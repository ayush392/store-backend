import { Auth, UserRole } from '@store/schemas';
import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../shared/appErrors.js';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError('Unauthorised. Please login');

    const userRole = req.user.role;

    // Admin has all the permissions
    if (userRole === Auth.UserRoleEnum.enum.ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenError(
        "You don't have permission to perform this action"
      );
    }

    return next();
  };
};
