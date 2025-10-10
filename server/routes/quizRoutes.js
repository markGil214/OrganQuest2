import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/quiz/submit
// @desc    Submit quiz results
// @access  Private
router.post('/submit', authMiddleware,
  [
    body('quizType')
      .isIn(['multiple-choice', 'timed-challenge', 'memory-matching'])
      .withMessage('Invalid quiz type'),
    body('score')
      .isInt({ min: 0 })
      .withMessage('Score must be a positive number'),
    body('totalQuestions')
      .isInt({ min: 1 })
      .withMessage('Total questions must be at least 1')
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

      const { quizType, score, totalQuestions } = req.body;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Add quiz result
      user.quizResults.push({
        quizType,
        score,
        totalQuestions,
        completedAt: new Date()
      });

      // Update stats
      user.stats.totalQuizzesTaken += 1;
      user.stats.totalScore += score;
      if (score > user.stats.highScore) {
        user.stats.highScore = score;
      }

      await user.save();

      res.json({
        success: true,
        message: 'Quiz result submitted successfully',
        data: {
          currentScore: score,
          highScore: user.stats.highScore,
          totalQuizzesTaken: user.stats.totalQuizzesTaken
        }
      });
    } catch (error) {
      console.error('Quiz submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error submitting quiz',
        error: error.message
      });
    }
  }
);

// @route   GET /api/quiz/history
// @desc    Get user's quiz history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('quizResults stats');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        quizResults: user.quizResults.sort((a, b) => b.completedAt - a.completedAt),
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz history',
      error: error.message
    });
  }
});

// @route   GET /api/quiz/leaderboard
// @desc    Get top players by high score
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topPlayers = await User.find()
      .select('username avatar stats.highScore stats.totalQuizzesTaken')
      .sort({ 'stats.highScore': -1 })
      .limit(limit);

    res.json({
      success: true,
      data: topPlayers.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        avatar: user.avatar,
        highScore: user.stats.highScore,
        totalQuizzes: user.stats.totalQuizzesTaken
      }))
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard',
      error: error.message
    });
  }
});

export default router;
