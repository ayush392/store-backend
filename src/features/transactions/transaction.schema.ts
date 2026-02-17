import { z } from 'zod';
import { DateTimeSchema, ObjectIdSchema } from '../../shared/schemas';

export const TransactionTypeEnum = z.enum([
  'UDHAAR',
  'PAYMENT',
  'SALARY',
  'BONUS',

  'RETURN',
  'ADJUSTMENT'
]);

export const CreateTransactionSchema = z.object({
  accountId: ObjectIdSchema,
  transactionType: TransactionTypeEnum,
  amount: z.number().positive('Amount must be greater than 0'),
  date: DateTimeSchema,
  note: z.string().optional()
});

export const UpdateTransactionSchema = CreateTransactionSchema.omit({
  accountId: true,
  transactionType: true
})
  .partial()
  .extend({
    reason: z.string().optional()
  });

export type TransactionType = z.infer<typeof TransactionTypeEnum>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
