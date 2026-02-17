import dotenv from 'dotenv';
import z from 'zod';

const NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${NODE_ENV}`,
  debug: NODE_ENV !== 'production'
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((v) => v.split(',').map((o) => o.trim())),
  SALT_ROUNDS: z.coerce.number().default(10),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .regex(/[A-Z]/, 'JWT_SECRET must contain an uppercase letter')
    .regex(/[a-z]/, 'JWT_SECRET must contain a lowercase letter')
    .regex(/[0-9]/, 'JWT_SECRET must contain a number'),
  MONGO_URI: z
    .string()
    .min(1)
    .refine(
      (v) => v.startsWith('mongodb://') || v.startsWith('mongodb+srv://'),
      { message: 'Invalid MongoDB connection string' }
    )
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables ', parsed.error);
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
export type Env = z.infer<typeof envSchema>;
