import { Account } from '@store/schemas';
import { Request, Response } from 'express';
import { parseBody } from '../../shared/parseBody.js';
import { ObjectIdSchema } from '../../shared/schemas.js';
import { successResponse } from '../../shared/successResponse.js';
import { accountService } from './account.service.js';

export const accountController = {
  getAccount: async (req: Request, res: Response) => {
    const query = parseBody(req.query, Account.AccountQuerySchema);
    const data = await accountService.get(query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Account data fetched',
      data
    });
  },

  createAccount: async (req: Request, res: Response) => {
    const body = parseBody(req.body, Account.CreateAccountSchema);
    const data = await accountService.create(body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Account created',
      data
    });
  },

  updateAccount: async (req: Request, res: Response) => {
    const body = parseBody(req.body, Account.UpdateAccountSchema);
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
