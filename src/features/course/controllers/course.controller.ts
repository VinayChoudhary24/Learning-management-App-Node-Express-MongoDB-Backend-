import { ErrorHandler } from '../../../utils/errors/errorHandler.util.js';
import { Request, Response, NextFunction } from 'express';
import {
  findAllCourses,
  findAllCoursesCount,
  findCourseById,
  findCourseWithModules,
} from '../repository/course.repository.js';
// import { findOrCreateReview } from '../repository/review.repository';

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // const userId = req.userId;
    // if (!userId) {
    //   return next(new ErrorHandler(401, 'User ID is required'));
    // }
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = (req.query.search as string)?.trim() || '';
    const status = parseInt(req.query.status as string) || 1;
    const isFeatured = (req.query?.isFeatured as string) || '';

    // Price filters
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : 0;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : 50000;

    // Category filter
    const category = (req.query.category as string)?.trim() || '';

    const courses = await findAllCourses({
      limit,
      offset,
      search,
      status,
      isFeatured,
      minPrice,
      maxPrice,
      category,
    });

    const count = await findAllCoursesCount({ status, search, minPrice, maxPrice, category });

    if (!courses || !count) {
      return next(new ErrorHandler(404, 'Courses not found or inactive'));
    }

    res.status(200).json({
      success: true,
      total: count,
      courses: courses,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler(400, 'please provide course ID'));
    }
    const course = await findCourseById(id);

    if (!course) {
      res.status(400).json({
        success: true,
        message: 'course not found or deactivated.',
      });
      return;
    }
    res.status(200).json({
      success: true,
      course: course,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCourseModules = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler(400, 'please provide course ID'));
    }

    const course = await findCourseWithModules(id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'course not found or deactivated.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      course: course,
    });
  } catch (error) {
    return next(error);
  }
};

// export const addCourseReview = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const { courseId } = req.params;
//     const { userId, rating } = req.body;

//     if (!userId || !rating || !courseId) {
//       return next(new ErrorHandler(400, 'please provide required fields'));
//     }

//     // Check if course exists
//     const course = await findCourseById(courseId);
//     if (!course) {
//       res.status(400).json({
//         success: true,
//         message: 'course not found or deactivated.',
//       });
//       return;
//     }

//     // Create or update review using repository
//     const review = await findOrCreateReview(courseId, req.body);

//     // get the updaated course
//     if (review) {
//       const updatedCourse = await findCourseById(courseId);

//       res.status(200).json({
//         success: true,
//         course: updatedCourse,
//       });
//     } else {
//       res.status(400).json({
//         success: true,
//         message: 'failed to update course review',
//       });
//       return;
//     }
//   } catch (error) {
//     next(error);
//   }
// };
