import cloudinary from '../../config/cloudinary.js';
import { env } from '../../config/env.js';
import { ObjectId } from '../../shared/schemas.js';

export const cloudinaryService = {
  getSignature: async (accountId: ObjectId) => {
    const uploadFolder =
      env.NODE_ENV === 'production'
        ? 'dukaan_book/' + String(accountId)
        : 'test';

    const paramsToSign = {
      timestamp: Math.floor(new Date().getTime() / 1000), // Unix timestamp in seconds
      folder: uploadFolder
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET
    );

    return {
      signature,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      timestamp: paramsToSign.timestamp,
      folder: paramsToSign.folder
    };
  }
};
