import mongoose from 'mongoose';
import { VerificationDocument, VerificationModel } from '../models/verification.schema.js';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util.js';

// Create a new verification record
export const createVerification = async (data: Partial<VerificationDocument>) => {
  try {
    return await VerificationModel.create(data);
  } catch (error: any) {
    if (error instanceof mongoose.Error) {
      throw error;
    }
    throw new ErrorHandler(500, 'Error creating verification record');
  }
};

// Find verification by type and value (email/phone)
export const findVerification = async (type: 'email' | 'phone', value: string) => {
  try {
    return await VerificationModel.findOne({ type, value }).sort({ createdAt: -1 }).lean();
  } catch (error: any) {
    if (error instanceof mongoose.Error) {
      throw error;
    }
    throw new ErrorHandler(500, 'Error finding verification record');
  }
};

// Update verification record
export const updateVerification = async (id: string, update: Partial<VerificationDocument>) => {
  try {
    const objectId = new mongoose.Types.ObjectId(id);
    return await VerificationModel.findByIdAndUpdate(objectId, update, { new: true }).lean();
  } catch (error: any) {
    if (error instanceof mongoose.Error) {
      throw error;
    }
    throw new ErrorHandler(500, 'Error updating verification record');
  }
};

// Mark verification as verified
export const markAsVerified = async (id: string) => {
  try {
    const objectId = new mongoose.Types.ObjectId(id);
    return await VerificationModel.findByIdAndUpdate(
      objectId,
      { verified: true },
      { new: true },
    ).lean();
  } catch (error: any) {
    if (error instanceof mongoose.Error) {
      throw error;
    }
    throw new ErrorHandler(500, 'Error marking verification as verified');
  }
};
