const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { validate, validators } = require('../middleware/validation');
const { protect, isAdmin } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { User, Product, Order, Payment, RefundRequest, SubscriptionPlan, Subscription } = require('../models');
const { ROLES, USER_STATUS, ORDER_STATUS, REFUND_STATUS } = require('../config/constants');

// Apply auth middleware to all admin routes
router.use(protect, isAdmin);

// ==================== USER MANAGEMENT ====================

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Admin
router.get('/users', [
  query('role').optional().isIn(Object.values(ROLES)),
  query('status').optional().isIn(Object.values(USER_STATUS)),
  query('search').optional().isString(),
  ...validators.pagination,
  validate
], asyncHandler(async (req, res) => {
  const { role, status, search, page = 1, limit = 20 } = req.query;
  
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { businessName: { $regex: search, $options: 'i' } }
    ];
  }
  
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @route   PATCH /api/admin/users/:id/status
// @desc    Update user status (block/unblock)
// @access  Admin
router.patch('/users/:id/status', [
  validators.mongoId('id'),
  body('status').isIn(Object.values(USER_STATUS)),
  validate
], asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    message: `User ${status === USER_STATUS.BLOCKED ? 'blocked' : 'updated'} successfully`,
    user
  });
}));

// ==================== VENDOR MANAGEMENT ====================

// @route   GET /api/admin/vendors/pending
// @desc    Get pending vendor approvals
// @access  Admin
router.get('/vendors/pending', asyncHandler(async (req, res) => {
  const vendors = await User.find({
    role: ROLES.VENDOR,
    status: USER_STATUS.PENDING
  }).sort({ createdAt: -1 });
  
  res.json({
    success: true,
    data: vendors,
    count: vendors.length
  });
}));

// @route   PATCH /api/admin/vendors/:id/approve
// @desc    Approve vendor
// @access  Admin
router.patch('/vendors/:id/approve', [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const vendor = await User.findOneAndUpdate(
    { _id: req.params.id, role: ROLES.VENDOR },
    { status: USER_STATUS.APPROVED },
    { new: true }
  );
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    });
  }
  
  // TODO: Send approval notification SMS/email
  
  res.json({
    success: true,
    message: 'Vendor approved successfully',
    vendor
  });
}));

// @route   PATCH /api/admin/vendors/:id/reject
// @desc    Reject vendor
// @access  Admin
router.patch('/vendors/:id/reject', [
  validators.mongoId('id'),
  body('reason').optional().isString(),
  validate
], asyncHandler(async (req, res) => {
  const vendor = await User.findOneAndUpdate(
    { _id: req.params.id, role: ROLES.VENDOR },
    { status: USER_STATUS.BLOCKED },
    { new: true }
  );
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Vendor rejected',
    vendor
  });
}));

// ==================== PRODUCT MANAGEMENT ====================

// @route   GET /api/admin/products
// @desc    Get all products
// @access  Admin
router.get('/products', [
  query('vendorId').optional().isMongoId(),
  query('category').optional().isString(),
  query('isActive').optional().isBoolean(),
  ...validators.pagination,
  validate
], asyncHandler(async (req, res) => {
  const { vendorId, category, isActive, page = 1, limit = 20 } = req.query;
  
  const filter = {};
  if (vendorId) filter.vendorId = vendorId;
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('vendorId', 'name businessName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}));

// @route   DELETE /api/admin/products/:id
// @desc    Remove product listing
// @access  Admin
router.delete('/products/:id', [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
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
    message: 'Product deactivated',
    product
  });
}));

// ==================== ORDER MANAGEMENT ====================

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Admin
router.get('/orders', [
  query('status').optional().isIn(Object.values(ORDER_STATUS)),
  query('vendorId').optional().isMongoId(),
  query('buyerId').optional().isMongoId(),
  ...validators.pagination,
  validate
], asyncHandler(async (req, res) => {
  const { status, vendorId, buyerId, page = 1, limit = 20 } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (vendorId) filter.vendorId = vendorId;
  if (buyerId) filter.buyerId = buyerId;
  
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('buyerId', 'name phone')
    .populate('vendorId', 'name businessName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}));

// ==================== REFUND MANAGEMENT ====================

// @route   GET /api/admin/refunds
// @desc    Get all refund requests
// @access  Admin
router.get('/refunds', [
  query('status').optional().isIn(Object.values(REFUND_STATUS)),
  ...validators.pagination,
  validate
], asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  
  const total = await RefundRequest.countDocuments(filter);
  const refunds = await RefundRequest.find(filter)
    .populate('orderId', 'orderId totalAmount')
    .populate('buyerId', 'name phone')
    .populate('vendorId', 'name businessName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  res.json({
    success: true,
    data: refunds,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}));

// @route   PATCH /api/admin/refunds/:id
// @desc    Approve or reject refund
// @access  Admin
router.patch('/refunds/:id', [
  validators.mongoId('id'),
  body('status').isIn([REFUND_STATUS.APPROVED, REFUND_STATUS.REJECTED]),
  body('approvedAmount').optional().isFloat({ min: 0 }),
  body('adminNotes').optional().isString(),
  validate
], asyncHandler(async (req, res) => {
  const { status, approvedAmount, adminNotes } = req.body;
  
  const refund = await RefundRequest.findById(req.params.id);
  if (!refund) {
    return res.status(404).json({
      success: false,
      message: 'Refund request not found'
    });
  }
  
  refund.status = status;
  refund.adminId = req.user._id;
  refund.adminNotes = adminNotes;
  refund.processedAt = new Date();
  
  if (status === REFUND_STATUS.APPROVED) {
    refund.approvedAmount = approvedAmount || refund.requestedAmount;
    // TODO: Process actual Razorpay refund
  }
  
  await refund.save();
  
  res.json({
    success: true,
    message: `Refund ${status}`,
    refund
  });
}));

// ==================== SUBSCRIPTION PLANS ====================

// @route   GET /api/admin/subscriptions/plans
// @desc    Get all subscription plans
// @access  Admin
router.get('/subscriptions/plans', asyncHandler(async (req, res) => {
  const plans = await SubscriptionPlan.find().sort({ priority: -1 });
  
  res.json({
    success: true,
    data: plans
  });
}));

// @route   POST /api/admin/subscriptions/plans
// @desc    Create subscription plan
// @access  Admin
router.post('/subscriptions/plans', [
  body('name').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('duration').isInt({ min: 1 }),
  body('maxProducts').isInt({ min: 1 }),
  body('features').optional().isArray(),
  validate
], asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Plan created',
    plan
  });
}));

// @route   PUT /api/admin/subscriptions/plans/:id
// @desc    Update subscription plan
// @access  Admin
router.put('/subscriptions/plans/:id', [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!plan) {
    return res.status(404).json({
      success: false,
      message: 'Plan not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Plan updated',
    plan
  });
}));

// @route   DELETE /api/admin/subscriptions/plans/:id
// @desc    Delete subscription plan
// @access  Admin
router.delete('/subscriptions/plans/:id', [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  
  res.json({
    success: true,
    message: 'Plan deactivated'
  });
}));

// ==================== ANALYTICS ====================

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Admin
router.get('/analytics', asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalVendors,
    totalBuyers,
    pendingVendors,
    totalProducts,
    activeProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    pendingRefunds
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: ROLES.VENDOR }),
    User.countDocuments({ role: ROLES.BUYER }),
    User.countDocuments({ role: ROLES.VENDOR, status: USER_STATUS.PENDING }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.countDocuments({ status: ORDER_STATUS.PLACED }),
    Order.countDocuments({ status: ORDER_STATUS.DELIVERED }),
    RefundRequest.countDocuments({ status: REFUND_STATUS.PENDING })
  ]);
  
  // Calculate total revenue
  const revenueResult = await Order.aggregate([
    { $match: { status: ORDER_STATUS.DELIVERED } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;
  
  // Recent orders
  const recentOrders = await Order.find()
    .populate('buyerId', 'name')
    .populate('vendorId', 'businessName')
    .sort({ createdAt: -1 })
    .limit(5);
  
  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        vendors: totalVendors,
        buyers: totalBuyers,
        pendingVendors
      },
      products: {
        total: totalProducts,
        active: activeProducts
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders
      },
      refunds: {
        pending: pendingRefunds
      },
      revenue: {
        total: totalRevenue
      },
      recentOrders
    }
  });
}));

module.exports = router;
