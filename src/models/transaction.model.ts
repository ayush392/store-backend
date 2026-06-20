import mongoose from 'mongoose';
import { TransactionTypeEnum } from '../features/transactions/transaction.schema.js';

const imageSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

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
      min: [0.01, 'Amount must be greater than 0']
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
    },
    //bill images
    images: [imageSchema]
  },
  { timestamps: true }
);
transactionSchema.index({ accountId: 1, isDeleted: 1 });
transactionSchema.index({ date: -1 });
export default mongoose.model('Transaction', transactionSchema);
