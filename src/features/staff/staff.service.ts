import {
  Attendance,
  AttendanceQuery,
  BulkAttendance,
  CreateEmployment,
  CreateStaff,
  DateOnly
} from '@store/schemas';
import { ClientSession } from 'mongoose';
import accountModel from '../../models/account.model.js';
import attendanceModel from '../../models/attendance.model.js';
import employmentModel from '../../models/employment.model.js';
import { BadRequestError } from '../../shared/appErrors.js';
import {
  getDateRange,
  getMonthRange,
  parseISTDate
} from '../../shared/date.js';
import { parseBody } from '../../shared/parseBody.js';
import { ObjectId, ObjectIdSchema } from '../../shared/schemas.js';
import { runTransaction } from '../../utils/runTransaction.js';
import { accountService } from '../accounts/account.service.js';

export const staffService = {
  createEmployment: async (
    accountId: ObjectId,
    { salary, salaryType, joinDate }: CreateEmployment
  ) => {
    const account = await accountService.findAccountByIdAndType(accountId, {
      accountType: 'STAFF'
    });

    if (!account) {
      throw new BadRequestError('Employment can be created for staff only.');
    }

    const newEmployment = await employmentModel.create({
      accountId,
      salary,
      salaryType,
      joinDate
    });

    return { employmentId: newEmployment._id };
  },

  deleteEmployment: async (employmentId: ObjectId, leaveDate: DateOnly) => {
    const staff = await employmentModel.findOneAndUpdate(
      { _id: employmentId, isActive: true, joinDate: { $lt: leaveDate } },
      { $set: { leaveDate, isActive: false } },
      { new: true, runValidators: true }
    );

    if (!staff) {
      throw new BadRequestError('Invalid leave date or employment not found');
    }

    return staff;
  },

  createStaffwithEmployment: async (data: CreateStaff) => {
    const { name, displayName, phone, address, notes, employment } = data;

    const isExistingAccount = await accountModel
      .findOne({ name, phone })
      .select('_id')
      .lean();

    if (isExistingAccount) {
      throw new BadRequestError(
        'Account with this name and phone already exist'
      );
    }

    const newAccount = new accountModel({
      name,
      displayName,
      phone,
      address,
      accountType: 'STAFF',
      notes
    });

    const result = await runTransaction(async (session: ClientSession) => {
      const account = await newAccount.save({ session });
      const accountId = account._id;
      const { salary, salaryType, joinDate } = employment;
      const newEmployment = new employmentModel({
        accountId,
        salary,
        salaryType,
        joinDate
      });

      const savedEmployment = await newEmployment.save({ session });

      return { accountId, employmentId: savedEmployment._id };
    });

    return result;
  },

  getStaffs: async () => {
    const { startDate, endDate } = getDateRange('today');

    const employments = await employmentModel
      .find({ isActive: true })
      .select('accountId salaryType salary')
      .populate({
        path: 'accountId',
        model: 'Account',
        select: 'name currentOutstanding isActive'
      })
      .lean();

    const attendances = await attendanceModel
      .find({
        date: { $gte: startDate, $lt: endDate }
      })
      .select('date status employmentId')
      .lean();

    const attendanceMap = new Map(
      attendances.map((att) => [att.employmentId?.toString(), att])
    );

    const result = employments.map((emp) => {
      const attendance = attendanceMap.get(emp._id.toString());

      return {
        employmentId: emp._id,
        account: emp.accountId,
        salary: emp.salary,
        salaryType: emp.salaryType,
        status: attendance?.status || null
      };
    });
    return result;
  },

  //This query is time efficient than previous one
  getStaffsAgg: async () => {
    const { startDate, endDate } = getDateRange('today');

    const result = await employmentModel.aggregate([
      {
        $match: { isActive: true }
      },

      {
        $lookup: {
          from: 'accounts',
          localField: 'accountId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                name: 1,
                displayName: 1,
                currentOutstanding: 1,
                isActive: 1
              }
            }
          ],
          as: 'account'
        }
      },

      {
        $unwind: '$account'
      },

      {
        $lookup: {
          from: 'attendances',
          let: { empId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$employmentId', '$$empId'] },
                    { $gte: ['$date', startDate] },
                    { $lt: ['$date', endDate] }
                  ]
                }
              }
            },
            {
              $project: {
                status: 1,
                _id: 0
              }
            }
          ],
          as: 'attendance'
        }
      },

      {
        $addFields: {
          status: { $arrayElemAt: ['$attendance.status', 0] }
        }
      },

      {
        $project: {
          employmentId: '$_id',
          account: '$account',
          salary: 1,
          salaryType: 1,
          status: 1
        }
      }
    ]);

    return result;
  },

  // attendance
  markBulkAttendance: async (attendances: BulkAttendance) => {
    const todayDate = parseISTDate();
    const employmentIds = [...new Set(attendances.map((a) => a.employmentId))];
    const activeEmployments = await employmentModel
      .find({
        _id: { $in: employmentIds },
        isActive: true,
        leaveDate: null
      })
      .select('_id accountId')
      .lean();

    const activeMap = new Map(
      activeEmployments.map((e) => [e._id.toString(), e])
    );

    for (const a of attendances) {
      const emp = activeMap.get(a.employmentId.toString());

      if (!emp) {
        throw new BadRequestError(
          `Inactive or invalid employment: ${a.employmentId}`
        );
      }

      if (emp.accountId.toString() !== a.accountId.toString()) {
        throw new BadRequestError(
          `Account mismatch for employment ${a.employmentId}`
        );
      }
    }

    const result = await attendanceModel.bulkWrite(
      attendances.map((a) => ({
        updateOne: {
          filter: {
            date: todayDate,
            employmentId: a.employmentId
          },
          update: {
            $set: { status: a.status },
            $setOnInsert: { accountId: parseBody(a.accountId, ObjectIdSchema) }
          },
          upsert: true
        }
      })),
      { ordered: false }
    );

    return result;
  },

  markAttendance: async (data: Attendance) => {
    const { accountId, employmentId, date, status } = data;
    const employee = await employmentModel.findOne({
      _id: employmentId,
      accountId,
      joinDate: { $lte: date },
      $or: [{ leaveDate: null }, { leaveDate: { $gte: date } }]
    });

    if (!employee) {
      throw new BadRequestError(
        'Staff with active employment not found for this date'
      );
    }

    const attendance = await attendanceModel.updateOne(
      { date, employmentId },
      {
        $set: { status },
        $setOnInsert: { accountId }
      },
      { upsert: true }
    );
    return attendance;
  },

  getAttendance: async (accountId: ObjectId, query: AttendanceQuery) => {
    const { employmentId, month, year } = query;
    const { startDate, endDate } = getMonthRange(month, year);
    const attendanceList = await attendanceModel.find({
      accountId,
      date: { $gte: startDate, $lt: endDate },
      ...(employmentId && { employmentId })
    });

    return attendanceList;
  }
};
