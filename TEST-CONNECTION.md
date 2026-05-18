# 🔍 TROUBLESHOOTING: Server Error During Login

## ✅ WHAT'S WORKING:

1. ✅ Backend is running: https://ecommerce-backend-qix7.onrender.com
2. ✅ Health check passes: `/api/health` returns OK
3. ✅ Frontend can reach backend (no CORS errors)
4. ✅ Environment variable is set correctly

## ❌ WHAT'S FAILING:

Login endpoint returns "Server error during login"

## 🔍 POSSIBLE CAUSES:

### 1. Database Connection Issue (Most Likely)

The backend might not be connecting to Supabase properly.

**Check Render Logs:**
1. Go to: https://dashboard.render.com
2. Click on `ecommerce-backend`
3. Click "Logs" tab
4. Look for database connection errors

**Common errors:**
- `ECONNREFUSED` - Database not reachable
- `password authentication failed` - Wrong password
- `database "postgres" does not exist` - Wrong database name

---

### 2. DATABASE_URL Format Issue

Supabase connection string needs to be in this exact format:

```
postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres?sslmode=require
```

**Check in Render:**
1. Go to Environment variables
2. Verify `DATABASE_URL` is correct
3. Make sure password is replaced (not `[YOUR-PASSWORD]`)

---

### 3. Admin User Not in Database

The admin user might not exist in Supabase.

**Verify in Supabase:**
1. Go to: https://supabase.com
2. Open your project
3. Click "Table Editor"
4. Click "users" table
5. Check if `admin@gmail.com` exists

---

## 🔧 QUICK FIX STEPS:

### STEP 1: Check Render Logs

1. Go to: https://dashboard.render.com
2. Click `ecommerce-backend`
3. Click "Logs"
4. Look for errors when you try to login
5. **Take a screenshot and share it**

### STEP 2: Verify Database Connection String

1. In Render, go to "Environment" tab
2. Check `DATABASE_URL` value
3. Make sure it looks like:
   ```
   postgresql://postgres:ACTUAL_PASSWORD@db.xxx.supabase.co:5432/postgres
   ```
4. If it still has `[YOUR-PASSWORD]`, replace it with your actual Supabase password

### STEP 3: Test Database Connection

In Supabase:
1. Go to SQL Editor
2. Run this query:
   ```sql
   SELECT * FROM users WHERE email = 'admin@gmail.com';
   ```
3. You should see 1 row with the admin user

---

## 🎯 MOST LIKELY ISSUE:

**The DATABASE_URL in Render still has `[YOUR-PASSWORD]` instead of the actual password.**

### TO FIX:

1. Go to Supabase → Project Settings → Database
2. Copy the connection string
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. Go to Render → Environment variables
5. Update `DATABASE_URL` with the corrected string
6. Redeploy the backend

---

## 📞 NEXT STEPS:

**Please check:**
1. Render backend logs (what error shows when you try to login?)
2. DATABASE_URL in Render (does it have the actual password?)
3. Supabase users table (does admin@gmail.com exist?)

**Share the error from Render logs and I'll help you fix it!**
