import { ClientSession } from 'mongoose';
import accountModel from '../../models/account.model.js';
import employmentModel, { Employment } from '../../models/employment.model.js';
import { BadRequestError, NotFoundError } from '../../shared/appErrors.js';
import { removeUndefined } from '../../shared/removeUndefined.js';
import { ObjectId } from '../../shared/schemas.js';
import { transactionService } from '../transactions/transaction.service.js';
import {
  type AccountType,
  type CreateAccount,
  type UpdateAccount,
  type UpdateOutstanding
} from './account.schema.js';

export const accountService = {
  findAccountByIdAndType: async (
    accountId: ObjectId,
    options?: { accountType?: AccountType; session?: ClientSession }
  ) => {
    const query = accountModel.findById(accountId).select('accountType').lean();

    if (options?.session) {
      query.session(options.session);
    }

    const account = await query;

    if (
      !account ||
      (options?.accountType && account.accountType !== options.accountType)
    ) {
      return null;
    }

    return account;
  },

  updateOutstanding: async (
    data: UpdateOutstanding,
    session: ClientSession
  ) => {
    const { accountId, diffAmount } = data;

    const updatedAccount = await accountModel.findByIdAndUpdate(
      accountId,
      {
        $inc: { currentOutstanding: diffAmount }
      },
      { new: true, session }
    );

    if (!updatedAccount) throw new NotFoundError('Account not found');
    return updatedAccount.currentOutstanding;
  },

  create: async (account: CreateAccount) => {
    const { name, displayName, phone, address, accountType, notes } = account;

    //TODO: Verify whether filter should be in name+phone or name or displayName?
    const newAccount = new accountModel({
      name,
      displayName,
      phone,
      address,
      accountType,
      notes
    });

    try {
      await newAccount.save();
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new BadRequestError(
          'Account with this name and phone already exist'
        );
      }
      throw err;
    }

    return newAccount;
  },
  update: async (accountId: ObjectId, account: UpdateAccount) => {
    const dataToUpdate = removeUndefined(account);

    const updatedAccount = await accountModel.findByIdAndUpdate(
      accountId,
      { $set: dataToUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      throw new NotFoundError('Account not found');
    }

    return updatedAccount;
  },

  delete: async (accountId: ObjectId) => {
    const result = await accountModel.updateOne(
      { _id: accountId, isActive: true },
      { $set: { isActive: false } }
    );

    if (result.matchedCount === 0)
      throw new NotFoundError('Account not found or already inactive');

    return;
  },

  activate: async (accountId: ObjectId) => {
    const result = await accountModel.updateOne(
      { _id: accountId, isActive: false },
      { $set: { isActive: true } }
    );

    if (result.matchedCount === 0)
      throw new NotFoundError('Account not found or already active');

    return;
  },

  userProfile: async (accountId: ObjectId) => {
    const profile = await accountModel
      .findById(accountId)
      .select(
        'name displayName phone address accountType currentOutstanding notes isActive'
      )
      .lean();

    if (!profile) {
      throw new NotFoundError('Account of given ID not found');
    }

    let employment: Employment[] = [];

    if (profile.accountType === 'STAFF') {
      employment = await employmentModel
        .find({ accountId })
        .select('salaryType salary joinDate leaveDate isActive')
        .sort({ joinDate: -1 })
        .lean();
    }

    const transactions = await transactionService.getTransactions(accountId);

    return {
      profile,
      ...(profile.accountType === 'STAFF' && { employment }),
      transactions
    };
  }
};
