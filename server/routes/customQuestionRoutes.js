import express from 'express';
import { body, validationResult } from 'express-validator';
import CustomQuestion from '../models/CustomQuestion.js';
import User from '../models/User.js';
import { authMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

// CREATE: Add new custom question
router.post('/create',
  authMiddleware,
  teacherMiddleware,
  [
    body('questionText').trim().notEmpty().withMessage('Question text is required'),
    body('options').isArray({ min: 4, max: 4 }).withMessage('Must have exactly 4 options'),
    body('correctAnswer').isInt({ min: 0, max: 3 }).withMessage('Correct answer must be 0-3')
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

      const { questionText, options, correctAnswer, explanation, category, difficulty, grade } = req.body;
      
      const teacher = await User.findById(req.userId);

      const question = new CustomQuestion({
        teacherId: req.userId,
        teacherName: teacher.fullName,
        questionText,
        options,
        correctAnswer,
        explanation,
        category,
        difficulty,
        grade
      });

      await question.save();

      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        question: question
      });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating question',
        error: error.message
      });
    }
  }
);

// READ: Get all questions for logged-in teacher
router.get('/my-questions', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { grade, category, difficulty, isActive } = req.query;
    
    const query = { teacherId: req.userId };
    
    if (grade) query.grade = grade;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const questions = await CustomQuestion.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

// READ: Get single question
router.get('/:id', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const question = await CustomQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Verify teacher owns this question
    if (question.teacherId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
});

// UPDATE: Edit question
router.put('/:id',
  authMiddleware,
  teacherMiddleware,
  [
    body('questionText').optional().trim().notEmpty(),
    body('options').optional().isArray({ min: 4, max: 4 }),
    body('correctAnswer').optional().isInt({ min: 0, max: 3 })
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

      const question = await CustomQuestion.findById(req.params.id);
      
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }
      
      // Verify teacher owns this question
      if (question.teacherId.toString() !== req.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      
      const allowedUpdates = ['questionText', 'options', 'correctAnswer', 'explanation', 'category', 'difficulty', 'grade', 'isActive'];
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          question[field] = req.body[field];
        }
      });
      
      await question.save();
      
      res.json({
        success: true,
        message: 'Question updated successfully',
        data: question
      });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating question',
        error: error.message
      });
    }
  }
);

// DELETE: Remove question
router.delete('/:id', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const question = await CustomQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Verify teacher owns this question
    if (question.teacherId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await CustomQuestion.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
});

// TOGGLE: Toggle question active status
router.patch('/toggle-active/:id', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const question = await CustomQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Verify teacher owns this question
    if (question.teacherId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    question.isActive = !question.isActive;
    await question.save();
    
    res.json({
      success: true,
      message: `Question ${question.isActive ? 'activated' : 'deactivated'}`,
      data: question
    });
  } catch (error) {
    console.error('Error toggling question:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling question status',
      error: error.message
    });
  }
});

// GET: Statistics about custom questions
router.get('/stats/summary', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const totalQuestions = await CustomQuestion.countDocuments({ teacherId: req.userId });
    const activeQuestions = await CustomQuestion.countDocuments({ teacherId: req.userId, isActive: true });
    
    const byCategory = await CustomQuestion.aggregate([
      { $match: { teacherId: req.userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const byDifficulty = await CustomQuestion.aggregate([
      { $match: { teacherId: req.userId } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalQuestions,
        activeQuestions,
        byCategory,
        byDifficulty
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

export default router;
