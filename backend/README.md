# DeadlineSync - FastAPI Backend

Production-ready backend system for intelligent deadline and task management with JWT authentication and smart prioritization.

## Features

### Authentication & User Management
- ✅ User registration with email validation
- ✅ Secure password hashing (bcrypt)
- ✅ JWT-based authentication (access + refresh tokens)
- ✅ User profile management
- ✅ Token refresh mechanism

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Task filtering by status and priority
- ✅ Full task history tracking
- ✅ Automatic timestamp management (created_at, updated_at, completed_at)

### Intelligent Prioritization Algorithm
The system automatically calculates task priority scores (0-100) based on:
1. **User-defined priority**: CRITICAL (100), HIGH (75), MEDIUM (50), LOW (20)
2. **Time urgency**: 
   - < 1 hour: 2x multiplier
   - < 24 hours: 1.5x multiplier
   - < 7 days: 1.2x multiplier
3. **Task status**: Completed/missed tasks are deprioritized
4. **Urgency levels**: AUTO-CALCULATED as CRITICAL, HIGH, MEDIUM, LOW

### Analytics & Insights
- Task statistics (total, completed, pending, missed, in-progress)
- Completion rate calculation
- Average completion time tracking
- Overdue task detection
- Upcoming tasks (next 7 days)

### Smart Recommendations
- **Recommended Next Task**: The single most urgent task to work on
- **Upcoming Tasks**: All pending/in-progress tasks sorted by calculated priority
- **Past Tasks**: Completed and missed tasks with full history

## Architecture

```
backend/
├── main.py              # FastAPI application
├── models.py            # SQLAlchemy ORM models
├── schemas.py           # Pydantic validation schemas
├── database.py          # Database connection & setup
├── auth.py              # JWT & password utilities
├── routers/
│   ├── auth.py          # Authentication endpoints
│   ├── tasks.py         # Task management endpoints
│   └── __init__.py
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md           # This file
```

## Database Schema

### Users Table
- id (Primary Key)
- name (String)
- email (Unique, Indexed)
- hashed_password
- is_active (Boolean)
- created_at (DateTime)
- updated_at (DateTime)

### Tasks Table
- id (Primary Key)
- user_id (Foreign Key → Users)
- title (String)
- description (Text)
- deadline (DateTime, Indexed)
- status (Enum: pending, in_progress, completed, missed)
- priority (Enum: low, medium, high, critical)
- completed_at (DateTime, nullable)
- created_at (DateTime)
- updated_at (DateTime)

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/register
  Create new user account
  Request: { name, email, password }
  Response: { access_token, token_type, user }

POST /api/auth/login
  Login with email and password
  Request: { email, password }
  Response: { access_token, token_type, user }

POST /api/auth/refresh
  Get new access token using refresh token
  Request: { refresh_token }
  Response: { access_token, token_type }

GET /api/auth/me
  Get current user info
  Response: { id, name, email, is_active, created_at }

POST /api/auth/logout
  Logout (client discards tokens)
  Response: { message }
```

### Task Endpoints

```
POST /api/tasks/
  Create new task
  Request: { title, description?, deadline, priority? }
  Response: TaskDetailedResponse with priority_score

GET /api/tasks/
  Get all user tasks (with optional filters)
  Query params: ?status=pending&priority=high
  Response: List[TaskDetailedResponse]

GET /api/tasks/{task_id}
  Get specific task
  Response: TaskDetailedResponse

PUT /api/tasks/{task_id}
  Update task (auto-sets completed_at when marked complete)
  Request: { title?, description?, deadline?, status?, priority? }
  Response: TaskDetailedResponse

DELETE /api/tasks/{task_id}
  Delete task
  Response: 204 No Content
```

### Analytics Endpoints

```
GET /api/tasks/analytics/dashboard
  Get task statistics and metrics
  Response: TaskAnalytics
  {
    total_tasks: int,
    completed_tasks: int,
    pending_tasks: int,
    missed_tasks: int,
    in_progress_tasks: int,
    completion_rate: float,
    average_completion_time: float,
    overdue_count: int,
    upcoming_count: int
  }

GET /api/tasks/prioritized/all
  Get all tasks organized by priority
  Response: PrioritizedTasksResponse
  {
    recommended_next_task: TaskDetailedResponse,
    upcoming_tasks: List[TaskDetailedResponse],
    past_tasks: List[TaskDetailedResponse]
  }
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env and change SECRET_KEY to a secure value
```

### 3. Run the Server
```bash
python main.py
# Server runs on http://localhost:8000
```

### 4. Access API Documentation
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Authentication Flow

### 1. Register
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": { "id": 1, "name": "John Doe", ... }
}
```

### 2. Use Access Token
```javascript
GET /api/tasks/
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
```

### 3. Refresh Token (if expired)
```javascript
POST /api/auth/refresh
{ "refresh_token": "eyJhbGc..." }
```

## Priority Calculation Example

**Task**: "Complete Project Report"
- User Priority: HIGH (75 points)
- Deadline: 2 hours away → 2x urgency multiplier
- Calculated Score: 75 × 2.0 = **150 (capped at 100)**
- Urgency Level: **CRITICAL**

**Task**: "Review Code"
- User Priority: MEDIUM (50 points)
- Deadline: 5 days away → 1.2x urgency multiplier
- Calculated Score: 50 × 1.2 = **60**
- Urgency Level: **HIGH**

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ User isolation (can only access own tasks)
- ✅ CORS configuration for frontend integration
- ✅ HTTP Bearer token scheme
- ✅ Inactive user detection

## Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Create Task
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete report",
    "deadline": "2026-02-28T17:00:00Z",
    "priority": "high"
  }'

# Get Prioritized Tasks
curl -X GET http://localhost:8000/api/tasks/prioritized/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Python requests
```python
import requests

BASE_URL = "http://localhost:8000"

# Register
resp = requests.post(f"{BASE_URL}/api/auth/register", json={
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
})
token = resp.json()["access_token"]

# Create task
headers = {"Authorization": f"Bearer {token}"}
resp = requests.post(f"{BASE_URL}/api/tasks/", headers=headers, json={
    "title": "Complete report",
    "deadline": "2026-02-28T17:00:00Z",
    "priority": "high"
})

# Get recommended task
resp = requests.get(f"{BASE_URL}/api/tasks/prioritized/all", headers=headers)
print(resp.json()["recommended_next_task"])
```

## Frontend Integration

The backend is ready to be integrated with the Next.js frontend. Update the API calls to point to `http://localhost:8000`:

```typescript
// hooks/useAuth.ts
const login = async (email: string, password: string) => {
  const res = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  localStorage.setItem('access_token', data.access_token);
  return data;
};
```

## Deployment

### For Production
1. Change `SECRET_KEY` to a strong random value
2. Use PostgreSQL instead of SQLite
3. Set `DEBUG=False`
4. Configure CORS properly (remove `allow_origins=["*"]`)
5. Use environment variables for all secrets
6. Deploy with Gunicorn: `gunicorn main:app`

### Docker Support
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Performance Tips

- Database queries are indexed on `user_id`, `deadline`, and `email`
- Task prioritization is calculated on-the-fly (can be cached)
- Past tasks query is limited to 50 most recent
- Use pagination for large task lists (future enhancement)

## Future Enhancements

- [ ] Task subtasks/checklists
- [ ] Recurring tasks
- [ ] Task collaboration and sharing
- [ ] Email reminders
- [ ] Webhook notifications
- [ ] Task dependencies
- [ ] Bulk operations
- [ ] Advanced filtering and search
- [ ] Rate limiting
- [ ] Task attachments
- [ ] Comments on tasks
- [ ] Activity logging

## License

MIT
