const mongoose = require('mongoose');
const { OTP_TYPES } = require('../config/constants');

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  type: {
    type: String,
    enum: Object.values(OTP_TYPES),
    required: [true, 'OTP type is required']
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - document will be deleted when expired
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

// Check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Check if max attempts exceeded
otpSchema.methods.hasExceededAttempts = function() {
  return this.attempts >= this.maxAttempts;
};

// Increment attempts
otpSchema.methods.incrementAttempts = async function() {
  this.attempts += 1;
  await this.save();
};

// Indexes
otpSchema.index({ phone: 1, type: 1 });

module.exports = mongoose.model('OTP', otpSchema);
