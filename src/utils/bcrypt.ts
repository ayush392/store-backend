import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

export const getHashedString = async (text: string) => {
  const rounds = env.SALT_ROUNDS;
  const hash = await bcrypt.hash(text, rounds); //salt is generated automatically
  return hash;
};

export const isValidHash = async (text: string, hash: string) => {
  const isValid = await bcrypt.compare(text, hash);
  return isValid;
};
