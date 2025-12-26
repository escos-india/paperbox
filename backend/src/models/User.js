const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, USER_STATUS } = require('../config/constants');

const addressSchema = new mongoose.Schema({
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  country: { type: String, default: 'India' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    sparse: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: false, // Phone is now optional if email is provided
    unique: true,
    sparse: true,    // Allows null/undefined values to not conflict
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number']
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.BUYER
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.APPROVED // Buyers are auto-approved
  },
  address: {
    type: addressSchema,
    default: () => ({})
  },
  
  // Admin only fields
  password: {
    type: String,
    select: false // Don't include in queries by default
  },
  secretKey: {
    type: String,
    select: false
  },
  
  // Vendor only fields
  businessName: {
    type: String,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true
  },
  razorpayKeyId: {
    type: String,
    select: false // Encrypted, don't expose
  },
  razorpayKeySecret: {
    type: String,
    select: false // Encrypted, don't expose
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  
  // Profile
  avatar: {
    type: String,
    default: ''
  },
  
  // Metadata
  lastLoginAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving (for admin)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.secretKey;
  delete obj.razorpayKeyId;
  delete obj.razorpayKeySecret;
  delete obj.__v;
  return obj;
};

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });

module.exports = mongoose.model('User', userSchema);
