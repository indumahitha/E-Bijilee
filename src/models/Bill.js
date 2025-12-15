const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/ // Format: YYYY-MM
  },
  unitsUsed: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid'
  },
  issuedDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound index for userId and month to ensure uniqueness
billSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Bill', billSchema);
