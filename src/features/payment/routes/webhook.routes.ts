import express from 'express';
import { stripeWebhookHandler } from '../controller/stripeWebhook/webhook.controller.js';

const router = express.Router();

/**
 * Stripe Webhook Route
 * IMPORTANT: This route uses express.raw() middleware
 * It must be registered BEFORE express.json() in app.ts
 */
router.post('/stripe-payment', express.raw({ type: 'application/json' }), stripeWebhookHandler);

// Add more webhook routes here if needed
// router.post('/webhook-razorpay', express.raw({ type: 'application/json' }), razorpayWebhookHandler);

export default router;
