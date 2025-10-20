import express from 'express';
import { getAllCategories } from '../controllers/category.controller';

const router = express.Router();

// GET ROUTES
// Get All Categories
router.route('/').get(getAllCategories);

export default router;
