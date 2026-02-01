# 🚀 Deployment Guide - Backend + Vercel Frontend

## Quick Deploy Instructions

### **Step 1: Deploy Backend to Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Deploy
railway up
```

Get your **Railway Backend URL** (e.g., `https://your-backend-url.railway.app`)

---

### **Step 2: Deploy Frontend to Vercel**

#### Option A: Via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

#### Option B: Via GitHub (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Add New → Project"
4. Import your GitHub repository
5. Set environment variables (see below)
6. Deploy

---

### **Step 3: Set Vercel Environment Variables**

In your Vercel project settings, add these variables:

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | Your Railway backend URL | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | Your Vercel frontend URL | Production, Preview, Development |

**Example:**
```
NEXT_PUBLIC_BACKEND_URL=https://deadlinemanager-prod.up.railway.app
NEXT_PUBLIC_APP_URL=https://deadline-manager.vercel.app
```

---

### **Step 4: Verify Deployment**

Test your backend API:
```bash
curl https://your-backend-url/health
```

Test your frontend:
```
https://your-vercel-url.vercel.app
```

---

## Environment Variables Reference

### Frontend (.env.local or Vercel)
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

### Backend (Railway)
```
DATABASE_URL=your_database_url
CORS_ORIGINS=https://your-frontend.vercel.app
```

---

## Troubleshooting

**Build fails with "supabaseUrl is required"**
- Remove old Supabase dependencies
- Clear `.next` folder
- Redeploy

**CORS errors**
- Update backend CORS settings
- Add frontend URL to allowed origins

**API 404 errors**
- Verify backend is running: `curl https://your-backend-url/health`
- Check `NEXT_PUBLIC_BACKEND_URL` is correct

---

## Production Checklist

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] CORS enabled properly
- [ ] Database migrations run
- [ ] Monitoring/logging enabled

