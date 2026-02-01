# ⚡ QUICK START DEPLOYMENT (5 Minutes)

## What Changed
✅ Removed all Supabase dependencies  
✅ Simplified to backend-only architecture  
✅ Ready for Railway + Vercel deployment  

---

## Step 1: Clean & Build (1 minute)

```powershell
# Clear old files
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules

# Install dependencies
pnpm install

# Build
pnpm build
```

**Expected Output:**
```
✓ Compiled successfully
```

---

## Step 2: Deploy Backend to Railway (1 minute)

### Option A: Using Railway Dashboard
1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your `deadlinemanager-tejas` repository
4. Click **Deploy**
5. Go to **Settings** → copy your **Railway URL**

### Option B: Using Railway CLI
```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Login
railway login

# Deploy from your project folder
railway up
```

**Your Railway URL will look like:**
```
https://deadlinemanager-tejas.up.railway.app
```

---

## Step 3: Deploy Frontend to Vercel (2 minutes)

### Option A: Using Vercel Dashboard (RECOMMENDED)
1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repo: `deadlinemanager-tejas`
5. Click **Import**
6. Under **"Environment Variables"**, add:
   ```
   NEXT_PUBLIC_BACKEND_URL = https://YOUR_RAILWAY_URL (from Step 2)
   NEXT_PUBLIC_APP_URL = https://YOUR_VERCEL_URL (you'll get this after deploy)
   ```
7. Click **Deploy**
8. Wait for deployment to complete (2-3 minutes)
9. Copy your **Vercel URL** from the success page

### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Follow the prompts
```

---

## Step 4: Verify Everything Works (1 minute)

### Test Backend
```powershell
# Test your Railway backend
curl https://YOUR_RAILWAY_URL/health
```

**Expected Response:**
```json
{"status": "ok"}
```

### Test Frontend
Visit: `https://YOUR_VERCEL_URL`

Should load without errors in the console!

---

## 📝 Your URLs After Deployment

```
FRONTEND: https://deadline-manager-XXXXX.vercel.app
BACKEND:  https://deadlinemanager-tejas.up.railway.app
```

Save these URLs for testing and monitoring!

---

## 🔧 If Build Fails

### Error: "supabaseUrl is required"
```bash
# This is already fixed! Just:
1. Clear cache: rm -rf .next
2. Rebuild: pnpm build
3. Redeploy on Vercel
```

### Error: "Cannot find module"
```bash
# Reinstall dependencies
pnpm install
pnpm build
```

### Error: "Backend URL not found"
```bash
# Check Vercel environment variables:
1. Go to Vercel Dashboard
2. Click your project
3. Settings → Environment Variables
4. Verify NEXT_PUBLIC_BACKEND_URL is set
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Railway URL looks correct
- [ ] Vercel URL loads without errors
- [ ] API health check passes (`/health`)
- [ ] Environment variables set in Vercel

---

## 🚀 You're Done!

Your application is now live:
- **Frontend:** Accessible at your Vercel URL
- **Backend:** Running on Railway
- **Database:** Connected to your Railway Postgres database

### Next Steps:
1. Monitor logs on Railway Dashboard
2. Monitor deployment history on Vercel
3. Test user flows on production
4. Set up error tracking (Sentry, DataDog, etc.)
5. Enable auto-scaling if needed

---

## 📞 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Build takes too long | It's compiling with Turbopack - normal on first build |
| CORS errors | Check backend CORS settings include Vercel URL |
| 502 Bad Gateway | Backend might be sleeping - open Railway URL in browser |
| API returning 404 | Check `NEXT_PUBLIC_BACKEND_URL` environment variable |
| Can't connect to database | Railway DB might be still starting - wait 30 seconds |

---

## 📊 Monitoring

```bash
# Watch Railway logs in real-time
railway logs -f

# Check deployment status
railway status

# View Vercel deployment logs
vercel logs --follow
```

