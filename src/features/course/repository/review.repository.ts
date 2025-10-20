// import mongoose from 'mongoose';
// import ReviewModel from '../models/review.schema';
// import { ErrorHandler } from '../../../utils/errors/errorHandler.util';
// interface review {
//   courseId: string;
//   userId: string;
//   rating: number;
//   comment?: string;
// }

// export const findOrCreateReview = async (courseId: string, data: review) => {
//   try {
//     const { userId, rating, comment } = data;
//     return await ReviewModel.findOneAndUpdate(
//       { course: courseId, user: userId },
//       { rating, comment },
//       {
//         upsert: true, // Creates if doesn't exist
//         new: true, // Returns updated document
//         runValidators: true, // Runs schema validations
//       },
//     );
//   } catch (error) {
//     if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
//       throw error;
//     } else {
//       throw new ErrorHandler(500, 'something went wrong while creating a review.');
//     }
//   }
// };
