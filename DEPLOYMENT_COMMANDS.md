# 📋 Deployment Commands

## Frontend Deployment (Vercel)

### Via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Get deployment URL
```

### Via GitHub (Recommended for Teams)
```bash
# 1. Push to GitHub
git add .
git commit -m "Remove Supabase, add backend-only setup"
git push origin main

# 2. Go to: https://vercel.com/dashboard
# 3. Click "Add New Project"
# 4. Select your GitHub repo
# 5. Add Environment Variables
# 6. Click Deploy
```

---

## Backend Deployment (Railway)

### Via Railway CLI
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway init

# 4. Set environment variables
railway variables set DATABASE_URL=your_database_url
railway variables set CORS_ORIGINS=https://your-vercel-url.vercel.app

# 5. Deploy
railway up

# 6. Get URL
railway status
```

### Via Railway Dashboard
```
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Configure environment variables
5. Deploy
```

---

## Environment Variables Configuration

### In Vercel Dashboard
```
Settings → Environment Variables → Add New

NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

### In Railway Dashboard
```
Variables → Add New Variable

DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ORIGINS=https://your-vercel-url.vercel.app
```

---

## Local Testing Before Deploy

```bash
# 1. Start backend locally
cd backend
python -m uvicorn main:app --reload --port 8000

# 2. In another terminal, start frontend
pnpm dev

# 3. Test API endpoints
curl http://localhost:8000/health
curl http://localhost:3000

# 4. Run build test
pnpm build
```

---

## Verify Deployment

### Frontend Health Check
```bash
# Visit your Vercel URL
https://your-frontend.vercel.app

# Check API connectivity
curl https://your-frontend.vercel.app/api/health
```

### Backend Health Check
```bash
curl https://your-backend.railway.app/health

# Should return:
# {"status": "ok"}
```

### Test API Call
```bash
curl https://your-frontend.vercel.app/api/deadlines \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Rollback Procedures

### Vercel Rollback
```
1. Go to Vercel Dashboard → Deployments
2. Find previous deployment
3. Click "Redeploy"
```

### Railway Rollback
```
1. Go to Railway Dashboard → Deployments
2. Find previous build
3. Click "Deploy"
```

---

## Performance Optimization

```bash
# Analyze bundle size
pnpm build
next/analyzer

# Check build time
pnpm build --debug

# Monitor frontend performance
curl -I https://your-vercel-url.vercel.app
```

---

## Troubleshooting Commands

```bash
# Check Vercel logs
vercel logs

# Check Railway logs
railway logs

# View Railway status
railway status

# Test database connection
railway shell
psql $DATABASE_URL -c "SELECT 1"

# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## Auto-Deployment Setup (GitHub + Vercel)

1. **Connect GitHub to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Authorize GitHub

2. **Enable Auto-Deploy:**
   - Settings → Git
   - Production Branch: `main`
   - Preview Deployments: `All`

3. **Deploy:**
   - Every push to `main` deploys to production
   - PRs create preview deployments

---

## Production Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in both
- [ ] Health endpoints responding
- [ ] API calls working end-to-end
- [ ] Database migrations applied
- [ ] Monitoring/alerts configured
- [ ] SSL certificates valid
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Error logging active
- [ ] Database backups scheduled

---

## Post-Deployment Monitoring

```bash
# Monitor for errors
railway logs -f

# Check uptime
curl -w "Status: %{http_code}\n" https://your-backend.railway.app/health

# Monitor response time
curl -w "@curl-format.txt" https://your-frontend.vercel.app
```

