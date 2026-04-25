import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  materials: [{
    title: String,
    url: String,
    type: { type: String, enum: ['video', 'pdf', 'link'] }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);
