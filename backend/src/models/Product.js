const mongoose = require('mongoose');
const { CATEGORIES, CONDITIONS } = require('../config/constants');

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor ID is required']
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  brand: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: Object.values(CATEGORIES),
    required: [true, 'Category is required']
  },
  condition: {
    type: String,
    enum: Object.values(CONDITIONS),
    required: [true, 'Condition is required']
  },
  reasonForSelling: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 1
  },
  images: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Stats
  views: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  
  // Ratings (aggregated from feedback)
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for availability status
productSchema.virtual('availability').get(function() {
  if (this.quantity === 0) return 'Out of Stock';
  if (this.quantity < 5) return 'Limited Stock';
  return 'In Stock';
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Indexes
productSchema.index({ vendorId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ condition: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1, isFeatured: -1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
