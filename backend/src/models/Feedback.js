const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    trim: true
  }],
  
  // Moderation
  isModerated: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  moderatorNote: String,
  
  // Vendor response
  vendorResponse: {
    type: String,
    trim: true,
    maxlength: [500, 'Response cannot exceed 500 characters']
  },
  vendorRespondedAt: Date,
  
  // Helpful votes
  helpfulVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews for same order+product
feedbackSchema.index({ orderId: 1, productId: 1, buyerId: 1 }, { unique: true });

// Indexes for queries
feedbackSchema.index({ productId: 1, isVisible: 1 });
feedbackSchema.index({ vendorId: 1 });
feedbackSchema.index({ buyerId: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
