# 🚀 Unified Full-Stack Architecture

## Overview

Your deadline management system now runs as a **unified full-stack application** with both frontend and backend accessible through a single localhost port (`http://localhost:3000`). This eliminates the need for separate CORS configuration and provides a seamless development experience.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    http://localhost:3000
                           │
┌──────────────────────────▼──────────────────────────────────┐
│            Next.js Frontend (React + TypeScript)            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Pages & Components                                     │ │
│  │  - Landing page                                         │ │
│  │  - Dashboard                                            │ │
│  │  - Auth pages (login/signup)                            │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Layer (/lib/api)                                   │ │
│  │  - auth.ts (login, register, refresh tokens)           │ │
│  │  - tasks.ts (CRUD operations, analytics)               │ │
│  │  - Hooks: useAuth, useDeadlines                         │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js API Proxy Routes (/app/api)                   │ │
│  │  - /api/auth/[...path] → routes to backend /api/auth   │ │
│  │  - /api/tasks/[...path] → routes to backend /api/tasks │ │
│  │  - Handles all HTTP methods (GET, POST, PUT, DELETE)   │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
              (Internal proxy - no CORS needed)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│      FastAPI Backend (Python)                               │
│      Running on http://localhost:8000                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Routes (/backend/routers)                              │ │
│  │  - auth.py (register, login, refresh, me, logout)      │ │
│  │  - tasks.py (CRUD, analytics, prioritization)          │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database (SQLite)                                       │ │
│  │  - Users table                                           │ │
│  │  - Tasks table                                           │ │
│  │  - Relationships & indexes                              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## How It Works

### Request Flow

1. **Frontend Request** (React Component)
   ```javascript
   // Component calls the API service
   const response = await login({ email, password });
   ```

2. **API Service Layer** (`lib/api/auth.ts`)
   ```typescript
   // Makes request to /api/auth/login (relative path)
   const response = await fetch(`${API_URL}/api/auth/login`, {
     method: 'POST',
     body: JSON.stringify(credentials),
   });
   ```

3. **Next.js API Proxy** (`app/api/auth/[...path]/route.ts`)
   ```typescript
   // Routes request to backend
   const backendUrl = `http://localhost:8000/api/auth/login`;
   const response = await fetch(backendUrl, {
     method: 'POST',
     body,
   });
   ```

4. **FastAPI Backend** (`backend/routers/auth.py`)
   ```python
   @router.post("/login")
   async def login(credentials: UserLogin, db: Session = Depends(get_db)):
       # Process login
       # Return tokens and user data
   ```

5. **Response Returns** → Frontend → UI Updates

---

## Key Advantages

### ✅ Single Port Development
- **No CORS issues** - requests are same-origin
- **Simplified configuration** - single port to manage
- **Better testing** - everything on `localhost:3000`

### ✅ Transparent Proxy
- **No API modifications** - backend unchanged
- **Clean separation** - frontend and backend logic separate
- **Easy debugging** - can see full request flow

### ✅ Production Ready
- **Can deploy separately** - frontend to Vercel, backend to AWS/GCP
- **Proxy only for dev** - production uses actual API URLs
- **Flexible** - adjust `BACKEND_URL` environment variable

### ✅ Hybrid Mode Support
- **Guest mode** - works offline with localStorage
- **Authenticated mode** - syncs to backend
- **Automatic fallback** - seamlessly switches between modes

---

## File Structure

```
deadline-manager-v0/
├── app/
│   ├── api/
│   │   ├── auth/[...path]/route.ts        ← Auth proxy
│   │   ├── tasks/[...path]/route.ts       ← Tasks proxy
│   │   └── ...existing routes...
│   ├── dashboard/page.tsx                 ← Main dashboard
│   ├── auth/
│   │   ├── login/page.tsx                 ← Login page
│   │   └── sign-up/page.tsx               ← Registration page
│   └── ...other pages...
│
├── lib/
│   └── api/
│       ├── auth.ts                         ← Auth API service
│       └── tasks.ts                        ← Tasks API service
│
├── hooks/
│   ├── useAuth.ts                          ← Auth state management
│   └── useDeadlines.ts                     ← Deadlines management
│
├── backend/
│   ├── main.py                             ← FastAPI app
│   ├── models.py                           ← SQLAlchemy models
│   ├── schemas.py                          ← Pydantic schemas
│   ├── database.py                         ← DB connection
│   ├── auth.py                             ← Auth utilities
│   ├── routers/
│   │   ├── auth.py                         ← Auth routes
│   │   └── tasks.py                        ← Task routes
│   ├── requirements.txt                    ← Python dependencies
│   └── deadline_manager.db                 ← SQLite database
│
└── package.json                            ← Node dependencies
```

---

## Running the Full Stack

### Start Everything at Once

```bash
# Terminal 1: Start the backend
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start the frontend
pnpm dev
```

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:8000 | Direct API access |
| **API Docs** | http://localhost:8000/api/docs | Swagger UI |
| **Dashboard** | http://localhost:3000/dashboard | Main app |
| **Login** | http://localhost:3000/auth/login | Sign in |
| **Signup** | http://localhost:3000/auth/sign-up | Register |

---

## Testing the Integration

### 1. Guest Mode (No Backend Required)
```bash
# Just start frontend
pnpm dev

# Visit http://localhost:3000
# Click "continue as guest"
# Add, edit, delete tasks
# Data persists in localStorage
```

### 2. Authenticated Mode (Full Backend)
```bash
# Start both servers
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pnpm dev

# Visit http://localhost:3000
# Click "Sign up"
# Create account → data syncs to backend
# Login with different browser → see same data
```

### 3. API Testing

#### Create Task (via frontend)
```bash
# Visit http://localhost:3000
# Sign in
# Add a deadline
# Backend automatically stores it
```

#### Direct API Testing (via curl)
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123456"}'

# Create task (replace TOKEN with actual token)
curl -X POST http://localhost:3000/api/tasks/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Report","deadline":"2026-02-28T17:00:00Z","priority":"high"}'
```

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=/api  # Uses relative paths (proxied)
BACKEND_URL=http://localhost:8000  # For proxy routes
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./deadline_manager.db
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Production Deployment

### Option 1: Separate Deployments (Recommended)

**Frontend** → Vercel
```bash
# Vercel auto-detects Next.js
pnpm install
pnpm build
# Configure BACKEND_URL to point to your backend API
```

**Backend** → AWS Lambda / GCP Cloud Run / Railway
```bash
# Deploy FastAPI
docker build -t deadline-backend .
# Push to container registry
# Deploy to your platform
```

### Option 2: Monolithic Deployment

```bash
# Deploy both on same server
# Update BACKEND_URL to production backend URL
# Or use same domain with path-based routing
```

---

## API Proxy Routes

### Auth Proxy (`app/api/auth/[...path]/route.ts`)

Routes all requests from `/api/auth/*` to `http://localhost:8000/api/auth/*`

- Supports: GET, POST, PUT, DELETE
- Maintains: headers, body, query parameters
- Handles: errors gracefully

```
Request:  POST /api/auth/login
Proxied:  POST http://localhost:8000/api/auth/login
Response: Returns backend response directly
```

### Tasks Proxy (`app/api/tasks/[...path]/route.ts`)

Routes all requests from `/api/tasks/*` to `http://localhost:8000/api/tasks/*`

- Supports: GET, POST, PUT, DELETE
- Maintains: headers, body, query parameters, search params
- Handles: errors gracefully

```
Request:  GET /api/tasks/prioritized/all?status=pending
Proxied:  GET http://localhost:8000/api/tasks/prioritized/all?status=pending
Response: Returns backend response directly
```

---

## Next Steps

### Frontend Enhancements
- [ ] Add notification system
- [ ] Implement collaborative features
- [ ] Add real-time updates with WebSockets
- [ ] Mobile app (React Native)

### Backend Enhancements
- [ ] Add email notifications
- [ ] Implement webhooks
- [ ] Add pagination for large datasets
- [ ] Add rate limiting

### DevOps
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Database migrations
- [ ] Monitoring and logging

---

## Troubleshooting

### Issue: 404 on API endpoints
**Solution:** Ensure backend is running on port 8000 and proxy routes exist

### Issue: CORS errors
**Solution:** Proxy should prevent CORS - check that requests go through `/api` paths

### Issue: Database locked
**Solution:** Make sure only one backend instance is running

### Issue: Frontend not updating data
**Solution:** Check that authentication tokens are valid and stored in localStorage

---

## Summary

Your unified full-stack application now features:
- ✅ Single localhost port (3000) for development
- ✅ Transparent API proxy layer
- ✅ No CORS configuration needed
- ✅ Clean separation of concerns
- ✅ Both guest and authenticated modes
- ✅ Production-ready architecture
- ✅ Easy debugging and testing
