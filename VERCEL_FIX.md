# ⚡ Quick Fix: Vercel Environment Variables

## The Issue
Vercel can't find the secret references. You need to add environment variables manually in the Vercel dashboard.

## ✅ Solution: Add These Environment Variables in Vercel

### Step 1: In Vercel Dashboard

1. Go to your project settings
2. Click **"Environment Variables"** in the left sidebar
3. Add these variables **one by one**:

### Required Environment Variables:

#### 1. NEXT_PUBLIC_BACKEND_URL
```
Variable Name: NEXT_PUBLIC_BACKEND_URL
Value: http://localhost:8000
```
**Note**: After you deploy the backend to Railway, update this to your Railway URL

#### 2. NEXT_PUBLIC_GOOGLE_CLIENT_ID (Optional for now)
```
Variable Name: NEXT_PUBLIC_GOOGLE_CLIENT_ID
Value: your-google-client-id.apps.googleusercontent.com
```
Leave as placeholder if you haven't set up Google OAuth yet

#### 3. NEXT_PUBLIC_SUPABASE_URL (Temporary placeholder)
```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://placeholder.supabase.co
```

#### 4. NEXT_PUBLIC_SUPABASE_ANON_KEY (Temporary placeholder)
```
Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: placeholder_key
```

### Step 2: Deploy Settings

Make sure these are selected:
- **Environment**: Production, Preview, and Development (all three)
- **Framework Preset**: Next.js (should auto-detect)
- **Build Command**: `pnpm install && pnpm build` (auto-detected)
- **Install Command**: `pnpm install`
- **Root Directory**: `./` (default)

### Step 3: Redeploy

After adding all environment variables:
1. Click **"Redeploy"** in Vercel
2. Or trigger a new deployment by pushing to GitHub

## 🎯 Recommended Deployment Order

### Option 1: Deploy Frontend Only (Fast)

For now, just deploy the frontend and keep backend running locally:

1. **Vercel**: Deploy frontend with `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
2. Keep your local backend running on port 8000
3. Access your frontend at your Vercel URL
4. It will connect to your local backend for development

### Option 2: Deploy Both (Production Ready)

1. **First, deploy backend to Railway**:
   - Go to https://railway.app
   - New Project → Deploy from GitHub
   - Select `deadlinemanager-tejas`
   - Root directory: `backend`
   - Add env vars:
     ```
     SECRET_KEY=your-secret-key-min-32-chars
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```
   - Railway provides DATABASE_URL automatically
   - **Copy your Railway URL** (e.g., `https://deadlinemanager-production.up.railway.app`)

2. **Then, update Vercel**:
   - Go to Vercel project settings
   - Update `NEXT_PUBLIC_BACKEND_URL` to your Railway URL
   - Redeploy

3. **Finally, update backend CORS**:
   - Edit `backend/main.py` on GitHub
   - Add your Vercel URL to `allow_origins`:
     ```python
     allow_origins=[
         "https://your-app.vercel.app",
         "http://localhost:3000",
     ]
     ```
   - Commit and push
   - Railway auto-redeploys

## 🔧 Environment Variables Reference

### For Vercel (Frontend)

**Minimum Required:**
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key
```

**With Google OAuth:**
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key
```

### For Railway (Backend)

**Required:**
```
SECRET_KEY=generate-a-random-32-character-string-here
DATABASE_URL=postgresql://... (auto-provided by Railway)
```

**Optional (for Gmail/Calendar):**
```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

## ⚠️ Important Notes

1. **NEXT_PUBLIC_** prefix is required for client-side env vars in Next.js
2. Without `NEXT_PUBLIC_`, the variable won't be available in the browser
3. Railway auto-generates `DATABASE_URL` - don't add it manually
4. Always redeploy after changing environment variables

## 🐛 Troubleshooting

### "Environment variable references Secret which does not exist"
- ✅ Fixed! The updated `vercel.json` removed secret references
- Add variables manually in Vercel UI instead

### "Can't connect to backend"
- Check `NEXT_PUBLIC_BACKEND_URL` is correct
- Ensure backend is running (locally or on Railway)
- Check CORS settings in backend

### "Build fails"
- Check all required env vars are added
- Ensure they're selected for "Production" environment
- Try redeploying

---

**Ready to continue?** Add the environment variables in Vercel and click "Redeploy"! 🚀
