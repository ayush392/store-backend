import transactionModel from '../../models/transaction.model.js';
import transactionHistoryModel from '../../models/transactionHistory.model.js';
import { BadRequestError, NotFoundError } from '../../shared/appErrors.js';
import { getDiffAmount } from '../../shared/calculation.js';
import {
  STAFF_ONLY_TRANSACTION_TYPES,
  TRANSACTION_EFFECT
} from '../../shared/constant.js';
import { getDateRange, istDateString } from '../../shared/date.js';
import { removeUndefined } from '../../shared/removeUndefined.js';
import { ObjectId, ObjectIdSchema } from '../../shared/schemas.js';
import { runTransaction } from '../../utils/runTransaction.js';
import { accountService } from '../accounts/account.service.js';
import { CreateTransaction, UpdateTransaction } from './transaction.schema.js';

export const transactionService = {
  create: async (createdBy: ObjectId, transaction: CreateTransaction) => {
    const { accountId, transactionType, amount, date, note, images } =
      transaction;

    const result = await runTransaction(async (session) => {
      const account = await accountService.findAccountByIdAndType(accountId, {
        session
      });
      if (!account) throw new NotFoundError('Account not found');

      if (
        account.accountType !== 'STAFF' &&
        STAFF_ONLY_TRANSACTION_TYPES.includes(transactionType)
      ) {
        throw new BadRequestError(`${transactionType} is for staff only`);
      }

      const diffAmount = getDiffAmount(transactionType, amount);

      // create new transaction and update outstanding balance
      const [trans] = await transactionModel.create(
        [
          {
            accountId,
            transactionType,
            amount,
            date,
            note,
            amountChange: diffAmount,
            createdBy,
            images
          }
        ],
        { session }
      );

      if (!trans) {
        throw new BadRequestError('Could not create transaction');
      }

      await accountService.updateOutstanding(
        { accountId, diffAmount },
        session
      );

      return { transactionId: trans._id };
    });

    return result;
  },

  edit: async (
    transactionId: ObjectId,
    editedBy: ObjectId,
    transaction: UpdateTransaction
  ) => {
    const data = removeUndefined(transaction);
    const result = await runTransaction(async (session) => {
      if (data.amount === undefined) {
        const updatedTrans = await transactionModel.findOneAndUpdate(
          { _id: transactionId, isDeleted: false },
          { $set: data },
          { returnDocument: 'after', runValidators: true, session }
        );

        if (!updatedTrans)
          throw new NotFoundError('Transaction not found or deleted');

        return updatedTrans;
      }

      //Amount change -> update trans, create history, update outstanding
      const existingTransaction = await transactionModel
        .findOne({ _id: transactionId, isDeleted: false })
        .select('accountId transactionType amount')
        .session(session)
        .lean();

      if (!existingTransaction)
        throw new NotFoundError('Transaction not found or deleted');

      const diffAmount = getDiffAmount(
        existingTransaction.transactionType,
        data.amount,
        existingTransaction.amount
      );

      const amountChange = getDiffAmount(
        existingTransaction.transactionType,
        data.amount
      );

      await accountService.updateOutstanding(
        { accountId: existingTransaction.accountId, diffAmount },
        session
      );

      const updatedTransaction = await transactionModel.findOneAndUpdate(
        { _id: transactionId, isDeleted: false },
        { $set: { ...data, amountChange } },
        { returnDocument: 'after', runValidators: true, session }
      );

      if (!updatedTransaction)
        throw new NotFoundError('Transaction not found or deleted');

      await transactionHistoryModel.create(
        [
          {
            transactionId,
            prevAmount: existingTransaction.amount,
            newAmount: data.amount,
            editedBy,
            reason: data.reason || ''
          }
        ],
        { session }
      );

      return updatedTransaction;
    });

    return result;
  },

  delete: async (editedBy: ObjectId, transactionId: ObjectId) => {
    const result = await runTransaction(async (session) => {
      const transaction = await transactionModel.findOneAndUpdate(
        { _id: transactionId, isDeleted: false },
        { isDeleted: true },
        { returnDocument: 'after', session }
      );

      if (!transaction)
        throw new NotFoundError('Transaction not found or already deleted');

      await transactionHistoryModel.create(
        [
          {
            transactionId,
            prevAmount: transaction.amount,
            newAmount: 0,
            editedBy,
            reason: 'Transaction deleted'
          }
        ],
        { session }
      );

      const newOutstanding = await accountService.updateOutstanding(
        {
          accountId: transaction.accountId,
          diffAmount: -1 * transaction.amountChange // -1 because amount needs to be reversed
        },
        session
      );

      return newOutstanding;
    });

    return result;
  },

  //by default, return todays transaction.
  recent: async () => {
    const { startDate, endDate } = getDateRange('today');

    const transactionsRaw = await transactionModel
      .find({
        date: { $gte: startDate, $lt: endDate },
        isDeleted: false
      })
      .select('accountId transactionType amountChange amount date images')
      .populate({
        path: 'accountId',
        model: 'Account',
        select: 'name displayName phone accountType currentOutstanding isActive'
      })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const transactions = transactionsRaw.map(({ accountId, ...rest }) => ({
      ...rest,
      account: accountId
    }));

    return transactions;
  },

  getTransactions: async (accountId: ObjectId) => {
    const transactions = await transactionModel
      .find({ accountId, isDeleted: false })
      .sort({ date: -1, createdAt: -1 })
      .lean();
    return transactions;
  },

  getTransactionEditHistory: async (transactionId: ObjectId) => {
    const editHistory = await transactionHistoryModel
      .find({ transactionId })
      .populate({
        path: 'editedBy',
        model: 'User',
        select: 'name role isActive'
      })
      .sort({ editedAt: -1 })
      .lean();

    return editHistory;
  },

  basicTransactionDetails: async (transactionId: ObjectId) => {
    const transaction = await transactionModel
      .findById(transactionId)
      .select('accountId transactionType amount date note updatedAt')
      .lean();

    if (!transaction) {
      throw new NotFoundError('Transaction with given Id not found');
    }

    return transaction;
  },

  transactionOverview: async () => {
    const { startDate, endDate } = getDateRange('week');
    const transactions = await transactionModel
      .find({
        date: { $gte: startDate, $lt: endDate },
        isDeleted: false
      })
      .select('amount date transactionType')
      .lean();

    let result: Record<string, { credit: number; debit: number }> = {};
    let totalDue = 0;

    for (const { amount, date, transactionType } of transactions) {
      const key = istDateString(date);
      if (!result[key]) {
        result[key] = { credit: 0, debit: 0 };
      }

      const effect = TRANSACTION_EFFECT[transactionType];
      if (!effect || effect === 0) continue;

      if (effect < 0) result[key].credit += amount;
      else result[key].debit += amount;
      totalDue += effect * amount;
    }

    const chartData = Object.entries(result)
      .map(([date, values]) => ({
        date,
        credit: values.credit,
        debit: values.debit
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { totalDue, chartData };
  }
};
