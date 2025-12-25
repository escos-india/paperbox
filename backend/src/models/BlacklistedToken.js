const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Automatically delete documents after 7 days (matching JWT expiry)
  }
});

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
