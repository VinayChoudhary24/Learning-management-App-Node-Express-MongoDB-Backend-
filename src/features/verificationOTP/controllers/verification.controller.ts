import { NextFunction, Request, Response } from 'express';
import { generateOtp, otpExpiry } from '../../../utils/otp/otp.util';
import { createVerification, findVerification } from '../repository/verification.repository';
import { sendEmailOtp, sendSmsOtp } from '../service/verificationService';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util';

export const sendVerificationOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, value } = req.body;

    if (!['email', 'phone'].includes(type)) {
      return next(new ErrorHandler(400, 'Invalid verification type'));
    }

    const otp = generateOtp();
    const expiresAt = otpExpiry();

    // overwrite old verification if exists
    const existing = await findVerification(type, value);
    if (existing) {
      await existing.deleteOne();
    }

    await createVerification({ type, value, otp, expiresAt });

    // send otp
    if (type === 'email') {
      await sendEmailOtp(value, otp);
    } else {
      await sendSmsOtp(value, otp);
    }

    res.status(200).json({ success: true, message: `${type} OTP sent successfully` });
  } catch (error: any) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, value, otp } = req.body;

    const verification = await findVerification(type, value);

    if (!verification || verification.expiresAt < new Date()) {
      return next(new ErrorHandler(400, 'OTP expired'));
    }

    if (verification.otp !== otp) {
      return next(new ErrorHandler(400, 'Invalid OTP'));
    }

    res.status(200).json({ success: true, message: `${type} verified successfully` });
  } catch (error: any) {
    next(error);
  }
};
