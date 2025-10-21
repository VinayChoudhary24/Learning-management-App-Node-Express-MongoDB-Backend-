import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/appConfig/app.config.js';
import { ErrorHandler } from '../../utils/errors/errorHandler.util.js';

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  // console.log('authHeader', authHeader);
  if (!authHeader) {
    return next(new ErrorHandler(401, 'please login again, your session is expired...'));
  }

  // Handle "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  // console.log('token', token);
  try {
    const decodedData = (await jwt.verify(token, appConfig.jwt_secret)) as { id: string };
    // console.log('decodedData', decodedData);
    req.userId = decodedData.id;
    next();
  } catch (err) {
    // console.log('token=ERR', err);
    return next(new ErrorHandler(401, 'please login again, your session is expired...'));
  }
};

// Authorization Middleware
// export const authByUserRole = (...roles) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           403,
//           `Role: ${req.user.role} is not allowed to access this resource`
//         )
//       );
//     }
//     next();
//   };
// };
