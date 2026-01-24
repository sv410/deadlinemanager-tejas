# 💻 Local Development Environment Variables

## Backend (.env file in `/backend/` folder)

Create file: `backend/.env`

```env
# Database (SQLite for local development)
DATABASE_URL=sqlite:///./deadline_manager.db

# Security - CHANGE THESE!
SECRET_KEY=local-dev-secret-key-change-this-to-random-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth (Optional - for Gmail/Calendar features)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Settings
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

---

## Frontend (.env file in root folder)

Create file: `.env` or `.env.local` in project root

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
BACKEND_URL=http://localhost:8000

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Placeholders - using backend instead)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Email Service (Optional - for notifications)
GMAIL_APP_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# Cron Secret (Optional - for scheduled tasks)
CRON_SECRET=your-random-cron-secret-key
```

---

## Quick Setup Commands

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your values
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
# From project root
cp .env.example .env.local
# Edit .env.local with your values
pnpm install
pnpm dev
```

---

## 🔐 Generate SECRET_KEY

### PowerShell
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Python
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Online
https://randomkeygen.com/ (use "Fort Knox Passwords")

---

## ✅ Minimum Required for Local Dev

**Backend:**
- `DATABASE_URL=sqlite:///./deadline_manager.db`
- `SECRET_KEY=<any-random-string>`

**Frontend:**
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
- `NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key`

Everything else is optional!

---

## 🚀 Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2 - Frontend
```bash
pnpm dev
```

**Access**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

---

**Note**: The `.env` files are already in `.gitignore` so they won't be committed to Git! ✅
