import { sendOtpEmail } from '../../../utils/emails/oneTimePassword.util.js';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util.js';
import { sendOtpSms } from '../../../utils/sms/otp/sendMessage.util.js';
// import { ErrorHandler } from '../../../utils/errors/errorHandler.util';

export const sendEmailOtp = async (email: string, otp: string) => {
  try {
    console.log(`Sending OTP ${otp} to email: ${email}`);
    await sendOtpEmail(email, otp);
  } catch (emailError) {
    // Handle Errors
    console.log('OTP-EMAIL-ERROR', emailError);
    if (emailError instanceof ErrorHandler) throw emailError;
    throw new ErrorHandler(500, 'Error sending OTP email');
  }
};

export const sendSmsOtp = async (phone: string, otp: string): Promise<void> => {
  try {
    console.log(`Sending OTP ${otp} to phone: ${phone}`);
    await sendOtpSms(phone, otp);
  } catch (smsError) {
    console.error('OTP-SMS-ERROR', smsError);
    if (smsError instanceof ErrorHandler) throw smsError;
    throw new ErrorHandler(500, 'Error sending OTP SMS');
  }
};
