import mongoose from 'mongoose';
import CategoryModel from '../models/category.schema.js';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util.js';

interface FindAllCategoriesParams {
  isLimitedData: string;
}

export const findAllCategories = async ({ isLimitedData }: FindAllCategoriesParams) => {
  try {
    const filter: any = {
      status: 1,
    };

    // Build the query
    let query = CategoryModel.find(filter);

    // If isLimitedData is true, select only _id and name
    if (isLimitedData !== undefined && isLimitedData !== '') {
      const isLimited =
        typeof isLimitedData === 'string'
          ? isLimitedData.toLowerCase() === 'true'
          : !!isLimitedData;

      if (isLimited) {
        query = query.select('_id name');
      }
    }

    return await query.sort({ createdAt: -1 }).lean();
  } catch (error) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'something went wrong while finding All categories.');
    }
  }
};
