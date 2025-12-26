const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { CATEGORIES, CONDITIONS, ORDER_STATUS } = require('../config/constants');

// Validation result checker middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation Errors:', JSON.stringify(errors.array(), null, 2)); // DEBUG LOG
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Common validators
const validators = {
  // Phone number validation (Indian)
  phone: body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian phone number'),

  // Generic identifier (Phone OR Email)
  identifier: body('identifier')
    .trim()
    .custom((value) => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        if (emailRegex.test(value) || phoneRegex.test(value)) {
            return true;
        }
        throw new Error('Please provide a valid Phone Number or Email');
    }),

  // OTP validation
  otp: body('otp')
    .trim()
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),

  // MongoDB ObjectId validation
  mongoId: (field) => param(field)
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage(`Invalid ${field} format`),

  // Product validators
  product: {
    name: body('name')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Product name must be between 3 and 200 characters'),
    
    description: body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    
    category: body('category')
      .custom(value => {
        if (!value) return false;
        const normalized = value.toLowerCase();
        const validCategories = Object.values(CATEGORIES).map(c => c.toLowerCase());
        // Handle "Mobiles" -> "phones" and "Tablets" -> "phones" or "electronics" mapping if needed
        if (normalized === 'mobiles' || normalized === 'tablets') return true;
        return validCategories.includes(normalized);
      })
      .withMessage('Invalid category'),
    
    condition: body('condition')
      .custom(value => {
        if (!value) return false;
        const normalized = value.toLowerCase();
        const validConditions = Object.values(CONDITIONS).map(c => c.toLowerCase());
        // Support common variants
        if (normalized.includes('refurbished')) return true;
        if (normalized.includes('new')) return true;
        if (normalized === 'open box') return true;
        return validConditions.includes(normalized);
      })
      .withMessage('Invalid condition'),
    
    price: body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    quantity: body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer')
  },

  // Order validators
  order: {
    status: body('status')
      .isIn(Object.values(ORDER_STATUS))
      .withMessage('Invalid order status'),
    
    shippingAddress: [
      body('shippingAddress.name').trim().notEmpty().withMessage('Name is required'),
      body('shippingAddress.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone required'),
      body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
      body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
      body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
      body('shippingAddress.pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode required')
    ]
  },

  // Vendor registration validators
  vendorRegistration: [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone required'),
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('businessName').trim().isLength({ min: 2, max: 200 }).withMessage('Business name required'),
    body('gstNumber').optional().trim(),
    body('razorpayKeyId').optional().trim().notEmpty().withMessage('Razorpay Key ID required'),
    body('razorpayKeySecret').optional().trim().notEmpty().withMessage('Razorpay Key Secret required')
  ],

  // Pagination validators
  pagination: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sort').optional().isString()
  ],

  // Feedback validators
  feedback: [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().trim().isLength({ max: 1000 }).withMessage('Review max 1000 characters')
  ],

  // Refund request validators
  refundRequest: [
    body('reason').trim().isLength({ min: 10, max: 1000 }).withMessage('Reason must be 10-1000 characters'),
    body('requestedAmount').isFloat({ min: 0 }).withMessage('Valid amount required')
  ]
};

module.exports = {
  validate,
  validators
};
