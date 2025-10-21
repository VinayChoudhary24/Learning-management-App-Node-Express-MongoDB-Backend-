import mongoose from 'mongoose';
import UserModel from '../../user/models/user.schema.js';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util.js';

export const createNewUserRepo = async (user: any) => {
  try {
    // Save new user
    const newUser = new UserModel(user);
    return await newUser.save();
  } catch (error: any) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    }
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern || {})[0];
      const message = `${duplicatedField} already in use by another user`;
      throw new ErrorHandler(400, message);
    }
    throw new ErrorHandler(500, 'Something went wrong while registering user');
  }
};

export const findUserRepo = async (factor: any, withPassword = false) => {
  try {
    if (withPassword) return await UserModel.findOne(factor).select('+password');
    else return await UserModel.findOne(factor);
  } catch (error) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'something went wrong while finding user.');
    }
  }
};

export const findUserByEmailAndProvider = async (
  email: string,
  authProvider: 'local' | 'google' | 'apple' | 'facebook',
) => {
  try {
    const query = { email, authProvider };
    return await UserModel.findOne(query);
  } catch (error) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Something went wrong while finding user by email and provider.');
    }
  }
};

export const findUserForPasswordResetRepo = async (hashtoken: any) => {
  try {
    return await UserModel.findOne({
      resetPasswordToken: hashtoken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  } catch (error) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'something went wrong while finding user for password reset.');
    }
  }
};
