const jwt = require('jsonwebtoken');
const { getConfig } = require('../config/env.config');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const { ROLES } = require('../config/constants');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (req.path.includes('/vendor/products') && req.method === 'POST') {
      console.log('--- Auth Debug ---');
      console.log('Method:', req.method);
      console.log('Path:', req.path);
      console.log('Auth Header:', req.headers.authorization);
      console.log('Token Resolved:', token ? 'Yes (length: ' + token.length + ')' : 'No');
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.'
      });
    }

    // Check if token is blacklisted
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token invalidated. Please login again.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, getConfig('JWT_SECRET'));

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.'
      });
    }

    // Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Check if user is vendor
const isVendor = (req, res, next) => {
  if (req.user.role !== ROLES.VENDOR) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Vendor privileges required.'
    });
  }
  
  // Check if vendor is approved
  if (req.user.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your vendor account is not yet approved.'
    });
  }
  
  next();
};

// Check if user is buyer
const isBuyer = (req, res, next) => {
  if (req.user.role !== ROLES.BUYER) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Buyer privileges required.'
    });
  }
  next();
};

// Check if user is vendor or admin
const isVendorOrAdmin = (req, res, next) => {
  if (req.user.role !== ROLES.VENDOR && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Vendor or Admin privileges required.'
    });
  }
  next();
};

// Optional auth - doesn't require token but attaches user if present
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, getConfig('JWT_SECRET'));
      req.user = await User.findById(decoded.id);
    }

    next();
  } catch (error) {
    // Token invalid but that's okay for optional auth
    next();
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    getConfig('JWT_SECRET'),
    { expiresIn: getConfig('JWT_EXPIRES_IN') }
  );
};

module.exports = {
  protect,
  isAdmin,
  isVendor,
  isBuyer,
  isVendorOrAdmin,
  optionalAuth,
  generateToken
};
