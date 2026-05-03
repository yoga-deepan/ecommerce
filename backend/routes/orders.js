const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderById } = require('../controllers/orderController');
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

// Customer routes
router.post('/', verifyToken, placeOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/my/:id', verifyToken, getOrderById);

// Admin routes
router.get('/all', verifyToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
