# Vercel Deployment Guide

## Issue: 404 Errors on Vercel

Your React app uses client-side routing (React Router), but Vercel was serving 404 for all non-root routes. This is now fixed with:
- **vercel.json** - Configures SPA routing redirects
- **.vercelignore** - Excludes backend files from Vercel build

---

## Deployment Steps

### Step 1: Deploy Frontend to Vercel

1. **Push to GitHub:**
   ```bash
   cd c:\Users\haady\OneDrive\Desktop\ecommerce
   git add .
   git commit -m "Add Vercel configuration"
   git push origin master
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "Other" for Framework (since Vite is auto-detected)
   - Project root: `.` (root)
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Click "Deploy"

3. **Set Environment Variables on Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Save and redeploy

---

### Step 2: Deploy Backend to Separate Service

Since your backend (Express.js) needs a server, deploy it separately:

#### Option A: Deploy to Railway (Recommended for beginners)

1. **Create account:** https://railway.app
2. **Connect GitHub repo**
3. **Create new project** → Select "Deploy from GitHub repo"
4. **Select your ecommerce-site repo**
5. **Configure:**
   - Root Directory: `server`
   - Start Command: `npm start`
6. **Add Environment Variables:**
   - PORT: 3000 (auto-assigned)
   - DB_HOST: your-mysql-host
   - DB_USER: your-db-user
   - DB_PASSWORD: your-db-password
   - DB_NAME: ecommerce_db
   - JWT_SECRET: your-secret-key
7. **Deploy** - Get the backend URL

#### Option B: Deploy to Render

1. **Create account:** https://render.com
2. **New Web Service** → Connect GitHub
3. **Select repository and server folder**
4. **Settings:**
   - Runtime: Node
   - Build Command: `cd server && npm install`
   - Start Command: `npm start`
   - Region: Singapore or nearest
5. **Add environment variables** (same as above)
6. **Deploy**

#### Option C: Deploy to Heroku

1. Create account: https://heroku.com
2. Install Heroku CLI
3. Run:
   ```bash
   cd server
   heroku login
   heroku create your-app-name
   git push heroku master
   ```

---

### Step 3: Update Frontend API URL

After backend is deployed, update Vercel environment variable:

1. **On Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Update `VITE_API_URL` with your actual backend URL
   - Example: `https://ecommerce-backend-xyz.railway.app/api`
   - Redeploy

2. **Or add to .env.local locally:**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

---

## Alternative: Full-Stack on One Platform

If you want everything in one place, you can:

### Use Vercel Functions for Backend
- Create serverless functions in `/api` folder
- Deploy entire app on Vercel
- Requires MySQL cloud database (AWS RDS, Railway, etc.)

### Use Railway for Both
- Deploy frontend and backend on same Railway instance
- Simpler for monorepo projects

---

## Troubleshooting

### Still Getting 404 Errors?

1. **Check vercel.json exists:**
   ```bash
   ls vercel.json
   ```

2. **Verify .vercelignore:**
   ```bash
   ls .vercelignore
   ```

3. **Clear Vercel cache:**
   - Vercel Dashboard → Project Settings → General → Purge Cache

4. **Rebuild on Vercel:**
   - Make a small change, push to GitHub
   - Vercel auto-rebuilds

### API Calls Returning 404

- Ensure backend is deployed
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend logs for actual errors
- Confirm database connection works

---

## Current URLs After Deployment

- **Frontend:** `https://your-vercel-app.vercel.app`
- **Backend:** `https://your-railway-app.railway.app`
- **API Base:** `https://your-railway-app.railway.app/api`

---

## Database Setup for Production

1. **Option A: MySQL Hosting**
   - Sun5ql (https://sunsql.com)
   - AWS RDS
   - Railway MySQL add-on
   - Google Cloud SQL

2. **Option B: Connection String**
   ```
   DB_HOST=db.railway.internal (if on Railway)
   DB_USER=your-user
   DB_PASSWORD=your-password
   DB_NAME=ecommerce_db
   ```

---

## Files Added

- **vercel.json** - Vercel configuration for SPA routing
- **vercel.gitignore** - Files to exclude from Vercel build

## Next Steps

1. ✅ Push vercel.json to GitHub
2. ✅ Deploy frontend to Vercel
3. ✅ Deploy backend to Railway/Render/Heroku
4. ✅ Update environment variables
5. ✅ Test the deployment
