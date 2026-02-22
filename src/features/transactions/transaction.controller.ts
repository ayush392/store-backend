import { Request, Response } from 'express';
import { CreateTransactionSchema, UpdateTransactionSchema } from 'schemas';
import { parseBody } from '../../shared/parseBody';
import { ObjectIdSchema } from '../../shared/schemas';
import { successResponse } from '../../shared/successResponse';
import { transactionService } from './transaction.service';

export const transactionController = {
  createTransaction: async (req: Request, res: Response) => {
    const body = parseBody(req.body, CreateTransactionSchema);
    const createdBy = parseBody(req.user?.userId, ObjectIdSchema);
    const data = await transactionService.create(createdBy, body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Transaction created',
      data
    });
  },

  editTransaction: async (req: Request, res: Response) => {
    const body = parseBody(req.body, UpdateTransactionSchema);
    const transactionId = parseBody(req.params.transactionId, ObjectIdSchema);
    const editedBy = parseBody(req.user?.userId, ObjectIdSchema);
    const data = await transactionService.edit(transactionId, editedBy, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Transaction updated',
      data
    });
  },

  deleteTransaction: async (req: Request, res: Response) => {
    const transactionId = parseBody(req.params.transactionId, ObjectIdSchema);
    const editedBy = parseBody(req.user?.userId, ObjectIdSchema);
    const data = await transactionService.delete(editedBy, transactionId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Transaction deleted',
      data
    });
  },

  recentTransactions: async (_req: Request, res: Response) => {
    const data = await transactionService.recent();

    return successResponse(res, {
      statusCode: 200,
      data
    });
  },

  // As of now, this endpoint not required

  // getTransactions: async (req: Request, res: Response) => {
  //   const body = await parseBody();
  //   const data = await transactionService.create();

  //   return successResponse(res, {
  //     statusCode: 200,
  //     message: '',
  //     data
  //   });
  // },

  transactionHistory: async (req: Request, res: Response) => {
    const transactionId = parseBody(req.params.transactionId, ObjectIdSchema);
    const data =
      await transactionService.getTransactionEditHistory(transactionId);

    return successResponse(res, {
      statusCode: 200,
      data
    });
  },

  transactionGraph: async (_req: Request, res: Response) => {
    const data = await transactionService.transactionOverview();

    return successResponse(res, {
      statusCode: 200,
      data
    });
  }
};
