# 🎯 EXACT DEPLOYMENT CODES - Copy & Paste Ready

## STATUS: ✅ READY TO DEPLOY
- Supabase removed ✓
- Backend-only setup ✓  
- Environment simplified ✓

---

## 🏃 FASTEST PATH TO PRODUCTION (Recommended)

### 1️⃣ Clean Local Build (Copy Exact Command)

**Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force .next; Remove-Item -Recurse -Force node_modules; pnpm install; pnpm build
```

**Mac/Linux:**
```bash
rm -rf .next node_modules; pnpm install; pnpm build
```

---

### 2️⃣ Deploy Backend to Railway (2 Options)

#### OPTION A: Railway Dashboard (Easiest - No CLI)
```
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect GitHub (if not already)
4. Select your repo: sv410/deadlinemanager-tejas
5. Wait for Railway to build & deploy
6. Go to Settings tab
7. Copy the Railway URL (looks like: https://deadlinemanager-tejas.up.railway.app)
8. SAVE THIS URL - you'll need it next
```

#### OPTION B: Railway CLI
```bash
npm install -g @railway/cli
railway login
cd /path/to/deadlinemanager-tejas
railway up
```

**After deploy, copy your Railway URL:**
```
https://deadlinemanager-tejas.up.railway.app
```

---

### 3️⃣ Deploy Frontend to Vercel (Exact Steps)

#### STEP 1: Go to Vercel Dashboard
```
https://vercel.com/dashboard
```

#### STEP 2: Create New Project
```
Click "Add New" → "Project"
```

#### STEP 3: Import Your Repository
```
Click "Import Git Repository"
Search for: sv410/deadlinemanager-tejas
Click "Import"
```

#### STEP 4: Set Environment Variables
```
Click "Environment Variables"

Add TWO variables:

Variable 1:
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://deadlinemanager-tejas.up.railway.app
(Use YOUR Railway URL from Step 2)

Variable 2:
Name: NEXT_PUBLIC_APP_URL
Value: https://deadline-manager.vercel.app
(Vercel will give you the real URL after deploy)

Select for all environments:
☑ Production
☑ Preview  
☑ Development
```

#### STEP 5: Deploy
```
Click "Deploy" button
Wait 3-5 minutes...
You'll see "Congratulations!"
```

---

### 4️⃣ Get Your URLs

After deployment completes:

**Frontend URL:** 
```
https://deadline-manager-XXXXX.vercel.app
```
(Vercel shows this on success page)

**Backend URL:**
```
https://deadlinemanager-tejas.up.railway.app
```
(From Railway dashboard)

---

## ✅ VERIFY DEPLOYMENT

### Test Backend Health
```bash
curl https://deadlinemanager-tejas.up.railway.app/health
```

**Expected Response:**
```json
{"status": "ok"}
```

### Test Frontend
```
Open in browser: https://deadline-manager-XXXXX.vercel.app
```

Should load without errors!

---

## 🔗 DIRECT LINKS

| Action | URL |
|--------|-----|
| Railway Dashboard | https://railway.app/dashboard |
| Vercel Dashboard | https://vercel.com/dashboard |
| Your Repo | https://github.com/sv410/deadlinemanager-tejas |

---

## 📋 VARIABLE REFERENCE

**Copy these exact variable names:**

```
Frontend Environment Variables:
- NEXT_PUBLIC_BACKEND_URL
- NEXT_PUBLIC_APP_URL

Backend Environment Variables:
- DATABASE_URL
- CORS_ORIGINS
```

---

## 🆘 IF SOMETHING BREAKS

### Build Fails: "supabaseUrl is required"
```bash
# Already fixed! Just rebuild:
rm -rf .next
pnpm build
```

### Deploy Shows Error
```
1. Go to Vercel → Your Project → Deployments
2. Click the failed deployment
3. Click "Logs" tab
4. Read the error message
5. Fix the issue
6. Redeploy
```

### Backend Unreachable
```bash
# Check Railway status:
1. Go to https://railway.app/dashboard
2. Click your project
3. Check deployment status
4. Wait if it's still deploying
5. Check logs if it failed
```

---

## 🚀 FINAL CHECKLIST

```
Before submitting to production:

☐ Local build passes: pnpm build
☐ Backend deployed to Railway
☐ Frontend deployed to Vercel
☐ Backend URL set in Vercel environment
☐ curl backend/health returns 200
☐ Frontend loads without console errors
☐ Can interact with the app
☐ Database migrations applied
☐ Monitoring/alerts configured
```

---

## 💡 NEXT STEPS AFTER DEPLOYMENT

```bash
# Monitor backend logs
railway logs -f

# Monitor frontend deployments  
vercel logs --follow

# Test API endpoints
curl -X GET https://deadlinemanager-tejas.up.railway.app/deadlines \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 SUPPORT

If deployment fails:
1. Check Railway logs: https://railway.app/dashboard
2. Check Vercel logs: Deployments tab in Vercel
3. Verify environment variables are set
4. Make sure repo is public (for GitHub actions)
5. Check node modules aren't corrupted

