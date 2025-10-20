import { Request, Response, NextFunction } from 'express';

export const notFoundMiddleware: any = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'learning Server Route not found',
  });
};
