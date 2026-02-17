import type { Response } from 'express';

type SuccessResponseType<T> = {
  statusCode?: number;
  message?: string;
  data?: T;
};

export const successResponse = <T>(
  res: Response,
  { statusCode = 200, message = 'Success', data }: SuccessResponseType<T>
) => {
  if (data === undefined) {
    return res.status(statusCode).json({
      success: true,
      message
    });
  }

  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};
