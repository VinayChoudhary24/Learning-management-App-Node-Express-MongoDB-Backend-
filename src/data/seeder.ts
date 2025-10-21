import fs from 'fs';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../features/user/models/user.schema.js';
import CourseModel from '../features/course/models/course.schema.js';
import CategoryModel from '../features/category/models/category.schema.js';

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGO_URI = process.env.mongoURI || 'mongodb://127.0.0.1:27017/easily';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed data
const importData = async () => {
  try {
    console.log('Clearing database...');
    await UserModel.deleteMany();
    await CourseModel.deleteMany();
    await CategoryModel.deleteMany();

    // ------------------------
    // USERS
    // ------------------------
    // const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'));
    const usersData = JSON.parse(
      fs.readFileSync(new URL('./users.json', import.meta.url), 'utf-8'),
    );

    const usersWithHashedPassword = usersData.map((user: any) => {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      return { ...user, password: hashedPassword };
    });

    const createdUsers = await UserModel.insertMany(usersWithHashedPassword);
    console.log(`Inserted ${createdUsers.length} users`);

    // ------------------------
    // CATEGORIES
    // ------------------------
    // const categoriesData = JSON.parse(
    //   fs.readFileSync(path.join(__dirname, 'data/category.json'), 'utf-8'),
    // );
    const categoriesData = JSON.parse(
      fs.readFileSync(new URL('./category.json', import.meta.url), 'utf-8'),
    );

    const createdCategories = await CategoryModel.insertMany(categoriesData);
    console.log(`Inserted ${createdCategories.length} categories`);

    // ------------------------
    // COURSES
    // ------------------------
    // const coursesData = JSON.parse(
    //   fs.readFileSync(path.join(__dirname, 'data/courses.json'), 'utf-8'),
    // );
    const coursesData = JSON.parse(
      fs.readFileSync(new URL('./courses.json', import.meta.url), 'utf-8'),
    );

    // Distribute courses among instructors
    const instructors = createdUsers.filter((u) => u.role === 'instructor');

    // helper: map placeholder -> real ObjectId
    const getInstructorId = (placeholder: string): mongoose.Types.ObjectId => {
      const match: any = placeholder.match(/<instructor_id_(\d+)>/);
      if (!match) throw new Error(`Invalid instructor placeholder: ${placeholder}`);
      const index = parseInt(match[1], 10) - 1;
      if (!instructors[index]) throw new Error(`Instructor index ${index} not found`);
      return instructors[index]._id;
    };

    // NEW: directly map category by its name (case-insensitive)
    const getCategoryIdByName = (name: string): mongoose.Types.ObjectId => {
      const category = createdCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
      if (!category) throw new Error(`Category "${name}" not found`);
      return category._id;
    };

    const coursesWithRefs = coursesData.map((course: any) => {
      let instructorId: mongoose.Types.ObjectId;

      if (course.instructor && course.instructor.startsWith('<instructor_id_')) {
        instructorId = getInstructorId(course.instructor);
      } else {
        // fallback random instructor
        const randomInstructor: any = instructors[Math.floor(Math.random() * instructors.length)];
        instructorId = randomInstructor._id;
      }

      // Category is now direct name match
      const categoryId = course.category ? getCategoryIdByName(course.category) : undefined;

      return {
        title: course.title,
        description: course.description,
        price: course.price,
        courseImg: course.courseImg,
        instructor: instructorId,
        category: categoryId,
        level: course.level,
        language: course.language,
        duration: course.duration,
        tags: course.tags || [],
        isFeatured: course.isFeatured || false,
        status: course.status || 1,
      };
    });
    const createdCourses = await CourseModel.insertMany(coursesWithRefs);
    console.log(`Inserted ${createdCourses.length} courses`);

    console.log('All data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error('Error while seeding data:', error);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await UserModel.deleteMany();
    await CourseModel.deleteMany();
    await CategoryModel.deleteMany();
    console.log('Data destroyed');
    process.exit();
  } catch (error) {
    console.error('Error while destroying data:', error);
    process.exit(1);
  }
};

// Run seeder
(async () => {
  await connectDB();

  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
})();
