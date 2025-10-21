import express from 'express';
import {
  createNewUser,
  forgetPassword,
  resetUserPassword,
  userGoogleAuth,
  userGoogleLogin,
  userLogin,
  userLogout,
} from '../controllers/auth.controller.js';
import { jwtAuth } from '../../../middleware/jwt/authentication.middleware.js';
import { getUserCourseEnrollment } from '../../enrollment/controller/enrollment.controller.js';

const router = express.Router();

// POST Routes
// User Register
router.route('/register').post(createNewUser);
// User login
router.route('/login').post(userLogin);
// User logout
router.route('/logout').get(userLogout);

// Google OAuth2 Login/Register URL
router.route('/google').get(userGoogleAuth);
// Google OAuth2 Callback URL
router.route('/oauth2/callback').get(userGoogleLogin);

// Verify JWT
router.route('/verify').get(jwtAuth, (req, res) => {
  res.status(200).json({ success: true, userId: req.userId });
});

// Verify Course Authorization
router.route('/verify/course-auth/:id').get(jwtAuth, async (req, res, next) => {
  await getUserCourseEnrollment(req, res, next);
});

// User Forgot Password
router.route('/password/forget').post(forgetPassword);

// PUT Routes
// User Reset Password
router.route('/password/reset/:token').put(resetUserPassword);

export default router;
