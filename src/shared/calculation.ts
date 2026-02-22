import { TransactionType } from '../features/transactions/transaction.schema.js';
import { TRANSACTION_EFFECT } from './constant.js';

export const getDiffAmount = (
  type: TransactionType,
  newAmount: number,
  oldAmount = 0
) => {
  const newAmt = TRANSACTION_EFFECT[type] * newAmount;
  const oldAmt = TRANSACTION_EFFECT[type] * oldAmount;

  return newAmt - oldAmt;
};
