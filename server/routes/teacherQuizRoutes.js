import express from 'express';
import { authMiddleware, teacherMiddleware } from '../middleware/auth.js';
import QuizAssignment from '../models/QuizAssignment.js';
import User from '../models/User.js';

const router = express.Router();

// CREATE: Assign a new quiz with code
router.post('/assign-quiz', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { quizType, title, description, assignedGrade, assignedSection, dueDate, maxAttempts, timeLimit, customQuestions } = req.body;
    
    const teacher = await User.findById(req.userId);
    
    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Quiz title is required'
      });
    }

    // Ensure assignedGrade is valid
    const validGrade = assignedGrade && assignedGrade.trim() ? assignedGrade : (teacher.assignedGrade || 'all');
    
    // Ensure assignedSection is valid - keep 'all' lowercase, convert A/B/C to uppercase
    let validSection = assignedSection && assignedSection.trim() ? assignedSection : 'all';
    if (validSection.toLowerCase() !== 'all') {
      validSection = validSection.toUpperCase();
    } else {
      validSection = 'all';
    }
    
    // Generate unique quiz code
    const quizCode = await QuizAssignment.generateQuizCode();
    
    const quizAssignment = new QuizAssignment({
      teacherId: req.userId,
      teacherName: teacher.fullName,
      quizCode,
      quizType,
      title,
      description,
      assignedGrade: validGrade,
      assignedSection: validSection,
      dueDate: dueDate ? new Date(dueDate) : null,
      maxAttempts: maxAttempts || 3,
      timeLimit: timeLimit || null,
      customQuestions: customQuestions || []
    });
    
    await quizAssignment.save();
    
    res.status(201).json({
      success: true,
      message: 'Quiz assigned successfully',
      data: quizAssignment
    });
  } catch (error) {
    console.error('Error assigning quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning quiz',
      error: error.message
    });
  }
});

// READ: Get all quiz assignments by this teacher
router.get('/my-assignments', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const assignments = await QuizAssignment.find({ teacherId: req.userId })
      .sort({ createdAt: -1 });
    
    // Add submission stats
    const assignmentsWithStats = assignments.map(assignment => {
      const totalSubmissions = assignment.studentSubmissions.length;
      const uniqueStudents = new Set(assignment.studentSubmissions.map(s => s.studentId.toString())).size;
      const avgScore = totalSubmissions > 0
        ? assignment.studentSubmissions.reduce((sum, s) => sum + s.percentage, 0) / totalSubmissions
        : 0;
      
      return {
        _id: assignment._id,
        quizCode: assignment.quizCode,
        quizType: assignment.quizType,
        title: assignment.title,
        description: assignment.description,
        assignedGrade: assignment.assignedGrade,
        assignedSection: assignment.assignedSection,
        dueDate: assignment.dueDate,
        maxAttempts: assignment.maxAttempts,
        timeLimit: assignment.timeLimit,
        isActive: assignment.isActive,
        customQuestions: assignment.customQuestions,
        createdAt: assignment.createdAt,
        submissions: totalSubmissions,
        uniqueStudents,
        averageScore: avgScore
      };
    });
    
    res.json({
      success: true,
      assignments: assignmentsWithStats
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments',
      error: error.message
    });
  }
});

// READ: Get quiz assignment by code (for students)
router.get('/by-code/:code', authMiddleware, async (req, res) => {
  try {
    const { code } = req.params;
    
    const assignment = await QuizAssignment.findOne({ 
      quizCode: code.toUpperCase(),
      isActive: true 
    }).populate('teacherId', 'fullName').populate('customQuestions');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Quiz code not found or quiz is inactive'
      });
    }
    
    // Check if student matches assigned grade
    const student = await User.findById(req.userId);
    if (assignment.assignedGrade !== 'all' && assignment.assignedGrade !== student.grade) {
      return res.status(403).json({
        success: false,
        message: `This quiz is only for ${assignment.assignedGrade} grade students`
      });
    }
    
    // Check if student matches assigned section
    if (assignment.assignedSection !== 'all' && assignment.assignedSection !== student.section) {
      return res.status(403).json({
        success: false,
        message: `This quiz is only for Section ${assignment.assignedSection} students`
      });
    }
    
    // Count student attempts for tracking only
    const studentAttempts = assignment.studentSubmissions.filter(
      s => s.studentId.toString() === req.userId.toString()
    ).length;
    
    // Return quiz details without submissions
    res.json({
      success: true,
      data: {
        _id: assignment._id,
        quizCode: assignment.quizCode,
        quizType: assignment.quizType,
        title: assignment.title,
        description: assignment.description,
        teacherName: assignment.teacherName,
        dueDate: assignment.dueDate,
        maxAttempts: assignment.maxAttempts,
        timeLimit: assignment.timeLimit,
        attemptsMade: studentAttempts,
        attemptsRemaining: assignment.maxAttempts - studentAttempts,
        customQuestions: assignment.customQuestions
      }
    });
  } catch (error) {
    console.error('Error fetching quiz by code:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error.message
    });
  }
});

// READ: Get single assignment by ID (for students taking quiz)
router.get('/:assignmentId', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await QuizAssignment.findById(assignmentId)
      .populate('teacherId', 'fullName')
      .populate('customQuestions');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Quiz assignment not found'
      });
    }
    
    // Check if student matches assigned grade
    const student = await User.findById(req.userId);
    if (assignment.assignedGrade !== 'all' && assignment.assignedGrade !== student.grade) {
      return res.status(403).json({
        success: false,
        message: `This quiz is only for ${assignment.assignedGrade} grade students`
      });
    }
    
    // Check if student matches assigned section
    if (assignment.assignedSection !== 'all' && assignment.assignedSection !== student.section) {
      return res.status(403).json({
        success: false,
        message: `This quiz is only for Section ${assignment.assignedSection} students`
      });
    }
    
    // Count student attempts for tracking only
    const studentAttempts = assignment.studentSubmissions.filter(
      s => s.studentId.toString() === req.userId.toString()
    ).length;
    
    res.json({
      success: true,
      data: {
        _id: assignment._id,
        quizCode: assignment.quizCode,
        quizType: assignment.quizType,
        title: assignment.title,
        description: assignment.description,
        teacherName: assignment.teacherName,
        dueDate: assignment.dueDate,
        maxAttempts: assignment.maxAttempts,
        timeLimit: assignment.timeLimit,
        attemptsMade: studentAttempts,
        attemptsRemaining: assignment.maxAttempts - studentAttempts,
        customQuestions: assignment.customQuestions
      }
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment',
      error: error.message
    });
  }
});

// CREATE: Submit quiz result (student)
router.post('/submit/:assignmentId', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { score, percentage, timeTaken, answers, totalQuestions } = req.body;
    
    const assignment = await QuizAssignment.findById(assignmentId).populate('teacherId', 'fullName');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Quiz assignment not found'
      });
    }
    
    const student = await User.findById(req.userId);
    
    // Count student's previous attempts for tracking
    const previousAttempts = assignment.studentSubmissions.filter(
      s => s.studentId.toString() === req.userId.toString()
    );
    
    // Add submission
    assignment.studentSubmissions.push({
      studentId: req.userId,
      studentName: student.fullName,
      score,
      percentage,
      attemptNumber: previousAttempts.length + 1,
      timeTaken,
      answers,
      submittedAt: new Date()
    });
    
    await assignment.save();
    
    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score,
        totalQuestions,
        percentage,
        attemptNumber: previousAttempts.length + 1,
        remainingAttempts: assignment.maxAttempts - (previousAttempts.length + 1),
        isTeacherMode: true,
        teacherName: assignment.teacherId.fullName
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz',
      error: error.message
    });
  }
});

// READ: Get submissions for a specific assignment
router.get('/submissions/:assignmentId', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await QuizAssignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Verify teacher owns this assignment
    if (assignment.teacherId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: {
        quiz: {
          title: assignment.title,
          quizCode: assignment.quizCode,
          quizType: assignment.quizType,
          assignedGrade: assignment.assignedGrade
        },
        submissions: assignment.studentSubmissions
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
});

// UPDATE: Toggle assignment active status
router.patch('/toggle-active/:assignmentId', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await QuizAssignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Verify teacher owns this assignment
    if (assignment.teacherId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    assignment.isActive = !assignment.isActive;
    await assignment.save();
    
    res.json({
      success: true,
      message: `Quiz ${assignment.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: assignment.isActive }
    });
  } catch (error) {
    console.error('Error toggling assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating assignment',
      error: error.message
    });
  }
});

// DELETE: Remove assignment
router.delete('/delete/:assignmentId', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await QuizAssignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Verify teacher owns this assignment
    if (assignment.teacherId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await QuizAssignment.findByIdAndDelete(assignmentId);
    
    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting assignment',
      error: error.message
    });
  }
});

export default router;
