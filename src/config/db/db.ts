import mongoose from 'mongoose';
import { appConfig } from '../appConfig/app.config';
import dotenv from 'dotenv';
import { consoleLogger } from '../../utils/logs/logger.util';
import UserModel from '../../features/user/models/user.schema';
import CourseModel from '../../features/course/models/course.schema';
import CategoryModel from '../../features/category/models/category.schema';
import EnrollmentModel from '../../features/enrollment/models/enrollment.schema';
import PaymentModel from '../../features/payment/models/payment.schema';
import ModuleModel from '../../features/courseModules/models/module.schema';

// Load environment variables from .env
dotenv.config();

export const connectDB = async () => {
  try {
    const mongo_URI = appConfig.mongoURI || process.env.mongoURI;
    const url = mongo_URI as string;
    const res = await mongoose.connect(url);
    consoleLogger.debug({
      MongoDB: `mongodb connected with learning server ${res.connection.host}`,
    });

    // Sync Indexes on Startup
    await UserModel.syncIndexes();
    await CourseModel.syncIndexes();
    await CategoryModel.syncIndexes();
    await EnrollmentModel.syncIndexes();
    await PaymentModel.syncIndexes();
    await ModuleModel.syncIndexes();
    consoleLogger.debug({ MongoDB: 'Indexes synchronized successfully' });
  } catch (error) {
    consoleLogger.error({
      MongoDB: 'learning-server failed to establish connection with mongodb',
    });
    console.log(error);
  }
};
