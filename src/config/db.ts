import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { env } from './env.js';

//NOTE: This connection setting is optimised for serverless (AWS/lambda)

mongoose.set('strictQuery', true); //Only schema-defined fields are used in queries

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    logger.info('MongoDB connected using cache');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGO_URI, {
      maxPoolSize: env.NODE_ENV === 'production' ? 2 : 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: env.NODE_ENV !== 'production'
    });
  }

  try {
    cached.conn = await cached.promise;
    logger.info('MongoDB connected');
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
};
