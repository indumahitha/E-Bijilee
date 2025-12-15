const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  unitsUsed: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/ // Format: YYYY-MM
  }
}, {
  timestamps: true
});

// Compound index for userId and month to ensure uniqueness
usageSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Usage', usageSchema);
