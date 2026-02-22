import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../shared/appErrors.js';
import { verifyToken } from '../utils/jwt.js';

/*
 * authenticateToken is required when “Anyone can view posts, but logged-in users can see extra info.”
 * ex: user can see posts but authenticated users can see like/view count also.
 * requireAuth if for protected routes
 */

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (!authorization)
    throw new UnauthorizedError('authorization header is missing');

  const [scheme, token] = authorization.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token)
    throw new UnauthorizedError('Invalid token.');

  const decodedValue = verifyToken(token);

  req.user = { userId: decodedValue.sub, role: decodedValue.role };
  next();
};
