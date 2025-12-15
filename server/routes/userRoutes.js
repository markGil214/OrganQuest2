import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authMiddleware, generateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register',
  [
    body('fullName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2 and 100 characters'),
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('age')
      .isInt({ min: 1, max: 120 })
      .withMessage('Age must be between 1 and 120'),
    body('dateOfBirth')
      .isISO8601()
      .withMessage('Date of birth must be a valid date'),
    body('gender')
      .isIn(['Male', 'Female', 'Other'])
      .withMessage('Gender must be Male, Female, or Other'),
    body('grade')
      .isIn(['4th', '5th', '6th'])
      .withMessage('Grade must be 4th, 5th, or 6th'),
    body('section')
      .isIn(['A', 'B', 'C'])
      .withMessage('Section must be A, B, or C'),
    body('avatar')
      .optional()
      .custom((value) => {
        // Accept numbers 1-4 or strings (base64/URL)
        if (typeof value === 'number') {
          return value >= 1 && value <= 4;
        }
        if (typeof value === 'string') {
          return value.length > 0;
        }
        return false;
      })
      .withMessage('Avatar must be a number between 1-4 or a valid string'),
    body('language')
      .isIn(['english', 'filipino', 'spanish', 'mandarin'])
      .withMessage('Invalid language selection')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { fullName, username, password, age, dateOfBirth, gender, grade, section, avatar, language } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken. Please choose another one.'
        });
      }

      // Create new user (password will be hashed automatically by pre-save hook)
      const user = new User({
        fullName,
        username,
        password,
        age,
        dateOfBirth,
        gender,
        grade,
        section,
        avatar,
        language,
        role: 'student' // Explicitly set role
      });

      console.log('Creating user with role:', user.role);

      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            age: user.age,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            grade: user.grade,
            section: user.section,
            avatar: user.avatar,
            language: user.language,
            stats: user.stats,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
        error: error.message
      });
    }
  }
);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { username, password } = req.body;

      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Generate JWT token
      const token = generateToken(user._id);

      // Set HTTP-only cookie with the token
      res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Always secure for production
        sameSite: 'none', // Required for cross-origin requests
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token: token, // Return token in response body for localStorage
          user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            age: user.age,
            grade: user.grade,
            section: user.section,
            avatar: user.avatar,
            language: user.language,
            role: user.role,
            assignedGrade: user.assignedGrade,
            assignedSection: user.assignedSection,
            stats: user.stats,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: error.message
      });
    }
  }
);

// @route   POST /api/users/logout
// @desc    Logout user by clearing the authentication cookie
// @access  Private
router.post('/logout', (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware,
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 }),
    body('age')
      .optional()
      .isInt({ min: 1, max: 120 }),
    body('avatar')
      .optional()
      .custom((value) => {
        // Accept numbers 1-4 or strings (base64/URL)
        if (typeof value === 'number') {
          return value >= 1 && value <= 4;
        }
        if (typeof value === 'string') {
          return value.length > 0;
        }
        return false;
      })
      .withMessage('Avatar must be a number between 1-4 or a valid string'),
    body('language')
      .optional()
      .isIn(['english', 'filipino', 'spanish', 'mandarin'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const updates = {};
      ['username', 'age', 'avatar', 'language'].forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-__v');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating profile',
        error: error.message
      });
    }
  }
);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('stats quizResults organProgress fullName username age grade section');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        fullName: user.fullName,
        username: user.username,
        age: user.age,
        grade: user.grade,
        section: user.section,
        stats: user.stats,
        totalQuizResults: user.quizResults.length,
        exploredOrgans: user.organProgress.filter(o => o.explored).length
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
      error: error.message
    });
  }
});

// @route   PUT /api/user/update-profile
// @desc    Update user profile information
// @access  Private
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, username, age, grade, section } = req.body;
    
    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;
    if (age) updateData.age = age;
    if (grade) updateData.grade = grade;
    if (section) updateData.section = section;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
});

// @route   GET /api/user/my-progress
// @desc    Get user's quiz progress and analytics
// @access  Private
router.get('/my-progress', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('quizResults stats');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate quiz type stats
    const quizTypeStats = {};
    
    user.quizResults.forEach(result => {
      const quizType = result.quizType || 'multiple-choice';
      
      if (!quizTypeStats[quizType]) {
        quizTypeStats[quizType] = {
          totalAttempts: 0,
          totalScore: 0,
          highestScore: 0,
          lowestScore: 100,
          scores: []
        };
      }
      
      quizTypeStats[quizType].totalAttempts++;
      quizTypeStats[quizType].totalScore += result.score;
      quizTypeStats[quizType].scores.push(result.score);
      
      if (result.score > quizTypeStats[quizType].highestScore) {
        quizTypeStats[quizType].highestScore = result.score;
      }
      if (result.score < quizTypeStats[quizType].lowestScore) {
        quizTypeStats[quizType].lowestScore = result.score;
      }
    });

    // Calculate averages and completion rate
    Object.keys(quizTypeStats).forEach(quizType => {
      const stats = quizTypeStats[quizType];
      stats.averageScore = stats.totalScore / stats.totalAttempts;
      stats.completionRate = (stats.totalAttempts / (stats.totalAttempts || 1)) * 100;
    });

    res.json({
      success: true,
      data: {
        quizTypeStats,
        overallStats: user.stats
      }
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching progress',
      error: error.message
    });
  }
});

export default router;
