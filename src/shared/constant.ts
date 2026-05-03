import {
  TransactionType,
  TransactionTypeEnum
} from '../features/transactions/transaction.schema.js';

// applicable for staff only
export const STAFF_ONLY_TRANSACTION_TYPES: readonly TransactionType[] = [
  TransactionTypeEnum.enum.SALARY,
  TransactionTypeEnum.enum.ADVANCE
];
export const TRANSACTION_EFFECT: Record<TransactionType, number> = {
  // do not affect dues/outstanding balance
  [TransactionTypeEnum.enum.SALARY]: 0,

  // increase the dues/outstanding balance
  [TransactionTypeEnum.enum.UDHAAR]: 1,
  [TransactionTypeEnum.enum.ADVANCE]: 1,

  // decrease the dues/outstanding balance
  [TransactionTypeEnum.enum.PAYMENT]: -1
};
