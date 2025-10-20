import mongoose, { Document, Model } from 'mongoose';
import dayjs from 'dayjs';

const validateTags = (tags: string[]): boolean => {
  if (!Array.isArray(tags)) return false;
  return tags.length <= 10 && tags.every((tag) => typeof tag === 'string' && tag.length <= 30);
};

// STATUS
const ACTIVE = 1;
const INACTIVE = 0;
const SUSPENDED = 2;

// LEVEL
const BEGINNER = 1;
const INTERMEDIATE = 2;
const ADVANCED = 3;

// // Interface for the Course document
// export interface ICourse extends Document {
//   title: string;
//   description: string;
//   price: number;
//   courseImg: {
//     public_id: string;
//     url: string;
//   };
//   instructor: mongoose.Schema.Types.ObjectId;
//   category: mongoose.Schema.Types.ObjectId;
//   level: number;
//   language: string;
//   duration: number;
//   ratingStats: {
//     averageRating: number;
//     totalReviews: number;
//     ratingsBreakdown: {
//       1: number;
//       2: number;
//       3: number;
//       4: number;
//       5: number;
//     };
//   };
//   tags: string[];
//   isFeatured: boolean;
//   modules: mongoose.Schema.Types.ObjectId[];
//   status: number;
//   createdAt: number;
//   updatedAt: number;
// }

// // Interface for the Course model (including static methods)
// interface ICourseModel extends Model<ICourse> {
//   updateRatingStats(courseId: string): Promise<void>;
// }

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Price must be positive'],
    },
    courseImg: {
      public_id: { type: String, default: '' },
      url: {
        type: String,
        default: '',
      },
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // creating the relation with User model
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    level: {
      type: Number,
      enum: [BEGINNER, INTERMEDIATE, ADVANCED],
      default: BEGINNER,
    },
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: Number, // in hours
      default: 0,
    },
    // Store computed rating data for performance
    ratingStats: {
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0, min: 0 },
      ratingsBreakdown: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: validateTags,
        message: 'Maximum 10 tags, each no longer than 30 characters',
      },
    },
    isFeatured: { type: Boolean, default: false },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
      },
    ],
    status: {
      type: Number,
      enum: [ACTIVE, INACTIVE, SUSPENDED],
      default: ACTIVE,
    },
    createdAt: {
      type: Number,
      default: () => dayjs().unix(),
    },
    updatedAt: {
      type: Number,
      default: () => dayjs().unix(),
    },
  },
  {
    timestamps: false,
  },
);

// before save
courseSchema.pre('save', function (next) {
  this.updatedAt = dayjs().unix();
  if (this.isNew) {
    this.createdAt = dayjs().unix();
  }
  next();
});

// Pre-update hook/middleware to update the updatedAt timestamp
courseSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: dayjs().unix() });
  next();
});

// // ## HOW TO USE
// // Create a review - ratings automatically updated
// const review = await ReviewModel.create({
//   course: courseId,
//   user: userId,
//   rating: 5,
//   comment: "Great course!"
// });

// // Update a review - ratings automatically updated
// await ReviewModel.findByIdAndUpdate(reviewId, { rating: 4, comment: "Updated review" });

// // Delete a review - ratings automatically updated
// await ReviewModel.findByIdAndDelete(reviewId);
courseSchema.statics.updateRatingStats = async function (courseId) {
  const ReviewModel = mongoose.model('Review');

  const stats = await ReviewModel.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingsBreakdown: {
          $push: '$rating',
        },
      },
    },
  ]);

  if (stats.length === 0) {
    await this.findByIdAndUpdate(courseId, {
      ratingStats: {
        averageRating: 0,
        totalReviews: 0,
        ratingsBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    });
    return;
  }

  const breakdown: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].ratingsBreakdown.forEach((rating: any) => {
    breakdown[rating]++;
  });

  await this.findByIdAndUpdate(courseId, {
    ratingStats: {
      averageRating: Number(stats[0].averageRating.toFixed(2)),
      totalReviews: stats[0].totalReviews,
      ratingsBreakdown: breakdown,
    },
  });
};

// Indexes for performance
courseSchema.index({ title: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ 'ratingStats.averageRating': -1 });
courseSchema.index({ isFeatured: 1, status: 1 });

// To get the Virtual Fields in Response
courseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // hides __v
  transform: function (doc, ret) {
    delete ret.id; // hides the virtual 'id'
    return ret;
  },
});

const CourseModel = mongoose.model('Course', courseSchema);
export default CourseModel;
