import { Auth } from '@store/schemas';
import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[6-9]\d{9}$/,
        'Phone number must be a valid 10-digit Indian number'
      ],
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      required: true,
      enum: Auth.UserRoleEnum.options
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export type User = InferSchemaType<typeof userSchema>;
export default mongoose.model<User>('User', userSchema);
