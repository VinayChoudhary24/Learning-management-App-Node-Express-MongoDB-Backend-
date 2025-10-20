import mongoose from 'mongoose';
import validator from 'validator';
import dayjs from 'dayjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { appConfig } from '../../../config/appConfig';

// STATUS
const ACTIVE = 1;
const INACTIVE = 0;
const SUSPENDED = 2;

// Role
const STUDENT = 'student';
const INSTRUCTOR = 'instructor';
const ADMIN = 'admin';

const jwt_expire = '1h';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [30, 'First name must be at most 30 characters'],
      validate: {
        validator: (v: string) => /^[a-zA-Z0-9\s\-']+$/.test(v),
        message: 'First name can only contain letters, numbers, spaces, hyphens, and apostrophes',
      },
    },

    lastName: {
      type: String,
      required: [
        function (this: any) {
          // Only required for local auth, optional for OAuth
          return this.authProvider === 'local';
        },
        'Last name is required',
      ],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [30, 'Last name must be at most 30 characters'],
      validate: {
        validator: (v: string) => /^[a-zA-Z0-9\s\-']+$/.test(v),
        message: 'Last name can only contain letters, numbers, spaces, hyphens, and apostrophes',
      },
    },
    phoneCode: {
      type: String,
      required: [
        function (this: any) {
          // Only required for local auth, optional for OAuth
          return this.authProvider === 'local';
        },
        'Phone code is required',
      ],
    },
    phone: {
      type: String,
      required: [
        function (this: any) {
          // Only required for local auth, optional for OAuth
          return this.authProvider === 'local';
        },
        'Phone number is required',
      ],
      validate: {
        validator: validator.isMobilePhone,
        message: 'Please enter a valid phone number',
      },
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'email is required'],
      validate: [validator.isEmail, 'please enter a valid email'],
    },
    password: {
      type: String,
      required: [
        function (this: any) {
          // Only required for local auth, optional for OAuth
          return this.authProvider === 'local';
        },
        'Password is required',
      ],
      select: false,
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [52, 'Password cannot exceed 52 characters'],
      validate: {
        validator: function (v: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(v);
        },
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    },
    role: {
      type: String,
      enum: [STUDENT, INSTRUCTOR, ADMIN],
      default: STUDENT,
    },
    // enrolledCourses: [
    //       {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Course',
    //         required: true,
    //       },
    //     ],
    profileImg: {
      public_id: { type: String, default: '' },
      url: {
        type: String,
        default: '',
      },
    },
    has2FA: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      enum: [ACTIVE, INACTIVE, SUSPENDED],
      default: ACTIVE,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'apple', 'facebook'],
      default: 'local',
    },
    userGoogleId: { type: String, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    courses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      default: [],
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

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  const first = this.firstName || '';
  const last = this.lastName || '';
  return `${first} ${last}`.trim();
});

userSchema.virtual('mobile').get(function () {
  if (this.phoneCode && this.phone) {
    return `${this.phoneCode}${this.phone}`;
  }
  return null;
});

// before save
userSchema.pre('save', function (next) {
  this.updatedAt = dayjs().unix();
  if (this.isNew) {
    this.createdAt = dayjs().unix();
  }
  next();
});

// Pre-update hook/middleware to update the updatedAt timestamp
userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: dayjs().unix() });
  next();
});

// hash user password before saving using bcrypt
// userSchema.pre('save', async function (next) {
//   const saltRounds = 12;
//   // const saltRounds = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, saltRounds);
//   next();
// });
userSchema.pre('save', async function (next) {
  // For a NEW user being created:
  // - this.isModified('password') returns TRUE (because it's a new document)
  // - this.password exists and contains the plain text password
  // So the condition passes and password gets hashed

  if (!this.isModified('password') || !this.password) {
    return next(); // This won't execute for new users
  }

  // try {
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds); // Password gets hashed
  next();
  // } catch (error) {
  // next(error);
  // }
});

// JWT Token
userSchema.methods.getJWTToken = function (payload: any) {
  return jwt.sign(payload, appConfig.jwt_secret, {
    expiresIn: jwt_expire,
  });
};

// password compare
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// generatePasswordResetToken
userSchema.methods.getResetPasswordToken = async function () {
  // console.log('Generating reset password token for user:', this.email);
  const resetToken = crypto.randomBytes(20).toString('hex');
  // hashing and updating user resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  // console.log('Reset token (unhashed):', resetToken);
  return resetToken;
};

// Indexes for performance
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ firstName: 1, lastName: 1 });

// To get the Virtual Fields in Response
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // hides __v
  transform: function (doc, ret) {
    delete ret.password;
    // delete ret.resetPasswordToken;
    // delete ret.resetPasswordExpire;
    delete ret.id; // hides the virtual 'id'
    return ret;
  },
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
