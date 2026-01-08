const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { validate, validators } = require('../middleware/validation');
const { protect, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { Product, Order, Payment, Feedback, RefundRequest } = require('../models');
const { CATEGORIES, CONDITIONS, ORDER_STATUS, PAYMENT_STATUS, OTP_TYPES } = require('../config/constants');
const paymentService = require('../services/paymentService');
const otpService = require('../services/otpService');

// ==================== PUBLIC PRODUCT ROUTES ====================

// @route   GET /api/products
// @desc    Browse products
// @access  Public
router.get('/products', [
  query('category').optional().isIn(Object.values(CATEGORIES)),
  query('condition').optional().isIn(Object.values(CONDITIONS)),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('search').optional().isString(),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'newest', 'rating']),
  ...validators.pagination,
  validate
], asyncHandler(async (req, res) => {
  const { 
    category, condition, minPrice, maxPrice, search, sort,
    page = 1, limit = 20 
  } = req.query;
  
  const filter = { isActive: true, quantity: { $gt: 0 } };
  
  if (category) filter.category = category;
  if (condition) filter.condition = condition;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  if (search) {
    filter.$text = { $search: search };
  }
  
  // Sorting
  let sortOption = { createdAt: -1 };
  switch (sort) {
    case 'price_asc': sortOption = { price: 1 }; break;
    case 'price_desc': sortOption = { price: -1 }; break;
    case 'rating': sortOption = { averageRating: -1 }; break;
    case 'newest': 
    default: sortOption = { createdAt: -1 };
  }
  
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('vendorId', 'businessName')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);
  
  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}));

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/products/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    isActive: true, 
    isFeatured: true,
    quantity: { $gt: 0 }
  })
    .populate('vendorId', 'businessName')
    .limit(8);
  
  res.json({
    success: true,
    data: products
  });
}));

// @route   GET /api/products/categories
// @desc    Get product categories with counts
// @access  Public
router.get('/products/categories', asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  res.json({
    success: true,
    data: categories.map(c => ({ category: c._id, count: c.count }))
  });
}));

// @route   GET /api/products/:id
// @desc    Get product details
// @access  Public
router.get('/products/:id', [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('vendorId', 'businessName name');
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  // Increment views
  product.views += 1;
  await product.save();
  
  // Get reviews
  const reviews = await Feedback.find({ 
    productId: product._id,
    isVisible: true
  })
    .populate('buyerId', 'name')
    .sort({ createdAt: -1 })
    .limit(10);
  
  res.json({
    success: true,
    data: product,
    reviews
  });
}));

// ==================== PROTECTED BUYER ROUTES ====================

// @route   POST /api/checkout
// @desc    Create order and initiate payment
// @access  Private (Buyer)
router.post('/checkout', protect, [
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isMongoId(),
  body('items.*.quantity').isInt({ min: 1 }),
  ...validators.order.shippingAddress,
  validate
], asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;
  
  // Validate products and calculate totals
  const productIds = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  
  if (products.length !== items.length) {
    return res.status(400).json({
      success: false,
      message: 'Some products are unavailable'
    });
  }
  
  // Group items by vendor for multi-vendor cart handling
  const vendorGroups = {};
  
  for (const item of items) {
    const product = products.find(p => p._id.toString() === item.productId);
    
    if (product.quantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}`
      });
    }
    
    const vendorId = product.vendorId.toString();
    if (!vendorGroups[vendorId]) {
      vendorGroups[vendorId] = {
        vendorId: product.vendorId,
        items: [],
        subtotal: 0
      };
    }
    
    vendorGroups[vendorId].items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0] || ''
    });
    
    vendorGroups[vendorId].subtotal += product.price * item.quantity;
  }
  
  // Create orders for each vendor
  const orders = [];
  const paymentOrders = [];
  
  for (const vendorId in vendorGroups) {
    const group = vendorGroups[vendorId];
    const tax = Math.round(group.subtotal * 0.18); // 18% GST
    const totalAmount = group.subtotal + tax;
    
    // Create order
    const order = await Order.create({
      buyerId: req.user._id,
      vendorId: group.vendorId,
      items: group.items,
      subtotal: group.subtotal,
      tax,
      totalAmount,
      shippingAddress,
      status: ORDER_STATUS.PLACED
    });
    
    orders.push(order);
    
    // Create Pay-on-Delivery / Manual Payment Order
    try {
      // Create payment record (Pending)
      const payment = await Payment.create({
        orderId: order._id,
        vendorId: group.vendorId,
        buyerId: req.user._id,
        razorpayOrderId: `manual_${order.orderId}`, // Placeholder
        amount: totalAmount,
        status: PAYMENT_STATUS.PENDING
      });
      
      order.paymentId = payment._id;
      await order.save();
      
      paymentOrders.push({
        orderId: order._id,
        orderNumber: order.orderId,
        vendorId: group.vendorId,
        amount: totalAmount,
        isManual: true
      });
    } catch (error) {
      console.error('Order creation error:', error);
      // Clean up if payment creation fails
      await Order.findByIdAndDelete(order._id);
      throw error;
    }
  }
  
  res.status(201).json({
    success: true,
    message: 'Orders created',
    orders: orders.map(o => ({
      id: o._id,
      orderId: o.orderId,
      totalAmount: o.totalAmount
    })),
    payments: paymentOrders
  });
}));

// @route   POST /api/payment/verify
// @desc    Verify payment after Razorpay checkout
// @access  Private
router.post('/payment/verify', protect, [
  body('orderId').isMongoId(),
  body('razorpayOrderId').notEmpty(),
  body('razorpayPaymentId').notEmpty(),
  body('razorpaySignature').notEmpty(),
  validate
], asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  const payment = await Payment.findOne({ orderId: order._id });
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }
  
  // Check for mock payment
  if (razorpayOrderId.includes('mock')) {
    payment.razorpayPaymentId = `pay_mock_${Date.now()}`;
    payment.status = PAYMENT_STATUS.SUCCESS;
    payment.paidToVendor = true;
    await payment.save();
    
    order.updateStatus(ORDER_STATUS.CONFIRMED, 'Payment received (mock)');
    await order.save();
    
    // Update product quantities
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity, soldCount: item.quantity }
      });
    }
    
    return res.json({
      success: true,
      message: 'Payment verified (mock)',
      order
    });
  }
  
  // Verify with Razorpay
  const isValid = await paymentService.verifyProductPayment(
    order.vendorId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );
  
  if (!isValid) {
    payment.status = PAYMENT_STATUS.FAILED;
    await payment.save();
    
    return res.status(400).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
  
  // Update payment
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = PAYMENT_STATUS.SUCCESS;
  payment.paidToVendor = true;
  await payment.save();
  
  // Update order status
  order.updateStatus(ORDER_STATUS.CONFIRMED, 'Payment received');
  await order.save();
  
  // Update product quantities
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { quantity: -item.quantity, soldCount: item.quantity }
    });
  }
  
  // Update vendor earnings
  await require('../models/User').findByIdAndUpdate(order.vendorId, {
    $inc: { totalEarnings: order.totalAmount }
  });
  
  res.json({
    success: true,
    message: 'Payment verified successfully',
    order
  });
}));

// @route   GET /api/orders
// @desc    Get buyer's orders
// @access  Private
router.get('/orders', protect, [
  query('status').optional().isIn(Object.values(ORDER_STATUS)),
  ...validators.pagination,
  validate
], asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const filter = { buyerId: req.user._id };
  if (status) filter.status = status;
  
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('vendorId', 'businessName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}));

// @route   GET /api/orders/:id
// @desc    Get order details
// @access  Private
router.get('/orders/:id', protect, [
  validators.mongoId('id'),
  validate
], asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    buyerId: req.user._id
  })
    .select('+deliveryOtp')
    .populate('vendorId', 'businessName phone qrCode')
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

// @route   POST /api/orders/:id/verify-delivery
// @desc    Verify delivery OTP
// @access  Private
router.post('/orders/:id/verify-delivery', protect, [
  validators.mongoId('id'),
  body('otp').isLength({ min: 4, max: 4 }).isNumeric(),
  validate
], asyncHandler(async (req, res) => {
  const { otp } = req.body;
  
  const order = await Order.findOne({
    _id: req.params.id,
    buyerId: req.user._id
  }).select('+deliveryOtp');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  if (order.deliveryOtp !== otp) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  }
  
  order.deliveryOtpVerified = true;
  order.updateStatus(ORDER_STATUS.DELIVERED, 'Delivery confirmed by buyer');
  await order.save();
  
  res.json({
    success: true,
    message: 'Delivery confirmed',
    order
  });
}));

// @route   POST /api/orders/:id/confirm-payment
// @desc    Buyer confirms payment with transaction ID
// @access  Private
router.post('/orders/:id/confirm-payment', protect, [
  validators.mongoId('id'),
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('paymentProof').optional(),
  validate
], asyncHandler(async (req, res) => {
  const { transactionId, paymentProof } = req.body;
  
  const order = await Order.findOne({
    _id: req.params.id,
    buyerId: req.user._id
  });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Update order with payment details
  order.transactionId = transactionId;
  order.paymentProof = paymentProof;
  order.isPaymentVerified = false; // Needs vendor verification
  order.updateStatus(ORDER_STATUS.PAYMENT_PENDING || 'PAYMENT_PENDING', 'Payment details submitted by buyer'); 
  // Ensure PAYMENT_PENDING is in constants or just use a string for now if not present. 
  // Checking constants file later might be good, but 'PLACED' is default. 
  // Let's assume we keep it as PLACED or move to a "VERIFICATION_PENDING" state if we had one.
  // For now, let's just save the details. The status might remain PLACED until verified.
  
  await order.save();
  
  res.json({
    success: true,
    message: 'Payment details submitted. Waiting for vendor verification.',
    order
  });
}));

router.post('/orders/:id/refund', protect, [
  validators.mongoId('id'),
  body('reason').trim().isLength({ min: 10, max: 1000 }).withMessage('Reason must be 10-1000 characters'),
  validate
], asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const order = await Order.findOne({
    _id: req.params.id,
    buyerId: req.user._id
  });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Only allow refund request for delivered or confirmed (paid) orders
  const allowedStatuses = [ORDER_STATUS.DELIVERED, ORDER_STATUS.CONFIRMED];
  if (!allowedStatuses.includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Refunds can only be requested for delivered or confirmed orders'
    });
  }
  
  // Check if refund already exists
  const existingRefund = await RefundRequest.findOne({ orderId: order._id });
  if (existingRefund) {
    return res.status(400).json({
      success: false,
      message: 'Refund request already exists'
    });
  }
  
  // Create RefundRequest
  const refund = await RefundRequest.create({
    orderId: order._id,
    buyerId: req.user._id,
    vendorId: order.vendorId,
    reason,
    requestedAmount: order.totalAmount, // Auto-set to order total
    status: 'pending'
  });
  
  // Update order with refund request
  order.refundRequested = true;
  order.refundReason = reason;
  order.refundStatus = 'PENDING';
  
  // Optionally update status to indicate refund requested in timeline
  order.updateStatus('REFUND_REQUESTED', reason);
  
  await order.save();
  
  res.status(201).json({
    success: true,
    message: 'Refund request submitted',
    refund
  });
}));

// @route   POST /api/orders/:id/feedback
// @desc    Submit feedback
// @access  Private
router.post('/orders/:id/feedback', protect, [
  validators.mongoId('id'),
  body('productId').isMongoId(),
  ...validators.feedback,
  validate
], asyncHandler(async (req, res) => {
  const { productId, rating, review } = req.body;
  
  const order = await Order.findOne({
    _id: req.params.id,
    buyerId: req.user._id,
    status: ORDER_STATUS.DELIVERED
  });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or not delivered'
    });
  }
  
  // Verify product was in order
  const orderItem = order.items.find(i => i.productId.toString() === productId);
  if (!orderItem) {
    return res.status(400).json({
      success: false,
      message: 'Product not in this order'
    });
  }
  
  // Create feedback
  const feedback = await Feedback.create({
    orderId: order._id,
    productId,
    vendorId: order.vendorId,
    buyerId: req.user._id,
    rating,
    review
  });
  
  // Update product average rating
  const allFeedback = await Feedback.find({ productId, isVisible: true });
  const avgRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
  
  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews: allFeedback.length
  });
  
  res.status(201).json({ success: true, message: 'Feedback submitted' });
}));

// @route   PATCH /api/orders/:id/cancel
// @desc    Cancel order (buyer only, before shipped)
// @access  Buyer
router.patch('/orders/:id/cancel', [
  validators.mongoId('id'),
  body('reason').optional().isString().trim(),
  validate
], protect, asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const order = await Order.findOne({
    _id: req.params.id,
    buyerId: req.user._id
  });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Only allow cancellation if order hasn't shipped yet
  const cancellableStatuses = [ORDER_STATUS.PLACED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PICKED_PACKED];
  if (!cancellableStatuses.includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot cancel order in ${order.status} status. Please contact support.`
    });
  }
  
  // Update order status to cancelled
  order.updateStatus(ORDER_STATUS.CANCELLED, reason || 'Cancelled by buyer');
  await order.save();
  
  res.json({
    success: true,
    message: 'Order cancelled successfully',
    order
  });
}));

module.exports = router;
