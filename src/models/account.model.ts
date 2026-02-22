import mongoose, { InferSchemaType } from 'mongoose';
import { AccountTypeEnum } from '../features/accounts/account.schema.js';

const accountSchema = new mongoose.Schema(
  {
    //for users who can login
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    displayName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      match: [
        /^[6-9]\d{9}$/,
        'Phone number must be a valid 10-digit Indian number'
      ],
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    accountType: {
      type: String,
      required: true,
      enum: AccountTypeEnum.options
    },
    currentOutstanding: {
      type: Number,
      required: true,
      default: 0
    },
    notes: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
);

accountSchema.index({ name: 1, phone: 1 }, { unique: true });
export type Account = InferSchemaType<typeof accountSchema>;
export default mongoose.model<Account>('Account', accountSchema);
