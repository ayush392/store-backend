import { BadRequestError } from './appErrors.js';

export function removeUndefined<T extends Record<string, any>>(obj: T) {
  const data = Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;

  if (Object.keys(data).length === 0) {
    throw new BadRequestError('No valid fields provided for update');
  }

  return data;
}
