import mongoose from 'mongoose';
import dayjs from 'dayjs';

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Lesson name must be at least 2 characters'],
    maxlength: [100, 'Lesson name must be at most 100 characters'],
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
});

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Module name must be at least 2 characters'],
      maxlength: [100, 'Module name must be at most 100 characters'],
    },
    description: { type: String, maxlength: 500, default: '' },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    lessons: [lessonSchema],
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
moduleSchema.pre('save', function (next) {
  this.updatedAt = dayjs().unix();
  if (this.isNew) {
    this.createdAt = dayjs().unix();
  }
  next();
});

// Pre-update hook/middleware to update the updatedAt timestamp
moduleSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: dayjs().unix() });
  next();
});

// Indexes for performance
moduleSchema.index({ name: 1 }, { unique: true });

// To get the Virtual Fields in Response
moduleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // hides __v
  transform: function (doc, ret) {
    delete ret.id; // hides the virtual 'id'
    return ret;
  },
});

const ModuleModel = mongoose.model('Module', moduleSchema);
export default ModuleModel;
