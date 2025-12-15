const Joi = require('joi');
const User = require('../models/User');
const Bill = require('../models/Bill');

// Validation schema for profile update
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  meterId: Joi.string()
});

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        meterId: user.meterId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    // Validate input
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, meterId } = req.body;
    const userId = req.user._id;

    // Check if meterId is already taken by another user
    if (meterId) {
      const existingUser = await User.findOne({ meterId, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Meter ID is already taken.'
        });
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (meterId) updateData.meterId = meterId;
    updateData.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Get user's bills
const getBills = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, month } = req.query;

    // Build query
    const query = { userId };
    if (status) query.status = status;
    if (month) query.month = month;

    const bills = await Bill.find(query).sort({ issuedDate: -1 });

    res.json({
      success: true,
      data: bills
    });
  } catch (error) {
    next(error);
  }
};

// Pay a bill
const payBill = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const billId = req.params.billId;
    const { paymentMode } = req.body;

    // Find bill
    const bill = await Bill.findOne({ _id: billId, userId });
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found.'
      });
    }

    if (bill.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Bill is already paid.'
      });
    }

    // Update bill
    bill.status = 'Paid';
    bill.paidDate = new Date();
    await bill.save();

    res.json({
      success: true,
      message: 'Bill paid successfully.',
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getBills,
  payBill
};
