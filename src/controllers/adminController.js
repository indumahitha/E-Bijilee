const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Usage = require('../models/Usage');
const Bill = require('../models/Bill');
const { generateToken } = require('../utils/jwt');
const { calculateBillAmount } = require('../utils/billing');

// Validation schemas
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  meterId: Joi.string().required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

const addUsageSchema = Joi.object({
  unitsUsed: Joi.number().min(0).required(),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required()
});

const generateBillsSchema = Joi.object({
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required()
});

// Create a new user (admin can create users)
const createUser = async (req, res, next) => {
  try {
    // Validate input
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, password, meterId, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.'
      });
    }

    // Check if meterId already exists
    const existingMeter = await User.findOne({ meterId });
    if (existingMeter) {
      return res.status(400).json({
        success: false,
        message: 'Meter ID already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      meterId,
      role: role || 'user'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        meterId: user.meterId,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all users with pagination
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a user
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users.'
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// Add usage for a user
const addUsage = async (req, res, next) => {
  try {
    // Validate input
    const { error } = addUsageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.params.userId;
    const { unitsUsed, month } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Create or update usage
    const usage = await Usage.findOneAndUpdate(
      { userId, month },
      { unitsUsed },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Usage recorded successfully.',
      data: usage
    });
  } catch (error) {
    next(error);
  }
};

// Generate bills for all users for a given month
const generateBills = async (req, res, next) => {
  try {
    // Validate input
    const { error } = generateBillsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { month } = req.body;

    // Get all users
    const users = await User.find({ role: 'user' });

    let generatedCount = 0;
    const bills = [];

    for (const user of users) {
      // Get usage for the month
      const usage = await Usage.findOne({ userId: user._id, month });

      if (usage) {
        // Calculate bill amount
        const amount = calculateBillAmount(usage.unitsUsed);

        // Create or update bill
        const bill = await Bill.findOneAndUpdate(
          { userId: user._id, month },
          {
            unitsUsed: usage.unitsUsed,
            amount,
            issuedDate: new Date()
          },
          { upsert: true, new: true }
        );

        bills.push(bill);
        generatedCount++;
      }
    }

    res.json({
      success: true,
      message: `Bills generated successfully for ${generatedCount} users.`,
      data: {
        month,
        generatedCount,
        bills
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all bills with filters and pagination
const getBills = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, month, status, userId } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (month) query.month = month;
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const bills = await Bill.find(query)
      .populate('userId', 'name email meterId')
      .sort({ issuedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBills = await Bill.countDocuments(query);

    res.json({
      success: true,
      data: {
        bills,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBills / limit),
          totalBills,
          hasNext: page * limit < totalBills,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get system statistics
const getStatistics = async (req, res, next) => {
  try {
    // Total revenue collected (sum of Paid bills)
    const totalRevenueResult = await Bill.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenueCollected = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // Total outstanding (sum of Unpaid bills)
    const totalOutstandingResult = await Bill.aggregate([
      { $match: { status: 'Unpaid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalOutstanding = totalOutstandingResult.length > 0 ? totalOutstandingResult[0].total : 0;

    // Bill counts
    const totalBillsCount = await Bill.countDocuments();
    const paidBillsCount = await Bill.countDocuments({ status: 'Paid' });
    const unpaidBillsCount = await Bill.countDocuments({ status: 'Unpaid' });

    res.json({
      success: true,
      data: {
        totalRevenueCollected,
        totalOutstanding,
        totalBillsCount,
        paidBillsCount,
        unpaidBillsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  deleteUser,
  addUsage,
  generateBills,
  getBills,
  getStatistics
};
