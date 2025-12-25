const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../config/constants');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required']
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor ID is required']
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer ID is required']
  },
  
  // Razorpay identifiers
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  
  // Amount details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Payment status
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  
  // Payment method details
  method: {
    type: String,
    default: ''
  },
  bank: String,
  wallet: String,
  vpa: String, // UPI VPA
  
  // Refund details
  refundId: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundedAt: Date,
  refundReason: String,
  
  // Tracking
  paidToVendor: {
    type: Boolean,
    default: false
  },
  vendorPaidAt: Date,
  
  // Error tracking
  errorCode: String,
  errorDescription: String,
  
  // Webhook data
  webhookData: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ vendorId: 1 });
paymentSchema.index({ buyerId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
