const mongoose = require('mongoose');
const { SUBSCRIPTION_STATUS } = require('../config/constants');

const subscriptionPaymentSchema = new mongoose.Schema({
  razorpayPaymentId: {
    type: String,
    required: true
  },
  razorpayOrderId: String,
  amount: {
    type: Number,
    required: true
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'success'
  }
}, { _id: false });

const subscriptionSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor ID is required']
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: [true, 'Plan ID is required']
  },
  status: {
    type: String,
    enum: Object.values(SUBSCRIPTION_STATUS),
    default: SUBSCRIPTION_STATUS.ACTIVE
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  
  // Current period Razorpay details
  razorpaySubscriptionId: String,
  razorpayOrderId: String,
  
  // Payment history
  payments: {
    type: [subscriptionPaymentSchema],
    default: []
  },
  
  // Cancellation
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === SUBSCRIPTION_STATUS.ACTIVE && new Date() < this.endDate;
};

// Get days remaining
subscriptionSchema.methods.daysRemaining = function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Indexes
subscriptionSchema.index({ vendorId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
