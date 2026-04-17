const express = require('express');
const router = express.Router();
const { getUsers, addProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All routes here are protected and require admin role
router.use(protect, admin);

router.route('/users').get(getUsers);
router.route('/products').post(addProduct);
router.route('/products/:id').put(updateProduct).delete(deleteProduct);
router.route('/orders').get(getOrders);
router.route('/orders/:id/status').put(updateOrderStatus);

module.exports = router;
