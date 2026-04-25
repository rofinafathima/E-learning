import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { auth, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const router = express.Router();

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create course (Instructor only)
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user.id
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Enroll in course (Student only)
router.post('/:id/enroll', auth, authorize('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    course.students.push(req.user.id);
    await course.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: course._id }
    });

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add material to course (Instructor only)
router.post('/:id/materials', auth, authorize('instructor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check if instructor owns the course
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course.materials.push(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/materials/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, type } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const materialUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    course.materials.push({ title, url: materialUrl, type: type || 'pdf' });
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get enrolled courses with materials
router.get('/enrolled', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      populate: { path: 'instructor', select: 'name' }
    });
    res.json(user.enrolledCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
