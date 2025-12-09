import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: ['4th', '5th', '6th'],
    default: '4th'
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    enum: ['A', 'B', 'C'],
    uppercase: true
  },
  avatar: {
    type: Number,
    required: [true, 'Avatar selection is required'],
    min: 1,
    max: 4
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['english', 'filipino'],
    default: 'english'
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'superuser'],
    default: 'student'
  },
  assignedGrade: {
    type: String,
    enum: ['4th', '5th', '6th', 'all'],
    default: null // Only for teachers
  },
  teacherCode: {
    type: String,
    unique: true,
    sparse: true // Only for teachers
  },
  stats: {
    totalQuizzesTaken: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    highScore: {
      type: Number,
      default: 0
    },
    organsExplored: {
      type: Number,
      default: 0
    }
  },
  organProgress: [{
    organName: String,
    explored: {
      type: Boolean,
      default: false
    },
    exploredAt: Date
  }],
  quizResults: [{
    quizType: {
      type: String,
      enum: ['multiple-choice', 'timed-challenge', 'memory-matching']
    },
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    timeTaken: Number, // in seconds
    attemptNumber: {
      type: Number,
      default: 1
    },
    answers: [{
      questionIndex: Number,
      question: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean
    }],
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizAttempts: [{
    quizType: {
      type: String,
      enum: ['multiple-choice', 'timed-challenge', 'memory-matching']
    },
    attemptCount: {
      type: Number,
      default: 0
    },
    lastAttemptDate: Date,
    maxAttempts: {
      type: Number,
      default: 3
    }
  }],
  badges: [{
    badgeId: String,
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Auto-increment userId before saving
userSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  try {
    const lastUser = await this.constructor.findOne({}, { userId: 1 }).sort({ userId: -1 });
    this.userId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes for faster queries
userSchema.index({ userId: 1 }, { unique: true });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.highScore': -1 }); // For leaderboard queries
userSchema.index({ role: 1, assignedGrade: 1 }); // For admin queries
userSchema.index({ createdAt: -1 }); // For sorting by registration date

const User = mongoose.model('User', userSchema);

export default User;
