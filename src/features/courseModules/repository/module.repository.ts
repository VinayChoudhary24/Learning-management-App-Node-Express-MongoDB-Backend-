import mongoose from 'mongoose';
import CourseModel from '../../course/models/course.schema';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util';
import ModuleModel from '../models/module.schema';

export const createModulesAndAttachToCourse = async (courseId: string, modulesData: any[]) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Ensure course exists
    const course = await CourseModel.findById(courseId).session(session);
    if (!course) {
      throw new ErrorHandler(404, 'Course not found.');
    }

    // Create all modules
    const newModules = await ModuleModel.insertMany(
      modulesData.map((m) => ({
        ...m,
        courses: [courseId],
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      })),
      { session },
    );

    // Update course to include the new module IDs
    const moduleIds = newModules.map((m) => new mongoose.Types.ObjectId(m._id.toString()));
    course.modules.push(...moduleIds);
    await course.save({ session });

    await session.commitTransaction();
    session.endSession();

    return newModules;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error instanceof ErrorHandler
      ? error
      : new ErrorHandler(500, 'Failed to create modules.');
  }
};
