const express = require('express');
const {
  createUser,
  getUsers,
  deleteUser,
  addUsage,
  generateBills,
  getBills,
  getStatistics
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// POST /api/admin/users
router.post('/users', createUser);

// GET /api/admin/users
router.get('/users', getUsers);

// DELETE /api/admin/users/:userId
router.delete('/users/:userId', deleteUser);

// POST /api/admin/usage/:userId
router.post('/usage/:userId', addUsage);

// POST /api/admin/generate-bills
router.post('/generate-bills', generateBills);

// GET /api/admin/bills
router.get('/bills', getBills);

// GET /api/admin/statistics
router.get('/statistics', getStatistics);

module.exports = router;
