const db = require('../config/db');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const query = `
      SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image, p.stock
      FROM Cart c
      JOIN Products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
    const [cartItems] = await db.query(query, [req.user.id]);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Check if item already in cart
    const [existingItem] = await db.query(
      'SELECT * FROM Cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existingItem.length > 0) {
      // Update quantity
      await db.query(
        'UPDATE Cart SET quantity = quantity + ? WHERE id = ?',
        [quantity || 1, existingItem[0].id]
      );
    } else {
      // Insert new
      await db.query(
        'INSERT INTO Cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, productId, quantity || 1]
      );
    }

    res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE Cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found or unauthorized' });
    }

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM Cart WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found or unauthorized' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
