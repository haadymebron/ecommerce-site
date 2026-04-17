const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createUserProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, createUserProduct);

router.route('/:id').get(getProductById);

module.exports = router;
