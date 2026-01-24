# 📋 Environment Variables - Complete Reference

## Quick Links to Specific Guides

- **[Vercel (Frontend)](VERCEL_ENV_VARIABLES.md)** - Deploy frontend
- **[Railway (Backend)](RAILWAY_ENV_VARIABLES.md)** - Deploy backend
- **[Local Development](LOCAL_ENV_VARIABLES.md)** - Run locally

---

## 📊 Variables by Platform

### Vercel (Frontend Deployment)

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` or Railway URL | ✅ Yes | Backend API endpoint |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://placeholder.supabase.co` | ✅ Yes | Placeholder (using backend) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `placeholder_key` | ✅ Yes | Placeholder |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth ID | ⚪ Optional | For Gmail/Calendar |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | ⚪ Optional | For Gmail/Calendar |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL | ⚪ Optional | Frontend URL |

**Environment**: Select Production, Preview, Development for all

---

### Railway (Backend Deployment)

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `SECRET_KEY` | Random 32+ chars | ✅ Yes | JWT token signing |
| `DATABASE_URL` | Auto-provided | ✅ Yes | PostgreSQL connection (auto) |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | ⚪ Optional | For Gmail/Calendar |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | ⚪ Optional | For Gmail/Calendar |
| `ALGORITHM` | `HS256` | ⚪ Optional | Has default |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | ⚪ Optional | Has default |

**Note**: Railway auto-creates `DATABASE_URL` when you add PostgreSQL

---

### Local Development

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `DATABASE_URL` | `sqlite:///./deadline_manager.db` | ✅ Yes | Local SQLite |
| `SECRET_KEY` | Any random string | ✅ Yes | For development |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` | ✅ Yes | Local backend |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://placeholder.supabase.co` | ✅ Yes | Placeholder |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `placeholder_key` | ✅ Yes | Placeholder |

---

## 🎯 Deployment Checklist

### Step 1: Deploy Backend to Railway

1. ✅ Add `SECRET_KEY` (generate random 32+ chars)
2. ✅ Add PostgreSQL database (auto-creates `DATABASE_URL`)
3. ⚪ Add Google OAuth credentials (optional)
4. ✅ Copy Railway URL after deployment

### Step 2: Deploy Frontend to Vercel

1. ✅ Add `NEXT_PUBLIC_BACKEND_URL` = Railway URL
2. ✅ Add `NEXT_PUBLIC_SUPABASE_URL` = placeholder
3. ✅ Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` = placeholder
4. ✅ Select Production, Preview, Development
5. ✅ Click Redeploy

### Step 3: Update Backend CORS

1. ✅ Edit `backend/main.py` in GitHub
2. ✅ Add Vercel URL to `allow_origins`
3. ✅ Commit and push (Railway auto-redeploys)

---

## 🔐 Generate SECRET_KEY

```bash
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Or use: https://randomkeygen.com/

---

## 🚀 Quick Start

### Minimum Required for Vercel (Right Now)

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key
```

Add these three and **Redeploy**! ✅

---

## 📚 File Locations

- **Vercel**: Add via Dashboard → Settings → Environment Variables
- **Railway**: Add via Dashboard → Variables Tab
- **Local Backend**: Create `backend/.env` file
- **Local Frontend**: Create `.env` or `.env.local` in root

---

## ⚠️ Important Notes

1. **NEXT_PUBLIC_** prefix required for client-side variables in Next.js
2. Never commit `.env` files to Git (already in `.gitignore`)
3. Railway auto-generates `DATABASE_URL` - don't add manually
4. Always redeploy after changing environment variables
5. Use placeholder values for unused Supabase variables

---

**Need detailed instructions?** Check the specific platform guides above! 🎉
