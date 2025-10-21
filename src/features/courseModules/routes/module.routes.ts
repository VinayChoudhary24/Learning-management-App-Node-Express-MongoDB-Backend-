import express from 'express';
// import { jwtAuth } from '../../../middleware/jwt/authentication.middleware';
import { createModuleForCourse } from '../controllers/module.controller.js';

const router = express.Router();

// POST → create new module(s) for a course
router.route('/:courseId').post(createModuleForCourse);

export default router;
