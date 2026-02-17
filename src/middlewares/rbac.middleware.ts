import { NextFunction, Request, Response } from 'express';
import { UserRoleEnum, type UserRole } from '../features/auth/auth.schema';
import { ForbiddenError, UnauthorizedError } from '../shared/appErrors';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError('Unauthorised. Please login');

    const userRole = req.user.role;

    // Admin has all the permissions
    if (userRole === UserRoleEnum.enum.ADMIN) {
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
