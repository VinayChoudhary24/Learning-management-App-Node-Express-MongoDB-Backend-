import mongoose from 'mongoose';
import CourseModel from '../models/course.schema';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util';

interface FindAllCoursesParams {
  limit: number;
  offset: number;
  search: string;
  status: number;
  isFeatured: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

export const findAllCourses = async ({
  limit,
  offset,
  search,
  status,
  isFeatured,
  minPrice,
  maxPrice,
  category,
}: FindAllCoursesParams) => {
  try {
    const filter: any = {
      status: status,
    };

    if (isFeatured !== undefined && isFeatured !== '') {
      // Always normalize to boolean
      filter.isFeatured =
        typeof isFeatured === 'string' ? isFeatured.toLowerCase() === 'true' : !!isFeatured;
    }

    if (search && search !== '') {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexPattern = escapedSearch
        .split(/\s+/)
        .map((word) => `(?=.*${word})`)
        .join('');
      filter.title = { $regex: new RegExp(regexPattern, 'i') };
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    // Category filter
    if (category && category !== '') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = new mongoose.Types.ObjectId(category);
      }
    }

    return await CourseModel.find(filter)
      .select('-__v')
      .sort({ createdAt: -1, _id: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'instructor',
        select: 'firstName lastName', // only these fields
      })
      .populate({
        path: 'category',
        select: 'name', // only the name field
      })
      .lean();
  } catch (error) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'something went wrong while finding All courses.');
    }
  }
};

interface FindAllCoursesCountOptions {
  status: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}
export const findAllCoursesCount = async ({
  status,
  search,
  minPrice,
  maxPrice,
  category,
}: FindAllCoursesCountOptions) => {
  try {
    const filter: any = {
      status: status,
    };
    // Search filter (same as in findAllCourses)
    if (search && search !== '') {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexPattern = escapedSearch
        .split(/\s+/)
        .map((word) => `(?=.*${word})`)
        .join('');
      filter.title = { $regex: new RegExp(regexPattern, 'i') };
    }

    // Price filter (same as in findAllCourses)
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    // Category filter - expects category _id from frontend
    if (category && category !== '') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = new mongoose.Types.ObjectId(category);
      }
    }

    return await CourseModel.countDocuments(filter);
  } catch (error) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error counting courses');
    }
  }
};

export const findCourseById = async (id: string) => {
  try {
    return await CourseModel.findOne({ _id: id, status: 1 })
      .populate({
        path: 'instructor',
        select: 'firstName lastName email role',
      })
      .populate({
        path: 'category',
        select: 'name description',
      })
      .lean();
  } catch (error) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'something went wrong while finding course by id.');
    }
  }
};

export const findCourseWithModules = async (id: string) => {
  try {
    console.log('CALLINGGGG', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler(400, 'Invalid course ID format');
    }
    return await CourseModel.findOne({ _id: id, status: 1 })
      .populate({
        path: 'instructor',
        select: 'firstName lastName email role',
      })
      .populate({
        path: 'category',
        select: 'name description',
      })
      .populate({
        path: 'modules',
        // select: 'name description lessons',
      })
      .lean();
  } catch (error) {
    console.error('❌ Error details:', {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'something went wrong while finding course with modules.');
    }
  }
};
