import { Request, Response, NextFunction } from 'express';
import { findAllCategories } from '../repository/category.repository.js';

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const isLimitedData = (req.query?.isLimitedData as string) || '';

    const categories = await findAllCategories({ isLimitedData });
    res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    return next(error);
  }
};
