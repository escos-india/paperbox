const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, query } = require('express-validator');
const { validate, validators } = require('../middleware/validation');
const { protect, isVendor } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const cloudinaryService = require('../services/cloudinaryService');
const paymentService = require('../services/paymentService');
const otpService = require('../services/otpService');
const { Product, Order, Subscription, SubscriptionPlan, User } = require('../models');
const { ORDER_STATUS, SUBSCRIPTION_STATUS } = require('../config/constants');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Apply auth middleware to all vendor routes
router.use(protect, isVendor);

// ==================== PRODUCT MANAGEMENT ====================

// @route   GET /api/vendor/products
// @desc    Get vendor's products
// @access  Vendor
router.get('/products', [
  query('isActive').optional().isBoolean(),
  ...validators.pagination,
  validate
], asyncHandler(async (req, res) => {
  const { isActive, page = 1, limit = 20 } = req.query;
  
  const filter = { vendorId: req.user._id };
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}));

// @route   POST /api/vendor/products
// @desc    Create new product
// @access  Vendor
router.post('/products', upload.array('images', 5), [
  validators.product.name,
  validators.product.description,
  validators.product.category,
  validators.product.condition,
  validators.product.price,
  validators.product.quantity,
  validate
], asyncHandler(async (req, res) => {
  const { name, description, brand, category, condition, reasonForSelling, price, originalPrice, quantity, specifications } = req.body;
  
  // Upload images to Cloudinary
  let imageUrls = [];
  console.log('Product upload request files:', req.files ? req.files.length : 'No files');
  
  if (req.files && req.files.length > 0) {
    try {
      const uploadResults = await cloudinaryService.uploadMultipleImages(
        req.files,
        `paperbox/products/${req.user._id}`
      );
      
      console.log('Cloudinary upload results:', JSON.stringify(uploadResults, null, 2));

      imageUrls = uploadResults
        .filter(r => r.success)
        .map(r => r.url);
        
      console.log('Final image URLs to save:', imageUrls);
    } catch (err) {
      console.error('Error in image upload block:', err);
    }
  }
  
  // Parse specifications if it's a string
  let specs = {};
  if (specifications) {
    try {
      specs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    } catch (e) {
      specs = {};
    }
  }
  
  // Normalize category and condition for internal storage
  let normalizedCategory = category.toLowerCase();
  if (['mobiles', 'tablets', 'phones'].includes(normalizedCategory)) normalizedCategory = 'phones';
  if (['laptops', 'laptop'].includes(normalizedCategory)) normalizedCategory = 'laptops';
  
  let normalizedCondition = condition.toLowerCase();
  if (normalizedCondition.includes('refurbished')) normalizedCondition = 'refurbished';
  if (normalizedCondition.includes('new')) normalizedCondition = 'new';
  if (normalizedCondition === 'open box') normalizedCondition = 'like-new';
  if (normalizedCondition.includes('used')) normalizedCondition = 'used';

  const product = await Product.create({
    vendorId: req.user._id,
    name,
    description,
    brand,
    category: normalizedCategory,
    condition: normalizedCondition,
    reasonForSelling,
    price,
    originalPrice,
    quantity: quantity || 1,
    images: imageUrls,
    specifications: specs
  });
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product
  });
}));

// @route   PUT /api/vendor/products/:id
// @desc    Update product
// @access  Vendor
router.put('/products/:id', upload.array('images', 5), [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  // Verify ownership
  const product = await Product.findOne({
    _id: req.params.id,
    vendorId: req.user._id
  });
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  // Handle new images
  if (req.files && req.files.length > 0) {
    const uploadResults = await cloudinaryService.uploadMultipleImages(
      req.files,
      `paperbox/products/${req.user._id}`
    );
    const newUrls = uploadResults
      .filter(r => r.success)
      .map(r => r.url);
    
    // Append to existing images or replace
    if (req.body.replaceImages === 'true') {
      req.body.images = newUrls;
    } else {
      req.body.images = [...product.images, ...newUrls];
    }
  }
  
  // Parse specifications
  if (req.body.specifications && typeof req.body.specifications === 'string') {
    try {
      req.body.specifications = JSON.parse(req.body.specifications);
    } catch (e) {
      delete req.body.specifications;
    }
  }
  
  // Normalize category and condition if they are being updated
  if (req.body.category) {
    let normalized = req.body.category.toLowerCase();
    if (['mobiles', 'tablets', 'phones'].includes(normalized)) normalized = 'phones';
    if (['laptops', 'laptop'].includes(normalized)) normalized = 'laptops';
    req.body.category = normalized;
  }
  if (req.body.condition) {
    let normalized = req.body.condition.toLowerCase();
    if (normalized.includes('refurbished')) normalized = 'refurbished';
    if (normalized.includes('new')) normalized = 'new';
    if (normalized === 'open box') normalized = 'like-new';
    if (normalized.includes('used')) normalized = 'used';
    req.body.condition = normalized;
  }

  // Handle quantity mapping if frontend sends "stock" (fallback)
  if (req.body.stock && !req.body.quantity) {
    req.body.quantity = req.body.stock;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    message: 'Product updated',
    product: updatedProduct
  });
}));

// @route   DELETE /api/vendor/products/:id
// @desc    Delete product
// @access  Vendor
router.delete('/products/:id', [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, vendorId: req.user._id },
    { isActive: false },
    { new: true }
  );
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Product deactivated'
  });
}));

// ==================== ORDER MANAGEMENT ====================

// @route   GET /api/vendor/orders
// @desc    Get vendor's orders
// @access  Vendor
router.get('/orders', [
  query('status').optional().isIn(Object.values(ORDER_STATUS)),
  ...validators.pagination,
  validate
], asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const filter = { vendorId: req.user._id };
  if (status) filter.status = status;
  
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('buyerId', 'name phone')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}));

// @route   GET /api/vendor/orders/:id
// @desc    Get order details
// @access  Vendor
router.get('/orders/:id', [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    vendorId: req.user._id
  })
    .populate('buyerId', 'name phone email')
    .populate('paymentId');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  res.json({
    success: true,
    data: order
  });
}));

// @route   PATCH /api/vendor/orders/:id/status
// @desc    Update order status
// @access  Vendor
router.patch('/orders/:id/status', [
  validators.mongoId('id'),
  body('status').isIn(Object.values(ORDER_STATUS)),
  body('note').optional().isString(),
  validate
], asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  
  const order = await Order.findOne({
    _id: req.params.id,
    vendorId: req.user._id
  });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Update status with timeline
  order.updateStatus(status, note);
  await order.save();
  
  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    order
  });
}));

// @route   POST /api/vendor/orders/:id/delivery-otp
// @desc    Generate delivery OTP
// @access  Vendor
router.post('/orders/:id/delivery-otp', [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    vendorId: req.user._id
  }).select('+deliveryOtp');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  if (order.status !== ORDER_STATUS.OUT_FOR_DELIVERY) {
    return res.status(400).json({
      success: false,
      message: 'Order must be out for delivery to generate OTP'
    });
  }
  
  // Generate 4-digit delivery OTP
  const deliveryOtp = otpService.generateDeliveryOTP();
  order.deliveryOtp = deliveryOtp;
  await order.save();
  
  // TODO: Send OTP to buyer via SMS
  
  res.json({
    success: true,
    message: 'Delivery OTP generated and sent to buyer',
    otp: deliveryOtp // For development - remove in production
  });
}));

// ==================== EARNINGS ====================

// @route   GET /api/vendor/earnings
// @desc    Get vendor earnings summary
// @access  Vendor
router.get('/earnings', asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  
  // Get earnings stats
  const [
    totalOrders,
    completedOrders,
    pendingOrders,
    earningsResult
  ] = await Promise.all([
    Order.countDocuments({ vendorId }),
    Order.countDocuments({ vendorId, status: ORDER_STATUS.DELIVERED }),
    Order.countDocuments({ 
      vendorId, 
      status: { $nin: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED] }
    }),
    Order.aggregate([
      { $match: { vendorId, status: ORDER_STATUS.DELIVERED } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
  ]);
  
  const totalEarnings = earningsResult[0]?.total || 0;
  
  // Recent transactions
  const recentOrders = await Order.find({
    vendorId,
    status: ORDER_STATUS.DELIVERED
  })
    .select('orderId totalAmount createdAt deliveredAt')
    .sort({ deliveredAt: -1 })
    .limit(10);
  
  res.json({
    success: true,
    data: {
      totalEarnings,
      totalOrders,
      completedOrders,
      pendingOrders,
      recentTransactions: recentOrders
    }
  });
}));

// ==================== SUBSCRIPTION ====================

// @route   GET /api/vendor/subscription
// @desc    Get current subscription status
// @access  Vendor
router.get('/subscription', asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({
    vendorId: req.user._id,
    status: SUBSCRIPTION_STATUS.ACTIVE
  }).populate('planId');
  
  res.json({
    success: true,
    data: subscription,
    hasActiveSubscription: !!subscription && subscription.isActive()
  });
}));

// @route   GET /api/vendor/subscription/plans
// @desc    Get available subscription plans
// @access  Vendor
router.get('/subscription/plans', asyncHandler(async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true })
    .sort({ priority: -1 });
  
  res.json({
    success: true,
    data: plans
  });
}));

// @route   POST /api/vendor/subscription/subscribe
// @desc    Subscribe to a plan
// @access  Vendor
router.post('/subscription/subscribe', [
  body('planId').isMongoId(),
  validate
], asyncHandler(async (req, res) => {
  const { planId } = req.body;
  
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan || !plan.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Plan not found'
    });
  }
  
  // Create Razorpay order using Admin's account
  const order = await paymentService.createSubscriptionOrder(
    req.user._id,
    planId,
    plan.price,
    { planName: plan.name }
  );
  
  res.json({
    success: true,
    message: 'Subscription order created',
    order,
    plan
  });
}));

// @route   POST /api/vendor/subscription/verify
// @desc    Verify subscription payment
// @access  Vendor
router.post('/subscription/verify', [
  body('razorpayOrderId').notEmpty(),
  body('razorpayPaymentId').notEmpty(),
  body('razorpaySignature').notEmpty(),
  body('planId').isMongoId(),
  validate
], asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planId } = req.body;
  
  // Verify signature
  const isValid = paymentService.verifySubscriptionPayment(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );
  
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
  
  const plan = await SubscriptionPlan.findById(planId);
  
  // Deactivate existing subscription
  await Subscription.updateMany(
    { vendorId: req.user._id, status: SUBSCRIPTION_STATUS.ACTIVE },
    { status: SUBSCRIPTION_STATUS.EXPIRED }
  );
  
  // Create new subscription
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);
  
  const subscription = await Subscription.create({
    vendorId: req.user._id,
    planId,
    status: SUBSCRIPTION_STATUS.ACTIVE,
    startDate,
    endDate,
    razorpayOrderId,
    payments: [{
      razorpayPaymentId,
      razorpayOrderId,
      amount: plan.price,
      paidAt: new Date(),
      status: 'success'
    }]
  });
  
  res.json({
    success: true,
    message: 'Subscription activated',
    subscription
  });
}));

// ==================== RAZORPAY KEYS ====================

// @route   PUT /api/vendor/razorpay-keys
// @desc    Update Razorpay API keys
// @access  Vendor
router.put('/razorpay-keys', [
  body('razorpayKeyId').trim().notEmpty(),
  body('razorpayKeySecret').trim().notEmpty(),
  validate
], asyncHandler(async (req, res) => {
  const { razorpayKeyId, razorpayKeySecret } = req.body;
  
  // Encrypt and store
  const encryptedKeyId = paymentService.encryptKey(razorpayKeyId);
  const encryptedKeySecret = paymentService.encryptKey(razorpayKeySecret);
  
  await User.findByIdAndUpdate(req.user._id, {
    razorpayKeyId: encryptedKeyId,
    razorpayKeySecret: encryptedKeySecret
  });
  
  res.json({
    success: true,
    message: 'Razorpay credentials updated'
  });
}));

module.exports = router;
