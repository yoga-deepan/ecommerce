# 🛒 FreshMart — Online Grocery eCommerce

A full-stack online grocery store with a modern React frontend, Express backend, and MySQL database.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ (https://nodejs.org)
- **MySQL Server** (via MySQL Installer — NOT XAMPP)
- **MySQL Workbench** (recommended)

---

## 🗄️ Step 1 — Set Up Database

1. Open **MySQL Workbench** and connect to your local server.
2. Open a new query tab and paste the contents of `backend/schema.sql`.
3. Run the script (**Ctrl+Shift+Enter** or click ⚡).
4. This creates:
   - Database: `ecommerce_db`
   - Tables: `users`, `products`, `orders`, `order_items`
   - Default admin user
   - 20 sample products

---

## ⚙️ Step 2 — Configure Backend

1. Open `backend/.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password   ← CHANGE THIS
DB_NAME=ecommerce_db
JWT_SECRET=grocery_jwt_secret_key_2024_super_secure
```
2. Replace `your_mysql_password` with your actual MySQL root password.

---

## 🖥️ Step 3 — Start Backend

```bash
cd backend
npm install
node server.js
```

You should see:
```
🚀 Server running on http://localhost:5000
📦 API ready at http://localhost:5000/api
```

---

## 🎨 Step 4 — Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:5173**

---

## 🔐 Login Credentials

### Admin
```
Email:    admin@gmail.com
Password: admin123
```
Admin Panel: http://localhost:5173/admin

### Customer (register any new account, or use demo)
```
Email:    customer@gmail.com
Password: customer123
```
*(Add this user manually via the Register page or MySQL)*

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET  | /api/auth/profile | Get current user (auth required) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | /api/products | Get all products (supports ?search, ?category, ?minPrice, ?maxPrice, ?featured) |
| GET  | /api/products/categories | Get all categories |
| GET  | /api/products/:id | Get single product |
| POST | /api/products | Create product (Admin only) |
| PUT  | /api/products/:id | Update product (Admin only) |
| DELETE | /api/products/:id | Delete product (Admin only) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place order (Customer) |
| GET  | /api/orders/my | Get my orders (Customer) |
| GET  | /api/orders/my/:id | Get single order (Customer) |
| GET  | /api/orders/all | Get all orders (Admin) |
| PUT  | /api/orders/:id/status | Update order status (Admin) |

---

## 📂 Project Structure

```
ecommerce-project/
│
├── backend/
│   ├── server.js              ← Express app entry point
│   ├── db.js                  ← MySQL connection pool
│   ├── schema.sql             ← Database setup script
│   ├── .env                   ← Environment variables
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── orders.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   │
│   ├── middleware/
│   │   ├── auth.js            ← JWT verification
│   │   └── admin.js           ← Admin role check
│   │
│   └── uploads/               ← Product images stored here
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    │
    └── src/
        ├── main.jsx
        ├── App.jsx             ← Routes & layout
        ├── index.css           ← Design system & global styles
        │
        ├── api/
        │   └── axios.js        ← Axios config with JWT interceptor
        │
        ├── context/
        │   ├── AuthContext.jsx ← User auth state
        │   └── CartContext.jsx ← Shopping cart state
        │
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProductCard.jsx
        │
        └── pages/
            ├── Home.jsx
            ├── Shop.jsx
            ├── ProductDetails.jsx
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── MyOrders.jsx
            ├── OrderSuccess.jsx
            └── admin/
                └── AdminDashboard.jsx
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router DOM v6 |
| Styling | Bootstrap 5, Custom CSS (CSS Variables) |
| Icons | FontAwesome 6 |
| Notifications | React Toastify |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Auth | JWT (jsonwebtoken), Bcrypt |
| Database | MySQL 8+, mysql2 |
| File Upload | Multer |

---

## 🌈 Color Theme

| Token | Value | Usage |
|-------|-------|-------|
| --primary | #1a7a3c | Main green |
| --primary-dark | #145e2e | Darker green |
| --accent | #f97316 | Orange highlights |
| --bg | #f4f6f4 | Page background |

---

## 🛠️ Troubleshooting

**MySQL connection error:**
- Make sure MySQL Server is running
- Double-check password in `backend/.env`
- Verify `ecommerce_db` exists (run schema.sql first)

**Port conflicts:**
- Backend uses port `5000` — make sure nothing else runs on it
- Frontend uses port `5173`

**Images not showing:**
- Make sure `backend/uploads/` folder exists (created automatically)
- The backend must be running for images to serve

**CORS errors:**
- Frontend and backend must both be running
- Frontend should be at http://localhost:5173
- Backend should be at http://localhost:5000

---

## 📱 Features Summary

### Customer
- ✅ Register / Login / Logout
- ✅ Browse products with search & category filters
- ✅ Product detail page
- ✅ Add to cart, update quantity, remove items
- ✅ Checkout with COD / UPI payment
- ✅ Order tracking with progress stepper
- ✅ View order history

### Admin
- ✅ Dashboard with stats (products, orders, revenue)
- ✅ Add / Edit / Delete products with image upload
- ✅ View all orders from all customers
- ✅ Update delivery status (Pending → Packed → Out for Delivery → Delivered)

---

© 2024 FreshMart. Built with ❤️
