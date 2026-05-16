# 🚀 Deploy to Netlify - Step by Step Guide

## Prerequisites
- GitHub account with your code pushed
- Netlify account (free)
- Backend deployed separately (Render/Railway)
- Database set up (PlanetScale/Aiven)

---

## 📋 Deployment Steps

### Step 1: Deploy Backend First

Before deploying the frontend to Netlify, you **must** deploy your backend:

**Recommended: Use Render for Backend**
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect repository: `yoga-deepan/ecommerce`
5. Configure:
   - **Name:** `freshmart-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables (see below)
7. Deploy and note your backend URL

**Backend Environment Variables:**
```
PORT=5000
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=ecommerce_db
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-site.netlify.app
```

---

### Step 2: Set Up Database

**Option A: PlanetScale (Recommended - Free MySQL)**
1. Go to https://planetscale.com
2. Create account
3. Create new database: `ecommerce_db`
4. Get connection string
5. Connect and run `backend/schema.sql`

**Option B: Aiven (Free MySQL)**
1. Go to https://aiven.io
2. Create free MySQL service
3. Get connection details
4. Run schema

---

### Step 3: Deploy Frontend to Netlify

#### 3.1 Sign Up / Login
1. Go to https://netlify.com
2. Click "Sign up" or "Log in"
3. Choose "Sign up with GitHub"

#### 3.2 Import Project
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Authorize Netlify to access your repositories
4. Select repository: `yoga-deepan/ecommerce`

#### 3.3 Configure Build Settings

Netlify should auto-detect Vite, but verify these settings:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

**Important:** Make sure the base directory is set to `frontend`!

#### 3.4 Add Environment Variable

Before deploying, add this environment variable:

1. Click "Show advanced"
2. Click "New variable"
3. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com/api`
   
   Replace with your actual backend URL from Step 1!

#### 3.5 Deploy Site

1. Click "Deploy site"
2. Wait for build to complete (2-3 minutes)
3. Note your Netlify URL: `https://random-name.netlify.app`

---

### Step 4: Update Backend CORS

Now that you have your Netlify URL, update your backend:

1. Go back to Render (or your backend host)
2. Update environment variable:
   - **FRONTEND_URL:** `https://your-actual-site.netlify.app`
3. Save and redeploy backend

---

### Step 5: Test Your Deployment

1. Visit your Netlify URL
2. Test these features:
   - ✅ Homepage loads
   - ✅ Products display
   - ✅ Register new account
   - ✅ Login (admin@gmail.com / admin123)
   - ✅ Add to cart
   - ✅ Checkout
   - ✅ View orders
   - ✅ Admin dashboard

---

## 🔧 Troubleshooting

### Issue: 404 on Page Refresh

**Cause:** Missing SPA redirect rule

**Solution:** The `_redirects` file should already be in `frontend/public/` with:
```
/* /index.html 200
```

If missing, create it and redeploy.

---

### Issue: "Server error" on Login/Register

**Cause:** Backend not reachable or CORS issue

**Solutions:**
1. Check `VITE_API_URL` is correct in Netlify environment variables
2. Verify backend is running (visit backend URL)
3. Check `FRONTEND_URL` in backend matches your Netlify URL
4. Check browser console for CORS errors

---

### Issue: Assets (CSS/JS) Not Loading

**Cause:** Incorrect base path

**Solution:** 
- Vite automatically handles this
- Make sure `vite.config.js` doesn't have incorrect `base` setting
- Check browser console for 404 errors on assets

---

### Issue: Build Fails

**Common Causes:**
1. **Node version mismatch**
   - Solution: Set `NODE_VERSION=18` in Netlify environment variables

2. **Missing dependencies**
   - Solution: Make sure all dependencies are in `package.json`

3. **Build command incorrect**
   - Solution: Use `npm run build` (not `npm start`)

4. **Wrong publish directory**
   - Solution: Set to `frontend/dist` (not just `dist`)

---

### Issue: API Calls Return 404

**Cause:** Backend URL incorrect

**Solution:**
1. Check `VITE_API_URL` environment variable
2. Make sure it includes `/api` at the end
3. Example: `https://backend.onrender.com/api` (not just `https://backend.onrender.com`)

---

## 📱 Custom Domain (Optional)

### Add Custom Domain

1. Go to Netlify dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Enter your domain (e.g., `freshmart.com`)
5. Follow DNS configuration instructions
6. Netlify provides free SSL certificate

### Update Backend CORS

After adding custom domain:
1. Update backend `FRONTEND_URL` to your custom domain
2. Redeploy backend

---

## 🔄 Continuous Deployment

Netlify automatically redeploys when you push to GitHub:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Netlify automatically builds and deploys
4. Check deploy status in Netlify dashboard

---

## 📊 Monitoring

### View Deploy Logs

1. Go to Netlify dashboard
2. Click "Deploys"
3. Click on any deploy to see logs
4. Check for errors or warnings

### View Function Logs (if using Netlify Functions)

1. Go to "Functions" tab
2. Click on function name
3. View execution logs

---

## 💰 Pricing

**Netlify Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Custom domains

**Render Free Tier (Backend):**
- ✅ 750 hours/month
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold starts (takes 30s to wake up)

**PlanetScale Free Tier (Database):**
- ✅ 5GB storage
- ✅ 1 billion row reads/month
- ✅ 10 million row writes/month

**Total Cost: $0/month** 🎉

---

## 🎯 Production Checklist

Before going live:

- [ ] Backend deployed and running
- [ ] Database set up with schema
- [ ] Frontend deployed to Netlify
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Test all features work
- [ ] Admin login works
- [ ] Customer registration works
- [ ] Orders can be placed
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (optional)
- [ ] Error monitoring set up (optional)

---

## 📞 Need Help?

If you encounter issues:

1. Check Netlify deploy logs
2. Check browser console for errors
3. Verify all environment variables
4. Test backend API directly
5. Check CORS configuration
6. Review this guide again

---

## 🔗 Useful Links

- **Netlify Docs:** https://docs.netlify.com
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **Render Docs:** https://render.com/docs
- **PlanetScale Docs:** https://planetscale.com/docs

---

**Ready to deploy?** Follow the steps above and your site will be live in 15-20 minutes! 🚀
