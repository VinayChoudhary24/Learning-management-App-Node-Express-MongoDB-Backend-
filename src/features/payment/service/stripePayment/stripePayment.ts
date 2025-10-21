import mongoose from 'mongoose';
import UserModel from '../../../user/models/user.schema.js';
import { ErrorHandler } from '../../../../utils/errors/errorHandler.util.js';
import EnrollmentModel from '../../../enrollment/models/enrollment.schema.js';
import Stripe from 'stripe';
import { createPaymentRepo } from '../../repository/payment.repository.js';
import { appConfig } from '../../../../config/appConfig/app.config.js';

const stripeSecretKey = appConfig.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new ErrorHandler(400, 'Stripe key not found');
}
const stripe = new Stripe(stripeSecretKey);

export const createStripePaymentIntent = async (userId: string, enrollmentId: string) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const enrollmentObjectId = new mongoose.Types.ObjectId(enrollmentId);

    // Fetch user details
    const user = await UserModel.findById(userObjectId).select('email firstName').lean();
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    // Fetch courses and validate they exist
    const enrollment = await EnrollmentModel.findById(enrollmentObjectId)
      .select('_id subTotalAmount refundedAmount taxes discountAmount totalAmount')
      .lean();

    if (!enrollment) {
      throw new ErrorHandler(404, 'Enrollment not found or inactive');
    }

    // Setup Payment Intent
    const args = {
      // customer: userId, // UserID
      amount: Number(enrollment.totalAmount),
      currency: 'inr', // usd
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        enrollmentId,
        userId,
        userEmail: user.email,
        userName: user.firstName || 'User',
      },
    };
    let paymentIntent: any;

    try {
      paymentIntent = await stripe.paymentIntents.create(args);
      // console.log('No error.');
    } catch (e: any) {
      if (e.type === 'StripeCardError') {
        console.log(`A payment error occurred: ${e.message}`);
        throw new ErrorHandler(400, `A payment error occurred: ${e.message}`);
      } else if (e.type === 'StripeInvalidRequestError') {
        console.log('An invalid request occurred.');
        throw new ErrorHandler(400, 'An invalid request occurred.');
      } else {
        console.log('Another problem occurred, maybe unrelated to Stripe.');
        throw new ErrorHandler(400, 'Another problem occurred, maybe unrelated to Stripe.');
      }
    }

    const paymentId = paymentIntent.id;

    // Call the Payment Repository and create Payment
    const paymentObj = {
      enrollmentId: enrollmentObjectId,
      userId: userObjectId,
      paymentId,
      method: 'Card',
      gateway: 'Stripe',
      subTotalAmount: enrollment.subTotalAmount,
      refundedAmount: enrollment.refundedAmount,
      taxes: enrollment.taxes,
      discountAmount: enrollment.discountAmount,
      amount: enrollment.totalAmount,
      amountPaid: enrollment.totalAmount,
    };
    // Create payment
    const payment = await createPaymentRepo(paymentObj);

    if (!payment) {
      throw new ErrorHandler(400, 'Error while creating stripe payment');
    }

    return {
      payment,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error creating stripe payment intent');
    }
  }
};
