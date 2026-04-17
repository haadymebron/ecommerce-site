const db = require('../config/db');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM Users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a product
// @route   POST /api/admin/products
// @access  Private/Admin
const addProduct = async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;

  if (!name || !price || !description || !image || !category || stock === undefined) {
    return res.status(400).json({ message: 'Please provide all product details' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, description, image, category, stock]
    );

    res.status(201).json({ message: 'Product created', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE Products SET name = ?, price = ?, description = ?, image = ?, category = ?, stock = ? WHERE id = ?',
      [name, price, description, image, category, stock, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Products WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT o.*, u.name as user_name, u.email as user_email FROM Orders o JOIN Users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE Orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUsers,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus
};
