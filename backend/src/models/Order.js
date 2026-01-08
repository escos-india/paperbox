const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../config/constants');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String
}, { _id: false });

const timelineEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
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
  items: {
    type: [orderItemSchema],
    required: [true, 'Order must have at least one item'],
    validate: [arr => arr.length > 0, 'Order must have at least one item']
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PLACED
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: [true, 'Shipping address is required']
  },
  
  // Payment details (Manual QR)
  paymentProof: {
    type: String, // URL to screenshot or just text
  },
  transactionId: {
    type: String
  },
  isPaymentVerified: {
    type: Boolean,
    default: false
  },

  // Delivery OTP for verification
  deliveryOtp: {
    type: String,
    select: false
  },
  deliveryOtpVerified: {
    type: Boolean,
    default: false
  },

  // Refund
  refundRequested: {
    type: Boolean,
    default: false
  },
  refundReason: String,
  refundStatus: {
    type: String,
    enum: ['NONE', 'PENDING', 'APPROVED', 'REJECTED'],
    default: 'NONE'
  },
  
  // Timeline tracking
  timeline: {
    type: [timelineEventSchema],
    default: []
  },
  
  // Notes
  buyerNote: String,
  vendorNote: String,
  
  // Tracking
  trackingNumber: String,
  courierName: String,
  
  // Dates
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

// Generate order ID before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `PB${timestamp}${random}`;
  }
  
  // Add initial timeline event
  if (this.isNew && this.timeline.length === 0) {
    this.timeline.push({
      status: ORDER_STATUS.PLACED,
      timestamp: new Date(),
      note: 'Order placed successfully'
    });
  }
  
  next();
});

// Method to update status with timeline
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note
  });
  
  if (newStatus === ORDER_STATUS.DELIVERED) {
    this.deliveredAt = new Date();
  }
  if (newStatus === ORDER_STATUS.CANCELLED) {
    this.cancelledAt = new Date();
    this.cancelReason = note;
  }
};

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ buyerId: 1 });
orderSchema.index({ vendorId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
