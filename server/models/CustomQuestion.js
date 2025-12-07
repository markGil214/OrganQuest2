import mongoose from 'mongoose';

const customQuestionSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['heart', 'brain', 'lungs', 'liver', 'kidney', 'digestive', 'general'],
    default: 'general'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  grade: {
    type: String,
    enum: ['4th', '5th', '6th', 'all'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
customQuestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
customQuestionSchema.index({ teacherId: 1, grade: 1, isActive: 1 });

const CustomQuestion = mongoose.model('CustomQuestion', customQuestionSchema);

export default CustomQuestion;
