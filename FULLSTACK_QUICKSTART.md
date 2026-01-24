# 🚀 Full-Stack Deadline Manager - Quick Start

## Architecture

- **Frontend**: Next.js 16 + React + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI + SQLAlchemy + SQLite/PostgreSQL
- **Auth**: JWT tokens (backend) with localStorage persistence
- **Integrations**: Google Calendar, Gmail (via OAuth)

## Quick Start (Development)

### 1. Start Backend Server

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Backend will run on http://localhost:8000

### 2. Start Frontend Server

```bash
# From project root
pnpm install
pnpm dev
```

Frontend will run on http://localhost:3000

### 3. Test the Integration

1. Open http://localhost:3000
2. Create an account (will use backend API)
3. Login with your credentials
4. Create deadlines - they'll be stored in the backend SQLite database
5. View upcoming/past deadlines - fetched from backend

## Features

### User Management
- ✅ Register new users (backend stores in DB)
- ✅ Login with email/password (JWT token auth)
- ✅ Per-user data isolation (all queries scoped by user_id)

### Deadline Management
- ✅ Create deadlines with title, description, due date, priority
- ✅ View all deadlines
- ✅ Filter by upcoming (next 30 days)
- ✅ Filter by past deadlines
- ✅ Update deadline status (pending, in_progress, completed, missed)
- ✅ Delete deadlines
- ✅ Priority scoring and urgency levels

### Google Integrations
- ✅ Send Gmail notifications for deadlines
- ✅ Sync deadlines to Google Calendar
- ✅ Store calendar event IDs to prevent duplicates
- ✅ Per-user OAuth token storage

### Analytics
- ✅ Total tasks count
- ✅ Completion rate
- ✅ Overdue count
- ✅ Priority distribution

## API Endpoints

### Backend (Python FastAPI)

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### Deadlines
- `GET /api/tasks/` - Get all user's tasks
- `GET /api/tasks/upcoming?days=30` - Get upcoming tasks
- `GET /api/tasks/past` - Get past tasks  
- `POST /api/tasks/` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

#### Google Integration
- `POST /api/tasks/google/tokens` - Store user's Google OAuth tokens
- `POST /api/tasks/{id}/notify/email` - Send Gmail notification
- `POST /api/tasks/{id}/calendar` - Sync to Google Calendar

#### Analytics
- `GET /api/tasks/analytics/dashboard` - Get user analytics

### Frontend API Routes (Proxies to Backend)

- `/api/backend-proxy/deadlines` - CRUD operations proxy
- `/api/backend-proxy/notify` - Notification proxy

## File Structure

```
deadline-manager-v0/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes (proxy to backend)
│   │   └── backend-proxy/        # Backend proxy routes
│   ├── dashboard/                # Dashboard page
│   └── auth/                     # Auth pages (login/register)
│
├── backend/                      # Python FastAPI backend
│   ├── main.py                   # FastAPI app
│   ├── models.py                 # Database models
│   ├── routers/                  # API route handlers
│   │   ├── auth.py               # Auth endpoints
│   │   └── tasks.py              # Task/deadline endpoints
│   ├── services/                 # Business logic
│   │   └── google_integration.py # Gmail/Calendar integration
│   ├── database.py               # Database setup
│   ├── requirements.txt          # Python dependencies
│   └── deadline_manager.db       # SQLite database (auto-created)
│
├── hooks/                        # React hooks
│   ├── useBackendAuth.ts         # Backend authentication hook
│   └── useBackendDeadlines.ts    # Backend deadline operations hook
│
├── lib/                          # Shared utilities
│   └── api/
│       └── backend-client.ts     # TypeScript client for backend API
│
└── components/                   # React components
    └── dashboard/                # Dashboard-specific components
```

## Usage Examples

### Frontend (React/TypeScript)

```typescript
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { useBackendDeadlines } from '@/hooks/useBackendDeadlines';

function Dashboard() {
  const { user, token, login, logout } = useBackendAuth();
  const { 
    deadlines, 
    upcomingDeadlines, 
    pastDeadlines,
    createDeadline, 
    updateDeadline,
    syncToCalendar,
    sendEmailNotification 
  } = useBackendDeadlines(token);

  // Login
  await login('user@example.com', 'password');

  // Create deadline
  await createDeadline({
    title: 'Submit Report',
    description: 'Q4 Financial Report',
    deadline: '2026-02-15T17:00:00Z',
    priority: 'high'
  });

  // Send Gmail notification
  await sendEmailNotification(deadline.id);

  // Sync to Google Calendar
  await syncToCalendar(deadline.id);

  // Logout
  logout();
}
```

### Direct Backend API (cURL)

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}' \
  | jq -r '.access_token')

# Get upcoming deadlines
curl -X GET http://localhost:8000/api/tasks/upcoming?days=7 \
  -H "Authorization: Bearer $TOKEN"

# Create deadline
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Meeting","deadline":"2026-02-01T10:00:00Z","priority":"high"}'
```

## Testing

### Test Backend Endpoints
```bash
cd backend
python test_endpoints.py
```

### Test Frontend
```bash
pnpm dev
# Open http://localhost:3000
# Register -> Login -> Create Deadline -> View Dashboard
```

## Production Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repo to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set `NEXT_PUBLIC_BACKEND_URL` to backend URL
4. Deploy

## Database

- **Development**: SQLite (`backend/deadline_manager.db`)
- **Production**: PostgreSQL (recommended)

To switch to PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@host:5432/deadline_db
```

## Troubleshooting

### Backend won't start
```bash
cd backend
pip install -r requirements.txt
rm deadline_manager.db  # Recreate DB
python -m uvicorn main:app --reload --port 8000
```

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Check CORS settings in `backend/main.py`

### Authentication issues
- Clear localStorage: `localStorage.clear()`
- Re-login to get new token
- Check token expiration (30 minutes default)

## Next Steps

1. Configure Google OAuth credentials
2. Test Gmail/Calendar integration
3. Add real-time notifications
4. Deploy to production
5. Setup monitoring and logging

For detailed API documentation, visit http://localhost:8000/api/docs after starting the backend.
