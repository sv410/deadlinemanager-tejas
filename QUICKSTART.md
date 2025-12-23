# QuickStart Guide - DeadlineSync with Google Integration

## 5-Minute Setup

### Step 1: Clone & Install (2 minutes)
```bash
git clone <repo>
cd deadline-manager-v0
pnpm install
```

### Step 2: Get Google Credentials (2 minutes)
1. Go to https://console.cloud.google.com/
2. Create project → Enable APIs (Calendar, Gmail, Meet)
3. Create OAuth2 credentials (Web app)
4. Set redirect: `http://localhost:3000/api/auth/google/callback`
5. Copy Client ID & Secret

### Step 3: Setup Environment (1 minute)
```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
```

Other optional but recommended:
```env
GMAIL_APP_EMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=app_password_from_google
```

### Step 4: Database
Run SQL migrations from `scripts/007_google_integration.sql` in Supabase

### Step 5: Run
```bash
pnpm dev
```

Visit: `http://localhost:3000` → Click "Get Started with Google"

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/google-config.ts` | OAuth configuration |
| `lib/google-calendar-service.ts` | Calendar operations |
| `lib/email-service.ts` | Email sending |
| `app/api/auth/google/*` | OAuth flow |
| `app/api/deadlines/route.ts` | Create deadlines (with sync) |
| `SETUP_GUIDE.md` | Full setup instructions |

## API Examples

### Create Deadline with Calendar Sync
```bash
curl -X POST http://localhost:3000/api/deadlines \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Submission",
    "description": "Final project due",
    "deadline_date": "2025-12-31",
    "priority": "high",
    "category": "project"
  }'
```

### Get All Deadlines
```bash
curl "http://localhost:3000/api/deadlines?user_id=<user_id>"
```

### Create Google Meet
```bash
curl -X POST http://localhost:3000/api/calendar/meet \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user_id>",
    "deadlineId": "<deadline_id>",
    "title": "Project Discussion"
  }'
```

## Testing Checklist

- [ ] Click "Get Started with Google" on landing page
- [ ] Successfully login with Google
- [ ] Redirected to dashboard
- [ ] Can create a deadline
- [ ] Deadline appears in Google Calendar
- [ ] Email reminder is sent (check spam folder)
- [ ] Can create Google Meet from deadline
- [ ] Meet link works

## Troubleshooting Quick Fixes

**"Redirect URI mismatch"**
- Fix: Ensure redirect URI exactly matches in Google Console

**"Gmail credentials invalid"**
- Fix: Use App Password, not regular password

**"No calendar events created"**
- Fix: Ensure Calendar API is enabled in Google Console

**"Emails not sending"**
- Fix: Check GMAIL_APP_EMAIL and GMAIL_APP_PASSWORD

## Production Deployment

### Environment Setup
1. Set all env vars in production platform
2. Update `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` to production URL
3. Add production OAuth credentials to Google Console
4. Run database migrations on production

### Cron Job Setup
Set up scheduled task to hit endpoint every hour:
```
GET /api/notifications/send?api_key=<CRON_SECRET>
```

Use: Vercel Cron, GitHub Actions, EasyCron, or Cronitor

### Monitoring
- Check error logs regularly
- Monitor email delivery
- Track failed notifications
- Review API usage

## Next Steps

1. ✅ Deploy to production
2. Configure cron job for email reminders
3. Set up monitoring/logging
4. Gather user feedback
5. Implement additional features

## Support

- Full setup guide: `SETUP_GUIDE.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Google APIs docs: https://developers.google.com/

---

**Ready to deploy? Follow SETUP_GUIDE.md for detailed instructions.**
