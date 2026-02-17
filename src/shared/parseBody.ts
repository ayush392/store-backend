import { z } from 'zod';
import { BadRequestError } from './appErrors';

export const parseBody = <S extends z.ZodType>(
  body: unknown,
  schema: S
): z.infer<S> => {
  const result = schema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join(', ');
    throw new BadRequestError(message);
  }

  return result.data;
};
