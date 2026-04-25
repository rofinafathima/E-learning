import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  fileUrl: { type: String },
  totalPoints: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Assignment', assignmentSchema);
