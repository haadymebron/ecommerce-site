const db = require('../config/db');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT p.*, u.name as seller_name FROM Products p LEFT JOIN Users u ON p.seller_id = u.id';
    let params = [];
    
    // Add filtering
    if (category || search) {
      query += ' WHERE';
      let conditions = [];
      if (category) {
        conditions.push(' p.category = ?');
        params.push(category);
      }
      if (search) {
        conditions.push(' p.name LIKE ?');
        params.push(`%${search}%`);
      }
      query += conditions.join(' AND ');
    }
    
    query += ' ORDER BY p.created_at DESC';

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
// @desc    Create a product (for users to sell)
// @route   POST /api/products
// @access  Private
const createUserProduct = async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;

  if (!name || !price || !description || !image || !category || stock === undefined) {
    return res.status(400).json({ message: 'Please provide all product details' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Products (name, price, description, image, category, stock, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, price, description, image, category, stock, req.user.id]
    );

    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT p.*, u.name as seller_name FROM Products p LEFT JOIN Users u ON p.seller_id = u.id WHERE p.id = ?', [req.params.id]);
    
    if (products.length > 0) {
      res.json(products[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createUserProduct,
};
