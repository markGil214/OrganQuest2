import mongoose from 'mongoose';

const quizAssignmentSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  quizCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 6,
    maxlength: 6
  },
  quizType: {
    type: String,
    enum: ['multiple-choice', 'timed-challenge', 'memory-matching'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  assignedGrade: {
    type: String,
    enum: ['4th', '5th', '6th', 'all'],
    required: true
  },
  dueDate: {
    type: Date,
    default: null
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  timeLimit: {
    type: Number, // in minutes
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  studentSubmissions: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    studentName: String,
    score: Number,
    percentage: Number,
    attemptNumber: Number,
    timeTaken: Number,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    answers: [{
      questionIndex: Number,
      question: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique 6-character quiz code
quizAssignmentSchema.statics.generateQuizCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let exists = true;
  
  while (exists) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const existingQuiz = await this.findOne({ quizCode: code });
    exists = !!existingQuiz;
  }
  
  return code;
};

// Update timestamp on save
quizAssignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const QuizAssignment = mongoose.model('QuizAssignment', quizAssignmentSchema);

export default QuizAssignment;
