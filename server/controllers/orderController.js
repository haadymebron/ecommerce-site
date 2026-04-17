const db = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Create Order
    const [orderResult] = await connection.query(
      'INSERT INTO Orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [req.user.id, totalAmount, 'pending']
    );

    const orderId = orderResult.insertId;

    // Create Order Items
    for (let i = 0; i < items.length; i++) {
      await connection.query(
        'INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, items[i].product_id, items[i].quantity, items[i].price]
      );
    }

    // Clear Cart
    await connection.query('DELETE FROM Cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error creating order', error: error.message });
  } finally {
    connection.release();
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    // Get orders
    const [orders] = await db.query(
      'SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Get items for each order
    for (let i = 0; i < orders.length; i++) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image 
         FROM Order_Items oi
         JOIN Products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orders[i].id]
      );
      orders[i].items = items;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};
