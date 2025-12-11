import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/quiz/submit
// @desc    Submit quiz results with detailed tracking
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
      .withMessage('Total questions must be at least 1'),
    body('timeTaken')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time taken must be a positive number'),
    body('answers')
      .optional()
      .isArray()
      .withMessage('Answers must be an array')
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

      const { quizType, score, totalQuestions, timeTaken = 0, answers = [] } = req.body;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Track attempt info without limiting
      let attemptInfo = user.quizAttempts.find(a => a.quizType === quizType);
      
      if (!attemptInfo) {
        attemptInfo = {
          quizType,
          attemptCount: 0,
          maxAttempts: 999
        };
        user.quizAttempts.push(attemptInfo);
      }

      // Increment attempt count for tracking only
      attemptInfo.attemptCount += 1;
      attemptInfo.lastAttemptDate = new Date();

      const percentage = Math.round((score / totalQuestions) * 100);

      // Add detailed quiz result
      user.quizResults.push({
        quizType,
        score,
        totalQuestions,
        percentage,
        timeTaken,
        attemptNumber: attemptInfo.attemptCount,
        answers,
        completedAt: new Date()
      });

      // Update stats
      user.stats.totalQuizzesTaken += 1;
      user.stats.totalScore += score;
      if (score > user.stats.highScore) {
        user.stats.highScore = score;
      }

      // Check for badges
      const newBadges = checkAndAwardBadges(user);

      await user.save();

      res.json({
        success: true,
        message: 'Quiz result submitted successfully',
        data: {
          currentScore: score,
          percentage,
          highScore: user.stats.highScore,
          totalQuizzesTaken: user.stats.totalQuizzesTaken,
          attemptNumber: attemptInfo.attemptCount,
          remainingAttempts: attemptInfo.maxAttempts - attemptInfo.attemptCount,
          newBadges
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

// @route   GET /api/quiz/attempts/:quizType
// @desc    Check remaining attempts for a quiz
// @access  Private
router.get('/attempts/:quizType', authMiddleware, async (req, res) => {
  try {
    const { quizType } = req.params;
    
    const user = await User.findById(req.userId).select('quizAttempts');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const attemptInfo = user.quizAttempts.find(a => a.quizType === quizType);
    
    if (!attemptInfo) {
      return res.json({
        success: true,
        data: {
          attemptCount: 0,
          maxAttempts: 3,
          remainingAttempts: 3
        }
      });
    }

    res.json({
      success: true,
      data: {
        attemptCount: attemptInfo.attemptCount,
        maxAttempts: attemptInfo.maxAttempts,
        remainingAttempts: attemptInfo.maxAttempts - attemptInfo.attemptCount,
        lastAttemptDate: attemptInfo.lastAttemptDate
      }
    });
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching attempts',
      error: error.message
    });
  }
});

// @route   GET /api/quiz/history
// @desc    Get user's quiz history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('quizResults stats quizAttempts badges');
    
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
        stats: user.stats,
        attempts: user.quizAttempts,
        badges: user.badges || []
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

// Helper function to check and award badges
function checkAndAwardBadges(user) {
  const newBadges = [];
  
  // First Quiz Badge
  if (user.stats.totalQuizzesTaken === 1 && !user.badges.some(b => b.badgeId === 'first-quiz')) {
    const badge = {
      badgeId: 'first-quiz',
      name: 'First Steps',
      earnedAt: new Date()
    };
    user.badges.push(badge);
    newBadges.push(badge);
  }
  
  // Perfect Score Badge
  const latestQuiz = user.quizResults[user.quizResults.length - 1];
  if (latestQuiz && latestQuiz.score === latestQuiz.totalQuestions && 
      !user.badges.some(b => b.badgeId === 'perfect-score')) {
    const badge = {
      badgeId: 'perfect-score',
      name: 'Perfect Score',
      earnedAt: new Date()
    };
    user.badges.push(badge);
    newBadges.push(badge);
  }
  
  // Quiz Master Badge (10 quizzes)
  if (user.stats.totalQuizzesTaken === 10 && !user.badges.some(b => b.badgeId === 'quiz-master')) {
    const badge = {
      badgeId: 'quiz-master',
      name: 'Quiz Master',
      earnedAt: new Date()
    };
    user.badges.push(badge);
    newBadges.push(badge);
  }
  
  // Speed Demon Badge (completed in under 2 minutes)
  if (latestQuiz && latestQuiz.timeTaken && latestQuiz.timeTaken < 120 && 
      !user.badges.some(b => b.badgeId === 'speed-demon')) {
    const badge = {
      badgeId: 'speed-demon',
      name: 'Speed Demon',
      earnedAt: new Date()
    };
    user.badges.push(badge);
    newBadges.push(badge);
  }
  
  // All Quiz Types Badge
  const quizTypes = ['multiple-choice', 'timed-challenge', 'memory-matching'];
  const completedTypes = [...new Set(user.quizResults.map(q => q.quizType))];
  if (completedTypes.length === 3 && !user.badges.some(b => b.badgeId === 'all-types')) {
    const badge = {
      badgeId: 'all-types',
      name: 'Well Rounded',
      earnedAt: new Date()
    };
    user.badges.push(badge);
    newBadges.push(badge);
  }
  
  return newBadges;
}

export default router;
