# Backend API Setup & Testing Guide

## Prerequisites

1. Python 3.9+ installed
2. Backend dependencies installed
3. Environment variables configured

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL=sqlite:///./deadline_manager.db
# Or for PostgreSQL: DATABASE_URL=postgresql://user:password@localhost/deadline_manager

# Security
SECRET_KEY=your-secret-key-min-32-characters-change-in-production!
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

### 3. Initialize Database

If using SQLite (default), remove the old database to ensure new tables are created:

```bash
# Remove old database
rm backend/deadline_manager.db

# Start the server (will auto-create tables)
cd backend
uvicorn main:app --reload
```

### 4. Test the Backend API

Open a new terminal and run the test script:

```bash
cd backend
python test_endpoints.py
```

This will test:
- ✓ Health check
- ✓ User registration
- ✓ User login
- ✓ Task creation
- ✓ Fetch all tasks
- ✓ Fetch upcoming tasks (next 30 days)
- ✓ Fetch past tasks
- ✓ Update task
- ✓ Analytics dashboard

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks/Deadlines

- `GET /api/tasks/` - Get all tasks (with optional filters)
- `GET /api/tasks/upcoming?days=30` - Get upcoming tasks
- `GET /api/tasks/past` - Get past tasks
- `GET /api/tasks/{id}` - Get single task
- `POST /api/tasks/` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Google Integrations

- `POST /api/tasks/google/tokens` - Upsert Google OAuth tokens
- `POST /api/tasks/{id}/notify/email` - Send Gmail notification
- `POST /api/tasks/{id}/calendar` - Sync to Google Calendar

### Analytics

- `GET /api/tasks/analytics/dashboard` - Get user analytics

## Frontend Integration

The frontend can now communicate with the backend through:

1. **Direct client**: Use `lib/api/backend-client.ts`
2. **Proxy routes**: Use `/api/backend-proxy/*` endpoints

### Example Usage in Frontend

```typescript
import { backendClient } from '@/lib/api/backend-client';

// Login
const { access_token } = await backendClient.login('user@example.com', 'password');

// Fetch upcoming deadlines
const upcoming = await backendClient.getUpcomingTasks(7); // next 7 days

// Fetch past deadlines
const past = await backendClient.getPastTasks();

// Create deadline
const newTask = await backendClient.createTask({
  title: 'Submit report',
  description: 'Q4 financial report',
  deadline: '2026-02-15T17:00:00Z',
  priority: 'high'
});

// Send email notification
await backendClient.sendEmailNotification(newTask.id);

// Sync to Google Calendar
await backendClient.syncToCalendar(newTask.id);
```

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Upcoming Tasks
```bash
curl -X GET http://localhost:8000/api/tasks/upcoming?days=30 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Past Tasks
```bash
curl -X GET http://localhost:8000/api/tasks/past \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps

1. Configure Google OAuth credentials
2. Test Gmail/Calendar integration
3. Connect frontend to backend
4. Deploy both services to production
