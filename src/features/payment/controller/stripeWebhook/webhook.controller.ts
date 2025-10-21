import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import {
  handlePaymentIntentFailed,
  handlePaymentIntentSucceeded,
} from '../../service/stripeWebhook/stripeWebhook.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const stripeWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'] as string;
  // console.log('RECEIVED-STRIPE-WEBHOOK', sig);

  let event: Stripe.Event;

  try {
    // Verify signature & construct the event
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    // return res.status(400).send(`Webhook Error: ${err.message}`);
    next(err);
    return;
  }

  // console.log('RECEIVED-STRIPE-event', event);
  // Handle different Stripe event types
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // console.log('Payment succeeded:', paymentIntent);

        // Retrieve payment method details
        let paymentMethodDetails = null;
        if (paymentIntent.payment_method) {
          try {
            const paymentMethod = await stripe.paymentMethods.retrieve(
              paymentIntent.payment_method as string,
            );
            // console.log('PAYMENT-METHOD-DETAILS', paymentMethod);

            // Extract card details
            paymentMethodDetails = {
              type: paymentMethod.type || '',
              card: paymentMethod.card
                ? {
                    brand: paymentMethod.card.brand || '',
                    last4: paymentMethod.card.last4 || '',
                    expMonth: paymentMethod.card.exp_month || 0,
                    expYear: paymentMethod.card.exp_year || 0,
                    funding: paymentMethod.card.funding || '',
                    country: paymentMethod.card.country || '',
                  }
                : null,
              billingDetails: paymentMethod.billing_details ? paymentMethod.billing_details : null, // Name, email, address
            };
            // console.log('Payment Method Details:', paymentMethodDetails);
          } catch (error) {
            console.error('Failed to retrieve payment method:', error);
          }
        }

        // Update Enrollment and enrollmentPayment
        await handlePaymentIntentSucceeded(paymentIntent, paymentMethodDetails);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const failureMessage = paymentIntent.last_payment_error?.message;
        // console.log(`Payment failed: ${failureMessage}`);

        // Update Enrollment and enrollmentPayment
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    // res.status(500).send("Webhook handler error");
    next(err);
  }
};
