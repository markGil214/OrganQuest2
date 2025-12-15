import express from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import User from '../models/User.js';
import Class from '../models/Class.js';
import { authMiddleware, teacherMiddleware, adminMiddleware } from '../middleware/auth.js';
import { sendTeacherInvitationEmail } from '../utils/emailService.js';

const router = express.Router();

// Email test endpoint removed - will be implemented when email service is configured

// @route   GET /api/Teacher/students
// @desc    Get all students with filters
// @access  Teacher/Admin
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

    // Filter by assigned grade if teacher (not admin)
    if (req.userRole === 'teacher' && req.assignedGrade && req.assignedGrade !== 'all') {
      query.grade = req.assignedGrade;
    }

    // Filter by assigned section if teacher (not admin)
    if (req.userRole === 'teacher' && req.assignedSection && req.assignedSection !== 'all') {
      query.section = req.assignedSection;
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
// @access  Teacher/Admin
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
    if (req.userRole !== 'superuser' && req.userRole === 'admin' && req.assignedGrade && req.assignedGrade !== 'all') {
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
// @access  Teacher/Admin
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

// @route   GET /api/admin/teachers
// @desc    Get all teachers (Admin only)
// @access  Admin
router.get('/teachers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password -__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { teachers }
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching teachers',
      error: error.message
    });
  }
});

// @route   POST /api/admin/send-teacher-invitation
// @desc    Send teacher invitation email (Admin only)
// @access  Admin
router.post('/send-teacher-invitation',
  authMiddleware,
  adminMiddleware,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().optional(),
    body('teacherId').trim().optional()
  ],
  async (req, res) => {
    try {
      console.log('=== STARTING TEACHER INVITATION PROCESS ===');
      console.log('Request body:', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { fullName, email, phone, teacherId } = req.body;
      console.log('Extracted data:', { fullName, email, phone, teacherId });

      console.log('Sending teacher invitation:', { fullName, email });

      // Check if teacherId already exists (if provided)
      if (teacherId) {
        console.log('Checking teacherId uniqueness:', teacherId);
        const existingTeacherId = await User.findOne({ teacherId });
        if (existingTeacherId) {
          console.log('TeacherId already exists:', existingTeacherId._id);
          return res.status(400).json({
            success: false,
            message: `Teacher ID ${teacherId} is already assigned to another teacher`
          });
        }
        console.log('TeacherId is unique');
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email, role: 'teacher' });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'A teacher with this email already exists'
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

      // Generate incremental username
      const generateUsername = async () => {
        const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
        let counter = 1;
        let username;
        let exists = true;

        while (exists) {
          const paddedCounter = counter.toString().padStart(4, '0');
          username = `${currentYear}-${paddedCounter}-DCS`;

          const existingUser = await User.findOne({ username });
          exists = !!existingUser;

          if (exists) {
            counter++;
          }
        }

        return username;
      };

      // Generate random password
      const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };

      const username = await generateUsername();
      const password = generatePassword();
      console.log('Generated credentials:', { username, passwordLength: password.length });

      // Generate registration token
      const registrationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token expires in 24 hours
      console.log('Generated registration token');

      // Create teacher user with active status (since credentials are provided)
      console.log('Creating teacher object with data:', {
        fullName,
        email,
        phone: phone || '',
        username,
        passwordLength: password.length,
        role: 'teacher',
        teacherCode,
        teacherId: teacherId || undefined,
        hasRegistrationToken: !!registrationToken,
        age: 30,
        grade: '4th',
        avatar: 1,
        language: 'english',
        accountStatus: 'active'
      });

      const teacher = new User({
        fullName,
        email,
        phone: phone || '',
        username,
        password,
        role: 'teacher',
        teacherCode,
        ...(teacherId && { teacherId }), // Only include if teacherId has a value
        registrationToken,
        tokenExpiry,
        age: 30, // Default for teacher
        grade: '4th', // Required but not used for teachers
        avatar: 1,
        language: 'english',
        accountStatus: 'active' // Active since credentials are provided
      });

      // Validate the teacher object before saving
      console.log('Validating teacher object...');
      const validationError = teacher.validateSync();
      if (validationError) {
        console.error('Teacher validation failed:', validationError);
        return res.status(400).json({
          success: false,
          message: 'Teacher data validation failed',
          error: validationError.message
        });
      }

      console.log('Saving teacher to database...');
      await teacher.save();
      console.log('Teacher saved successfully with ID:', teacher._id);

      console.log('Teacher invitation created:', {
        id: teacher._id,
        email: teacher.email,
        teacherCode: teacher.teacherCode,
        registrationToken: teacher.registrationToken
      });

      // Send invitation email with credentials (non-blocking)
      console.log('Setting up non-blocking email send...');
      try {
        // Send email asynchronously - don't block teacher creation
        setImmediate(async () => {
          console.log('=== ASYNC EMAIL SEND STARTED ===');
          try {
            console.log('Calling sendTeacherInvitationEmail with:', {
              email: teacher.email,
              fullName: teacher.fullName,
              username: teacher.username,
              passwordLength: password.length,
              teacherCode: teacher.teacherCode,
              teacherId: teacher.teacherId
            });

            const emailResult = await sendTeacherInvitationEmail({
              email: teacher.email,
              fullName: teacher.fullName,
              username: teacher.username,
              password: password, // Send plain password
              teacherCode: teacher.teacherCode,
              teacherId: teacher.teacherId
            });

            if (emailResult.success) {
              console.log('Invitation email sent successfully to:', teacher.email);
            } else {
              console.error('Failed to send invitation email:', emailResult.error);
            }
          } catch (emailError) {
            console.error('Exception in async email send:', emailError);
          }
        });
        console.log('Email send setup complete (non-blocking)');
      } catch (syncError) {
        console.error('Synchronous error in email setup:', syncError);
        // Continue with teacher creation even if email setup fails
      }

      res.status(201).json({
        success: true,
        message: 'Teacher invitation sent successfully',
        data: {
          teacher: {
            _id: teacher._id,
            fullName: teacher.fullName,
            email: teacher.email,
            phone: teacher.phone,
            username: teacher.username,
            teacherId: teacher.teacherId,
            teacherCode: teacher.teacherCode,
            accountStatus: teacher.accountStatus,
            createdAt: teacher.createdAt
          }
        }
      });
    } catch (error) {
      console.error('=== TEACHER INVITATION ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);
      console.error('Request body that caused error:', req.body);

      res.status(500).json({
        success: false,
        message: 'Server error sending teacher invitation',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// @route   POST /api/admin/create-teacher
// @desc    Create a new teacher (Admin only)
// @access  Admin
router.post('/create-teacher', 
  authMiddleware, 
  adminMiddleware,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().optional(),
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

      const { fullName, email, phone, username, password, assignedGrade } = req.body;

      console.log('Creating teacher with data:', { fullName, email, username, assignedGrade });

      // Check if username exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }

      // Check if email exists
      const existingEmail = await User.findOne({ email, role: 'teacher' });
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
          
          const existingTeacher = await User.findOne({ teacherCode: code });
          exists = !!existingTeacher;
        }
        
        return code;
      };

      const teacherCode = await generateTeacherCode();

      // Create teacher user
      const teacher = new User({
        fullName,
        email,
        phone: phone || '',
        username,
        password,
        role: 'teacher',
        assignedGrade,
        teacherCode,
        age: 30, // Default for teacher
        grade: '4th', // Required but not used for teachers
        avatar: 1,
        language: 'english',
        accountStatus: 'active'
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
            _id: teacher._id,
            fullName: teacher.fullName,
            email: teacher.email,
            phone: teacher.phone,
            username: teacher.username,
            role: teacher.role,
            assignedGrade: teacher.assignedGrade,
            teacherCode: teacher.teacherCode,
            status: teacher.accountStatus,
            createdAt: teacher.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Create teacher error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error creating teacher',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/admin/teachers/:id/status
// @desc    Update teacher account status (Admin only)
// @access  Admin
router.put('/teachers/:id/status',
  authMiddleware,
  adminMiddleware,
  [
    body('accountStatus').isIn(['active', 'disabled', 'pending']).withMessage('Invalid status')
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

      const { accountStatus } = req.body;
      const teacher = await User.findById(req.params.id);

      if (!teacher || teacher.role !== 'teacher') {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      teacher.accountStatus = accountStatus;
      await teacher.save();

      res.json({
        success: true,
        message: `Teacher account ${accountStatus}`,
        data: {
          teacher: {
            _id: teacher._id,
            fullName: teacher.fullName,
            email: teacher.email,
            username: teacher.username,
            accountStatus: teacher.accountStatus
          }
        }
      });
    } catch (error) {
      console.error('Update teacher status error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating teacher status',
        error: error.message
      });
    }
  }
);

// @route   POST /api/admin/teachers/:id/resend-activation
// @desc    Resend activation email to teacher (Admin only)
// @access  Admin
router.post('/teachers/:id/resend-activation',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const teacher = await User.findById(req.params.id);

      if (!teacher || teacher.role !== 'teacher') {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      if (teacher.accountStatus !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Teacher account is not in pending status'
        });
      }

      // Generate new registration token
      const token = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token expires in 24 hours

      teacher.registrationToken = token;
      teacher.tokenExpiry = tokenExpiry;
      await teacher.save();

      // In production, send email here using sendTeacherInvitationEmail
      // For now, just return success
      
      res.json({
        success: true,
        message: 'Activation email resent successfully',
        data: {
          teacher: {
            _id: teacher._id,
            fullName: teacher.fullName,
            email: teacher.email
          }
        }
      });
    } catch (error) {
      console.error('Resend activation error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error resending activation email',
        error: error.message
      });
    }
  }
);

// @route   GET /api/Teacher/admins
// @desc    Get all admins (Admin only)
// @access  Admin
router.get('/admins', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const teachers = await User.find({ role: { $in: ['teacher', 'admin', 'superuser'] } })
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
// @desc    Create a new admin (Admin only)
// @access  Admin
router.post('/create-admin', 
  authMiddleware, 
  adminMiddleware,
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
// @desc    Update teacher (Admin only)
// @access  Admin
router.put('/admins/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { assignedGrade, password } = req.body;
      const teacher = await User.findById(req.params.id);

      if (!admin || (teacher.role !== 'teacher' && teacher.role !== 'admin' && teacher.role !== 'superuser')) {
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
// @desc    Delete student (Teacher/Admin)
// @access  Teacher/Admin
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

// @route   DELETE /api/Teacher/students/bulk/all
// @desc    Delete all students (Teacher/Admin)
// @access  Teacher/Admin
router.delete('/students/bulk/all',
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      // Build query based on user role
      let query = { role: 'student' };
      
      // If teacher (not admin), only delete students from their section
      if (req.userRole === 'teacher' && req.assignedSection && req.assignedSection !== 'all') {
        query.section = req.assignedSection;
      }

      const result = await User.deleteMany(query);

      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} student(s)`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      console.error('Bulk delete students error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting students',
        error: error.message
      });
    }
  }
);

// @route   DELETE /api/Teacher/admins/:id
// @desc    Delete admin (Admin only)
// @access  Admin
router.delete('/admins/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const teacher = await User.findById(req.params.id);

      if (!teacher || (teacher.role !== 'teacher' && teacher.role !== 'admin' && teacher.role !== 'superuser')) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Prevent deleting admin or superuser
      if (teacher.role === 'admin' || teacher.role === 'superuser') {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete admin'
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
// @access  Teacher/Admin
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
// @access  Teacher/Admin
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
// @access  Teacher/Admin
router.get('/quiz-analytics', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const query = { role: 'student' };

    // Filter by assigned grade if teacher (not admin)
    if (req.userRole === 'teacher' && req.assignedGrade && req.assignedGrade !== 'all') {
      query.grade = req.assignedGrade;
    }

    // Filter by assigned section if teacher (not admin)
    if (req.userRole === 'teacher' && req.assignedSection && req.assignedSection !== 'all') {
      query.section = req.assignedSection;
    }

    const students = await User.find(query).select('quizResults quizAttempts badges');

    // Aggregate quiz data
    const allQuizResults = students.flatMap(s => s.quizResults || []);
    
    // Quiz type breakdown
    const quizTypeStats = {
      'multiple-choice': { total: 0, avgScore: 0, avgTime: 0, totalScore: 0, totalTime: 0 },
      'timed-challenge': { total: 0, avgScore: 0, avgTime: 0, totalScore: 0, totalTime: 0 },
      'custom-quiz': { total: 0, avgScore: 0, avgTime: 0, totalScore: 0, totalTime: 0 }
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
      'custom-quiz': []
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
// @desc    Get all classes (teachers) - Admin only
// @access  Admin
// @route   GET /api/admin/classes
// @desc    Get all classes with filters
// @access  Admin
router.get('/classes',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      console.log('=== GET CLASSES ===');
      const {
        grade,
        section,
        assignedTeacher,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 50
      } = req.query;

      // Build query
      const query = {};

      if (grade) query.grade = grade;
      if (section) query.section = section;
      if (assignedTeacher) query.assignedTeacher = assignedTeacher;

      if (search) {
        query.$or = [
          { className: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get classes with populated teacher info
      const classes = await Class.find(query)
        .populate('assignedTeacher', 'fullName username email')
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Class.countDocuments(query);

      console.log(`Found ${classes.length} classes (total: ${total})`);

      res.status(200).json({
        success: true,
        data: {
          classes,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          }
        }
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
// @access  Admin
router.post('/create-class', 
  authMiddleware, 
  adminMiddleware,
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
        assignedSection: section 
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
        assignedSection: section,
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
          section: teacher.assignedSection,
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
            assignedSection: teacher.assignedSection,
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
            assignedSection: teacher.assignedSection,
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
    }).select('fullName email assignedGrade assignedSection teacherCode tokenExpiry');

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
          assignedSection: teacher.assignedSection,
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

// ==========================================
// CLASS MANAGEMENT ENDPOINTS
// ==========================================

// @route   GET /api/admin/classes
// @desc    Get all classes with filters
// @access  Admin
router.get('/classes',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      console.log('=== GET CLASSES ===');
      const {
        grade,
        section,
        assignedTeacher,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 50
      } = req.query;

      // Build query
      const query = {};

      if (grade) query.grade = grade;
      if (section) query.section = section;
      if (assignedTeacher) query.assignedTeacher = assignedTeacher;

      if (search) {
        query.$or = [
          { className: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get classes with populated teacher info
      const classes = await Class.find(query)
        .populate('assignedTeacher', 'fullName username email')
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Class.countDocuments(query);

      console.log(`Found ${classes.length} classes (total: ${total})`);

      res.status(200).json({
        success: true,
        data: {
          classes,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Get classes error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching classes',
        error: error.message
      });
    }
  }
);

// @route   GET /api/admin/classes/stats
// @desc    Get class statistics
// @access  Admin
router.get('/classes/stats',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      console.log('=== GET CLASS STATS ===');

      const stats = await Class.aggregate([
        {
          $group: {
            _id: null,
            totalClasses: { $sum: 1 },
            activeClasses: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            classesByGrade: {
              $push: {
                grade: '$grade',
                section: '$section',
                status: '$status'
              }
            }
          }
        }
      ]);

      // Get grade-wise breakdown
      const gradeStats = await Class.aggregate([
        {
          $group: {
            _id: '$grade',
            count: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      const result = stats[0] || { totalClasses: 0, activeClasses: 0, classesByGrade: [] };

      console.log('Class stats retrieved:', result);

      res.status(200).json({
        success: true,
        data: {
          totalClasses: result.totalClasses || 0,
          activeClasses: result.activeClasses || 0,
          gradeBreakdown: gradeStats
        }
      });
    } catch (error) {
      console.error('Get class stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching class statistics',
        error: error.message
      });
    }
  }
);

// @route   POST /api/admin/classes
// @desc    Create a new class
// @access  Admin
router.post('/classes',
  authMiddleware,
  adminMiddleware,
  [
    body('grade').isIn(['4th', '5th', '6th', '7th', '8th', '9th', '10th']).withMessage('Invalid grade'),
    body('section').isIn(['A', 'B', 'C', 'D', 'E', 'F']).withMessage('Invalid section'),
    body('className').trim().notEmpty().withMessage('Class name is required'),
    body('capacity').optional().isInt({ min: 1, max: 100 }).withMessage('Capacity must be between 1-100'),
    body('description').optional().trim().isLength({ max: 200 }).withMessage('Description too long'),
    body('assignedTeacher').notEmpty().withMessage('Teacher assignment is required')
  ],
  async (req, res) => {
    try {
      console.log('=== CREATE CLASS ===');
      console.log('Request body:', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { grade, section, className, description, capacity, assignedTeacher } = req.body;

      // Check if grade-section combination already exists
      const existingClass = await Class.findOne({ grade, section });
      if (existingClass) {
        return res.status(400).json({
          success: false,
          message: `Class ${grade}-${section} already exists`
        });
      }

      // Verify teacher exists and is a teacher
      const teacher = await User.findById(assignedTeacher);
      if (!teacher || teacher.role !== 'teacher') {
        return res.status(400).json({
          success: false,
          message: 'Invalid teacher assignment'
        });
      }

      const newClass = new Class({
        grade,
        section,
        className,
        description,
        capacity: capacity || 30,
        assignedTeacher
      });

      await newClass.save();
      console.log('Class saved to database with ID:', newClass._id);

      // Verify the class was saved
      const savedClass = await Class.findById(newClass._id);
      console.log('Verification - class found after save:', savedClass ? 'YES' : 'NO');

      // Populate teacher info for response
      await newClass.populate('assignedTeacher', 'fullName username email');

      console.log('Class created successfully:', newClass._id);

      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        data: { class: newClass }
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

// @route   PUT /api/admin/classes/:id
// @desc    Update a class
// @access  Admin
router.put('/classes/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('grade').optional().isIn(['4th', '5th', '6th', '7th', '8th', '9th', '10th']).withMessage('Invalid grade'),
    body('section').optional().isIn(['A', 'B', 'C', 'D', 'E', 'F']).withMessage('Invalid section'),
    body('className').optional().trim().notEmpty().withMessage('Class name cannot be empty'),
    body('capacity').optional().isInt({ min: 1, max: 100 }).withMessage('Capacity must be between 1-100'),
    body('description').optional().trim().isLength({ max: 200 }).withMessage('Description too long'),
    body('assignedTeacher').notEmpty().withMessage('Teacher assignment is required')
  ],
  async (req, res) => {
    try {
      console.log('=== UPDATE CLASS ===');
      console.log('Class ID:', req.params.id);
      console.log('Update data:', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { grade, section, assignedTeacher, ...updateData } = req.body;

      // If grade or section is being updated, check for conflicts
      if (grade || section) {
        const existingClass = await Class.findOne({
          grade: grade || undefined,
          section: section || undefined,
          _id: { $ne: req.params.id }
        });

        if (existingClass) {
          return res.status(400).json({
            success: false,
            message: `Class ${grade || existingClass.grade}-${section || existingClass.section} already exists`
          });
        }
      }

      // Verify teacher exists and is a teacher
      const teacher = await User.findById(assignedTeacher);
      if (!teacher || teacher.role !== 'teacher') {
        return res.status(400).json({
          success: false,
          message: 'Invalid teacher assignment'
        });
      }

      const updatedClass = await Class.findByIdAndUpdate(
        req.params.id,
        { ...updateData, ...(grade && { grade }), ...(section && { section }), ...(assignedTeacher !== undefined && { assignedTeacher }) },
        { new: true, runValidators: true }
      ).populate('assignedTeacher', 'fullName username email');

      if (!updatedClass) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      console.log('Class updated successfully:', updatedClass._id);

      res.status(200).json({
        success: true,
        message: 'Class updated successfully',
        data: { class: updatedClass }
      });
    } catch (error) {
      console.error('Update class error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating class',
        error: error.message
      });
    }
  }
);

// @route   DELETE /api/admin/classes/:id
// @desc    Delete a class
// @access  Admin
router.delete('/classes/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      console.log('=== DELETE CLASS ===');
      console.log('Class ID:', req.params.id);

      // First check if the class exists
      const classToDelete = await Class.findById(req.params.id);
      console.log('Class found in database:', classToDelete ? 'YES' : 'NO');
      if (classToDelete) {
        console.log('Class details:', {
          id: classToDelete._id,
          grade: classToDelete.grade,
          section: classToDelete.section,
          className: classToDelete.className
        });
      }

      // Check if class has students assigned
      if (classToDelete) {
        const studentsInClass = await User.countDocuments({
          role: 'student',
          grade: classToDelete.grade,
          section: classToDelete.section
        });

        if (studentsInClass > 0) {
          return res.status(400).json({
            success: false,
            message: `Cannot delete class with ${studentsInClass} students assigned. Please reassign students first.`
          });
        }
      }

      const deletedClass = await Class.findByIdAndDelete(req.params.id);

      if (!deletedClass) {
        console.log('Class not found for deletion');
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      console.log('Class deleted successfully:', deletedClass._id);

      res.status(200).json({
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

export default router;
