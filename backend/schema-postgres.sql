-- ============================================
-- Online Grocery eCommerce - PostgreSQL Schema
-- ============================================

-- ========================
-- USERS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- PRODUCTS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(100) NOT NULL,
  image VARCHAR(255),
  stock INTEGER DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'piece',
  is_featured SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- ORDERS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20),
  address TEXT NOT NULL,
  city VARCHAR(100),
  pincode VARCHAR(20),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'COD' CHECK (payment_method IN ('COD', 'UPI')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Packed', 'Out for Delivery', 'Delivered')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================
-- ORDER ITEMS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_image VARCHAR(255),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ========================
-- DEFAULT ADMIN USER
-- ========================
-- Password: admin123 (bcrypt hashed)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@gmail.com', '$2a$10$pW.411cXMYYPySGAlnsCAuRg4Z4/dr6TcPgyuu88jYtDyxE.EQzIK', 'admin')
ON CONFLICT (email) DO UPDATE SET role='admin';

-- ========================
-- SAMPLE PRODUCTS
-- ========================
INSERT INTO products (name, description, price, original_price, category, stock, unit, is_featured) VALUES
('Fresh Basmati Rice', 'Premium long-grain basmati rice, aged for perfect aroma and taste.', 89.00, 110.00, 'Grains & Rice', 100, '1 kg', 1),
('Toor Dal (Split Pigeon Pea)', 'High-protein toor dal, freshly processed and cleaned.', 125.00, 140.00, 'Pulses & Lentils', 80, '500 g', 1),
('Aashirvaad Atta', '100% whole wheat atta for soft, nutritious rotis.', 280.00, 310.00, 'Flour & Atta', 60, '5 kg', 1),
('Fresh Tomatoes', 'Farm-fresh red tomatoes, handpicked daily.', 35.00, 50.00, 'Vegetables', 150, '1 kg', 1),
('Onions', 'Fresh red onions sourced directly from farmers.', 28.00, 40.00, 'Vegetables', 200, '1 kg', 0),
('Amul Butter', 'Rich, creamy butter made from pure milk fat.', 55.00, 60.00, 'Dairy & Eggs', 90, '100 g', 1),
('Amul Full Cream Milk', 'Fresh full cream milk, pasteurized and homogenized.', 30.00, 32.00, 'Dairy & Eggs', 120, '500 ml', 0),
('Free Range Eggs', 'Farm-fresh eggs from free-range hens, rich in nutrients.', 90.00, 100.00, 'Dairy & Eggs', 75, '12 pieces', 1),
('Fortune Sunflower Oil', 'Light, healthy sunflower oil for everyday cooking.', 185.00, 210.00, 'Oils & Ghee', 50, '1 L', 0),
('Patanjali Cow Ghee', 'Pure desi cow ghee, traditionally made for rich flavor.', 350.00, 400.00, 'Oils & Ghee', 40, '500 ml', 1),
('Alphonso Mangoes', 'Premium Ratnagiri Alphonso mangoes, the king of fruits.', 250.00, 300.00, 'Fruits', 60, '1 dozen', 1),
('Bananas', 'Fresh, ripe bananas loaded with potassium and energy.', 45.00, 55.00, 'Fruits', 100, '1 dozen', 0),
('Brooke Bond Red Label Tea', 'Aromatic strong tea for a refreshing morning cup.', 120.00, 140.00, 'Beverages', 80, '250 g', 0),
('Nescafe Classic Coffee', 'Smooth, rich instant coffee for the perfect brew.', 195.00, 220.00, 'Beverages', 45, '100 g', 1),
('Parle-G Biscuits', 'India''s favourite glucose biscuits, loved by all ages.', 20.00, 22.00, 'Snacks', 200, '200 g', 0),
('Lay''s Classic Salted Chips', 'Crispy, light potato chips with just the right saltiness.', 20.00, 22.00, 'Snacks', 150, '26 g', 0),
('Colgate Strong Teeth Toothpaste', 'Advanced fluoride formula for stronger teeth and fresher breath.', 89.00, 100.00, 'Personal Care', 100, '200 g', 0),
('Dettol Hand Wash', 'Kills 99.9% germs, keeps hands clean and moisturized.', 75.00, 85.00, 'Personal Care', 80, '250 ml', 0),
('Baby Spinach', 'Tender, organic baby spinach leaves, washed and ready to eat.', 55.00, 70.00, 'Vegetables', 60, '200 g', 0),
('Himalaya Honey', 'Pure, natural honey harvested from the best bee farms.', 175.00, 200.00, 'Grocery', 55, '500 g', 1)
ON CONFLICT DO NOTHING;

-- ========================
-- CREATE INDEXES FOR PERFORMANCE
-- ========================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
