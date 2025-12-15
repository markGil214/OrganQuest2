import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true
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
    required: function() {
      // Required for students and active teachers, optional for pending teachers
      return this.role === 'student' || (this.role === 'teacher' && this.accountStatus === 'active');
    },
    unique: true,
    sparse: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  password: {
    type: String,
    required: function() {
      // Required for students and active teachers, optional for pending teachers
      return this.role === 'student' || (this.role === 'teacher' && this.accountStatus === 'active');
    },
    minlength: [6, 'Password must be at least 6 characters']
  },
  email: {
    type: String,
    sparse: true, // Only for teachers
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Only validate if email is provided
        if (!v) return true;
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  age: {
    type: Number,
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  grade: {
    type: String,
    enum: ['4th', '5th', '6th']
  },
  section: {
    type: String,
    enum: ['A', 'B', 'C'],
    uppercase: true
  },
  dateOfBirth: {
    type: Date,
    required: function() {
      return this.role === 'student';
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: function() {
      return this.role === 'student';
    }
  },
  avatar: {
    type: mongoose.Schema.Types.Mixed,
    default: 1,
    validate: {
      validator: function(v) {
        // Accept numbers 1-4 (preset avatars) or strings (custom avatars)
        return (typeof v === 'number' && v >= 1 && v <= 4) || (typeof v === 'string' && v.length > 0);
      },
      message: 'Avatar must be a number between 1-4 or a valid string'
    }
  },
  language: {
    type: String,
    enum: ['english', 'filipino'],
    default: 'english'
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'superuser'],
    default: 'student'
  },
  assignedGrade: {
    type: String,
    enum: ['4th', '5th', '6th', 'all'],
    default: null // Only for teachers
  },
  assignedSection: {
    type: String,
    enum: ['A', 'B', 'C', 'all'],
    default: null, // Only for teachers
    uppercase: true
  },
  teacherCode: {
    type: String,
    unique: true,
    sparse: true // Only for teachers
  },
  teacherId: {
    type: String,
    sparse: true, // Only for teachers
    unique: true
  },
  accountStatus: {
    type: String,
    enum: ['pending', 'active'],
    default: function() {
      // Students and admins are active by default, teachers start as pending
      return this.role === 'teacher' ? 'pending' : 'active';
    }
  },
  registrationToken: {
    type: String,
    unique: true,
    sparse: true // Only for pending teachers
  },
  tokenExpiry: {
    type: Date,
    default: null // Expiry date for registration token
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
// Note: userId and username already have unique indexes from schema definition
userSchema.index({ 'stats.highScore': -1 }); // For leaderboard queries
userSchema.index({ role: 1, assignedGrade: 1 }); // For admin queries
userSchema.index({ createdAt: -1 }); // For sorting by registration date

// Pre-save hook to generate userId
userSchema.pre('save', async function(next) {
  console.log('Pre-save hook running for user:', this.username, 'role:', this.role, 'userId exists:', !!this.userId);
  if (!this.userId) {
    try {
      const roleSuffixes = {
        student: 'STUD',
        teacher: 'TEACH',
        admin: 'ADMIN',
        superuser: 'SUPER'
      };

      const suffix = roleSuffixes[this.role] || 'USER';
      const year = '25'; // 2025

      console.log('Generating userId for role:', this.role, 'suffix:', suffix);

      // Find the highest sequence number for this role
      const lastUser = await this.constructor.findOne(
        { role: this.role, userId: { $regex: `^${year}-\\d{4}-${suffix}$` } }
      ).sort({ userId: -1 });

      let sequence = 1;
      if (lastUser) {
        const match = lastUser.userId.match(new RegExp(`^${year}-(\\d{4})-${suffix}$`));
        if (match) {
          sequence = parseInt(match[1]) + 1;
        }
      }

      this.userId = `${year}-${sequence.toString().padStart(4, '0')}-${suffix}`;
      console.log('Generated userId:', this.userId, 'for role:', this.role);
      next();
    } catch (error) {
      console.error('Error generating userId:', error);
      next(error);
    }
  } else {
    console.log('userId already exists:', this.userId);
    next();
  }
});

const User = mongoose.model('User', userSchema);

export default User;
