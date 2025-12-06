import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authMiddleware, teacherMiddleware, superuserMiddleware } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/Teacher/students
// @desc    Get all students with filters
// @access  Teacher/Superuser
router.get('/students', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { 
      search, // Search by name or username
      grade, 
      age, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build query
    const query = { role: 'student' };

    // Filter by assigned grade if teacher (not superuser)
    if (req.userRole === 'teacher' && req.assignedGrade && req.assignedGrade !== 'all') {
      query.grade = req.assignedGrade;
    } else if (grade) {
      // Only apply grade filter from query params if superuser or teacher with 'all' grades
      query.grade = grade;
    }

    // Apply other filters

    if (age) {
      query.age = parseInt(age);
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get students
    const students = await User.find(query)
      .select('-password -__v')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(query);

    // Calculate additional metrics for each student
    const studentsWithMetrics = students.map(student => {
      const firstDayProgress = calculateFirstDayProgress(student);
      
      return {
        ...student.toObject(),
        firstDayProgress,
        hasProgress: student.stats.totalQuizzesTaken > 0
      };
    });

    res.json({
      success: true,
      data: {
        students: studentsWithMetrics,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching students',
      error: error.message
    });
  }
});

// @route   GET /api/Teacher/students/:id
// @desc    Get detailed student info
// @access  Teacher/Superuser
router.get('/students/:id', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password -__v');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if teacher has access to this student's grade
    if (req.userRole === 'admin' && req.assignedGrade && req.assignedGrade !== 'all') {
      if (student.grade !== req.assignedGrade) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this student'
        });
      }
    }

    const firstDayProgress = calculateFirstDayProgress(student);

    res.json({
      success: true,
      data: {
        student: {
          ...student.toObject(),
          firstDayProgress
        }
      }
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching student',
      error: error.message
    });
  }
});

// @route   GET /api/Teacher/analytics
// @desc    Get analytics for assigned students
// @access  Teacher/Superuser
router.get('/analytics', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const query = { role: 'student' };

    // Filter by assigned grade if teacher
    if (req.userRole === 'teacher' && req.assignedGrade && req.assignedGrade !== 'all') {
      query.grade = req.assignedGrade;
    }

    const students = await User.find(query).select('-password -__v');

    // Calculate analytics
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.stats.totalQuizzesTaken > 0).length;
    
    const totalQuizzes = students.reduce((sum, s) => sum + s.stats.totalQuizzesTaken, 0);
    
    const studentsWithQuizzes = students.filter(s => s.stats.totalQuizzesTaken > 0);
    const avgQuizzesPerStudent = studentsWithQuizzes.length > 0 
      ? totalQuizzes / studentsWithQuizzes.length 
      : 0;

    // Calculate overall average score
    let totalScorePercentage = 0;
    let studentsWithScores = 0;
    
    students.forEach(student => {
      if (student.quizResults.length > 0) {
        const studentAvg = student.quizResults.reduce((sum, quiz) => {
          return sum + (quiz.score / quiz.totalQuestions * 100);
        }, 0) / student.quizResults.length;
        totalScorePercentage += studentAvg;
        studentsWithScores++;
      }
    });

    const overallAverageScore = studentsWithScores > 0 
      ? Math.round(totalScorePercentage / studentsWithScores) 
      : 0;

    // Grade distribution
    const gradeDistribution = {
      '4th': students.filter(s => s.grade === '4th').length,
      '5th': students.filter(s => s.grade === '5th').length,
      '6th': students.filter(s => s.grade === '6th').length
    };

    // First day progress
    const studentsWithFirstDayProgress = students.filter(student => {
      const progress = calculateFirstDayProgress(student);
      return progress.hasActivity;
    }).length;

    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
        totalQuizzes,
        avgQuizzesPerStudent: Math.round(avgQuizzesPerStudent * 10) / 10,
        overallAverageScore,
        gradeDistribution,
        firstDayEngagement: {
          total: totalStudents,
          active: studentsWithFirstDayProgress,
          percentage: totalStudents > 0 ? Math.round((studentsWithFirstDayProgress / totalStudents) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics',
      error: error.message
    });
  }
});

// @route   GET /api/Teacher/admins
// @desc    Get all admins (Superuser only)
// @access  Superuser
router.get('/admins', authMiddleware, superuserMiddleware, async (req, res) => {
  try {
    const teachers = await User.find({ role: { $in: ['teacher', 'superuser'] } })
      .select('-password -__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { admins: teachers }
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching admins',
      error: error.message
    });
  }
});

// @route   POST /api/Teacher/create-admin
// @desc    Create a new admin (Superuser only)
// @access  Superuser
router.post('/create-admin', 
  authMiddleware, 
  superuserMiddleware,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('assignedGrade').isIn(['4th', '5th', '6th', 'all']).withMessage('Invalid grade assignment')
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

      const { fullName, username, password, assignedGrade } = req.body;

      console.log('Creating teacher with data:', { fullName, username, assignedGrade });

      // Check if username exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }

      // Generate unique teacher code
      const generateTeacherCode = async () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code;
        let exists = true;
        
        while (exists) {
          code = 'T-';
          for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
          }
          
          const existingTeacher = await User.findOne({ teacherCode: code });
          exists = !!existingTeacher;
        }
        
        return code;
      };

      const teacherCode = await generateTeacherCode();

      // Create teacher user
      const teacher = new User({
        fullName,
        username,
        password,
        role: 'teacher',
        assignedGrade,
        teacherCode,
        age: 30, // Default for teacher
        grade: '4th', // Required but not used for teachers
        avatar: 1,
        language: 'english'
      });

      await teacher.save();

      console.log('Teacher created successfully:', {
        id: teacher._id,
        role: teacher.role,
        teacherCode: teacher.teacherCode,
        assignedGrade: teacher.assignedGrade
      });

      res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        data: {
          teacher: {
            id: teacher._id,
            fullName: teacher.fullName,
            username: teacher.username,
            role: teacher.role,
            assignedGrade: teacher.assignedGrade,
            teacherCode: teacher.teacherCode,
            createdAt: teacher.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Create teacher error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error creating admin',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/Teacher/admins/:id
// @desc    Update teacher (Superuser only)
// @access  Superuser
router.put('/admins/:id',
  authMiddleware,
  superuserMiddleware,
  async (req, res) => {
    try {
      const { assignedGrade, password } = req.body;
      const teacher = await User.findById(req.params.id);

      if (!admin || (teacher.role !== 'teacher' && teacher.role !== 'superuser')) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      if (assignedGrade) {
        teacher.assignedGrade = assignedGrade;
      }

      if (password) {
        teacher.password = password; // Will be hashed by pre-save hook
      }

      await teacher.save();

      res.json({
        success: true,
        message: 'Teacher updated successfully',
        data: {
          teacher: {
            id: teacher._id,
            fullName: teacher.fullName,
            username: teacher.username,
            assignedGrade: teacher.assignedGrade
          }
        }
      });
    } catch (error) {
      console.error('Update teacher error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating admin',
        error: error.message
      });
    }
  }
);

// @route   DELETE /api/Teacher/admins/:id
// @desc    Delete admin (Superuser only)
// @access  Superuser
router.delete('/admins/:id',
  authMiddleware,
  superuserMiddleware,
  async (req, res) => {
    try {
      const teacher = await User.findById(req.params.id);

      if (!teacher || (teacher.role !== 'teacher' && teacher.role !== 'superuser')) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Prevent deleting superuser
      if (teacher.role === 'superuser') {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete superuser'
        });
      }

      await User.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Teacher deleted successfully'
      });
    } catch (error) {
      console.error('Delete admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error deleting admin',
        error: error.message
      });
    }
  }
);

// @route   POST /api/Teacher/students/:studentId/reset-quiz-attempts
// @desc    Reset quiz attempts for a student
// @access  Teacher/Superuser
router.post('/students/:studentId/reset-quiz-attempts', 
  authMiddleware, 
  teacherMiddleware,
  [
    body('quizType')
      .optional()
      .isIn(['multiple-choice', 'timed-challenge', 'memory-matching', 'all'])
      .withMessage('Invalid quiz type')
  ],
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const { quizType } = req.body;

      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Reset specific quiz type or all
      if (quizType && quizType !== 'all') {
        const attemptIndex = student.quizAttempts.findIndex(a => a.quizType === quizType);
        if (attemptIndex !== -1) {
          student.quizAttempts[attemptIndex].attemptCount = 0;
          student.quizAttempts[attemptIndex].isLocked = false;
          student.quizAttempts[attemptIndex].lastAttemptDate = null;
        }
      } else {
        // Reset all quiz attempts
        student.quizAttempts.forEach(attempt => {
          attempt.attemptCount = 0;
          attempt.isLocked = false;
          attempt.lastAttemptDate = null;
        });
      }

      await student.save();

      res.json({
        success: true,
        message: `Quiz attempts reset successfully for ${student.fullName}`,
        data: {
          quizAttempts: student.quizAttempts
        }
      });
    } catch (error) {
      console.error('Reset quiz attempts error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error resetting quiz attempts',
        error: error.message
      });
    }
  }
);

// @route   GET /api/Teacher/students/:studentId/quiz-details
// @desc    Get detailed quiz history for a student
// @access  Teacher/Superuser
router.get('/students/:studentId/quiz-details', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId)
      .select('fullName username role quizResults quizAttempts badges stats');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: {
        student: {
          id: student._id,
          fullName: student.fullName,
          username: student.username
        },
        quizResults: student.quizResults.sort((a, b) => b.completedAt - a.completedAt),
        quizAttempts: student.quizAttempts || [],
        badges: student.badges || [],
        stats: student.stats
      }
    });
  } catch (error) {
    console.error('Get quiz details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz details',
      error: error.message
    });
  }
});

// @route   GET /api/Teacher/quiz-analytics
// @desc    Get quiz analytics and question difficulty analysis
// @access  Teacher/Superuser
router.get('/quiz-analytics', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const query = { role: 'student' };

    // Filter by assigned grade if teacher
    if (req.userRole === 'teacher' && req.assignedGrade && req.assignedGrade !== 'all') {
      query.grade = req.assignedGrade;
    }

    const students = await User.find(query).select('quizResults quizAttempts badges');

    // Aggregate quiz data
    const allQuizResults = students.flatMap(s => s.quizResults || []);
    
    // Quiz type breakdown
    const quizTypeStats = {
      'multiple-choice': { total: 0, avgScore: 0, avgTime: 0, totalScore: 0, totalTime: 0 },
      'timed-challenge': { total: 0, avgScore: 0, avgTime: 0, totalScore: 0, totalTime: 0 },
      'memory-matching': { total: 0, avgScore: 0, avgTime: 0, totalScore: 0, totalTime: 0 }
    };

    allQuizResults.forEach(quiz => {
      const type = quiz.quizType;
      if (quizTypeStats[type]) {
        quizTypeStats[type].total += 1;
        quizTypeStats[type].totalScore += (quiz.percentage || 0);
        quizTypeStats[type].totalTime += (quiz.timeTaken || 0);
      }
    });

    // Calculate averages
    Object.keys(quizTypeStats).forEach(type => {
      const stat = quizTypeStats[type];
      stat.avgScore = stat.total > 0 ? Math.round(stat.totalScore / stat.total) : 0;
      stat.avgTime = stat.total > 0 ? Math.round(stat.totalTime / stat.total) : 0;
      delete stat.totalScore;
      delete stat.totalTime;
    });

    // Question difficulty analysis
    const questionStats = {};
    allQuizResults.forEach(quiz => {
      if (quiz.answers && Array.isArray(quiz.answers)) {
        quiz.answers.forEach(answer => {
          const questionKey = answer.question;
          if (!questionStats[questionKey]) {
            questionStats[questionKey] = {
              question: questionKey,
              totalAttempts: 0,
              correctAttempts: 0,
              incorrectAttempts: 0,
              successRate: 0
            };
          }
          questionStats[questionKey].totalAttempts += 1;
          if (answer.isCorrect) {
            questionStats[questionKey].correctAttempts += 1;
          } else {
            questionStats[questionKey].incorrectAttempts += 1;
          }
        });
      }
    });

    // Calculate success rates and sort by difficulty (hardest first)
    const questionsArray = Object.values(questionStats)
      .map(q => {
        q.successRate = q.totalAttempts > 0 
          ? Math.round((q.correctAttempts / q.totalAttempts) * 100) 
          : 0;
        return q;
      })
      .filter(q => q.totalAttempts >= 3) // Only include questions with at least 3 attempts for statistical significance
      .sort((a, b) => a.successRate - b.successRate);

    // Attempt statistics
    const attemptStats = {
      lockedStudents: 0,
      byQuizType: {}
    };

    students.forEach(student => {
      if (student.quizAttempts && Array.isArray(student.quizAttempts)) {
        student.quizAttempts.forEach(attempt => {
          if (attempt.isLocked) {
            attemptStats.lockedStudents += 1;
          }
          if (!attemptStats.byQuizType[attempt.quizType]) {
            attemptStats.byQuizType[attempt.quizType] = {
              totalAttempts: 0,
              lockedCount: 0,
              avgAttemptsUsed: 0
            };
          }
          attemptStats.byQuizType[attempt.quizType].totalAttempts += attempt.attemptCount;
          if (attempt.isLocked) {
            attemptStats.byQuizType[attempt.quizType].lockedCount += 1;
          }
        });
      }
    });

    // Badge statistics
    const badgeStats = {};
    students.forEach(student => {
      if (student.badges && Array.isArray(student.badges)) {
        student.badges.forEach(badge => {
          if (!badgeStats[badge.badgeId]) {
            badgeStats[badge.badgeId] = {
              badgeId: badge.badgeId,
              name: badge.name,
              count: 0
            };
          }
          badgeStats[badge.badgeId].count += 1;
        });
      }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalQuizzesTaken: allQuizResults.length,
          totalStudents: students.length,
          avgQuizzesPerStudent: students.length > 0 
            ? Math.round((allQuizResults.length / students.length) * 10) / 10 
            : 0
        },
        quizTypeStats,
        questionDifficulty: {
          hardestQuestions: questionsArray.slice(0, 10),
          easiestQuestions: questionsArray.slice(-10).reverse(),
          totalQuestionsTracked: questionsArray.length
        },
        attemptStats,
        badgeStats: Object.values(badgeStats).sort((a, b) => b.count - a.count)
      }
    });
  } catch (error) {
    console.error('Quiz analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz analytics',
      error: error.message
    });
  }
});

// Helper function to calculate first day progress
function calculateFirstDayProgress(student) {
  const createdDate = new Date(student.createdAt);
  const endOfFirstDay = new Date(createdDate);
  endOfFirstDay.setHours(23, 59, 59, 999);

  // Check quizzes taken on first day
  const firstDayQuizzes = student.quizResults.filter(quiz => {
    const quizDate = new Date(quiz.completedAt);
    return quizDate >= createdDate && quizDate <= endOfFirstDay;
  });

  return {
    quizzesTaken: firstDayQuizzes.length,
    hasActivity: firstDayQuizzes.length > 0
  };
}

export default router;
