# ⚠️ Build Error Fix Required

## The Problem

Build failing because old API routes still reference Supabase and sqlite3 (which doesn't work on Vercel).

## ✅ Quick Fix: Add These Environment Variables in Vercel

You already added some, but make sure ALL of these are present:

### Go to Vercel Dashboard → Settings → Environment Variables

Add these (if not already added):

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYwNTgwMDAsImV4cCI6MTk2MTYzNDAwMH0.placeholder
```

**Important**: 
- Select **Production, Preview, and Development** for each variable
- The Supabase values are placeholders since you're using the Python backend

### After Adding Variables:
1. Click **"Redeploy"** in Vercel
2. The build should succeed

## 🎯 Recommended: Deploy Backend First

For a fully working app:

1. **Deploy Backend to Railway** (5 min):
   - Go to https://railway.app
   - New Project → Deploy from GitHub repo
   - Select `deadlinemanager-tejas`
   - Root directory: `backend`
   - Add env vars:
     ```
     SECRET_KEY=your-32-char-secret-key
     GOOGLE_CLIENT_ID=your-id (optional)
     GOOGLE_CLIENT_SECRET=your-secret (optional)
     ```
   - Railway auto-provides `DATABASE_URL`
   - **Copy your Railway URL**

2. **Update Vercel**:
   - Change `NEXT_PUBLIC_BACKEND_URL` to Railway URL
   - Redeploy

3. **Update Backend CORS**:
   - Edit `backend/main.py` in GitHub
   - Add your Vercel URL to `allow_origins`
   - Commit and push

## Alternative: Clean Build (Remove Old Files)

If you want to remove the old Supabase routes entirely, I can help with that. But the quickest fix is just adding the placeholder env vars above.

---

**Next Step**: Add those environment variables in Vercel and redeploy! 🚀
