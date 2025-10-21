import express from 'express';
import { jwtAuth } from '../../../middleware/jwt/authentication.middleware.js';
import { createEnrollment, getEnrollment } from '../controller/enrollment.controller.js';

const router = express.Router();

// POST Routes
// Creates Enrollment
router.route('/').post(jwtAuth, createEnrollment);

// GET Routes
// Fetch Enrollment
router.route('/').get(jwtAuth, getEnrollment);

export default router;
