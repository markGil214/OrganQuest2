import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: ['4th', '5th', '6th', '7th', '8th', '9th', '10th'],
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
    uppercase: true,
    trim: true
  },
  className: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [50, 'Class name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1'],
    max: [100, 'Capacity cannot exceed 100'],
    default: 30
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Teacher assigned to this class
  }
}, {
  timestamps: true
});

// Compound index to ensure unique grade-section combinations
classSchema.index({ grade: 1, section: 1 }, { unique: true });

// Index for faster queries
classSchema.index({ status: 1 });
classSchema.index({ assignedTeacher: 1 });

const Class = mongoose.model('Class', classSchema);

export default Class;