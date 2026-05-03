# 🚀 Deployment Guide - FreshMart eCommerce

## Deployment Options

### Option 1: Vercel + Render (Recommended - FREE)

#### Step 1: Deploy Backend on Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create MySQL Database**
   - Click "New +" → "PostgreSQL" (or use external MySQL like PlanetScale)
   - Note: Render doesn't offer free MySQL, so we'll use PostgreSQL or external MySQL
   
   **Alternative: Use PlanetScale (Free MySQL)**
   - Go to https://planetscale.com
   - Create free database
   - Get connection string

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `yoga-deepan/JK-`
   - Configure:
     - **Name:** `freshmart-backend`
     - **Root Directory:** `backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
   
4. **Add Environment Variables**
   ```
   PORT=5000
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=ecommerce_db
   JWT_SECRET=grocery_jwt_secret_key_2024_super_secure
   ```

5. **Run Database Schema**
   - Connect to your database
   - Run the `backend/schema.sql` file

#### Step 2: Deploy Frontend on Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import `yoga-deepan/JK-`
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **Update API URL**
   - Before deploying, update `frontend/src/api/axios.js`
   - Change `baseURL` to your Render backend URL

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

---

### Option 2: Netlify (Frontend + Backend Functions)

1. **Deploy Frontend**
   - Go to https://netlify.com
   - Connect GitHub repo
   - Set build settings:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `frontend/dist`

2. **Backend Options:**
   - Use Netlify Functions (requires refactoring)
   - Or deploy backend separately on Render/Railway

---

### Option 3: Railway (Full Stack - EASIEST)

Railway can host both frontend and backend together:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `yoga-deepan/JK-`

3. **Add MySQL Database**
   - Click "New" → "Database" → "Add MySQL"
   - Railway will auto-configure connection

4. **Configure Backend Service**
   - Add environment variables
   - Set start command: `cd backend && npm install && npm start`

5. **Configure Frontend Service**
   - Create new service from same repo
   - Set root directory: `frontend`
   - Build command: `npm run build`
   - Start command: `npm run preview`

---

### Option 4: Heroku (Paid but Simple)

Heroku no longer has a free tier, but it's very reliable:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   heroku create freshmart-backend
   heroku addons:create jawsdb:kitefin  # MySQL addon
   git push heroku main
   ```

3. **Deploy Frontend**
   - Use Vercel or Netlify for frontend
   - Update API URL to Heroku backend

---

### Option 5: AWS (Advanced)

For production-grade deployment:

- **Frontend:** AWS S3 + CloudFront
- **Backend:** AWS EC2 or Elastic Beanstalk
- **Database:** AWS RDS (MySQL)

---

## 📝 Pre-Deployment Checklist

### Backend Changes Needed:

1. **Update CORS settings** in `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend-domain.vercel.app'],
     credentials: true
   }));
   ```

2. **Add production database** (not localhost)

3. **Secure environment variables**

### Frontend Changes Needed:

1. **Update API URL** in `frontend/src/api/axios.js`:
   ```javascript
   const API = axios.create({
     baseURL: 'https://your-backend-url.onrender.com/api'
   });
   ```

2. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

---

## 🔒 Security Recommendations

1. **Never commit `.env` files** ✅ (already in .gitignore)
2. **Use environment variables** for all secrets
3. **Enable HTTPS** (automatic on Vercel/Render)
4. **Add rate limiting** to prevent abuse
5. **Validate all inputs** on backend
6. **Use strong JWT secrets**

---

## 🌐 Free Hosting Summary

| Service | Frontend | Backend | Database | Cost |
|---------|----------|---------|----------|------|
| Vercel + Render | ✅ | ✅ | ❌ | Free |
| Vercel + PlanetScale | ✅ | ✅ | ✅ | Free |
| Railway | ✅ | ✅ | ✅ | $5/month |
| Netlify + Render | ✅ | ✅ | ❌ | Free |

---

## 📞 Need Help?

If you encounter issues during deployment, check:
- Build logs in your hosting platform
- Environment variables are set correctly
- Database connection is working
- CORS is configured properly

---

**Recommended for Beginners:** Start with **Railway** - it's the simplest all-in-one solution!
