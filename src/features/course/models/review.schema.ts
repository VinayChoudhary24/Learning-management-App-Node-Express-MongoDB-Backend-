// import dayjs from 'dayjs';
// import mongoose from 'mongoose';
// import CourseModel from './course.schema';

// const reviewSchema = new mongoose.Schema(
//   {
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Course',
//       required: true,
//       index: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     comment: { type: String, maxlength: 1000 },
//     rating: { type: Number, min: 1, max: 5, required: true },
//     createdAt: { type: Number, default: () => dayjs().unix() },
//     updatedAt: {
//       type: Number,
//       default: () => dayjs().unix(),
//     },
//   },
//   {
//     timestamps: false,
//   },
// );

// // before save
// reviewSchema.pre('save', function (next) {
//   this.updatedAt = dayjs().unix();
//   if (this.isNew) {
//     this.createdAt = dayjs().unix();
//   }
//   next();
// });

// // Pre-update hook/middleware to update the updatedAt timestamp
// reviewSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
//   this.set({ updatedAt: dayjs().unix() });
//   next();
// });

// // Keep course rating stats in sync
// reviewSchema.post('save', async function (doc, next) {
//   await CourseModel.updateRatingStats(doc.course.toString());
//   next();
// });

// reviewSchema.post('findOneAndUpdate', async function (doc, next) {
//   if (doc) {
//     await CourseModel.updateRatingStats(doc.course.toString());
//   }
//   next();
// });

// reviewSchema.post('findOneAndDelete', async function (doc, next) {
//   if (doc) {
//     await CourseModel.updateRatingStats(doc.course.toString());
//   }
//   next();
// });

// // Compound index for efficient queries
// reviewSchema.index({ course: 1, createdAt: -1 });
// reviewSchema.index({ user: 1, course: 1 }, { unique: true });

// // To get the Virtual Fields in Response
// reviewSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false, // hides __v
//   transform: function (doc, ret) {
//     delete ret.id; // hides the virtual 'id'
//     return ret;
//   },
// });

// const ReviewModel = mongoose.model('Review', reviewSchema);
// export default ReviewModel;
