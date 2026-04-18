# Railway Deployment Troubleshooting

## ✅ Configuration Files Added

I've added the necessary files for Railway deployment:
1. **railway.json** - Tells Railway where your backend code is
2. **Procfile** - Tells Railway how to start your app
3. **vercel.json** - Already exists for frontend routing

---

## Step 1: Push Updated Code to GitHub

```bash
cd c:\Users\haady\OneDrive\Desktop\ecommerce
git add .
git commit -m "Add Railway configuration files"
git push origin master
```

---

## Step 2: Fix Railway Deployment

### Option A: Redeploy on Railway (Recommended)

1. Go to https://railway.app
2. Find your project
3. Click "Deployments"
4. Click "Redeploy" next to the failed deployment
5. Wait for it to build (~2-3 minutes)

### Option B: Start Fresh (Clean)

1. On Railway dashboard, delete the old project
2. Click "New Project"
3. Select "Deploy from GitHub Repo"
4. Choose your ecommerce-site repo again
5. Click "Deploy"

---

## Step 3: Configure Environment Variables on Railway

After deployment starts, go to **Variables** tab and set:

```
PORT=3000
NODE_ENV=production
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=<Railway-generates-this>
DB_NAME=railway
JWT_SECRET=your-super-secret-jwt-key-that-is-very-long-and-random
```

**Where to get these:**
- PORT: Use 3000 (Railway assigns it)
- DB_HOST: Use `mysql` (Railway internal hostname)
- DB_USER: root (default)
- DB_PASSWORD: Check "Connect" tab for MySQL service
- DB_NAME: Check MySQL "Connect" tab
- JWT_SECRET: Create any random string (32+ characters)

---

## Step 4: Create Database on Railway

1. **If you don't have MySQL service yet:**
   - Go to your Railway project
   - Click "New Service"
   - Select "MySQL"
   - Click "Deploy"

2. **Connect to MySQL and create database:**
   ```bash
   # From your local machine, in the project root:
   git clone https://github.com/haadymebron/ecommerce-site.git
   cd ecommerce-site/server
   npm install
   node initDb.js
   ```

---

## Step 5: Test Deployment

Once Railway shows "Success" ✅:

1. Go to Railway project "Connect" tab
2. Copy your backend URL (looks like: `https://ecommerce-xxx.railway.app`)

3. Test the API:
   ```bash
   # Test health check
   curl https://ecommerce-xxx.railway.app/api
   
   # Should show: "E-commerce API is running..."
   ```

---

## Common Railway Build Errors & Fixes

### Error: "Cannot find module"

**Cause:** Dependencies not installed  
**Fix:**
```bash
cd server
npm install
git add package-lock.json
git push origin master
```

### Error: "No suitable builder found"

**Cause:** Missing railway.json  
**Fix:**
```bash
# Create railway.json in root (already done)
git add railway.json
git push origin master
```

### Error: "ECONNREFUSED: Database connection"

**Cause:** Wrong database credentials  
**Fix:**
1. On Railway, go to MySQL service "Connect" tab
2. Copy exact credentials
3. Update variables on Railway
4. Redeploy

---

## Missing Files Checklist

Before pushing, ensure these files exist:

```
✅ server/server.js
✅ server/package.json
✅ server/routes/authRoutes.js
✅ server/routes/productRoutes.js
✅ server/routes/cartRoutes.js
✅ server/routes/orderRoutes.js
✅ server/routes/adminRoutes.js
✅ server/controllers/authController.js
✅ server/controllers/productController.js
✅ server/controllers/cartController.js
✅ server/controllers/orderController.js
✅ server/controllers/adminController.js
✅ server/middleware/authMiddleware.js
✅ server/config/db.js
✅ server/models/ (folder with model files)
✅ railway.json (root level)
✅ Procfile (in server folder)
```

Verify all files exist:
```bash
ls -la server/
ls server/routes/
ls server/controllers/
ls server/models/
```

---

## If Still Not Working

1. **Check Railway logs:**
   - Go to Railway project
   - Click "Logs" tab
   - Copy error message

2. **Common issues:**
   - Routes folder not tracked: `git add server/routes/`
   - Controllers missing: `git add server/controllers/`
   - Models missing: `git add server/models/`
   - Middleware missing: `git add server/middleware/`
   - Config missing: `git add server/config/`

3. **Force Git to track all:**
   ```bash
   git add -A
   git commit -m "Add all missing files"
   git push origin master
   ```

---

## Next Steps After Backend Works

1. Get backend URL from Railway
2. Update Vercel environment variable:
   - Go to vercel.com → your-frontend-project
   - Settings → Environment Variables
   - Update `VITE_API_URL=https://your-railway-backend.railway.app/api`
   - Redeploy frontend

3. Test full integration:
   - Visit your Vercel frontend URL
   - Try login, add to cart, checkout
   - Should all work!

---

## Quick Summary

```
❌ Problem: Railway deployment failed
✅ Solution: 
   1. Added railway.json + Procfile
   2. Push to GitHub
   3. Redeploy on Railway
   4. Set environment variables
   5. Test API endpoint
```

**Expected time:** 10-15 minutes total  
**Difficulty:** Easy ⭐

You've got this! 🚀
