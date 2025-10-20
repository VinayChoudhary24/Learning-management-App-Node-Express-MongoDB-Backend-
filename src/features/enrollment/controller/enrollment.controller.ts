import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util';
import {
  createEnrollmentRepo,
  getEnrollmentRepo,
  getUserCourseEnrollmentRepo,
} from '../repository/enrollment.repository';

export const createEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('Called createEnrollment controller');
  try {
    const userId = req.userId as string;
    if (!userId) {
      return next(new ErrorHandler(401, 'User ID is required'));
    }

    const { courseIds } = req.body;

    // Validate courseIds
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return next(new ErrorHandler(400, 'Course IDs are required and must be a non-empty array'));
    }

    // Create enrollment
    const enrollment = await createEnrollmentRepo(userId, courseIds);

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      response: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('Called createEnrollment controller');
  try {
    const userId = req.userId as string;
    if (!userId) {
      return next(new ErrorHandler(401, 'User ID is required'));
    }

    // get user enrollments
    const enrollments = await getEnrollmentRepo(userId);

    res.status(201).json({
      success: true,
      message: 'Enrollment fetched successfully',
      response: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserCourseEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('Called createEnrollment controller');
  try {
    const userId = req.userId as string;
    if (!userId) {
      return next(new ErrorHandler(401, 'User ID is required'));
    }

    const { id } = req.params;

    const { id: courseId } = req.params;
    if (!courseId) {
      return next(new ErrorHandler(400, 'Please provide course ID'));
    }

    const enrollment = await getUserCourseEnrollmentRepo(userId, courseId);

    if (enrollment) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (error) {
    next(error);
  }
};
