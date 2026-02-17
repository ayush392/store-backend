import userModel from '../../models/user.model';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} from '../../shared/appErrors';
import { ObjectId } from '../../shared/schemas';
import { getHashedString, isValidHash } from '../../utils/bcrypt';
import { createToken } from '../../utils/jwt';
import type { LoginUser, RegisterUser, UserRole } from './auth.schema';

export const authService = {
  login: async ({ phone, password }: LoginUser) => {
    const user = await userModel
      .findOne({ phone })
      .select('+passwordHash')
      .lean();

    if (!user) {
      throw new BadRequestError('Invalid phone or password');
    }

    if (!user.isActive) {
      throw new ForbiddenError(
        'Your account is deactivated. Please contact owner.'
      );
    }

    const isPasswordCorrect = await isValidHash(password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new BadRequestError('Invalid phone or password');
    }

    const token = createToken({ sub: user._id.toString(), role: user.role });

    return { name: user.name, role: user.role, token };
  },

  register: async ({ name, phone, password }: RegisterUser) => {
    const role: UserRole = 'USER';
    const hashPassword = await getHashedString(password);
    try {
      const newUser = await userModel.create({
        name,
        phone,
        passwordHash: hashPassword,
        role
      });

      return { name: newUser.name, phone: newUser.phone };
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new BadRequestError(
          'User with phone already exist. Please login'
        );
      }
      throw err;
    }
  },
  myProfile: async (userId: ObjectId) => {
    const user = await userModel
      .findById(userId)
      .select('name phone role isActive')
      .lean();

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return user;
  }

  // editProfile: async (user: any) => {
  //   const dataToUpdate = removeUndefined(user);
  // }
};
