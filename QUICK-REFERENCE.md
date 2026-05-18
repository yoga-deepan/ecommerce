# ⚡ Quick Reference Card

## 🎯 Your Mission
Deploy your eCommerce app to Vercel with Supabase database in ~20 minutes.

---

## 📚 Which Guide to Use?

### 🚀 **Want to deploy NOW?**
👉 Open: **`DEPLOY-NOW.md`**
- Step-by-step instructions
- Copy-paste ready
- Fastest path to deployment

### 📖 **Want detailed explanation?**
👉 Open: **`VERCEL-SUPABASE-SETUP.md`**
- Complete architecture overview
- Troubleshooting guide
- Security best practices

### 📋 **Need environment variables list?**
👉 Open: **`ENV-VARIABLES-CHECKLIST.md`**
- All 8 variables with examples
- Where to find each value
- How to generate secrets

### 📊 **Want to see what changed?**
👉 Open: **`DEPLOYMENT-SUMMARY.md`**
- Files created/modified
- Architecture diagram
- Deployment checklist

---

## ⚡ Super Quick Start (TL;DR)

1. **Get Supabase credentials** (5 min)
   - Project URL, anon key, service_role key, DATABASE_URL

2. **Import database schema** (2 min)
   - Supabase → SQL Editor → Run `backend/schema-postgres.sql`

3. **Add 8 environment variables in Vercel** (5 min)
   - See `ENV-VARIABLES-CHECKLIST.md` for exact values

4. **Click Deploy** (3-5 min)
   - Wait for deployment to complete

5. **Update FRONTEND_URL and redeploy** (2 min)
   - Add your Vercel URL to FRONTEND_URL variable

6. **Test your app** (2 min)
   - Visit your Vercel URL

**Total: ~20 minutes** ⏱️

---

## 🔑 8 Environment Variables Needed

Quick copy-paste format for Vercel:

```
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [SECRET]
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres [SECRET]
PORT=5000
JWT_SECRET=[generate-random-32-chars] [SECRET]
FRONTEND_URL=https://your-app.vercel.app
VITE_API_URL=/api
```

**3 variables must be marked as SECRET** 🔒

---

## 🧪 Test URLs After Deployment

```
✅ Backend:     https://your-app.vercel.app/api
✅ Database:    https://your-app.vercel.app/api/test-db
✅ Products:    https://your-app.vercel.app/api/products
✅ Frontend:    https://your-app.vercel.app
```

---

## 📁 Key Files Created

```
backend/api/index.js              ← Serverless entry point
backend/config/supabase.js        ← Supabase client
vercel.json                       ← Vercel configuration
frontend/.env.production          ← Frontend API URL
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Deployment fails | Check Vercel logs, verify all 8 env vars |
| Database error | Verify DATABASE_URL, check Supabase is active |
| CORS error | Update FRONTEND_URL, redeploy |
| 404 on /api | Check vercel.json routes, verify backend/api/index.js exists |
| Blank frontend | Check browser console, verify VITE_API_URL=/api |

---

## 🎯 Success Criteria

After deployment, you should be able to:
- ✅ Visit your Vercel URL and see the frontend
- ✅ Register a new user account
- ✅ Login with credentials
- ✅ View products list
- ✅ Add items to cart
- ✅ Place an order
- ✅ View order history

---

## 📞 Where to Get Help

1. **Deployment logs**: Vercel Dashboard → Deployments → Click deployment → View logs
2. **Browser console**: F12 → Console tab
3. **Supabase logs**: Supabase Dashboard → Logs
4. **Documentation**: See `VERCEL-SUPABASE-SETUP.md` troubleshooting section

---

## 🚀 Ready? Start Here:

👉 **Open `DEPLOY-NOW.md` and follow the steps!**

---

**Good luck with your deployment! 🎉**
