import { Auth } from '@store/schemas';
import { Request, Response } from 'express';
import { parseBody } from '../../shared/parseBody.js';
import { ObjectIdSchema } from '../../shared/schemas.js';
import { successResponse } from '../../shared/successResponse.js';
import { authService } from './auth.service.js';

export const authController = {
  login: async (req: Request, res: Response) => {
    const { phone, password } = parseBody(req.body, Auth.LoginUserSchema);

    const data = await authService.login({ phone, password });

    return successResponse(res, {
      statusCode: 200,
      message: 'Login successful',
      data
    });
  },

  register: async (req: Request, res: Response) => {
    const { name, phone, password } = parseBody(
      req.body,
      Auth.RegisterUserSchema
    );

    const data = await authService.register({ name, phone, password });

    return successResponse(res, {
      statusCode: 201,
      message: 'User registered. Please Login',
      data
    });
  },

  myProfile: async (req: Request, res: Response) => {
    const userId = parseBody(req.user?.userId, ObjectIdSchema);
    const data = await authService.myProfile(userId);

    return successResponse(res, {
      statusCode: 200,
      data
    });
  }
};
