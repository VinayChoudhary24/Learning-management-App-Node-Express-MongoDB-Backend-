import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util.js';
import { createStripePaymentIntent } from '../service/stripePayment/stripePayment.js';
import EventEmitter from 'events';
import { errorLogger } from '../../../utils/logs/logger.util.js';
import { updateEnrollmentPaymentIdRepo } from '../../enrollment/repository/enrollment.repository.js';

// Create event emitter instance
const paymentEventEmitter = new EventEmitter();
// Event handlers for background processing
paymentEventEmitter.on('payment.created', async (data) => {
  const { enrollmentId, paymentId } = data;
  // add created payment ID in enrollment
  try {
    await updateEnrollmentPaymentIdRepo(enrollmentId, paymentId);
  } catch (enrollmentError) {
    errorLogger.error('Failed to update enrollment paymentId:', enrollmentError);
  }
});

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('Called createPaymentIntent controller');
  try {
    const userId = req.userId as string;
    if (!userId) {
      return next(new ErrorHandler(401, 'User ID is required'));
    }

    // console.log('req.body', req.body);
    const { enrollmentId } = req.body;

    // Validate courseIds
    if (!enrollmentId) {
      return next(new ErrorHandler(400, 'Enrollment ID is required'));
    }

    // Create Payment Intent
    const paymentIntent = await createStripePaymentIntent(userId, enrollmentId);

    res.json({ clientSecret: paymentIntent.clientSecret });
    // res.status(201).json({
    //   success: true,
    //   message: 'Payment Intent created successfully',
    //   clientSecret: paymentIntent.clientSecret,
    // });

    setImmediate(() => {
      paymentEventEmitter.emit('payment.created', {
        enrollmentId,
        paymentId: paymentIntent.payment._id,
      });
    });
  } catch (error) {
    next(error);
  }
};
