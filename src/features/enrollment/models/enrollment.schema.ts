import mongoose from 'mongoose';
import dayjs from 'dayjs';

// Enrollment status constants
const ENROLLMENT_STATUS = {
  PENDING: 1, // Initial request/ payment penind
  CONFIRMED: 2, //  confirmed by system / payment initiated
  CANCELLED: 3, // Cancelled by user
  COMPLETED: 4, // Session completed / payment completed
  NO_SHOW: 5, // User didn't show up
  REFUNDED: 6, // Payment refunded
  EXPIRED: 7, // expired (auto-cancel)
};

// Enrollment types constants
const ENROLLMENT_TYPE = {
  ONLINE: 1, // Online Enrollment
  OFFLINE: 2, // In-person Enrollment
  PHONE: 3, // Enrollment via phone call or WhatsApp
};

// Cancellation type constants
const CANCELLATION_TYPE = {
  NO_CAN: 0, // default Value
  USER: 1, // User initiated
  MERCHANT: 2, // Merchant initiated
  SYSTEM: 3, // System initiated (auto-cancel)
  ADMIN: 4, // Admin initiated
};

const CancellationSchema = new mongoose.Schema(
  {
    cancelledBy: {
      type: Number,
      enum: Object.values(CANCELLATION_TYPE),
      default: CANCELLATION_TYPE.NO_CAN,
    },
    cancelledAt: { type: Number, default: 0 }, // UNIX timestamp
    reason: { type: String, default: '' },
    refundEligible: { type: Boolean, default: false },
    cancellationFee: { type: Number, default: 0, min: 0 },
    refundAmount: { type: Number, default: 0 },
  },
  { _id: false },
);

const enrollmentSchema = new mongoose.Schema(
  {
    // Who Enrolled
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userDetails: {
      firstName: { type: String, trim: true, default: '' },
      lastName: { type: String, trim: true, default: '' },
      email: { type: String, lowercase: true, trim: true, default: '' },
      phone: { type: String, default: '' },
      phoneCode: { type: String, default: '' },
    },

    // Enrollment details i.e Courses Enrolled
    enrollmentDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
    ],

    subTotalAmount: {
      type: Number,
      required: [true, 'subTotalAmount is required'],
      min: [0, 'subTotalAmount must not be negative'],
    },
    refundedAmount: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'totalAmount is required'],
      min: [0, 'totalAmount must not be negative'],
    },

    // Enrollment status
    enrollmentStatus: {
      type: Number,
      enum: Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.PENDING,
    },
    enrollmentType: {
      type: Number,
      enum: Object.values(ENROLLMENT_TYPE),
      default: ENROLLMENT_TYPE.ONLINE, // Default to online
    },

    // Payment info
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },

    // Cancellation Details
    cancellation: {
      type: CancellationSchema,
      default: () => ({}),
    },

    // Enrollment timestamps
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

// before save
enrollmentSchema.pre('save', function (next) {
  this.updatedAt = dayjs().unix();
  if (this.isNew) {
    this.createdAt = dayjs().unix();
  }
  next();
});

// Pre-update middleware to update the updatedAt timestamp
enrollmentSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: dayjs().unix() });
  next();
});

// Compound Indexes for Performance
enrollmentSchema.index({ userId: 1, enrollmentStatus: 1 }); // User's bookings by status
enrollmentSchema.index({ createdAt: 1 }); // Recent bookings
enrollmentSchema.index({ userId: 1, createdAt: -1 });
// For user bookings sorted by most recent

// TTL Index for auto-cleanup of unpaid Enrollments after 15 minutes (900 seconds)
// Only applies to enrollments with PENDING status (payment not completed)
enrollmentSchema.index(
  { _createdAtDate: 1 },
  {
    name: 'ttl_enrollment_cleanup',
    expireAfterSeconds: 900, // 15 minutes = 15 * 60 = 900 seconds
    partialFilterExpression: {
      enrollmentStatus: ENROLLMENT_STATUS.PENDING,
    },
  },
);

// To get the Virtual Fields in Response
enrollmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // hides __v
});

const EnrollmentModel = mongoose.model('Enrollment', enrollmentSchema);
export default EnrollmentModel;
