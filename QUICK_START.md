# 🚀 Unified Full-Stack Quick Start

## What You Have

A complete deadline management application with:
- **Frontend**: React + Next.js (TypeScript) on http://localhost:3000
- **Backend**: FastAPI (Python) on http://localhost:8000
- **Database**: SQLite with user authentication and task management
- **Unified Access**: All accessible through **http://localhost:3000**

---

## Quick Setup & Run

### Prerequisites
- Python 3.8+
- Node.js 18+
- pnpm (or npm/yarn)

### 1️⃣ Start the Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
✅ Database initialized
```

### 2️⃣ Start the Frontend

```bash
# In a new terminal
pnpm dev
```

**Output:**
```
▲ Next.js 16.0.10
- Local:         http://localhost:3000
- Ready in 6.8s
```

### 3️⃣ Open Your Browser

Visit **http://localhost:3000** - Everything is running!

---

## Demo: Using the Application

### Option A: Guest Mode (No Backend Required)

```
1. Visit http://localhost:3000
2. Click "continue as guest"
3. Add a deadline: "Report due Friday"
4. Data saves to your browser (localStorage)
5. Refresh page - data persists!
```

### Option B: Cloud Mode (With Backend)

```
1. Visit http://localhost:3000
2. Click "Sign up"
3. Create account: 
   - Name: John Doe
   - Email: john@example.com
   - Password: Password123
4. You're logged in! Add deadlines
5. Open new private window, login with same account
6. See the SAME deadlines - synced to backend! ☁️
```

---

## Architecture: How It Works

### Single Port Magic 🎩

```
Browser (http://localhost:3000)
         ↓
    Next.js Frontend
         ↓
  /api/auth/login  ← Your click
         ↓
  Next.js Proxy Route (/app/api/auth/[...path]/route.ts)
         ↓
  http://localhost:8000/api/auth/login
         ↓
    FastAPI Backend
         ↓
  SQLite Database
         ↓
  Returns data back through same path
```

**Result:** No CORS issues, no config needed, seamless experience!

---

## Key Files

### Frontend
- `app/dashboard/page.tsx` - Main dashboard with all features
- `lib/api/auth.ts` - Authentication service
- `lib/api/tasks.ts` - Task management service
- `hooks/useAuth.ts` - Authentication state
- `hooks/useDeadlines.ts` - Deadline state (hybrid mode)

### Backend
- `backend/main.py` - FastAPI application entry point
- `backend/models.py` - Database models (Users, Tasks)
- `backend/routers/auth.py` - Authentication endpoints
- `backend/routers/tasks.py` - Task endpoints with AI prioritization

### Proxy (Makes it unified)
- `app/api/auth/[...path]/route.ts` - Auth proxy
- `app/api/tasks/[...path]/route.ts` - Tasks proxy

---

## API Endpoints (All Accessible via http://localhost:3000)

### Authentication
```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Sign in
POST   /api/auth/refresh      - Refresh token
GET    /api/auth/me           - Current user
POST   /api/auth/logout       - Sign out
```

### Tasks
```
POST   /api/tasks/            - Create task
GET    /api/tasks/            - List tasks
GET    /api/tasks/{id}        - Get task
PUT    /api/tasks/{id}        - Update task
DELETE /api/tasks/{id}        - Delete task
```

### Analytics
```
GET    /api/tasks/analytics/dashboard    - Get analytics
GET    /api/tasks/prioritized/all        - Get smart recommendations
```

---

## Testing with curl (Using Proxy)

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-01-23T10:30:00"
  }
}
```

### 2. Create Task
```bash
curl -X POST http://localhost:3000/api/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Quarterly Report",
    "description": "Complete Q1 financial report",
    "deadline": "2026-02-28T17:00:00Z",
    "priority": "high"
  }'
```

### 3. Get Smart Recommendations
```bash
curl http://localhost:3000/api/tasks/prioritized/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response includes:**
- `recommended_next_task` - What to do first
- `upcoming_tasks` - Coming up soon
- `past_tasks` - Historical data

---

## Real-World Usage

### Scenario 1: Working on Report
```
1. Visit http://localhost:3000/dashboard
2. Click "Add New Deadline"
3. Title: "Q1 Report"
4. Date: 2026-02-28
5. Priority: High
6. Click "Create Deadline"
7. Appears in dashboard instantly
8. If logged in → syncs to backend
9. Login on phone → see same deadline!
```

### Scenario 2: Checking Progress
```
1. Dashboard shows analytics:
   - Due Today: 2
   - Overdue: 1
   - Upcoming (7 days): 5
   - Success Rate: 75%
2. Past deadline analysis shows:
   - On-time completions
   - Late completions
   - Failed deadlines
3. Smart prioritization recommends:
   - "Do CRITICAL deadline first"
   - "Then HIGH priority tasks"
```

---

## Environment Setup (.env files)

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./deadline_manager.db
SECRET_KEY=your-secret-key-change-in-production-minimum-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Dashboard Features

✅ **Overview Section**
- Total deadlines count
- In Progress count
- Completed count

✅ **Analytics**
- Due Today
- Overdue
- Upcoming (7 days)
- Past Events

✅ **Past Deadline Analysis**
- On-time Completion (green)
- Late Completion (orange)
- Failed/Missed (red)
- Success Rate %

✅ **Smart Prioritization**
- Recommended next task
- Urgency levels (CRITICAL, HIGH, MEDIUM, LOW)
- Priority scores (0-100)

✅ **Task Management**
- Add/Edit/Delete deadlines
- Set time or date-only
- Change priority levels
- Mark as complete
- View detailed analytics

---

## Technology Stack

### Frontend
- **Next.js 16** - React framework with file-based routing
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **Pydantic** - Data validation
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **SQLite** - Embedded database

### DevOps
- **Uvicorn** - ASGI server
- **pnpm** - Package manager
- **Git** - Version control
- **GitHub** - Code hosting

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | `lsof -i :3000` then kill process or use different port |
| Port 8000 already in use | Backend won't start - kill process or use `--port 9000` |
| `Cannot find module` errors | Run `pnpm install` in root directory |
| Database locked error | Only one backend instance can access SQLite at a time |
| Proxy showing 404 | Ensure backend is running on port 8000 |
| Login not working | Check browser console (F12) for network errors |
| Data not syncing | Verify JWT token is stored in localStorage |

---

## Next: Going to Production

### Frontend Deployment (Vercel)
```bash
# Build
pnpm build

# Deploy
vercel deploy

# Set environment variable:
# BACKEND_URL=https://your-api.com
```

### Backend Deployment (Railway/Render/AWS)
```bash
# Create Docker image
docker build -t deadline-backend .

# Deploy to your platform
# Update DATABASE_URL to production database
# Update SECRET_KEY to strong random value
```

---

## Summary

You now have:
- ✅ Complete full-stack application
- ✅ Single localhost port (3000) development
- ✅ No CORS configuration needed
- ✅ Guest mode + cloud sync
- ✅ Smart task prioritization
- ✅ Production-ready architecture
- ✅ Comprehensive analytics
- ✅ Ready to deploy anywhere

**Start building! 🚀**
