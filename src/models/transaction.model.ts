import mongoose, { InferSchemaType } from 'mongoose';
import { TransactionTypeEnum } from '../features/transactions/transaction.schema';

const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    transactionType: {
      type: String,
      required: true,
      enum: TransactionTypeEnum.options
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    amountChange: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
);
transactionSchema.index({ accountId: 1, isDeleted: 1 });
transactionSchema.index({ date: -1 });
export type Transaction = InferSchemaType<typeof transactionSchema>;
export default mongoose.model<Transaction>('Transaction', transactionSchema);
