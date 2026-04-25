import express from 'express';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import { auth, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-assign' + path.extname(file.originalname))
});

const upload = multer({ storage });

const router = express.Router();

// Create assignment (Instructor only)
router.post('/', auth, authorize('instructor'), upload.single('file'), async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const fileUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
    const assignment = new Assignment({ ...req.body, fileUrl });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('course');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
