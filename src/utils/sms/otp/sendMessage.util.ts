import axios from 'axios';
import { ErrorHandler } from '../../errors/errorHandler.util';
import { appConfig } from '../../../config/appConfig';

interface Fast2SmsResponse {
  return: boolean;
  request_id: string;
  message: string[];
}

export const sendOtpSms = async (phone: string, otp: string): Promise<void> => {
  try {
    const FAST2SMS_API = appConfig.fast2SmsApiKey || process.env.FAST2SMS_API_KEY;
    const FAST2SMS_URL = appConfig.fast2SmsUrl || process.env.FAST2SMS_URL;

    if (!FAST2SMS_API) {
      throw new ErrorHandler(500, 'SMS API key not configured');
    }
    if (!FAST2SMS_URL) {
      throw new ErrorHandler(500, 'SMS URL not configured');
    }

    const response: any = await axios.get<Fast2SmsResponse>(FAST2SMS_URL, {
      params: {
        authorization: FAST2SMS_API,
        message: `Your DEFI Account OTP Verification Code is ${otp}`,
        language: 'english',
        route: 'q',
        numbers: phone,
      },
      headers: {
        'cache-control': 'no-cache',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Check if the response indicates success
    if (!response.data.return) {
      //   console.error('Fast2SMS Error:', response.data);
      throw new ErrorHandler(500, 'Failed to send SMS OTP');
    }

    console.log('SMS sent successfully:', response.data);
  } catch (error: any) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.code);
      //   console.error('Axios Error:', error.message);

      if (error.code === 'ECONNABORTED') {
        throw new ErrorHandler(500, 'SMS service timeout');
      }

      if (error.response?.status === 401) {
        throw new ErrorHandler(500, 'Invalid SMS API credentials');
      }

      throw new ErrorHandler(500, 'Error connecting to SMS service');
    }

    // Re-throw if already an ErrorHandler
    if (error instanceof ErrorHandler) {
      throw error;
    }

    // Generic error
    console.error('SMS Error:', error);
    throw new ErrorHandler(500, 'Failed to send SMS OTP');
  }
};
