# FastAPI Backend + Next.js Frontend Integration Guide

## System Architecture

```
┌─────────────────────────────────────┐
│     Next.js Frontend (Port 3000)    │
│  - Authentication Pages             │
│  - Task Dashboard                   │
│  - Priority Visualization           │
└──────────────┬──────────────────────┘
               │ HTTP/REST
               ▼
┌─────────────────────────────────────┐
│   FastAPI Backend (Port 8000)       │
│  - JWT Authentication               │
│  - Task Management CRUD             │
│  - Intelligent Prioritization       │
│  - Analytics & Recommendations      │
└──────────────┬──────────────────────┘
               │ ORM
               ▼
        ┌──────────────┐
        │ SQLite DB    │
        │ (Local Dev)  │
        └──────────────┘
```

## Getting Started

### Step 1: Start Backend (Already Running)
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# API Documentation: http://localhost:8000/api/docs
```

### Step 2: Start Frontend (Already Running)
```bash
cd .
pnpm dev

# Website: http://localhost:3000
```

## Integration Steps

### 1. Update Authentication Context

Create `hooks/useAuth.ts`:

```typescript
import { useState, useCallback } from 'react'

export interface User {
  id: number
  name: string
  email: string
  is_active: boolean
  created_at: string
}

interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  )
  const [user, setUser] = useState<User | null>(null)

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    
    if (!res.ok) throw new Error('Registration failed')
    
    const data: AuthResponse = await res.json()
    setToken(data.access_token)
    setUser(data.user)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token || '')
    return data
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!res.ok) throw new Error('Login failed')
    
    const data: AuthResponse = await res.json()
    setToken(data.access_token)
    setUser(data.user)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token || '')
    return data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }, [])

  return { token, user, register, login, logout }
}
```

### 2. Create Task Service

Create `lib/api/tasks.ts`:

```typescript
const API_URL = 'http://localhost:8000/api/tasks'

interface Task {
  id: number
  user_id: number
  title: string
  description?: string
  deadline: string
  status: 'pending' | 'in_progress' | 'completed' | 'missed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
  updated_at: string
  completed_at?: string
  priority_score: number
  urgency_level: string
  is_overdue: boolean
  hours_until_deadline: number
}

interface PrioritizedTasks {
  recommended_next_task?: Task
  upcoming_tasks: Task[]
  past_tasks: Task[]
}

export const taskApi = {
  // Create task
  async create(token: string, task: any) {
    const res = await fetch(`${API_URL}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    return res.json()
  },

  // Get all tasks
  async getAll(token: string, status?: string, priority?: string) {
    let url = API_URL
    const params = new URLSearchParams()
    if (status) params.append('status_filter', status)
    if (priority) params.append('priority_filter', priority)
    if (params.toString()) url += `?${params.toString()}`

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  },

  // Get single task
  async get(token: string, taskId: number) {
    const res = await fetch(`${API_URL}/${taskId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  },

  // Update task
  async update(token: string, taskId: number, updates: any) {
    const res = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })
    return res.json()
  },

  // Delete task
  async delete(token: string, taskId: number) {
    const res = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.ok
  },

  // Get analytics
  async getAnalytics(token: string) {
    const res = await fetch(`${API_URL}/analytics/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  },

  // Get prioritized tasks
  async getPrioritized(token: string): Promise<PrioritizedTasks> {
    const res = await fetch(`${API_URL}/prioritized/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  }
}
```

### 3. Update Dashboard Component

Integrate with backend:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { taskApi } from '@/lib/api/tasks'

export default function Dashboard() {
  const { token } = useAuth()
  const [prioritized, setPrioritized] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    if (!token) return

    // Load prioritized tasks
    taskApi.getPrioritized(token).then(setPrioritized)
    // Load analytics
    taskApi.getAnalytics(token).then(setAnalytics)
  }, [token])

  if (!prioritized) return <div>Loading...</div>

  return (
    <div>
      <h2>Next Task to Complete:</h2>
      {prioritized.recommended_next_task && (
        <div>
          <h3>{prioritized.recommended_next_task.title}</h3>
          <p>Priority Score: {prioritized.recommended_next_task.priority_score}/100</p>
          <p>Urgency: {prioritized.recommended_next_task.urgency_level}</p>
        </div>
      )}

      <h2>Upcoming Tasks</h2>
      {prioritized.upcoming_tasks.map(task => (
        <div key={task.id}>
          <h4>{task.title}</h4>
          <p>Score: {task.priority_score} | Level: {task.urgency_level}</p>
        </div>
      ))}
    </div>
  )
}
```

## API Response Examples

### Register/Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "is_active": true,
    "created_at": "2026-01-23T10:00:00"
  }
}
```

### Create Task Response
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Complete project report",
  "description": "Finish Q4 report",
  "deadline": "2026-02-28T17:00:00Z",
  "status": "pending",
  "priority": "high",
  "priority_score": 87.5,
  "urgency_level": "CRITICAL",
  "is_overdue": false,
  "hours_until_deadline": 35.5,
  "created_at": "2026-01-23T10:00:00Z",
  "updated_at": "2026-01-23T10:00:00Z",
  "completed_at": null
}
```

### Prioritized Tasks Response
```json
{
  "recommended_next_task": {
    "id": 1,
    "title": "Complete project report",
    "priority_score": 95,
    "urgency_level": "CRITICAL",
    "hours_until_deadline": 2.5
  },
  "upcoming_tasks": [
    { "id": 1, ... },
    { "id": 3, ... }
  ],
  "past_tasks": [
    { "id": 2, "status": "completed" },
    { "id": 4, "status": "missed" }
  ]
}
```

## Testing Workflow

### 1. Register a User
Visit http://localhost:8000/api/docs
- Click "POST /api/auth/register"
- Execute with sample data

### 2. Create Tasks
- Use returned access token
- Create multiple tasks with different deadlines
- Set different priorities

### 3. View Recommendations
- GET /api/tasks/prioritized/all
- See recommended next task
- View analytics dashboard

### 4. Update Tasks
- PUT /api/tasks/{task_id}
- Change status to "completed"
- Watch analytics update

## Key Features Explained

### Priority Score Calculation
```
Base Score: LOW=20, MEDIUM=50, HIGH=75, CRITICAL=100

Multipliers:
- < 1 hour: 2.0x
- < 24 hours: 1.5x
- < 7 days: 1.2x
- Overdue: 2.0x

Example:
HIGH priority (75) with 2 hours left = 75 × 1.5 = 112.5 → capped at 100
```

### Urgency Levels
- CRITICAL: Score >= 75
- HIGH: Score >= 50
- MEDIUM: Score >= 25
- LOW: Score < 25

## Production Deployment

### Backend
```bash
# Using Gunicorn
gunicorn main:app --workers 4

# Using Docker
docker build -t deadline-api .
docker run -p 8000:8000 deadline-api
```

### Frontend
```bash
# Build and deploy Next.js
pnpm build
pnpm start

# Or deploy to Vercel
vercel deploy
```

## Environment Variables

Backend (`.env`):
```
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://user:pass@localhost/deadline_db
```

Frontend (`.env.local`):
```
NEXT_PUBLIC_API_URL=https://api.deadline-manager.com
```

## Security Checklist

- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt
- ✅ CORS properly configured
- ✅ User data isolation
- ✅ Database indexes on foreign keys
- ✅ Input validation with Pydantic
- ✅ Error handling without leaking details

## Troubleshooting

### CORS Issues
If frontend can't reach backend, check CORS in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Token Expiration
Implement token refresh:
```typescript
const refreshAccessToken = async () => {
  const refresh = localStorage.getItem('refresh_token')
  const res = await fetch('http://localhost:8000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh })
  })
  const data = await res.json()
  localStorage.setItem('access_token', data.access_token)
}
```

## Summary

You now have a **production-ready system**:
- ✅ Secure authentication with JWT
- ✅ Intelligent task prioritization
- ✅ Full task history and analytics
- ✅ User data isolation
- ✅ RESTful API design
- ✅ Comprehensive documentation
- ✅ Ready for database scaling
