import { NextFunction, Request, Response } from 'express';
import { AppError } from '../shared/appErrors';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong.',
    code: 'INTERNAL_ERROR'
  });
};
