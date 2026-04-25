import express from 'express';
import Submission from '../models/Submission.js';
import Notification from '../models/Notification.js';
import Assignment from '../models/Assignment.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-sub' + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { assignment, content } = req.body;
    const fileUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
    
    // Create the submission
    const submission = new Submission({
      assignment,
      student: req.user.id,
      content,
      fileUrl
    });
    await submission.save();

    // Notify the instructor (Optional but good)
    const assignData = await Assignment.findById(assignment).populate('course');
    if (assignData) {
      const instructorNotif = new Notification({
        recipient: assignData.course.instructor,
        title: 'New Submission',
        message: `${req.user.name} submitted their assessment for ${assignData.title}.`,
        type: 'info'
      });
      await instructorNotif.save();
    }

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get submissions for a student
router.get('/my', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).populate('assignment');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
