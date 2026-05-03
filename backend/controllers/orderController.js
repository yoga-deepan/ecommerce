const db = require('../db');

// Place order (Customer)
const placeOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      pincode,
      payment_method,
      notes,
      items, // [{ product_id, quantity, price }]
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item.' });
    }

    // Calculate total
    let total_amount = 0;
    for (const item of items) {
      total_amount += item.price * item.quantity;
    }
    // Add delivery charge if under 500
    const delivery_charge = total_amount < 500 ? 40 : 0;
    total_amount += delivery_charge;

    // Insert order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, address, city, pincode, total_amount, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        customer_name,
        customer_email,
        customer_phone || null,
        address,
        city || null,
        pincode || null,
        total_amount,
        payment_method || 'COD',
        notes || null,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      // Get product details
      const [products] = await conn.query('SELECT name, image FROM products WHERE id = ?', [item.product_id]);
      const product = products[0];
      const subtotal = item.price * item.quantity;

      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, product ? product.name : 'Unknown', product ? product.image : null, item.quantity, item.price, subtotal]
      );

      // Update stock
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?', [
        item.quantity,
        item.product_id,
        item.quantity,
      ]);
    }

    await conn.commit();

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId,
      total_amount,
    });
  } catch (err) {
    await conn.rollback();
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Failed to place order.' });
  } finally {
    conn.release();
  }
};

// Get my orders (Customer)
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Get items for each order
    for (const order of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error('Get my orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    for (const order of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order status updated successfully.', status });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Failed to update order status.' });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id,
    ]);
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found.' });

    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    orders[0].items = items;

    res.json(orders[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order.' });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderById };
