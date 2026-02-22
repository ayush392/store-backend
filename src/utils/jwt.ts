import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { UserRoleEnum } from '../features/auth/auth.schema.js';
import { UnauthorizedError } from '../shared/appErrors.js';

export const JwtPayloadSchema = z.object({
  sub: z.string(), // user id
  role: UserRoleEnum,
  iat: z.number().optional(),
  exp: z.number().optional()
});
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// Sign JWT token
export const createToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256'
  });
};

//  Verify + validate token
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    return JwtPayloadSchema.parse(decoded);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
