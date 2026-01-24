# 🚀 Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `deadlinemanager-tejas`

3. **Configure Backend**
   - Set root directory: `backend`
   - Railway will auto-detect Python

4. **Add Environment Variables**
   ```
   DATABASE_URL=postgresql://... (Railway auto-generates)
   SECRET_KEY=your-random-secret-key-min-32-chars
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   PORT=8000
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL: `https://your-app.railway.app`

#### Deploy Frontend to Vercel

1. **Push to GitHub** (if not done)
   ```bash
   git remote add origin https://github.com/sv410/deadlinemanager-tejas.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import `deadlinemanager-tejas`

3. **Configure**
   - Framework: Next.js
   - Root Directory: `./`

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

5. **Deploy**
   - Vercel will build and deploy
   - Get your URL: `https://your-app.vercel.app`

6. **Update Backend CORS**
   - Edit `backend/main.py`
   - Add Vercel URL to `allow_origins`:
   ```python
   allow_origins=[
       "https://your-app.vercel.app",
       "http://localhost:3000",
   ]
   ```
   - Push changes to redeploy

### Option 2: All-in-One Deployment

#### Deploy to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service for Backend**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repo
   - Configure:
     - Name: `deadlinemanager-backend`
     - Root Directory: `backend`
     - Environment: Python 3
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add Backend Environment Variables**
   ```
   DATABASE_URL=postgresql://... (add PostgreSQL database)
   SECRET_KEY=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Create Web Service for Frontend**
   - Click "New +"
   - Select "Static Site"
   - Connect same GitHub repo
   - Configure:
     - Name: `deadlinemanager-frontend`
     - Root Directory: `./`
     - Build Command: `pnpm install && pnpm build`
     - Publish Directory: `.next`

5. **Add Frontend Environment Variables**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://deadlinemanager-backend.onrender.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

## Database Setup

### PostgreSQL (Production)

For Railway:
- Automatically provisioned
- Connection string in `DATABASE_URL`

For Render:
1. Create PostgreSQL database
2. Copy connection string
3. Update `DATABASE_URL` environment variable

### Migrate from SQLite

The backend will automatically create tables on first run. No manual migration needed!

## Google OAuth Setup

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com

2. **Create Project**
   - Click "Select Project" → "New Project"
   - Name: "Deadline Manager"

3. **Enable APIs**
   - Go to "APIs & Services" → "Library"
   - Enable:
     - Gmail API
     - Google Calendar API

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://your-app.vercel.app/api/auth/google/callback`
     - `http://localhost:3000/api/auth/google/callback` (for dev)

5. **Copy Credentials**
   - Copy Client ID and Client Secret
   - Add to environment variables

## Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database connected
- [ ] Environment variables set
- [ ] CORS configured with frontend URL
- [ ] Google OAuth credentials configured
- [ ] Test user registration
- [ ] Test deadline creation
- [ ] Test Gmail notifications (if configured)
- [ ] Test Calendar sync (if configured)

## Monitoring & Logs

### Railway
- Dashboard → Your Service → Logs
- Real-time log streaming

### Vercel
- Dashboard → Your Project → Deployments → View Function Logs

### Render
- Dashboard → Your Service → Logs tab

## Troubleshooting

### Backend 502/503 Errors
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check logs for Python errors

### Frontend 404 Errors
- Ensure `NEXT_PUBLIC_BACKEND_URL` is correct
- Check CORS settings in backend

### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall rules
- Ensure database is running

### CORS Errors
- Add frontend URL to backend CORS settings
- Redeploy backend after changes

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### Railway
1. Go to Settings → Networking
2. Add custom domain
3. Update DNS records

## Environment Variables Reference

### Backend
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=random-secret-key-min-32-characters
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Cost Estimates

### Free Tier Options
- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month credit (good for small apps)
- **Render**: Free tier available
- **Supabase**: Free tier with 500MB database

### Paid Options
- **Railway**: ~$5-20/month (usage-based)
- **Render**: $7/month (starter)
- **Vercel Pro**: $20/month (optional)

---

Need help? Open an issue on GitHub!
