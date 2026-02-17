import mongoose, { InferSchemaType } from 'mongoose';

// store transaction history
const transactionHistorySchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
    index: true
  },
  prevAmount: {
    type: Number,
    required: true
  },
  newAmount: {
    type: Number,
    required: true
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  editedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

export type TransactionHistory = InferSchemaType<
  typeof transactionHistorySchema
>;

export default mongoose.model<TransactionHistory>(
  'TransactionHistory',
  transactionHistorySchema
);
