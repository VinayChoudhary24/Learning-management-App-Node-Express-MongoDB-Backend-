import express from 'express';
import { jwtAuth } from '../../../middleware/jwt/authentication.middleware.js';
import {
  getAllCourses,
  getCourseById,
  getCourseModules,
} from '../controllers/course.controller.js';

const router = express.Router();

// POST Routes
// Creates Course
// router.route('/').post(jwtAuth, createNewCourse);

// GET ROUTES
// Get Course with modules
router.route('/module/:id').get(getCourseModules);
// Get a Specific Course by ID
router.route('/:id').get(getCourseById);
// Get All Courses
router.route('/').get(getAllCourses);

// PUT Routes
// Update a course review
// router.route('/review/:courseId').put(jwtAuth, addCourseReview);

export default router;
