import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is invalid or expired'
    });
  }
};

// Admin middleware - requires admin or superuser role
export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'admin' && user.role !== 'superuser') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.userRole = user.role;
    req.assignedGrade = user.assignedGrade;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error checking admin privileges'
    });
  }
};

// Superuser middleware - requires superuser role only
export const superuserMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'superuser') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Superuser privileges required.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error checking superuser privileges'
    });
  }
};

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};
