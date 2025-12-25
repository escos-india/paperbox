const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 day'],
    default: 30 // 30 days = monthly
  },
  features: [{
    type: String,
    trim: true
  }],
  maxProducts: {
    type: Number,
    required: true,
    default: 10
  },
  commissionRate: {
    type: Number,
    default: 0, // Percentage commission on sales
    min: 0,
    max: 100
  },
  priority: {
    type: Number,
    default: 0 // For sorting plans
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
subscriptionPlanSchema.index({ isActive: 1, priority: -1 });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
