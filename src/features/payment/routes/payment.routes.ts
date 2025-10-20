import express from 'express';
import { jwtAuth } from '../../../middleware/jwt/authentication.middleware';
import { createPaymentIntent } from '../controller/payment.controller';
import { stripeWebhookHandler } from '../controller/stripeWebhook/webhook.controller';
const router = express.Router();

// POST Routes
// Creates Stripe Payment Intent
router.route('/create-payment-intent').post(jwtAuth, createPaymentIntent);

// Stripe sends raw request body (important for signature verification)
router
  .route('/webhook-stripe')
  .post(express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
