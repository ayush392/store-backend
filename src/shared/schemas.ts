import mongoose from 'mongoose';
import { z } from 'zod';

//Note: this file contains the validation schemas which are used across the app/api
export const ObjectIdSchema = z
  .string()
  .trim()
  .length(24, 'Invalid Id length')
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    error: 'Invalid Id format'
  })
  .transform((val) => new mongoose.Types.ObjectId(val));

export type ObjectId = z.infer<typeof ObjectIdSchema>;
