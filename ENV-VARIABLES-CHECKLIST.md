# 📋 Vercel Environment Variables Checklist

Copy this checklist when adding environment variables in Vercel:

---

## ✅ Environment Variables to Add

### 1️⃣ SUPABASE_URL
```
Key: SUPABASE_URL
Value: https://[your-project-ref].supabase.co
Secret: No
Environments: Production, Preview, Development
```

### 2️⃣ SUPABASE_ANON_KEY
```
Key: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your anon key)
Secret: No
Environments: Production, Preview, Development
```

### 3️⃣ SUPABASE_SERVICE_ROLE_KEY
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your service_role key)
Secret: ✅ YES (click 🔒 icon)
Environments: Production, Preview, Development
```

### 4️⃣ DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
Secret: ✅ YES (click 🔒 icon)
Environments: Production, Preview, Development
```

### 5️⃣ PORT
```
Key: PORT
Value: 5000
Secret: No
Environments: Production, Preview, Development
```

### 6️⃣ JWT_SECRET
```
Key: JWT_SECRET
Value: [Generate a random 32+ character string]
Secret: ✅ YES (click 🔒 icon)
Environments: Production, Preview, Development
```

### 7️⃣ FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://your-app.vercel.app (update after first deployment)
Secret: No
Environments: Production, Preview, Development
```

### 8️⃣ VITE_API_URL
```
Key: VITE_API_URL
Value: /api
Secret: No
Environments: Production, Preview, Development
```

---

## 🔑 How to Get Supabase Values

1. **SUPABASE_URL**: 
   - Supabase Dashboard → Settings → API → Project URL

2. **SUPABASE_ANON_KEY**: 
   - Supabase Dashboard → Settings → API → Project API keys → anon public

3. **SUPABASE_SERVICE_ROLE_KEY**: 
   - Supabase Dashboard → Settings → API → Project API keys → service_role

4. **DATABASE_URL**: 
   - Supabase Dashboard → Settings → Database → Connection string → URI

---

## 🎲 Generate JWT_SECRET

Use one of these methods:

**Option 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated string

**Option 3: Manual**
- Use a password manager to generate a 32+ character random string

---

## ⚠️ Important Notes

- Mark sensitive values as **Secret** (🔒 icon) in Vercel
- Apply to **All environments** (Production, Preview, Development)
- After adding all variables, click **Deploy**
- Update `FRONTEND_URL` after first deployment and redeploy

---

## ✅ Verification

After deployment, test:
- ✅ `https://your-app.vercel.app/api` → Backend working
- ✅ `https://your-app.vercel.app/api/test-db` → Database connected
- ✅ `https://your-app.vercel.app` → Frontend loads

---

**Total Variables: 8**  
**Secret Variables: 3** (SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, JWT_SECRET)
