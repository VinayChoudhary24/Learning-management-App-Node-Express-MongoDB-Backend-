import { appConfig } from '../../config/appConfig/app.config.js';

const time = Number(appConfig.cookieExpiresIN) || 1;

// create token and save into cookie
export const sendToken = async (user: any, res: any, statusCode: number) => {
  let payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const token = user.getJWTToken(payload);
  const cookieOptions = {
    expires: new Date(Date.now() + time * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    response: user,
    token,
  });
};
