import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util';
import { sendToken } from '../../../utils/sendToken/sendToken.util';
import EventEmitter from 'events';
import {
  createNewUserRepo,
  findUserForPasswordResetRepo,
  findUserRepo,
} from '../repository/auth.repository.js';
import { sendWelcomeEmail } from '../../../utils/emails/welcomeMail.util.js';
import { errorLogger } from '../../../utils/logs/logger.util.js';
// import { createNewSessionRepo } from '../../userSessions/repository/userSession.repository';
import { sendPasswordResetEmail } from '../../../utils/emails/passwordReset.util.js';
import crypto from 'crypto';
// import UserModel from '../../user/models/user.schema';
import { generateAuthUrl, getUserInfoGoogle } from '../service/googleAuth.js';
// import { OAuth2Client } from 'google-auth-library';
import { appConfig } from '../../../config/appConfig/app.config.js';
import { getToken } from '../../../utils/getToken/getToken.util.js';

// Create event emitter instance
const userEventEmitter = new EventEmitter();
// Event handlers for background processing
userEventEmitter.on('user.created', async (data) => {
  const { user, ipAddress, userAgent } = data;

  // Send welcome/OTP email (non-critical)
  try {
    await sendWelcomeEmail(user);
  } catch (emailError) {
    errorLogger.error('Failed to send welcome email:', emailError);
  }
  // Create session record (non-critical)
  // try {
  //   await createNewSessionRepo(user, ipAddress, userAgent);
  // } catch (sessionError) {
  //   errorLogger.error('Failed to create session:', sessionError);
  // }
});

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phoneCode, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phoneCode || !phone || !password) {
      return next(new ErrorHandler(400, 'Please provide all required fields'));
    }

    const newUser = await createNewUserRepo(req.body);

    await sendToken(newUser, res, 201);

    setImmediate(() => {
      userEventEmitter.emit('user.created', {
        user: newUser,
        ipAddress: req.headers['x-app-ip'] || req.headers['x-client-ip'] || req.ip || '',
        userAgent: req.headers['user-agent'] || req.headers['x-client'] || '',
      });
    });
  } catch (err) {
    return next(err);
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, 'please provide email and password'));
    }
    const user: any = await findUserRepo({ email }, true);
    if (!user) {
      return next(new ErrorHandler(401, 'user not found! please register yourself now!!'));
    }
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return next(new ErrorHandler(400, 'Invalid password!'));
    }
    await sendToken(user, res, 200);
  } catch (err) {
    return next(err);
  }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Destroy the session
    // req.session.destroy((err) => {
    // if (err) {
    //   console.error("Error destroying session:", err);
    //   return next(err);
    // }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
    // });
  } catch (error) {
    next(error);
  }
};

export const userGoogleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const googleAuthUrl = generateAuthUrl();
    console.log('Redirecting to Google Auth URL:', googleAuthUrl);
    res.json({ authUrl: googleAuthUrl });
  } catch (err) {
    return next(err);
  }
};

export const userGoogleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const frontendUrl = appConfig.frontendURL || process.env.FRONTEND_URL;
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      // return next(new ErrorHandler(400, 'Authorization code is missing or invalid'));
      return res.redirect(
        `${frontendUrl}/auth/google/oauth2/result?error=Google Authorization code is missing or invalid`,
      );
    }
    const userInfo: any = await getUserInfoGoogle(code);
    if (!userInfo || !userInfo.email) {
      return res.redirect(
        `${frontendUrl}/auth/google/oauth2/result?error=Failed to retrieve user information from Google`,
      );
    }
    console.log('Retrieved user info from Google:', userInfo);
    let user = await findUserRepo({ email: userInfo.email });
    console.log('Existing user found:', user);
    if (!user) {
      // Create new user if not exists
      user = await createNewUserRepo({
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        profileImg: {
          public_id: 'google-oauth2',
          url: userInfo.picture,
        },
        authProvider: 'google',
        userGoogleId: userInfo.id,
      });
      const token = await getToken(user);
      res.redirect(`${frontendUrl}/auth/google/oauth2/result?token=${token}`);

      setImmediate(() => {
        userEventEmitter.emit('user.created', {
          user: user,
          ipAddress: req.headers['x-app-ip'] || req.headers['x-client-ip'] || req.ip || '',
          userAgent: req.headers['user-agent'] || req.headers['x-client'] || '',
        });
      });
    } else {
      const token = await getToken(user);
      res.redirect(`${frontendUrl}/auth/google/oauth2/result?token=${token}`);
    }
  } catch (err) {
    // return next(err);
    const frontendUrl = appConfig.frontendURL || process.env.FRONTEND_URL;
    return res.redirect(
      `${frontendUrl}/auth/google/oauth2/result?error=Google Authentication failed`,
    );
  }
};

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler(400, 'please provide email'));
  }
  try {
    const user: any = await findUserRepo({ email });
    if (!user) {
      return next(new ErrorHandler(404, 'User not found with this email'));
    }

    if (user?.authProvider && user?.authProvider !== 'local') {
      return next(
        new ErrorHandler(404, 'User found with this email. please try to login with Google'),
      );
    }

    const resetToken = await user.getResetPasswordToken();
    // console.log('resetToken', resetToken);
    await user.save({ validateBeforeSave: false });
    // try {
    //   await user.save({ validateBeforeSave: false });
    //   console.log('User saved successfully');
    // } catch (saveError: any) {
    //   console.error('Error saving user:', saveError);
    //   // Log the specific error details
    //   console.error('Save error details:', {
    //     message: saveError.message,
    //     stack: saveError.stack,
    //     name: saveError.name,
    //   });
    //   throw saveError; // Re-throw to handle in outer catch
    // }

    // console.log('Generated reset token:', resetToken);
    try {
      // add a localhost URL for testing purposes i.e http://localhost:5173/reset-password
      const resetPasswordURL = `http://localhost:5173/reset-password/${resetToken}`;
      await sendPasswordResetEmail(user, resetPasswordURL);
      res.status(200).json({
        success: true,
        message: `Password reset link sent to ${user.email}`,
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      errorLogger.error('Failed to send password reset email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset email',
      });
    }
  } catch (err) {
    console.log('Error in forgetPassword:');
    return next(err);
  }
};

export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!token) {
    return next(new ErrorHandler(400, 'please provide verification token'));
  }

  if (!newPassword || newPassword !== confirmPassword) {
    return next(new ErrorHandler(400, 'Passwords do not match'));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const user: any = await findUserForPasswordResetRepo(hashedToken);

    if (!user) {
      return next(new ErrorHandler(400, 'Reset token is invalid or expired'));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendToken(user, res, 200); // auto-login after reset
  } catch (err) {
    return next(err);
  }
};
