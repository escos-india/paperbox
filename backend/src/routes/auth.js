const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate, validators } = require('../middleware/validation');
const { protect, generateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const otpService = require('../services/otpService');
const paymentService = require('../services/paymentService');

const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const { ROLES, USER_STATUS, OTP_TYPES } = require('../config/constants');
const { getConfig } = require('../config/env.config');

// @route   POST /api/auth/logout
// @desc    Logout user (blacklist token)
// @access  Private
router.post('/logout', protect, asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  // Add token to blacklist
  await BlacklistedToken.create({ token });
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', [
  validators.phone,
  validate
], asyncHandler(async (req, res) => {
  const { phone } = req.body;
  
  // Create and store OTP
  const { otp } = await otpService.createOTP(phone, OTP_TYPES.LOGIN);
  
  // Send OTP via SMS
  const result = await otpService.sendOTP(phone, otp);
  
  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
    ...(result.mock && { devOtp: otp }) // Only include in dev mode
  });
}));

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', [
  validators.phone,
  validators.otp,
  validate
], asyncHandler(async (req, res) => {
  const { phone, otp, name } = req.body;
  
  // Verify OTP
  const verification = await otpService.verifyOTP(phone, otp, OTP_TYPES.LOGIN);
  
  if (!verification.valid) {
    return res.status(400).json({
      success: false,
      message: verification.message,
      attemptsLeft: verification.attemptsLeft
    });
  }
  
  // Find or create user
  let user = await User.findOne({ phone });
  let isNewUser = false;
  
  if (!user) {
    // Create new buyer account
    user = await User.create({
      phone,
      name: name || `User ${phone.slice(-4)}`,
      role: ROLES.BUYER,
      status: USER_STATUS.APPROVED
    });
    isNewUser = true;
  }
  
  // Update last login
  user.lastLoginAt = new Date();
  await user.save();
  
  // Generate token
  const token = generateToken(user._id);
  
  res.status(200).json({
    success: true,
    message: isNewUser ? 'Account created successfully' : 'Login successful',
    token,
    user,
    isNewUser
  });
}));

// @route   POST /api/auth/vendor/signup
// @desc    Register as vendor
// @access  Public
router.post('/vendor/signup', [
  ...validators.vendorRegistration,
  validators.otp, // Add OTP validation
  validate
], asyncHandler(async (req, res) => {
  const { phone, otp, name, email, password, businessName, gstNumber, razorpayKeyId, razorpayKeySecret, address } = req.body;
  
  // Verify OTP first
  const verification = await otpService.verifyOTP(phone, otp, OTP_TYPES.LOGIN);
  if (!verification.valid) {
    return res.status(400).json({
      success: false,
      message: verification.message
    });
  }

  // Check if phone already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Phone number already registered'
    });
  }
  
  // Encrypt Razorpay keys if provided
  let encryptedKeyId, encryptedKeySecret;
  if (razorpayKeyId && razorpayKeySecret) {
    encryptedKeyId = paymentService.encryptKey(razorpayKeyId);
    encryptedKeySecret = paymentService.encryptKey(razorpayKeySecret);
  }
  
  // Create vendor (pending approval)
  const vendor = await User.create({
    phone,
    name,
    email,
    password, // Save password (will be hashed by pre-save)
    businessName,
    gstNumber,
    role: ROLES.VENDOR,
    status: USER_STATUS.PENDING,
    address: address || {},
    razorpayKeyId: encryptedKeyId,
    razorpayKeySecret: encryptedKeySecret
  });
  
  res.status(201).json({
    success: true,
    message: 'Vendor registration submitted. Waiting for admin approval.',
    vendor: {
      id: vendor._id,
      name: vendor.name,
      businessName: vendor.businessName,
      status: vendor.status
    }
  });
}));

// @route   POST /api/auth/vendor/login
// @desc    Vendor login with email and password
// @access  Public
router.post('/vendor/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validate
], asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find vendor by email
  const vendor = await User.findOne({ email, role: ROLES.VENDOR }).select('+password');
  
  if (!vendor) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Verify password
  const isPasswordValid = await vendor.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Update last login
  vendor.lastLoginAt = new Date();
  await vendor.save();
  
  // Generate token
  const token = generateToken(vendor._id);
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: vendor
  });
}));

// @route   POST /api/auth/admin/login-init
// @desc    Admin login step 1: Validate credentials and send OTP
// @access  Public
router.post('/admin/login-init', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  body('secretKey').notEmpty().withMessage('Secret key required'),
  validate
], asyncHandler(async (req, res) => {
  const { email, password, secretKey } = req.body;
  
  // Find admin by email
  const admin = await User.findOne({ email, role: ROLES.ADMIN }).select('+password +secretKey');
  
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Verify password
  const isPasswordValid = await admin.comparePassword(password);
  
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Verify secret key
  if (admin.secretKey !== secretKey) {
    return res.status(401).json({
      success: false,
      message: 'Invalid secret key'
    });
  }
  
  // Generate and send OTP to admin's phone
  const { otp } = await otpService.createOTP(admin.phone, OTP_TYPES.LOGIN);
  await otpService.sendOTP(admin.phone, otp);

  // Mask phone number for display
  const maskedPhone = admin.phone.replace(/.(?=.{4})/g, '*');
  
  res.status(200).json({
    success: true,
    message: `OTP sent to configured admin phone (${maskedPhone})`,
    phone: maskedPhone,
    tempId: admin._id // Send minimal info for next step
  });
}));

// @route   POST /api/auth/admin/login-verify
// @desc    Admin login step 2: Verify OTP and issue token
// @access  Public
router.post('/admin/login-verify', [
  body('email').isEmail().withMessage('Valid email required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP required'),
  validate
], asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Find admin to get phone number for verification
  const admin = await User.findOne({ email, role: ROLES.ADMIN });

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Admin not found' });
  }

  // Verify OTP
  const verification = await otpService.verifyOTP(admin.phone, otp, OTP_TYPES.LOGIN);
  
  if (!verification.valid) {
    return res.status(400).json({
      success: false,
      message: verification.message,
      attemptsLeft: verification.attemptsLeft
    });
  }
  
  // Update last login
  admin.lastLoginAt = new Date();
  await admin.save();
  
  // Generate token
  const token = generateToken(admin._id);
  
  res.status(200).json({
    success: true,
    message: 'Admin login successful',
    token,
    user: admin
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  res.status(200).json({
    success: true,
    user
  });
}));

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail(),
  body('address').optional().isObject(),
  validate
], asyncHandler(async (req, res) => {
  const { name, email, address } = req.body;
  
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (address) updateData.address = address;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'Profile updated',
    user
  });
}));

// @route   POST /api/auth/vendor/forgot-password/init
// @desc    Initiate forgot password for vendor (send OTP)
// @access  Public
router.post('/vendor/forgot-password/init', [
  body('identifier').notEmpty().withMessage('Email or phone number required'),
  validate
], asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  
  // Find vendor by email or phone
  const vendor = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
    role: ROLES.VENDOR
  });
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    });
  }
  
  // Create and send OTP
  const { otp } = await otpService.createOTP(vendor.phone, OTP_TYPES.FORGOT_PASSWORD);
  const result = await otpService.sendOTP(vendor.phone, otp);
  
  // Mask phone for response
  const maskedPhone = vendor.phone.replace(/.(?=.{4})/g, '*');
  
  res.status(200).json({
    success: true,
    message: `OTP sent to registered phone number (${maskedPhone})`,
    phone: maskedPhone,
    ...(result.mock && { devOtp: otp })
  });
}));

// @route   POST /api/auth/vendor/forgot-password/reset
// @desc    Reset vendor password with OTP
// @access  Public
router.post('/vendor/forgot-password/reset', [
  body('identifier').notEmpty().withMessage('Email or phone number required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], asyncHandler(async (req, res) => {
  const { identifier, otp, newPassword } = req.body;
  
  // Find vendor
  const vendor = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
    role: ROLES.VENDOR
  });
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    });
  }
  
  // Verify OTP
  const verification = await otpService.verifyOTP(vendor.phone, otp, OTP_TYPES.FORGOT_PASSWORD);
  
  if (!verification.valid) {
    return res.status(400).json({
      success: false,
      message: verification.message,
      attemptsLeft: verification.attemptsLeft
    });
  }
  
  // Update password
  vendor.password = newPassword;
  await vendor.save();
  
  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
}));

module.exports = router;
