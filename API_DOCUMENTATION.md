# API Documentation - DeadlineSync

## Base URL
```
http://localhost:3000 (development)
https://yourdomain.com (production)
```

## Authentication
All endpoints except OAuth use Supabase authentication. Include the user's session in requests.

---

## 🔐 OAuth Endpoints

### Google OAuth Initiation
**GET** `/api/auth/google`

Initiates Google OAuth flow. Redirects user to Google consent screen.

**Response:**
- Redirects to Google OAuth URL
- No JSON response

**Example:**
```html
<a href="/api/auth/google">Get Started with Google</a>
```

---

### Google OAuth Callback
**GET** `/api/auth/google/callback?code=<authorization_code>&state=<state>`

Handles OAuth callback from Google. Automatically creates/updates user and stores tokens.

**Query Parameters:**
- `code` (required) - Authorization code from Google
- `state` (optional) - State parameter for CSRF protection

**Response:**
```json
{
  "success": true,
  "userId": "uuid",
  "email": "user@example.com"
}
```

**Response Codes:**
- `302` - Redirect to dashboard on success
- `400` - Missing code or failed token exchange
- `500` - Server error

---

## 📋 Deadline Endpoints

### Create Deadline
**POST** `/api/deadlines`

Creates a new deadline and automatically syncs to Google Calendar.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "title": "Project Submission",
  "description": "Submit final project report",
  "deadline_date": "2025-12-31T23:59:00Z",
  "priority": "high",
  "category": "project"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Project Submission",
    "description": "Submit final project report",
    "deadline_date": "2025-12-31T23:59:00Z",
    "priority": "high",
    "category": "project",
    "status": "pending",
    "created_at": "2025-12-23T10:00:00Z"
  }
}
```

**Response Codes:**
- `201` - Deadline created successfully
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Server error

**Automatic Actions:**
- ✅ Deadline saved to database
- ✅ Event created in Google Calendar
- ✅ Calendar sync record created
- ✅ Email notification sent to user

---

### Get All Deadlines
**GET** `/api/deadlines?user_id=<user_id>`

Fetches all deadlines for a user, ordered by due date.

**Query Parameters:**
- `user_id` (required) - The user's ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Project Submission",
      "description": "Submit final project report",
      "deadline_date": "2025-12-31T23:59:00Z",
      "priority": "high",
      "category": "project",
      "status": "pending",
      "meet_link": null,
      "created_at": "2025-12-23T10:00:00Z",
      "updated_at": "2025-12-23T10:00:00Z"
    }
  ]
}
```

**Response Codes:**
- `200` - Success
- `400` - Missing user_id parameter
- `401` - Unauthorized
- `500` - Server error

---

## 📧 Notification Endpoints

### Send Notifications
**POST** `/api/notifications/send`

Sends notifications for a specific deadline or bulk sends pending reminders.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <session_token>
```

**Request Body (Single Notification):**
```json
{
  "userId": "uuid",
  "deadlineId": "uuid",
  "type": "reminder"
}
```

**Request Body (Bulk Send):**
```json
{
  "action": "send-reminders"
}
```

**Response (200):**
```json
{
  "success": true,
  "sentCount": 5,
  "message": "Successfully sent 5 reminders"
}
```

**Response Codes:**
- `200` - Success
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Server error

---

### Scheduled Reminders (Cron Job)
**GET** `/api/notifications/send?api_key=<CRON_SECRET>`

Webhook endpoint for sending scheduled reminders. Call hourly from a cron service.

**Query Parameters:**
- `api_key` (required) - Must match CRON_SECRET environment variable

**Response (200):**
```json
{
  "success": true,
  "sentCount": 3
}
```

**Response Codes:**
- `200` - Success
- `401` - Invalid API key
- `500` - Server error

**Usage Example (Vercel Cron):**
```json
{
  "crons": [
    {
      "path": "/api/notifications/send?api_key=your_secret_key",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## 📅 Calendar Endpoints

### Create Google Meet
**POST** `/api/calendar/meet`

Creates a Google Meet link for a deadline and adds it to Google Calendar.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "userId": "uuid",
  "deadlineId": "uuid",
  "title": "Project Discussion"
}
```

**Response (200):**
```json
{
  "success": true,
  "meetLink": "https://meet.google.com/xxx-yyyy-zzz",
  "eventId": "google_calendar_event_id"
}
```

**Response Codes:**
- `200` - Meet created successfully
- `400` - Missing required fields or calendar not connected
- `401` - Unauthorized
- `500` - Server error

---

### Get Google Meet Link
**GET** `/api/calendar/meet?user_id=<user_id>&deadline_id=<deadline_id>`

Retrieves an existing Google Meet link for a deadline.

**Query Parameters:**
- `user_id` (required) - The user's ID
- `deadline_id` (required) - The deadline's ID

**Response (200):**
```json
{
  "success": true,
  "meetLink": "https://meet.google.com/xxx-yyyy-zzz"
}
```

**Response Codes:**
- `200` - Success
- `400` - Missing parameters
- `401` - Unauthorized
- `404` - Deadline or meet link not found
- `500` - Server error

---

## 🔄 Data Models

### User
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "google_id": "google_user_id",
  "created_at": "2025-12-23T10:00:00Z",
  "updated_at": "2025-12-23T10:00:00Z"
}
```

### Deadline
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Project Submission",
  "description": "Submit final project report",
  "deadline_date": "2025-12-31T23:59:00Z",
  "priority": "high",
  "category": "project",
  "status": "pending",
  "meet_link": "https://meet.google.com/...",
  "created_at": "2025-12-23T10:00:00Z",
  "updated_at": "2025-12-23T10:00:00Z"
}
```

### Email Notification
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "deadline_id": "uuid",
  "email_address": "user@example.com",
  "notification_type": "reminder",
  "send_at": "2025-12-31T10:00:00Z",
  "sent_at": "2025-12-31T10:00:15Z",
  "status": "sent",
  "error_message": null,
  "created_at": "2025-12-23T10:00:00Z"
}
```

### Google Token
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "access_token": "encrypted_token",
  "refresh_token": "encrypted_token",
  "expires_at": "2025-12-24T10:00:00Z",
  "created_at": "2025-12-23T10:00:00Z",
  "updated_at": "2025-12-23T10:00:00Z"
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message describing what went wrong",
  "details": "Additional error details (if available)"
}
```

### Common Error Codes

| Status | Error | Solution |
|--------|-------|----------|
| `400` | Missing required fields | Check request body |
| `401` | Unauthorized | Ensure user is logged in |
| `404` | Not found | Verify resource IDs |
| `500` | Internal server error | Check server logs |

---

## Rate Limiting

Rate limiting is recommended for production:
- 100 requests per minute per user
- 1000 requests per hour per IP

---

## Best Practices

### 1. Error Handling
```javascript
const response = await fetch('/api/deadlines', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(deadlineData)
});

if (!response.ok) {
  const error = await response.json();
  console.error('Failed:', error.error);
}
```

### 2. Retry Logic
```javascript
const maxRetries = 3;
let attempt = 0;

while (attempt < maxRetries) {
  try {
    const response = await fetch(url);
    if (response.ok) break;
  } catch (error) {
    attempt++;
    if (attempt >= maxRetries) throw error;
    await new Promise(r => setTimeout(r, 1000 * attempt));
  }
}
```

### 3. Polling for Updates
```javascript
// Check for new deadlines every 30 seconds
setInterval(() => {
  fetch(`/api/deadlines?user_id=${userId}`)
    .then(r => r.json())
    .then(data => updateDeadlines(data));
}, 30000);
```

---

## Testing with cURL

### Create Deadline
```bash
curl -X POST http://localhost:3000/api/deadlines \
  -H "Content-Type: application/json" \
  -H "Cookie: your_session_cookie" \
  -d '{
    "title": "Test Deadline",
    "deadline_date": "2025-12-31",
    "priority": "high",
    "category": "test"
  }'
```

### Get Deadlines
```bash
curl "http://localhost:3000/api/deadlines?user_id=your_user_id" \
  -H "Cookie: your_session_cookie"
```

### Create Google Meet
```bash
curl -X POST http://localhost:3000/api/calendar/meet \
  -H "Content-Type: application/json" \
  -H "Cookie: your_session_cookie" \
  -d '{
    "userId": "your_user_id",
    "deadlineId": "deadline_id",
    "title": "Project Meeting"
  }'
```

---

## Webhook Security

For webhook endpoints (like cron jobs):
- Use a strong CRON_SECRET (32+ characters)
- Verify API key on every request
- Log all webhook requests
- Monitor for abuse

---

## Pagination

Currently not implemented. For large datasets, implement:
```
?limit=20&offset=0
```

---

## Versioning

Current API version: **v1** (implicit)

Future: Plan for `/api/v2/` when breaking changes needed

---

## Support

- Docs: See SETUP_GUIDE.md
- Issues: Check IMPLEMENTATION_SUMMARY.md troubleshooting
- Questions: Review code comments

---

**Last Updated:** December 23, 2025
