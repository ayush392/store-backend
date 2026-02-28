import { Transaction, TransactionType } from '@store/schemas';

const { TransactionTypeEnum } = Transaction;

// applicable for staff only
export const STAFF_ONLY_TRANSACTION_TYPES: readonly TransactionType[] = [
  TransactionTypeEnum.enum.SALARY,
  TransactionTypeEnum.enum.BONUS
];
export const TRANSACTION_EFFECT: Record<TransactionType, number> = {
  // do not affect dues/outstanding balance
  [TransactionTypeEnum.enum.SALARY]: 0,
  [TransactionTypeEnum.enum.BONUS]: 0,

  // increase the dues/outstanding balance
  [TransactionTypeEnum.enum.UDHAAR]: 1,

  // decrease the dues/outstanding balance
  [TransactionTypeEnum.enum.PAYMENT]: -1,
  [TransactionTypeEnum.enum.ADJUSTMENT]: -1,
  [TransactionTypeEnum.enum.RETURN]: -1
};
