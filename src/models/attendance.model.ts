import { Staff } from '@store/schemas';
import mongoose, { InferSchemaType } from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    employmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employment',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: Staff.AttendanceStatusEnum.options,
      required: true
    }
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1, employmentId: 1 }, { unique: true });

export type Attendance = InferSchemaType<typeof attendanceSchema>;
export default mongoose.model<Attendance>('Attendance', attendanceSchema);
