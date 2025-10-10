import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const ORGAN_NAMES = [
  'heart', 'brain', 'lungs', 'liver', 'kidney', 
  'stomach', 'intestine', 'bladder', 'pancreas', 
  'spleen', 'eyes', 'tongue', 'thyroid-gland', 
  'diaphragm', 'pelvis-femur'
];

// @route   POST /api/progress/organ
// @desc    Mark an organ as explored
// @access  Private
router.post('/organ', authMiddleware,
  [
    body('organName')
      .isIn(ORGAN_NAMES)
      .withMessage('Invalid organ name')
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

      const { organName } = req.body;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if organ already explored
      const existingOrgan = user.organProgress.find(o => o.organName === organName);
      
      if (existingOrgan) {
        if (existingOrgan.explored) {
          return res.json({
            success: true,
            message: 'Organ already explored',
            data: { alreadyExplored: true }
          });
        }
        existingOrgan.explored = true;
        existingOrgan.exploredAt = new Date();
      } else {
        user.organProgress.push({
          organName,
          explored: true,
          exploredAt: new Date()
        });
      }

      // Update organs explored count
      user.stats.organsExplored = user.organProgress.filter(o => o.explored).length;

      await user.save();

      res.json({
        success: true,
        message: 'Organ marked as explored',
        data: {
          organName,
          totalExplored: user.stats.organsExplored,
          totalOrgans: ORGAN_NAMES.length,
          progressPercentage: Math.round((user.stats.organsExplored / ORGAN_NAMES.length) * 100)
        }
      });
    } catch (error) {
      console.error('Organ progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating organ progress',
        error: error.message
      });
    }
  }
);

// @route   GET /api/progress/organs
// @desc    Get all organ progress
// @access  Private
router.get('/organs', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('organProgress stats.organsExplored');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create a map of explored organs
    const exploredMap = {};
    user.organProgress.forEach(organ => {
      exploredMap[organ.organName] = {
        explored: organ.explored,
        exploredAt: organ.exploredAt
      };
    });

    // Build complete organ list
    const allOrgans = ORGAN_NAMES.map(name => ({
      name,
      explored: exploredMap[name]?.explored || false,
      exploredAt: exploredMap[name]?.exploredAt || null
    }));

    res.json({
      success: true,
      data: {
        organs: allOrgans,
        totalExplored: user.stats.organsExplored,
        totalOrgans: ORGAN_NAMES.length,
        progressPercentage: Math.round((user.stats.organsExplored / ORGAN_NAMES.length) * 100)
      }
    });
  } catch (error) {
    console.error('Organ list error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching organ progress',
      error: error.message
    });
  }
});

// @route   GET /api/progress/summary
// @desc    Get overall progress summary
// @access  Private
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('stats organProgress quizResults');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate average score as percentage
    let averageScore = 0;
    if (user.quizResults.length > 0) {
      const totalPercentage = user.quizResults.reduce((sum, quiz) => {
        const percentage = (quiz.score / quiz.totalQuestions) * 100;
        return sum + percentage;
      }, 0);
      averageScore = Math.round(totalPercentage / user.quizResults.length);
    }

    const recentQuizzes = user.quizResults
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        stats: {
          organsExplored: user.stats.organsExplored,
          quizzesTaken: user.stats.totalQuizzesTaken, // Map to expected field name
          totalQuizzesTaken: user.stats.totalQuizzesTaken,
          averageScore: averageScore, // Calculate average
          totalScore: user.stats.totalScore,
          highScore: user.stats.highScore
        },
        organProgress: {
          explored: user.stats.organsExplored,
          total: ORGAN_NAMES.length,
          percentage: Math.round((user.stats.organsExplored / ORGAN_NAMES.length) * 100)
        },
        recentQuizzes
      }
    });
  } catch (error) {
    console.error('Progress summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching progress summary',
      error: error.message
    });
  }
});

export default router;
