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
    body('grade')
      .isIn(['4th', '5th', '6th'])
      .withMessage('Grade must be 4th, 5th, or 6th'),
    body('avatar')
      .isInt({ min: 1, max: 4 })
      .withMessage('Avatar must be between 1 and 4'),
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

      const { fullName, username, password, age, grade, avatar, language } = req.body;

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
        grade,
        avatar,
        language,
        organProgress: []
      });

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
            grade: user.grade,
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

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            age: user.age,
            grade: user.grade,
            avatar: user.avatar,
            language: user.language,
            role: user.role,
            assignedGrade: user.assignedGrade,
            stats: user.stats,
            createdAt: user.createdAt
          },
          token
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
      .isInt({ min: 1, max: 4 }),
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
    const user = await User.findById(req.userId).select('stats quizResults organProgress');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
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

export default router;
