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
// @desc    Send OTP to phone number or email
// @access  Public
router.post('/send-otp', [
  validators.identifier,
  validate
], asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  
  // Create and store OTP
  const { otp } = await otpService.createOTP(identifier, OTP_TYPES.LOGIN);
  
  // Send OTP via SMS or Email
  const result = await otpService.sendOTP(identifier, otp);
  
  if (!result.success) {
    if (result.mock) {
       // Allow dev mode/fallback to pass through
    } else {
        return res.status(500).json({
        success: false,
        message: result.error || 'Failed to send OTP'
        });
    }
  }
  
  res.status(200).json({
    success: true,
    message: `OTP sent to ${identifier}`,
    ...(result.mock && { devOtp: otp }) // Only include in dev mode
  });
}));

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', [
  validators.identifier,
  validators.otp,
  validate
], asyncHandler(async (req, res) => {
  const { identifier, otp, name } = req.body;
  
  // Verify OTP
  const verification = await otpService.verifyOTP(identifier, otp, OTP_TYPES.LOGIN);
  
  if (!verification.valid) {
    return res.status(400).json({
      success: false,
      message: verification.message,
      attemptsLeft: verification.attemptsLeft
    });
  }
  
  // Find or create user
  const isEmail = identifier.includes('@');
  const query = isEmail ? { email: identifier } : { phone: identifier };
  
  let user = await User.findOne(query);
  let isNewUser = false;
  
  if (!user) {
    // Create new buyer account
    const userData = {
      name: name || `User ${identifier.slice(0, 4)}...`,
      role: ROLES.BUYER,
      status: USER_STATUS.APPROVED
    };
    
    if (isEmail) userData.email = identifier;
    else userData.phone = identifier;

    user = await User.create(userData);
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
  const { phone, otp, name, email, password, businessName, gstNumber, razorpayKeyId, razorpayKeySecret, address, otpIdentifier } = req.body;
  
  // Verify OTP first
  // Use explicitly provided otpIdentifier, or fallback to phone (default)
  const identifierToVerify = otpIdentifier || phone;
  
  const verification = await otpService.verifyOTP(identifierToVerify, otp, OTP_TYPES.LOGIN);
  
  if (!verification.valid) {
    // Try verifying against email if phone failed, just in case user sent email OTP but didn't send otpIdentifier
    // (Optional robustness, but otpIdentifier is cleaner)
    // For now, return error.
    return res.status(400).json({
      success: false,
      message: verification.message
    });
  }

  // Check if phone/email already exists
  const existingUser = await User.findOne({ 
      $or: [{ phone }, { email }]
  });
  
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Phone or Email already registered'
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
  
  // Generate and send OTP to admin's EMAIL
  // User requested "email otp sending... for the admin Login too"
  const { otp } = await otpService.createOTP(admin.email, OTP_TYPES.LOGIN);
  await otpService.sendOTP(admin.email, otp);

  // Mask email for display
  const maskedEmail = admin.email.replace(/(.{2})(.*)(?=@)/,
    (gp1, gp2, gp3) => gp2 + "*".repeat(gp3.length));
  
  res.status(200).json({
    success: true,
    message: `OTP sent to admin email (${maskedEmail})`,
    phone: maskedEmail, // Keeping field name 'phone' for frontend compatibility if needed, or change frontend
    tempId: admin._id 
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

  // Find admin
  const admin = await User.findOne({ email, role: ROLES.ADMIN });

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Admin not found' });
  }

  // Verify OTP against EMAIL
  const verification = await otpService.verifyOTP(admin.email, otp, OTP_TYPES.LOGIN);
  
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

  // Determine which identifier to usage for OTP (prefer Email if identifier is email, else Phone)
  // Actually, we should send to the identifier the user PROVIDED if it matches.
  // OR, we send to the verified contact method.
  // Let's send to the `identifier` passed, assuming it matches the user record found.
  // But we need to use the actual value from the DB to be safe/clean? 
  // No, use the input `identifier` so `verifyOTP` works with the same string.
  
  // Create and send OTP
  const { otp } = await otpService.createOTP(identifier, OTP_TYPES.FORGOT_PASSWORD);
  const result = await otpService.sendOTP(identifier, otp);
  
  res.status(200).json({
    success: true,
    message: `OTP sent to ${identifier}`,
    phone: identifier,
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
  
  // Verify OTP against identifier
  const verification = await otpService.verifyOTP(identifier, otp, OTP_TYPES.FORGOT_PASSWORD);
  
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
