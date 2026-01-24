# Environment Variables for Full-Stack Application

## Backend Environment (.env in backend/)

```env
# Database
DATABASE_URL=sqlite:///./deadline_manager.db
# For PostgreSQL: DATABASE_URL=postgresql://user:password@localhost/deadline_manager

# Security
SECRET_KEY=your-super-secret-key-min-32-chars-change-in-production!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth / Integrations
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False
```

## Frontend Environment (.env.local in root/)

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
BACKEND_URL=http://localhost:8000

# Supabase (optional, for hybrid mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth (for frontend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service (if using Gmail directly from frontend)
GMAIL_APP_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# Cron Secret (for scheduled notifications)
CRON_SECRET=your-cron-secret-key
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your values
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
# From project root
cp .env.example .env.local
# Edit .env.local with your values
pnpm install
pnpm dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/api/docs
- **Backend Health**: http://localhost:8000/

## Production Environment

For production deployment:

### Backend (Railway/Render/Heroku)
- Set all backend env vars in platform dashboard
- Change `DATABASE_URL` to PostgreSQL production URL
- Set `DEBUG=False`
- Update `CORS` origins in main.py to production domains

### Frontend (Vercel/Netlify)
- Set `NEXT_PUBLIC_BACKEND_URL` to production backend URL
- Set `BACKEND_URL` to production backend URL
- Configure Google OAuth redirect URIs to production domain
- Set all other env vars in platform dashboard
