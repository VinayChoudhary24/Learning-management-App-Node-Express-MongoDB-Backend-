import mongoose from 'mongoose';
import dayjs from 'dayjs';

// STATUS
const ACTIVE = 1;
const INACTIVE = 0;
const SUSPENDED = 2;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [100, 'Category name must be at most 100 characters'],
    },
    description: { type: String, maxlength: 500, default: '' },
    isFeatured: { type: Boolean, default: false },
    image: { type: String, default: '' },
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
categorySchema.pre('save', function (next) {
  this.updatedAt = dayjs().unix();
  if (this.isNew) {
    this.createdAt = dayjs().unix();
  }
  next();
});

// Pre-update hook/middleware to update the updatedAt timestamp
categorySchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: dayjs().unix() });
  next();
});

// Indexes for performance
categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ status: 1 });

// To get the Virtual Fields in Response
categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // hides __v
  transform: function (doc, ret) {
    delete ret.id; // hides the virtual 'id'
    return ret;
  },
});

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;
