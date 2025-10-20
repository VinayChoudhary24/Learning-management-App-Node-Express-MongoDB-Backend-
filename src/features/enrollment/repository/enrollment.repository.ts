import mongoose from 'mongoose';
import UserModel from '../../user/models/user.schema';
import { ErrorHandler } from '../../../utils/errors/errorHandler.util';
import CourseModel from '../../course/models/course.schema';
import { validateEnrollmentAmount } from '../service/validateEnrollmentAmount';
import EnrollmentModel from '../models/enrollment.schema';

export const createEnrollmentRepo = async (userId: string, courseIds: string[]) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const courseObjectIds = courseIds.map((id) => new mongoose.Types.ObjectId(id));

    // Fetch user details
    const user = await UserModel.findById(userObjectId)
      .select('firstName lastName email phone phoneCode')
      .lean();
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    // Fetch courses and validate they exist
    const courses = await CourseModel.find({
      _id: { $in: courseObjectIds },
      status: 1, // ACTIVE courses
    })
      .select('_id title price')
      .lean();

    if (courses.length !== courseIds.length) {
      throw new ErrorHandler(404, 'One or more courses not found or inactive');
    }

    // Calculate subtotal from course prices
    const subTotalAmount = courses.reduce((sum, course) => sum + course.price, 0);

    // Validate and calculate pricing
    const pricingDetails = validateEnrollmentAmount(subTotalAmount);

    // Create enrollment document
    const enrollment = await EnrollmentModel.create({
      userId: userObjectId,
      userDetails: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        phoneCode: user.phoneCode || '',
      },
      enrollmentDetails: courseObjectIds,
      subTotalAmount: pricingDetails.subTotalAmount,
      taxes: pricingDetails.taxes,
      discountAmount: pricingDetails.discountAmount,
      totalAmount: pricingDetails.totalAmount,
      enrollmentStatus: 1, // PENDING
      enrollmentType: 1, // ONLINE
    });

    // Populate enrollmentDetails with course title and price
    const populatedEnrollment = await EnrollmentModel.findById(enrollment._id)
      .populate({
        path: 'enrollmentDetails',
        select: 'title price',
      })
      .lean();

    return populatedEnrollment;
  } catch (error: any) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error creating enrollment');
    }
  }
};

export const getEnrollmentRepo = async (userId: string) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const enrollments = await EnrollmentModel.find({ userId: userObjectId, enrollmentStatus: 4 })
      .populate({
        path: 'enrollmentDetails',
        model: 'Course',
        select: 'title courseImg duration instructor price',
        populate: {
          path: 'instructor',
          model: 'User',
          select: 'firstName lastName',
        },
      })
      .populate({
        path: 'paymentId',
        model: 'Payment',
        select: 'status gateway cardInfo taxes discountAmount amount updatedAt',
        match: { status: 3 },
      })
      .sort({ createdAt: -1 })
      .lean();

    return enrollments;
  } catch (error: any) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error creating enrollment');
    }
  }
};

export const updateEnrollmentPaymentIdRepo = async (enrollmentId: string, paymentId: string) => {
  try {
    const enrollmentObjectId = new mongoose.Types.ObjectId(enrollmentId);

    // Find and update enrollment
    const enrollment = await EnrollmentModel.findByIdAndUpdate(
      enrollmentObjectId,
      {
        paymentId: paymentId,
      },
      {
        new: true, // Return updated document
        runValidators: true,
      },
    );

    if (!enrollment) {
      throw new ErrorHandler(404, 'Enrollment not found');
    }
    return enrollment;
  } catch (error: any) {
    // console.error('Error updating enrollment:', error);
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error updating enrollment payment ID');
    }
  }
};

/**
 * Update enrollment status and paymentId after successful payment
 */
export const updateEnrollmentStatusAndPaymentDetailsRepo = async (enrollmentId: string) => {
  try {
    const enrollmentObjectId = new mongoose.Types.ObjectId(enrollmentId);

    // Find and update enrollment
    const enrollment = await EnrollmentModel.findByIdAndUpdate(
      enrollmentObjectId,
      {
        enrollmentStatus: 4, // PAID status
      },
      {
        new: true, // Return updated document
        runValidators: true,
      },
    );

    if (!enrollment) {
      throw new ErrorHandler(404, 'Enrollment not found');
    }

    // console.log('Enrollment updated successfully:', enrollment);

    return enrollment;
  } catch (error: any) {
    console.error('Error updating enrollment status:', error);
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error updating enrollment payment status');
    }
  }
};

/**
 * Get enrollment by ID
 */
export const getEnrollmentByIdRepo = async (enrollmentId: string) => {
  try {
    const enrollmentObjectId = new mongoose.Types.ObjectId(enrollmentId);

    const enrollment = await EnrollmentModel.findById(enrollmentObjectId).lean();

    if (!enrollment) {
      throw new ErrorHandler(404, 'Enrollment not found');
    }

    return enrollment;
  } catch (error: any) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error fetching enrollment');
    }
  }
};

// Check if user is enrolled for a particular course
export const getUserCourseEnrollmentRepo = async (userId: string, courseId: string) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // Check if enrollment exists with status 4 and courseId in enrollmentDetails array
    const enrollment = await EnrollmentModel.findOne({
      userId: userObjectId,
      enrollmentDetails: { $in: [courseObjectId] },
      enrollmentStatus: 4,
    });

    return enrollment;
  } catch (error: any) {
    if (error instanceof mongoose.Error || error instanceof ErrorHandler) {
      throw error;
    } else {
      throw new ErrorHandler(500, 'Error fetching user course enrollment');
    }
  }
};
