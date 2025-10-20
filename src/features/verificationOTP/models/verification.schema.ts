import mongoose, { Document, Schema } from 'mongoose';

export interface VerificationDocument extends Document {
  type: 'email' | 'phone';
  value: string; // email or phone number
  otp: string;
  expiresAt: Date;
  //   verified: boolean;
}

const verificationSchema = new Schema<VerificationDocument>(
  {
    type: { type: String, enum: ['email', 'phone'], required: true },
    value: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
    // verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const VerificationModel = mongoose.model<VerificationDocument>(
  'Verification',
  verificationSchema,
);
