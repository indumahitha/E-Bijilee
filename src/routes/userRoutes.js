const express = require('express');
const { getProfile, updateProfile, getBills, payBill } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');

const router = express.Router();

// All user routes require authentication and user role
router.use(authMiddleware);
router.use(roleMiddleware('user'));

// GET /api/user/profile
router.get('/profile', getProfile);

// PUT /api/user/profile
router.put('/profile', updateProfile);

// GET /api/user/bills
router.get('/bills', getBills);

// POST /api/user/pay/:billId
router.post('/pay/:billId', payBill);

module.exports = router;
