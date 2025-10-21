import mongoose from 'mongoose';
import PaymentModel from '../models/payment.schema.js';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util.js';

export const createPaymentRepo = async (paymentDetails: any) => {
  try {
    const payment = await PaymentModel.create(paymentDetails);
    return payment;
  } catch (error: any) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error creating payment');
    }
  }
};

/**
 * Update enrollment payment details after successful payment
 */
export const updateEnrollmentPaymentDetailsRepo = async (
  enrollmentId: string,
  userId: string,
  paymentIntentId: string,
  status: number,
  paymentMethodDetails?: any,
) => {
  try {
    const enrollmentObjectId = new mongoose.Types.ObjectId(enrollmentId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find and update payment
    const payment = await PaymentModel.findOneAndUpdate(
      {
        enrollmentId: enrollmentObjectId,
        userId: userObjectId,
      },
      {
        status: status,
        paymentId: paymentIntentId,
        cardInfo: paymentMethodDetails,
      },
      {
        new: true, // Return the updated document
        runValidators: true,
      },
    );

    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found');
    }
    // console.log('payment updated successfully:', payment);
    return payment;
  } catch (error: any) {
    console.error('Error updating payment:', error);
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error updating enrollment payment details');
    }
  }
};
