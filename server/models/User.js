import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
  avatar: {
    type: Number,
    required: [true, 'Avatar selection is required'],
    min: 1,
    max: 4
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['english', 'filipino', 'spanish', 'mandarin'],
    default: 'english'
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
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
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

// Index for faster queries
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

export default User;
