import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
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

// Index for faster queries
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

export default User;
