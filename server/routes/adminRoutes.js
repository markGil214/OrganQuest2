import express from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import User from '../models/User.js';
import { authMiddleware, teacherMiddleware, superuserMiddleware } from '../middleware/auth.js';
import { sendTeacherInvitationEmail } from '../utils/emailService.js';

const router = express.Router();

// Email test endpoint removed - will be implemented when email service is configured

// @route   GET /api/Teacher/students
// @desc    Get all students with filters
// @access  Teacher/Superuser
router.get('/students', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { 
      search, // Search by name or username
      performanceLevel,
      activityLevel,
      grade, // Grade filter
      section, // Section filter
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
    }

    // Apply explicit grade filter if provided
    if (grade) {
      query.grade = grade;
    }

    // Apply section filter if provided
    if (section) {
      query.section = section;
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
    let students = await User.find(query)
      .select('-password -__v')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Apply performance and activity filters after fetching
    if (performanceLevel || activityLevel) {
      students = students.filter(student => {
        // Performance level filter
        if (performanceLevel) {
          if (student.quizResults.length === 0) return false;
          
          const avgScore = student.quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / student.quizResults.length;
          
          if (performanceLevel === 'excellent' && avgScore <= 80) return false;
          if (performanceLevel === 'good' && (avgScore < 60 || avgScore > 80)) return false;
          if (performanceLevel === 'average' && (avgScore < 40 || avgScore > 60)) return false;
          if (performanceLevel === 'needs-improvement' && avgScore >= 40) return false;
        }

        // Activity level filter
        if (activityLevel) {
          const lastActive = student.stats?.lastActive ? new Date(student.stats.lastActive) : null;
          const daysInactive = lastActive ? Math.floor((Date.now() - lastActive) / (1000 * 60 * 60 * 24)) : 999;
          
          if (activityLevel === 'active' && daysInactive > 7) return false;
          if (activityLevel === 'inactive' && daysInactive <= 7) return false;
          if (activityLevel === 'at-risk') {
            const avgScore = student.quizResults.length > 0
              ? student.quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / student.quizResults.length
              : 0;
            if (avgScore >= 40 && daysInactive <= 14) return false;
          }
        }

        return true;
      });
    }

    // Get total count (note: filters are applied in memory, so this is approximate)
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
// @desc    Get learning progress analytics for assigned students
// @access  Teacher/Superuser
router.get('/analytics', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const query = { role: 'student' };

    // Filter by assigned grade if teacher
    if (req.userRole === 'teacher' && req.assignedGrade && req.assignedGrade !== 'all') {
      query.grade = req.assignedGrade;
    }

    const students = await User.find(query).select('-password -__v');

    // Calculate learning progress analytics
    const totalStudents = students.length;
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    
    // Active learners (activity in last 7 days)
    const activeLearners = students.filter(s => {
      if (!s.stats?.lastActive) return false;
      return new Date(s.stats.lastActive) >= weekAgo;
    }).length;

    // Quiz completion rate
    const studentsWithQuizzes = students.filter(s => s.stats.totalQuizzesTaken > 0);
    const expectedQuizzes = 10; // Target number of quizzes
    const totalCompletedQuizzes = students.reduce((sum, s) => sum + Math.min(s.stats.totalQuizzesTaken, expectedQuizzes), 0);
    const quizCompletionRate = totalStudents > 0
      ? Math.round((totalCompletedQuizzes / (totalStudents * expectedQuizzes)) * 100)
      : 0;

    // Average improvement calculation
    let totalImprovement = 0;
    let studentsWithImprovement = 0;
    
    students.forEach(student => {
      if (student.quizResults.length >= 2) {
        const firstScore = (student.quizResults[0].score / student.quizResults[0].totalQuestions) * 100;
        const lastScore = (student.quizResults[student.quizResults.length - 1].score / student.quizResults[student.quizResults.length - 1].totalQuestions) * 100;
        totalImprovement += (lastScore - firstScore);
        studentsWithImprovement++;
      }
    });

    const averageImprovement = studentsWithImprovement > 0
      ? Math.round(totalImprovement / studentsWithImprovement)
      : 0;

    // At-risk students (low scores or inactive)
    const atRiskStudents = students.filter(student => {
      if (student.quizResults.length === 0) return false;
      
      const avgScore = student.quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / student.quizResults.length;
      const isLowScore = avgScore < 40;
      
      const lastActive = student.stats?.lastActive ? new Date(student.stats.lastActive) : null;
      const daysInactive = lastActive ? Math.floor((now - lastActive) / (1000 * 60 * 60 * 24)) : 999;
      const isInactive = daysInactive > 14;
      
      return isLowScore || isInactive;
    }).length;

    // Topic mastery levels
    let masteredTopics = 0;
    let learningTopics = 0;
    let strugglingTopics = 0;

    students.forEach(student => {
      if (student.quizResults.length === 0) return;
      
      const avgScore = student.quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / student.quizResults.length;
      
      if (avgScore > 80) {
        masteredTopics++;
      } else if (avgScore >= 50) {
        learningTopics++;
      } else {
        strugglingTopics++;
      }
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        activeLearners,
        quizCompletionRate,
        averageImprovement,
        atRiskStudents,
        masteredTopics,
        learningTopics,
        strugglingTopics,
        activeStudents: studentsWithQuizzes.length,
        inactiveStudents: totalStudents - studentsWithQuizzes.length
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

// @route   DELETE /api/Teacher/students/:studentId
// @desc    Delete student (Teacher/Superuser)
// @access  Teacher/Superuser
router.delete('/students/:studentId',
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      const student = await User.findById(req.params.studentId);

      if (!student || student.role !== 'student') {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      await User.findByIdAndDelete(req.params.studentId);

      res.json({
        success: true,
        message: 'Student deleted successfully'
      });
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting student',
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
          student.quizAttempts[attemptIndex].lastAttemptDate = null;
        }
      } else {
        // Reset all quiz attempts
        student.quizAttempts.forEach(attempt => {
          attempt.attemptCount = 0;
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

    // Performance trends over time (for graphs)
    const performanceTrends = {
      'multiple-choice': [],
      'timed-challenge': [],
      'memory-matching': []
    };

    // Group quiz results by type and date
    allQuizResults.forEach(quiz => {
      const type = quiz.quizType;
      if (performanceTrends[type]) {
        performanceTrends[type].push({
          date: quiz.completedAt,
          score: quiz.percentage || 0,
          timeTaken: quiz.timeTaken || 0
        });
      }
    });

    // Sort by date and calculate rolling averages
    Object.keys(performanceTrends).forEach(type => {
      performanceTrends[type].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Group by day and calculate daily averages
      const dailyAverages = {};
      performanceTrends[type].forEach(result => {
        const dateKey = new Date(result.date).toISOString().split('T')[0];
        if (!dailyAverages[dateKey]) {
          dailyAverages[dateKey] = { scores: [], times: [] };
        }
        dailyAverages[dateKey].scores.push(result.score);
        dailyAverages[dateKey].times.push(result.timeTaken);
      });

      // Convert to array format for graphing
      performanceTrends[type] = Object.entries(dailyAverages)
        .map(([date, data]) => ({
          date,
          avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
          avgTime: Math.round(data.times.reduce((a, b) => a + b, 0) / data.times.length),
          attempts: data.scores.length
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-30); // Last 30 days
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
      byQuizType: {}
    };

    students.forEach(student => {
      if (student.quizAttempts && Array.isArray(student.quizAttempts)) {
        student.quizAttempts.forEach(attempt => {
          if (!attemptStats.byQuizType[attempt.quizType]) {
            attemptStats.byQuizType[attempt.quizType] = {
              totalAttempts: 0,
              avgAttemptsUsed: 0
            };
          }
          attemptStats.byQuizType[attempt.quizType].totalAttempts += attempt.attemptCount;
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
        performanceTrends,
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

// @route   GET /api/Teacher/classes
// @desc    Get all classes (teachers) - Superuser only
// @access  Superuser
router.get('/classes', authMiddleware, superuserMiddleware, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password -__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { classes: teachers }
    });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching classes',
      error: error.message
    });
  }
});

// @route   POST /api/Teacher/create-class
// @desc    Create a new class with teacher assignment (sends invitation email)
// @access  Superuser
router.post('/create-class', 
  authMiddleware, 
  superuserMiddleware,
  [
    body('fullName').trim().notEmpty().withMessage('Teacher full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('assignedGrade').isIn(['4th', '5th', '6th']).withMessage('Invalid grade assignment'),
    body('section').isIn(['A', 'B', 'C']).withMessage('Invalid section')
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

      const { fullName, email, assignedGrade, section } = req.body;

      // Check if grade-section combination already exists
      const existingClass = await User.findOne({ 
        role: 'teacher',
        assignedGrade,
        section 
      });
      
      if (existingClass) {
        return res.status(400).json({
          success: false,
          message: `${assignedGrade} Grade Section ${section} already has a teacher assigned (${existingClass.fullName})`
        });
      }

      // Check if email exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
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
          const existing = await User.findOne({ teacherCode: code });
          exists = !!existing;
        }
        return code;
      };

      const teacherCode = await generateTeacherCode();

      // Generate unique registration token
      const generateRegistrationToken = () => {
        return crypto.randomBytes(32).toString('hex');
      };

      const registrationToken = generateRegistrationToken();
      const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Create pending teacher
      const teacher = new User({
        fullName,
        email,
        role: 'teacher',
        assignedGrade,
        section,
        teacherCode,
        grade: assignedGrade,
        accountStatus: 'pending',
        registrationToken,
        tokenExpiry
      });

      await teacher.save();

      // Generate registration URL
      const registrationUrl = `${process.env.CLIENT_URL || 'https://organ-quest2.vercel.app'}/#teacher-register/${registrationToken}`;
      
      console.log('📧 Attempting to send invitation email to:', teacher.email);
      console.log('📧 MailerSend configured:', !!process.env.MAILERSEND_API_KEY);

      // Send invitation email
      let emailResult;
      try {
        emailResult = await sendTeacherInvitationEmail({
          email: teacher.email,
          fullName: teacher.fullName,
          teacherCode: teacher.teacherCode,
          assignedGrade: teacher.assignedGrade,
          section: teacher.section,
          registrationToken: registrationToken
        });

        if (emailResult.success) {
          console.log('✅ Email sent successfully to:', teacher.email);
        } else {
          console.error('❌ Failed to send invitation email:', emailResult.error);
          console.log('📋 Registration URL (share manually):', registrationUrl);
        }
      } catch (err) {
        console.error('❌ Email error:', err);
        console.log('📋 Registration URL (share manually):', registrationUrl);
        emailResult = { success: false, error: err.message };
      }

      // Respond with result
      res.status(201).json({
        success: true,
        message: emailResult.success 
          ? 'Class created successfully. Invitation email sent to teacher.'
          : 'Class created successfully. Email failed - please share the registration URL manually.',
        emailSent: emailResult.success,
        registrationUrl: registrationUrl,
        data: {
          teacher: {
            _id: teacher._id,
            fullName: teacher.fullName,
            email: teacher.email,
            assignedGrade: teacher.assignedGrade,
            section: teacher.section,
            teacherCode: teacher.teacherCode,
            accountStatus: teacher.accountStatus
          }
        }
      });
    } catch (error) {
      console.error('Create class error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error creating class',
        error: error.message
      });
    }
  }
);

// @route   DELETE /api/Teacher/classes/:id
// @desc    Delete class (teacher) - Superuser only
// @access  Superuser
router.delete('/classes/:id',
  authMiddleware,
  superuserMiddleware,
  async (req, res) => {
    try {
      const teacher = await User.findById(req.params.id);

      if (!teacher || teacher.role !== 'teacher') {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      await User.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Class deleted successfully'
      });
    } catch (error) {
      console.error('Delete class error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error deleting class',
        error: error.message
      });
    }
  }
);

// @route   POST /api/admin/complete-registration
// @desc    Complete teacher registration with username and password
// @access  Public (with valid token)
router.post('/complete-registration',
  [
    body('registrationToken').notEmpty().withMessage('Registration token is required'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

      const { registrationToken, username, password } = req.body;

      // Find teacher by registration token
      const teacher = await User.findOne({ 
        registrationToken,
        role: 'teacher',
        accountStatus: 'pending'
      });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Invalid or expired registration token'
        });
      }

      // Check if token is expired
      if (teacher.tokenExpiry && new Date() > teacher.tokenExpiry) {
        return res.status(400).json({
          success: false,
          message: 'Registration token has expired. Please contact administrator.'
        });
      }

      // Check if username is already taken
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }

      // Update teacher with username and password
      teacher.username = username;
      teacher.password = password;
      teacher.accountStatus = 'active';
      teacher.registrationToken = undefined;
      teacher.tokenExpiry = undefined;

      await teacher.save();

      res.json({
        success: true,
        message: 'Registration completed successfully!',
        data: {
          teacher: {
            _id: teacher._id,
            fullName: teacher.fullName,
            email: teacher.email,
            username: teacher.username,
            assignedGrade: teacher.assignedGrade,
            section: teacher.section,
            teacherCode: teacher.teacherCode,
            accountStatus: teacher.accountStatus
          }
        }
      });
    } catch (error) {
      console.error('Complete registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error completing registration',
        error: error.message
      });
    }
  }
);

// @route   GET /api/admin/verify-token/:token
// @desc    Verify registration token and get teacher info
// @access  Public
router.get('/verify-token/:token', async (req, res) => {
  try {
    const teacher = await User.findOne({
      registrationToken: req.params.token,
      role: 'teacher',
      accountStatus: 'pending'
    }).select('fullName email assignedGrade section teacherCode tokenExpiry');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Invalid registration token'
      });
    }

    // Check if token is expired
    if (teacher.tokenExpiry && new Date() > teacher.tokenExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Registration token has expired'
      });
    }

    res.json({
      success: true,
      data: {
        teacher: {
          fullName: teacher.fullName,
          email: teacher.email,
          assignedGrade: teacher.assignedGrade,
          section: teacher.section,
          teacherCode: teacher.teacherCode
        }
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying token',
      error: error.message
    });
  }
});

export default router;
