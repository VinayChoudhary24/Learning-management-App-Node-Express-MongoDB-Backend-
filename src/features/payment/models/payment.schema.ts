import mongoose from 'mongoose';
import dayjs from 'dayjs';

// Payment status constants
const PAYMENT_STATUS = {
  PENDING: 1,
  PROCESSING: 2,
  COMPLETED: 3,
  FAILED: 4,
  REFUNDED: 5,
  PARTIALLY_REFUNDED: 6,
};

const CardInfoSchema = new mongoose.Schema(
  {
    type: { type: String, default: '' },
    card: {
      brand: { type: String, default: '' },
      last4: { type: String, default: '' },
      expMonth: { type: Number, default: 0 },
      expYear: { type: Number, default: 0 },
      funding: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    billingDetails: { type: {}, default: {} },
  },
  { _id: false },
);

const paymentSchema = new mongoose.Schema(
  {
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Payment Intent ID
    paymentId: { type: String, default: '' }, // External payment service ID
    status: {
      type: Number,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    method: { type: String, default: 'card' }, // 'card', 'upi', 'wallet'
    gateway: { type: String, default: '' }, // 'stripe', 'razorpay', etc.

    // Amounts
    subTotalAmount: { type: Number, required: true, min: 0 },
    refundedAmount: { type: Number, required: true, min: 0 },
    taxes: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0 },

    // Card info
    cardInfo: {
      type: CardInfoSchema,
      default: () => ({}),
    },

    // Transaction logs (for multiple attempts/refunds)
    transactions: { type: [{}], default: [] },
    // Payment timestamps
    // Date field specifically for TTL index
    _createdAtDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    createdAt: {
      type: Number,
      default: () => dayjs().unix(),
    },
    updatedAt: {
      type: Number,
      default: () => dayjs().unix(),
    },
  },
  {
    timestamps: false,
  },
);

// Middleware
paymentSchema.pre('save', function (next) {
  this.updatedAt = dayjs().unix();
  if (this.isNew) {
    this.createdAt = dayjs().unix();
  }
  next();
});

paymentSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: dayjs().unix() });
  next();
});

// Indexes
paymentSchema.index({ enrollmentId: 1 });
paymentSchema.index({ paymentId: 1 }); // External payment ID lookup
paymentSchema.index({ userId: 1, createdAt: -1 });

// TTL Index for auto-cleanup of failed/pending payments after 15 minutes (900 seconds)
// Only applies to payments that are PENDING, PROCESSING, or FAILED
paymentSchema.index(
  { _createdAtDate: 1 },
  {
    name: 'ttl_payment_cleanup',
    expireAfterSeconds: 900, // 15 minutes = 15 * 60 = 900 seconds
    partialFilterExpression: {
      status: {
        $in: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PROCESSING, PAYMENT_STATUS.FAILED],
      },
    },
  },
);

paymentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

const PaymentModel = mongoose.model('Payment', paymentSchema);
export default PaymentModel;
