const mongoose = require('mongoose');
const { REFUND_STATUS } = require('../config/constants');

const refundRequestSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required']
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer ID is required']
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor ID is required']
  },
  
  // Request details
  reason: {
    type: String,
    required: [true, 'Refund reason is required'],
    trim: true,
    maxlength: [1000, 'Reason cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    trim: true
  }],
  
  // Amount
  requestedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  approvedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Status
  status: {
    type: String,
    enum: Object.values(REFUND_STATUS),
    default: REFUND_STATUS.PENDING
  },
  
  // Admin handling
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  processedAt: Date,
  
  // Razorpay refund
  razorpayRefundId: String,
  refundProcessedAt: Date
}, {
  timestamps: true
});

// Indexes
refundRequestSchema.index({ orderId: 1 });
refundRequestSchema.index({ buyerId: 1 });
refundRequestSchema.index({ vendorId: 1 });
refundRequestSchema.index({ status: 1 });

module.exports = mongoose.model('RefundRequest', refundRequestSchema);
