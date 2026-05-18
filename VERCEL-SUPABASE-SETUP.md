# 🚀 Vercel + Supabase Deployment Guide

## Architecture Overview
- **Frontend**: Vercel (React/Vite)
- **Backend**: Vercel Serverless (Express API)
- **Database**: Supabase (PostgreSQL)

---

## 📋 STEP 1: Get Supabase Database Keys

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API** (left sidebar)
4. Copy these 3 values:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role** key (secret, starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

5. Also get your **Database Connection String**:
   - Go to **Settings** → **Database**
   - Copy the **Connection string** (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

---

## 🔧 STEP 2: Add Environment Variables in Vercel

In your Vercel deployment screen, scroll to **Environment Variables** section and add these **EXACT** variables:

### Required Environment Variables:

| Key | Value | Secret? |
|-----|-------|---------|
| `SUPABASE_URL` | Your Supabase Project URL | No |
| `SUPABASE_ANON_KEY` | Your anon public key | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key | ✅ Yes (click 🔒) |
| `DATABASE_URL` | Your PostgreSQL connection string | ✅ Yes (click 🔒) |
| `PORT` | `5000` | No |
| `JWT_SECRET` | Generate a random string (32+ chars) | ✅ Yes (click 🔒) |
| `FRONTEND_URL` | Leave empty for now (will update after deploy) | No |
| `VITE_API_URL` | `/api` | No |

### How to add:
1. Click **Add** for each variable
2. Enter the **Key** name exactly as shown
3. Paste the **Value**
4. For sensitive values (marked ✅), click the 🔒 icon to mark as secret
5. Select **All** environments (Production, Preview, Development)

---

## 🗄️ STEP 3: Set Up Database Schema in Supabase

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `backend/schema-postgres.sql`
4. Click **Run** to create all tables

---

## 🚀 STEP 4: Deploy to Vercel

1. Click **Deploy** button in Vercel
2. Wait for deployment to complete (2-5 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`

---

## ✅ STEP 5: Update Frontend URL

After deployment:
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `FRONTEND_URL` variable
3. Update value to: `https://your-app.vercel.app` (your actual Vercel URL)
4. Click **Save**
5. Go to **Deployments** tab → Click **Redeploy** on latest deployment

---

## 🧪 STEP 6: Test Your Deployment

Test these endpoints:

### 1. Backend Health Check
```
https://your-app.vercel.app/api
```
Should return:
```json
{
  "message": "Backend working 🚀",
  "endpoints": { ... }
}
```

### 2. Database Connection Test
```
https://your-app.vercel.app/api/test-db
```
Should return:
```json
{
  "success": true,
  "message": "Database connected!",
  "timestamp": "2024-..."
}
```

### 3. Products API
```
https://your-app.vercel.app/api/products
```
Should return list of products (or empty array if no data)

### 4. Frontend
```
https://your-app.vercel.app
```
Should load your React app

---

## 🔍 Troubleshooting

### ❌ "Database connection failed"
- Check `DATABASE_URL` is correct in Vercel environment variables
- Verify Supabase project is active
- Make sure you ran the schema SQL in Supabase

### ❌ "CORS error" in browser
- Update `FRONTEND_URL` environment variable with your Vercel URL
- Redeploy after updating

### ❌ "Module not found" errors
- Make sure `@supabase/supabase-js` is in `backend/package.json` dependencies
- Check that `backend/api/index.js` exists
- Verify `vercel.json` points to correct paths

### ❌ API routes return 404
- Check `vercel.json` routes configuration
- Verify `backend/api/index.js` exports the Express app
- Make sure all route files exist in `backend/routes/`

---

## 📁 Files Created/Modified

✅ `backend/api/index.js` - Serverless Express entry point  
✅ `backend/config/supabase.js` - Supabase client configuration  
✅ `backend/.env.production` - Production environment template  
✅ `vercel.json` - Vercel deployment configuration  
✅ `frontend/.env.production` - Frontend API URL configuration  

---

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Database schema imported
- [ ] All environment variables added in Vercel
- [ ] Deployment successful
- [ ] `/api` endpoint works
- [ ] `/api/test-db` shows database connected
- [ ] Frontend loads correctly
- [ ] Can register/login users
- [ ] Can view products
- [ ] Can place orders

---

## 📞 Need Help?

If deployment fails:
1. Check Vercel deployment logs (click on failed deployment)
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Make sure Supabase database is accessible

---

## 🔐 Security Notes

- Never commit `.env` files to Git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (mark as secret in Vercel)
- Use strong `JWT_SECRET` (32+ random characters)
- Enable Row Level Security (RLS) in Supabase for production

---

**Your app will be live at**: `https://your-app.vercel.app` 🎉
