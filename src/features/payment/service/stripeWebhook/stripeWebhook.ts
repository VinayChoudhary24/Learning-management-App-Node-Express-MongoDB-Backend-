import Stripe from 'stripe';
import { ErrorHandler } from '../../../../utils/errors/errorHandler.util.js';
import { updateEnrollmentStatusAndPaymentDetailsRepo } from '../../../enrollment/repository/enrollment.repository.js';
import { updateEnrollmentPaymentDetailsRepo } from '../../repository/payment.repository.js';
import { sendPaymentConfirmationEmail } from '../../../../utils/emails/paymentConfirmation.util.js';
import { sendPaymentFailedEmail } from '../../../../utils/emails/paymentFailed.util.js';

/**
 * Handle successful payment intent
 */
export const handlePaymentIntentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent,
  paymentMethodDetails: any,
) => {
  //   console.log('Payment Intent Succeeded:', paymentIntent.id);
  try {
    // Extract metadata
    const enrollmentId = paymentIntent.metadata.enrollmentId;
    const userId = paymentIntent.metadata.userId;

    // Validate metadata
    if (!enrollmentId) {
      throw new ErrorHandler(400, 'Enrollment ID not found in payment intent metadata');
    }

    if (!userId) {
      throw new ErrorHandler(400, 'User ID not found in payment intent metadata');
    }

    // Update enrollment status to PAID
    await updateEnrollmentStatusAndPaymentDetailsRepo(enrollmentId);

    // Update payment status to COMPLETED
    await updateEnrollmentPaymentDetailsRepo(
      enrollmentId,
      userId,
      paymentIntent.id,
      3,
      paymentMethodDetails,
    );

    let successMailDetails: any;
    if (paymentIntent) {
      successMailDetails = {
        name: paymentIntent.metadata.userName,
        userEmail: paymentIntent.metadata.userEmail,
        amount: paymentIntent.amount,
      };
    }

    // Send payment confirmation email
    if (successMailDetails) {
      await sendPaymentConfirmationEmail(successMailDetails);
    }
  } catch (error: any) {
    console.error('Error handling payment success:', error.message);
    throw error;
  }
};

/**
 * Handle failed payment intent
 */
export const handlePaymentIntentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  //   console.log('Payment Intent Failed:', paymentIntent.id);

  try {
    const enrollmentId = paymentIntent.metadata.enrollmentId;
    const userId = paymentIntent.metadata.userId;

    // Validate metadata
    if (!enrollmentId) {
      throw new ErrorHandler(400, 'Enrollment ID not found in payment intent metadata');
    }

    if (!userId) {
      throw new ErrorHandler(400, 'User ID not found in payment intent metadata');
      return;
    }

    // Update payment status to FAILED
    await updateEnrollmentPaymentDetailsRepo(enrollmentId, userId, paymentIntent.id, 4);

    // Get failure reason
    const failureMessage =
      paymentIntent.last_payment_error?.message || 'Something went wrong. please try again...';
    // console.log('failureMessage', failureMessage);

    let successMailDetails: any;
    if (paymentIntent) {
      successMailDetails = {
        name: paymentIntent.metadata.userName,
        userEmail: paymentIntent.metadata.userEmail,
        amount: paymentIntent.amount,
        reason: failureMessage,
      };
    }

    // Send failure notification email
    await sendPaymentFailedEmail(successMailDetails);
    // console.log('Payment failed for enrollment:', enrollmentId);
  } catch (error: any) {
    console.error('Error handling payment failure:', error.message);
    throw error;
  }
};
