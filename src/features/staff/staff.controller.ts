import { Staff } from '@store/schemas';
import { Request, Response } from 'express';
import { parseBody } from '../../shared/parseBody.js';
import { ObjectIdSchema } from '../../shared/schemas.js';
import { successResponse } from '../../shared/successResponse.js';
import { staffService } from './staff.service.js';

export const staffController = {
  createEmployment: async (req: Request, res: Response) => {
    const body = parseBody(req.body, Staff.CreateEmploymentSchema);
    const accountId = parseBody(req.params.accountId, ObjectIdSchema);
    const data = await staffService.createEmployment(accountId, body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Employment created',
      data
    });
  },

  deleteEmployment: async (req: Request, res: Response) => {
    const { leaveDate } = parseBody(req.body, Staff.DeleteEmploymentSchema);
    const employmentId = parseBody(req.params.employmentId, ObjectIdSchema);
    const data = await staffService.deleteEmployment(employmentId, leaveDate);

    return successResponse(res, {
      statusCode: 200,
      message: 'Employment deleted',
      data
    });
  },

  createStaffWithEmployment: async (req: Request, res: Response) => {
    const body = parseBody(req.body, Staff.CreateStaffSchema);
    const data = await staffService.createStaffwithEmployment(body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Staff Account created',
      data
    });
  },

  getStaffs: async (_req: Request, res: Response) => {
    const data = await staffService.getStaffs();

    return successResponse(res, {
      statusCode: 200,
      data
    });
  },

  markBulkAttendance: async (req: Request, res: Response) => {
    const body = parseBody(req.body, Staff.BulkAttendanceSchema);
    const data = await staffService.markBulkAttendance(body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Attendance updated',
      data
    });
  },

  markAttendance: async (req: Request, res: Response) => {
    const body = parseBody(req.body, Staff.AttendanceSchema);
    const data = await staffService.markAttendance(body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Attendance updated',
      data
    });
  },

  getAttendance: async (req: Request, res: Response) => {
    const accountId = parseBody(req.params.accountId, ObjectIdSchema);
    const query = parseBody(req.query, Staff.AttendanceQuerySchema);
    const data = await staffService.getAttendance(accountId, query);

    return successResponse(res, {
      statusCode: 200,
      data
    });
  }
};
