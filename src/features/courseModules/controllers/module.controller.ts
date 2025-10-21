import { Request, Response, NextFunction } from 'express';
// import dayjs from 'dayjs';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util.js';
import { createModulesAndAttachToCourse } from '../repository/module.repository.js';

export const createModuleForCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const modulesData = req.body.modules; // expecting array of modules

    if (!courseId) {
      return next(new ErrorHandler(400, 'Please provide a course ID.'));
    }

    if (!Array.isArray(modulesData) || modulesData.length === 0) {
      return next(new ErrorHandler(400, 'Please provide module details.'));
    }

    const result = await createModulesAndAttachToCourse(courseId, modulesData);

    res.status(201).json({
      success: true,
      message: 'Modules created and linked to course successfully.',
      modules: result,
    });
  } catch (error) {
    next(error);
  }
};
