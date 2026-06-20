import { Request, Response } from 'express';
import { parseBody } from '../../shared/parseBody.js';
import { ObjectIdSchema } from '../../shared/schemas.js';
import { cloudinaryService } from './misc.service.js';
import { successResponse } from '../../shared/successResponse.js';

export const miscController = {
  getCloudinarySignature: async (req: Request, res: Response) => {
    const accountId = parseBody(req.body.accountId, ObjectIdSchema);
    const data = await cloudinaryService.getSignature(accountId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Signed upload signature fetched successfully',
      data
    });
  }
};
