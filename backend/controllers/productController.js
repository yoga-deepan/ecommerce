const db = require('../db');
const path = require('path');
const fs = require('fs');

// Get all products with optional search/filter
const getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, featured } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }

    query += ' ORDER BY created_at DESC';

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(rows.map((r) => r.category));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};

// Create product (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, category, stock, unit, is_featured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required.' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO products (name, description, price, original_price, category, image, stock, unit, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || '',
        parseFloat(price),
        original_price ? parseFloat(original_price) : null,
        category,
        image,
        parseInt(stock) || 0,
        unit || 'piece',
        is_featured === 'true' || is_featured === '1' ? 1 : 0,
      ]
    );

    const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Product created successfully.', product: newProduct[0] });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Failed to create product.' });
  }
};

// Update product (Admin)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, category, stock, unit, is_featured } = req.body;
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Product not found.' });

    let image = existing[0].image;
    if (req.file) {
      // Delete old image if exists
      if (image) {
        const oldPath = path.join(__dirname, '..', image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image = `/uploads/${req.file.filename}`;
    }

    await db.query(
      `UPDATE products SET name=?, description=?, price=?, original_price=?, category=?, image=?, stock=?, unit=?, is_featured=?
       WHERE id=?`,
      [
        name,
        description || '',
        parseFloat(price),
        original_price ? parseFloat(original_price) : null,
        category,
        image,
        parseInt(stock) || 0,
        unit || 'piece',
        is_featured === 'true' || is_featured === '1' ? 1 : 0,
        id,
      ]
    );

    const [updated] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product updated successfully.', product: updated[0] });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Failed to update product.' });
  }
};

// Delete product (Admin)
const deleteProduct = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Product not found.' });

    // Delete image file if exists
    if (existing[0].image) {
      const imgPath = path.join(__dirname, '..', existing[0].image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Failed to delete product.' });
  }
};

module.exports = { getAllProducts, getProductById, getCategories, createProduct, updateProduct, deleteProduct };
