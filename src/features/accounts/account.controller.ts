import { Request, Response } from 'express';
import { parseBody } from '../../shared/parseBody';
import { ObjectIdSchema } from '../../shared/schemas';
import { successResponse } from '../../shared/successResponse';
import { CreateAccountSchema, UpdateAccountSchema } from './account.schema';
import { accountService } from './account.service';

export const accountController = {
  createAccount: async (req: Request, res: Response) => {
    const body = parseBody(req.body, CreateAccountSchema);
    const data = await accountService.create(body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Account created',
      data
    });
  },

  updateAccount: async (req: Request, res: Response) => {
    const body = parseBody(req.body, UpdateAccountSchema);
    const accountId = parseBody(req.params.accountId, ObjectIdSchema);
    const data = await accountService.update(accountId, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Account data updated',
      data
    });
  },

  deleteAccount: async (req: Request, res: Response) => {
    const accountId = parseBody(req.params.accountId, ObjectIdSchema);
    await accountService.delete(accountId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Account deleted successfully'
    });
  },

  activateAccount: async (req: Request, res: Response) => {
    const accountId = parseBody(req.params.accountId, ObjectIdSchema);
    await accountService.activate(accountId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Account activated successfully'
    });
  },

  userProfile: async (req: Request, res: Response) => {
    const accountId = parseBody(req.params.accountId, ObjectIdSchema);
    const data = await accountService.userProfile(accountId);

    return successResponse(res, {
      statusCode: 200,
      data
    });
  }
};
