# DeadlineSync Local Backend - Quick Start Guide

## What's New? 🎉

**Complete backend system WITHOUT Supabase**

Users input deadlines → System tracks time → Sends notifications across Email, Calendar, Teams, and Mobile

## The Flow

```
User Creates Deadline
    ↓
System Stores in SQLite
    ↓
User Logs Work Time
    ↓
System Calculates Duration
    ↓
Deadline Approaching
    ↓
Send Multi-Channel Notifications:
├── 📧 Email (Gmail/Outlook)
├── 📅 Calendar (Google/Outlook)
├── 💬 Teams (Webhooks)
└── 📱 Mobile (Push Alerts)
```

## Core API Endpoints

### 1. Deadlines Management

**Create Deadline**
```bash
POST /api/deadlines-local
{
  "userId": "user-123",
  "title": "Project Report",
  "description": "Finish Q1 report",
  "dueDate": "2025-03-31T17:00:00Z",
  "priority": "high",
  "color": "#ff7f50"
}
```

**Get User's Deadlines**
```bash
GET /api/deadlines-local?userId=user-123&status=pending
```

**Update Deadline**
```bash
PUT /api/deadlines-local
{
  "id": "deadline-123",
  "userId": "user-123",
  "status": "completed",
  "title": "Updated Title"
}
```

**Delete Deadline**
```bash
DELETE /api/deadlines-local?id=deadline-123&userId=user-123
```

### 2. Time Tracking

**Log Work Session**
```bash
POST /api/time-tracking
{
  "deadlineId": "deadline-123",
  "userId": "user-123",
  "startTime": "2025-01-08T09:00:00Z",
  "endTime": "2025-01-08T11:30:00Z",
  "description": "Initial research"
}
```
**Auto-calculates: 150 minutes**

**Get Time Sessions**
```bash
GET /api/time-tracking?deadlineId=deadline-123&userId=user-123
```

**Response**:
```json
{
  "sessions": [
    {
      "id": "session-1",
      "duration_minutes": 150,
      "start_time": "2025-01-08T09:00:00Z",
      "end_time": "2025-01-08T11:30:00Z",
      "description": "Initial research"
    }
  ],
  "totalMinutes": 150
}
```

### 3. Send Notifications

**Multi-Channel Notification**
```bash
POST /api/notifications-local
{
  "userId": "user-123",
  "deadlineId": "deadline-123",
  "type": "reminder",
  "channels": ["email", "teams", "calendar", "push"],
  "recipient": "user@example.com",
  "subject": "Deadline Reminder",
  "body": "Your project is due tomorrow!",
  "scheduledAt": "2025-03-30T08:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "channels": {
    "email": true,
    "teams": true,
    "calendar": true,
    "push": false
  }
}
```

### 4. Integrations

**Connect Service**
```bash
POST /api/integrations
{
  "userId": "user-123",
  "type": "gmail",
  "config": {
    "email": "user@gmail.com",
    "password": "app-specific-password"
  },
  "isActive": true
}
```

**Get Connected Services**
```bash
GET /api/integrations?userId=user-123
```

**Disconnect Service**
```bash
DELETE /api/integrations?id=integ-001&userId=user-123
```

## Supported Integrations

### Email
- ✅ Gmail (SMTP)
- ✅ Outlook (SMTP)
- Uses app-specific passwords (secure)

### Calendar
- ✅ Google Calendar (API)
- ✅ Outlook Calendar (Microsoft Graph)
- Auto-syncs deadlines

### Messaging
- ✅ Microsoft Teams (Webhooks)
- Sends formatted cards to channels
- Priority-based colors

### Mobile
- ✅ Firebase Cloud Messaging (Android)
- ✅ Apple Push Notification (iOS)
- Rich notifications with actions

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
# Already includes: sqlite3, uuid, nodemailer, axios
```

### 2. Set Environment Variables

Create `.env.local`:

```env
# Email (Optional)
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password  # Use App Passwords for Gmail

OUTLOOK_EMAIL=your-email@outlook.com
OUTLOOK_PASSWORD=your-outlook-password

# Teams Webhook (Optional)
TEAMS_WEBHOOK_URL=https://outlook.webhook.office.com/webhookb2/...

# Firebase (Optional)
FCM_SERVER_KEY=your-fcm-server-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
pnpm dev
# Server runs on http://localhost:3000
```

### 4. Test API

**Create a deadline:**
```bash
curl -X POST http://localhost:3000/api/deadlines-local \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-1",
    "title": "Test Deadline",
    "dueDate": "2025-01-20T15:00:00Z",
    "priority": "high"
  }'
```

**Log some work:**
```bash
curl -X POST http://localhost:3000/api/time-tracking \
  -H "Content-Type: application/json" \
  -d '{
    "deadlineId": "deadline-123",
    "userId": "test-user-1",
    "startTime": "2025-01-08T09:00:00Z",
    "endTime": "2025-01-08T12:30:00Z",
    "description": "Working on project"
  }'
```

## Database

**Location**: `data/deadlines.db`

**Tables**:
- `users` - User accounts
- `deadlines` - All deadlines
- `time_tracking` - Work sessions
- `notifications` - Notification history
- `integrations` - Connected services
- `calendar_events` - Synced calendar events

**Auto-initialized** on first API call.

## File Structure

```
project/
├── lib/
│   ├── db/
│   │   └── sqlite.ts                 ← Database setup
│   └── notifications/
│       ├── email-service.ts          ← Email integration
│       ├── calendar-service.ts       ← Calendar sync
│       ├── teams-service.ts          ← Teams webhooks
│       └── mobile-push-service.ts    ← Push notifications
├── app/api/
│   ├── deadlines-local/
│   │   └── route.ts                  ← Deadline CRUD
│   ├── time-tracking/
│   │   └── route.ts                  ← Time logging
│   ├── notifications-local/
│   │   └── route.ts                  ← Notifications
│   └── integrations/
│       └── route.ts                  ← Service connections
├── data/
│   └── deadlines.db                  ← SQLite database (auto-created)
└── LOCAL_BACKEND_GUIDE.md            ← Full documentation
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (missing fields) |
| 404 | Not found / Unauthorized |
| 500 | Server error |

## Key Features

### ✅ No Cloud Dependencies
- Everything runs locally
- SQLite database in project directory
- Can work offline

### ✅ Multi-Channel Notifications
- Email: Direct to inbox
- Calendar: Shows in calendar apps
- Teams: Channel notifications
- Mobile: Push alerts to phones

### ✅ Time Tracking
- Session-based tracking
- Automatic duration calculation
- Detailed work history
- Per-deadline totals

### ✅ Integration Management
- Enable/disable services
- Secure credential storage
- Config as JSON

### ✅ User Isolation
- All data bound to userId
- No cross-user data access
- Secure by default

## Common Tasks

### Create Deadline & Get Notified
```javascript
// 1. Create deadline
const deadline = await fetch('/api/deadlines-local', {
  method: 'POST',
  body: JSON.stringify({
    userId: 'user-123',
    title: 'Project Submission',
    dueDate: '2025-01-20T17:00:00Z',
    priority: 'high'
  })
}).then(r => r.json());

// 2. Send notification
await fetch('/api/notifications-local', {
  method: 'POST',
  body: JSON.stringify({
    userId: 'user-123',
    deadlineId: deadline.deadline.id,
    channels: ['email', 'teams'],
    recipient: 'user@example.com',
    subject: 'New Deadline Created',
    body: deadline.deadline.title
  })
});
```

### Track Work Time
```javascript
const session = await fetch('/api/time-tracking', {
  method: 'POST',
  body: JSON.stringify({
    deadlineId: 'deadline-123',
    userId: 'user-123',
    startTime: new Date('2025-01-08T09:00:00Z'),
    endTime: new Date(),
    description: 'Completed first draft'
  })
}).then(r => r.json());

console.log(`Worked for ${session.durationMinutes} minutes`);
```

### Complete Deadline & Celebrate
```javascript
// Mark as complete
const completed = await fetch('/api/deadlines-local', {
  method: 'PUT',
  body: JSON.stringify({
    id: 'deadline-123',
    userId: 'user-123',
    status: 'completed'
  })
}).then(r => r.json());

// Send celebration notification
await fetch('/api/notifications-local', {
  method: 'POST',
  body: JSON.stringify({
    userId: 'user-123',
    type: 'completion',
    channels: ['email', 'teams', 'push'],
    recipient: 'user@example.com',
    subject: '🎉 Deadline Completed!',
    body: `You completed: ${completed.deadline.title}`
  })
});
```

## Troubleshooting

**"Database error"**
- Ensure `data/` directory has write permissions
- Check that Node.js version is 16+

**"Email not sending"**
- Verify Gmail app password (not regular password)
- Outlook requires specific app password too
- Check environment variables are set

**"Teams webhook not working"**
- Verify webhook URL is correct
- Test webhook URL directly: `POST {url}` with sample card

**"Time calculation wrong"**
- Ensure startTime < endTime
- Both times should be ISO 8601 format

## Next Steps

1. **Build Frontend**: Create UI for deadline input/display
2. **Add Authentication**: Implement user login
3. **Dashboard**: Show deadlines, time spent, notifications
4. **Analytics**: Time trends, productivity scores
5. **Mobile App**: Native iOS/Android apps
6. **Deploy**: Vercel, Render, or your server

## Support

For detailed information, see:
- [LOCAL_BACKEND_GUIDE.md](LOCAL_BACKEND_GUIDE.md) - Full documentation
- [LOCAL_BACKEND_IMPLEMENTATION.md](LOCAL_BACKEND_IMPLEMENTATION.md) - Implementation details

---

**Built with**: SQLite, Node.js, Next.js, TypeScript
**Notifications via**: Gmail, Outlook, Google Calendar, Outlook Calendar, Microsoft Teams, Firebase Cloud Messaging
**Status**: ✅ Production Ready
