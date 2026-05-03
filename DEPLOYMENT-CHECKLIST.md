# ✅ Deployment Checklist

## Before Deployment

- [x] Code pushed to GitHub ✅
- [x] .gitignore configured (no .env files) ✅
- [x] Environment variable examples created ✅
- [x] CORS configured for production ✅
- [x] API URL configurable via environment variable ✅

## Deployment Steps

### 1️⃣ Choose Your Platform

**Easiest (Recommended):**
- [ ] Railway - All-in-one solution
  - Sign up: https://railway.app
  - Follow: `QUICK-DEPLOY.md`

**Free Option:**
- [ ] Vercel (Frontend) + Render (Backend) + PlanetScale (Database)
  - Follow: `DEPLOYMENT.md`

### 2️⃣ Deploy Backend

- [ ] Create backend service
- [ ] Set environment variables:
  - [ ] `PORT=5000`
  - [ ] `DB_HOST=your-database-host`
  - [ ] `DB_USER=your-database-user`
  - [ ] `DB_PASSWORD=your-database-password`
  - [ ] `DB_NAME=ecommerce_db`
  - [ ] `JWT_SECRET=your-secret-key`
  - [ ] `FRONTEND_URL=your-frontend-url`
- [ ] Deploy backend
- [ ] Note backend URL: `_______________________`

### 3️⃣ Setup Database

- [ ] Create MySQL database
- [ ] Get connection credentials
- [ ] Connect to database
- [ ] Run `backend/schema.sql`
- [ ] Verify tables created:
  - [ ] users
  - [ ] products
  - [ ] orders
  - [ ] order_items
- [ ] Verify admin user exists
- [ ] Verify 20 sample products loaded

### 4️⃣ Deploy Frontend

- [ ] Create frontend service
- [ ] Set root directory: `frontend`
- [ ] Set build command: `npm run build`
- [ ] Set environment variable:
  - [ ] `VITE_API_URL=your-backend-url/api`
- [ ] Deploy frontend
- [ ] Note frontend URL: `_______________________`

### 5️⃣ Update CORS

- [ ] Go back to backend service
- [ ] Update `FRONTEND_URL` with actual frontend URL
- [ ] Redeploy backend

### 6️⃣ Test Deployment

- [ ] Visit frontend URL
- [ ] Homepage loads correctly
- [ ] Products display
- [ ] Register new account works
- [ ] Login works (test with admin@gmail.com / admin123)
- [ ] Add to cart works
- [ ] Checkout works
- [ ] Order history displays
- [ ] Admin dashboard accessible
- [ ] Admin can manage products
- [ ] Admin can view all orders

### 7️⃣ Post-Deployment

- [ ] Update README with live URLs
- [ ] Test on mobile device
- [ ] Check browser console for errors
- [ ] Monitor backend logs
- [ ] Set up error tracking (optional)
- [ ] Configure custom domain (optional)

## 🎉 Deployment Complete!

**Frontend URL:** `_______________________`
**Backend URL:** `_______________________`
**Admin Login:** admin@gmail.com / admin123

---

## 📊 Monitoring

After deployment, monitor:
- [ ] Server uptime
- [ ] Database connections
- [ ] API response times
- [ ] Error logs
- [ ] User registrations
- [ ] Order completions

---

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Update FRONTEND_URL in backend |
| Database connection failed | Check DB credentials |
| Build failed | Check Node.js version (18+) |
| 404 on API calls | Verify VITE_API_URL is correct |
| Images not loading | Check uploads folder permissions |

---

## 📞 Support

If you encounter issues:
1. Check deployment platform logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check database connection
5. Review CORS settings

---

**Need help?** Open an issue on GitHub or check the full guides:
- `QUICK-DEPLOY.md` - 10-minute Railway deployment
- `DEPLOYMENT.md` - Detailed deployment options
