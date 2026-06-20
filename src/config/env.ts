import dotenv from 'dotenv';
import { z } from 'zod';

const NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${NODE_ENV}`,
  debug: NODE_ENV !== 'production'
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(5000),
  ALLOWED_ORIGINS: z
    .string()
    .transform((str) =>
      str
        .split(',')
        .map((o) => o.trim())
        .filter((o) => o.startsWith('http://') || o.startsWith('https://'))
    )
    .refine((arr) => arr.length > 0, 'No valid ALLOWED_ORIGINS found'),
  SALT_ROUNDS: z.coerce.number().default(10),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .regex(/[A-Z]/, 'JWT_SECRET must contain an uppercase letter')
    .regex(/[a-z]/, 'JWT_SECRET must contain a lowercase letter')
    .regex(/[0-9]/, 'JWT_SECRET must contain a number')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'JWT_SECRET must contain a special character'
    ),
  MONGO_URI: z
    .string()
    .min(1)
    .refine(
      (v) => v.startsWith('mongodb://') || v.startsWith('mongodb+srv://'),
      { message: 'Invalid MongoDB connection string' }
    ),

  CLOUDINARY_CLOUD_NAME: z.string().min(2, 'Cloudinary cloud name is required'),
  CLOUDINARY_API_KEY: z.string().min(2, 'Cloudinary API key is required'),
  CLOUDINARY_API_SECRET: z.string().min(2, 'Cloudinary API secret is required')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment validation failed. Check the following fields:');
  console.error(parsed.error.issues);
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
export type Env = z.infer<typeof envSchema>;
