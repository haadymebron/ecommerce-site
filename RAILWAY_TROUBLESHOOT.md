# Railway Deployment - Troubleshooting & Fixes

## 🔴 Deployment Failed - Here's the Fix

### Most Common Cause: Missing Database Connection

Railway fails to deploy when:
1. **Database not initialized** - MySQL service created but empty
2. **Wrong credentials** - Environment variables don't match
3. **Port conflict** - PORT variable not set
4. **Node.js version** - Incompatibility with dependencies

---

## ✅ Quick Fix (5 minutes)

### Step 1: Reset Railway Project
1. Go to https://railway.app → Your Project
2. Click **"Settings"** → **"Danger Zone"**
3. Click **"Delete Project"** (don't worry, we'll recreate it)
4. Confirm deletion

### Step 2: Create Fresh Deployment
1. Click **"New Project"**
2. Select **"Deploy from GitHub Repo"**
3. Choose `ecommerce-site` repository
4. **IMPORTANT:** Select root directory: `.` (dot)
5. Click **"Deploy"**

### Step 3: Add Services
Once Railway starts building:
1. Click **"Add Service"**
2. Select **"GitHub"** → Choose repository again
3. Click **"Add Service"** again
4. Select **"MySQL"** (or "Postgres")
5. Wait for MySQL to provision

### Step 4: Configure Variables (CRITICAL)
Go to **"Variables"** and set these EXACTLY:

```
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-duper-secret-key-make-it-random-32-chars-long
```

**Then get database values:**
1. Go to **"MySQL"** service tab
2. Click **"Connect"**
3. Copy these values:

```
DB_HOST=<copy from Connect tab - usually mysql or 127.0.0.1>
DB_USER=<copy exactly - usually root>
DB_PASSWORD=<copy exactly>
DB_NAME=railway
```

Example:
```
DB_HOST=mysql
DB_USER=root  
DB_PASSWORD=AbCdEf123456
DB_NAME=railway
```

### Step 5: Initialize Database
After Railway service is running, run:

```bash
cd c:\Users\haady\OneDrive\Desktop\ecommerce\server
npm install
node initDb.js
```

This creates all tables in the Railway MySQL database.

### Step 6: Test Deployment
1. Go to Railway "Deployments"
2. Wait for ✅ **Success** status
3. Click **"Connect"** tab
4. Copy your public URL
5. Test in browser:
   ```
   https://your-railway-url/api
   ```
   Should show: "E-commerce API is running..."

---

## 🔧 Advanced Troubleshooting

### Issue 1: "Cannot find module"

**Cause:** Package.json not found or dependencies missing

**Fix:**
```bash
cd server
npm install
npm install -g pm2
git add package-lock.json
git commit -m "Fix: add package-lock.json"
git push origin main
```

Then redeploy on Railway.

---

### Issue 2: "ECONNREFUSED - Connection refused"

**Cause:** Database not running or wrong credentials

**Fix:**
1. On Railway dashboard, check if MySQL service ✅ exists
2. If not, click "Add Service" → "MySQL"
3. Wait for MySQL to be "Running"
4. Click MySQL service
5. "Connect" tab → copy the credentials again
6. Update variables with exact values (no typos!)
7. Test connection:
   ```bash
   mysql -h <DB_HOST> -u <DB_USER> -p<DB_PASSWORD> -D <DB_NAME>
   ```
   Should show `mysql>` prompt

---

### Issue 3: "Error: ER_BAD_DB_ERROR: Unknown database"

**Cause:** Database not created

**Fix:**
```bash
cd c:\Users\haady\OneDrive\Desktop\ecommerce\server
npm install
node initDb.js
```

This creates the database automatically.

---

### Issue 4: Build Successful but App Crashess

**Cause:** Missing .env file or port not set

**Fix:**
1. On Railway dashboard → Variables
2. Verify these exist:
   ```
   PORT=3000  ← MUST be set
   NODE_ENV=production
   JWT_SECRET=<something>
   DB_HOST=mysql (or whatever)
   DB_USER=root
   DB_PASSWORD=<password>
   DB_NAME=railway
   ```
3. Click "Redeploy" after adding/fixing variables

---

### Issue 5: 404 on API routes

**Cause:** Routes not loading or server not starting correctly

**Fix:**
Verify `server.js` has all routes:
```javascript
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
```

All route files must exist in `server/routes/` folder.

---

## 📋 Pre-Deployment Checklist

Before redeploying, verify locally:

```bash
# 1. Check server runs locally
cd server
npm start
# Should show: "Server running on port 5000"

# 2. Check all route files exist
ls routes/
# Should show: authRoutes.js, productRoutes.js, etc.

# 3. Check all controllers exist
ls controllers/
# Should show: authController.js, productController.js, etc.

# 4. Check package.json exists
cat package.json
# Should show all dependencies

# 5. Test database locally
mysql -u root -p
SHOW DATABASES;
USE ecommerce_db;
SHOW TABLES;
```

---

## 🚀 Nuclear Option: Fresh Deploy from Scratch

If everything still fails, do this:

### Step 1: Create New Railway Project
```
1. Go to railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repo
5. Click "Deploy"
```

### Step 2: Let It Build First
- Wait for build to complete (even if it fails)
- Don't add variables yet

### Step 3: Add MySQL Service
1. Click "New Service"
2. Select "MySQL"
3. Click "Deploy"
4. Wait for MySQL to show ✅

### Step 4: Copy MySQL Credentials
From MySQL service "Connect" tab, copy:
- DATABASE_URL (or individual values)
- Parse it to get: HOST, USER, PASSWORD, DB_NAME

### Step 5: Set Variables ONE BY ONE

In Railway "Variables" section:
```
Add: PORT = 3000
Save. Wait 10 seconds.
Add: NODE_ENV = production
Save. Wait 10 seconds.
Add: DB_HOST = mysql (or your host)
Save. Wait 10 seconds.
... continue for all variables
```

### Step 6: Redeploy
1. Go to "Deployments"
2. Click "Redeploy"
3. Watch logs: Click "Logs" tab
4. Wait for success

---

## 📊 Recommended Railway Configuration

```
Project: ecommerce-site
├── Service 1: Backend (from GitHub)
│   ├── Build: npm install (in /server folder)
│   ├── Start: npm start
│   └── Port: 3000
│
└── Service 2: MySQL
    ├── Auto-created with credentials
    └── Listen on: 3306
```

---

## 🧪 Final Test

After successful deployment:

```bash
# Test API is running
curl https://your-railway-url/api
# Response: "E-commerce API is running..."

# Test products endpoint
curl https://your-railway-url/api/products
# Response: JSON array of products

# Test auth (will fail but proves endpoint exists)
curl -X POST https://your-railway-url/api/auth/login -H "Content-Type: application/json"
# Response: some error (expected, no data sent) - proves endpoint exists
```

---

## 📞 Still Not Working? Debug Steps

1. **Check Railway logs:**
   - Railway Dashboard → "Logs" tab
   - Paste the error message here ⬇️

2. **Common error messages:**
   - "ECONNREFUSED" → Database not running
   - "Cannot find module" → Missing dependency
   - "Port already in use" → PORT variable not set
   - "Unknown database" → Run `node initDb.js`

3. **If stuck:**
   - Delete project
   - Start fresh
   - Follow this guide step-by-step carefully

---

## ✅ Success Indicators

✅ Build shows "Success" status  
✅ API endpoint responds with "API running" message  
✅ Products endpoint returns JSON  
✅ No errors in "Logs" tab  
✅ Frontend can connect to backend URL  

**If all green, deployment succeeded!** 🎉

---

## Next: Connect Frontend to Backend

Once backend is working on Railway:

1. Copy Railway backend URL
2. Go to Vercel frontend project
3. Settings → Environment Variables
4. Set: `VITE_API_URL=https://your-railway-backend.railway.app/api`
5. Redeploy frontend

Both services should now be:
✅ Frontend: https://your-vercel-url.vercel.app
✅ Backend: https://your-railway-url.railway.app
✅ Connected and working!

---

**Need help? Share the exact error from Railway "Logs" tab!**
