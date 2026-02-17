import mongoose, { InferSchemaType } from 'mongoose';
import { SalaryTypeEnum } from '../features/staff/staff.schema';

const employmentSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    salaryType: {
      type: String,
      enum: SalaryTypeEnum.options,
      required: true
    },
    salary: {
      type: Number,
      required: true,
      min: 0
    },
    joinDate: {
      type: Date,
      required: true
    },
    leaveDate: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
);
employmentSchema.index(
  { accountId: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export type Employment = InferSchemaType<typeof employmentSchema>;
export default mongoose.model<Employment>('Employment', employmentSchema);
