import express from 'express';
import {
  // getInternalUserDetails,
  getUserDetails,
  sendContactMail,
  updateUserDetails,
} from '../controllers/user.controller';
import { jwtAuth } from '../../../middleware/jwt/authentication.middleware';
import {
  sendVerificationOtp,
  verifyOtp,
} from '../../verificationOTP/controllers/verification.controller';

const router = express.Router();

// GET:
// Fetch user details only
router.route('/').get(jwtAuth, getUserDetails);
// Fetch user with Specific booking details
// router.route('/api/user/booking').get(getUserWithBookingDetails);
// Fetch User with All booking details
// router.route('/api/user/allbooking').get(getUserWithAllBookingDetails);

// PUT:
// Update user details
router.route('/').put(jwtAuth, updateUserDetails);

// POST
// Send OTP
router.route('/send-otp').post(sendVerificationOtp);
// Verify OTP
router.route('/verify-otp').post(verifyOtp);
// Contact Mail
// Send OTP
router.route('/contact').post(sendContactMail);

export default router;
