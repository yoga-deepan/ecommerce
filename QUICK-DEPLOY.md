# ⚡ Quick Deploy Guide

## 🚀 Deploy in 10 Minutes with Railway (Easiest)

### Step 1: Sign Up
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `yoga-deepan/JK-`
4. Railway will detect your project

### Step 3: Add MySQL Database
1. In your project, click "New"
2. Select "Database" → "Add MySQL"
3. Railway will automatically create and connect the database

### Step 4: Configure Backend Service
1. Click on your backend service
2. Go to "Variables" tab
3. Add these environment variables:
   ```
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.up.railway.app
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```
4. Railway auto-configures database variables (DATABASE_URL)

### Step 5: Update Database Connection (if needed)
If Railway provides `DATABASE_URL`, update `backend/db.js` to parse it:
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  // Parse Railway's DATABASE_URL
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  // Use individual environment variables
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

module.exports = pool;
```

### Step 6: Run Database Schema
1. Click on MySQL database service
2. Go to "Connect" tab
3. Use the provided connection details
4. Run the SQL from `backend/schema.sql`

**OR** use Railway's built-in query editor:
1. Click "Query" tab
2. Paste contents of `backend/schema.sql`
3. Execute

### Step 7: Deploy Frontend
1. In the same project, click "New"
2. Select "GitHub Repo" → Same repo
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```

### Step 8: Update CORS
1. Go back to backend service
2. Update `FRONTEND_URL` variable with your actual frontend URL
3. Railway will auto-redeploy

### Step 9: Test Your App! 🎉
1. Click on frontend service
2. Click "Open App" or copy the URL
3. Test login with: `admin@gmail.com` / `admin123`

---

## 🌐 Alternative: Vercel + Render (Free)

### Deploy Backend on Render

1. **Sign up at https://render.com**

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub: `yoga-deepan/JK-`
   - Settings:
     - **Name:** freshmart-backend
     - **Root Directory:** backend
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

3. **Add Environment Variables:**
   ```
   PORT=5000
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=ecommerce_db
   JWT_SECRET=your-secret-key
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Get a Free MySQL Database:**
   - Option A: PlanetScale (https://planetscale.com) - Free MySQL
   - Option B: Aiven (https://aiven.io) - Free MySQL
   - Option C: FreeSQLDatabase (https://www.freesqldatabase.com)

### Deploy Frontend on Vercel

1. **Sign up at https://vercel.com**

2. **Import Project**
   - Click "Add New" → "Project"
   - Import `yoga-deepan/JK-`
   - Settings:
     - **Framework:** Vite
     - **Root Directory:** frontend
     - **Build Command:** `npm run build`
     - **Output Directory:** dist

3. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy!**

---

## 📱 Test Your Deployment

1. Visit your frontend URL
2. Try registering a new account
3. Login with admin: `admin@gmail.com` / `admin123`
4. Browse products
5. Add items to cart
6. Place an order

---

## 🐛 Troubleshooting

### "Server error during login"
- Check backend logs
- Verify database is connected
- Ensure schema.sql was run

### "CORS error"
- Update `FRONTEND_URL` in backend environment variables
- Redeploy backend

### "Cannot connect to database"
- Verify database credentials
- Check if database service is running
- Ensure database name exists

### Build fails
- Check Node.js version (use 18.x or higher)
- Verify all dependencies are in package.json
- Check build logs for specific errors

---

## 💰 Cost Breakdown

| Platform | Free Tier | Limits |
|----------|-----------|--------|
| Railway | $5/month credit | 500 hours, 512MB RAM |
| Vercel | Free forever | 100GB bandwidth |
| Render | Free | 750 hours/month |
| PlanetScale | Free | 5GB storage, 1 billion reads |

**Total Cost: $0-5/month** 🎉

---

## 🎯 Recommended Setup

**For Learning/Portfolio:**
- Railway (all-in-one, easiest)

**For Production:**
- Vercel (frontend) + Render (backend) + PlanetScale (database)

---

Need help? Check the full DEPLOYMENT.md guide!
