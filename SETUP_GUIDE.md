# DeadlineSync - Google Integrated Deadline Manager

A modern deadline management application with seamless Google integration for Gmail, Google Calendar, and Google Meet.

## Features

- ✅ **One-Click Google Authentication** - No signup/login forms needed
- 📧 **Email Reminders** - Get deadline reminders via Gmail
- 📅 **Google Calendar Sync** - Automatically sync deadlines to Google Calendar
- 📹 **Google Meet Integration** - Create meeting links directly from deadlines
- 🔔 **Smart Notifications** - Multiple notification channels
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful orange-themed interface

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Google OAuth credentials
- Supabase account
- Gmail account with App Password

### Setup Instructions

#### 1. Clone and Install Dependencies

```bash
git clone <repository>
cd deadline-manager-v0
pnpm install
```

#### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Google Calendar API
   - Gmail API
   - Meet API
4. Create OAuth 2.0 credentials (Web Application):
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
5. Copy the Client ID and Client Secret

#### 3. Setup Gmail App Password

1. Enable 2-Step Verification on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Select Mail and Windows Computer (or your device)
4. Generate an app-specific password

#### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
NEXT_PUBLIC_BASE_URL=http://localhost:3000

GMAIL_APP_EMAIL=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password

CRON_SECRET=your_random_secret_key
```

#### 5. Setup Supabase Database

1. Create a Supabase project
2. Run the SQL migrations:
   - `scripts/001_create_tables.sql`
   - `scripts/002_update_auth_settings.sql`
   - `scripts/003_add_additional_tables.sql`
   - `scripts/004_innovative_features.sql`
   - `scripts/005_fix_auth_settings.sql`
   - `scripts/006_disable_email_confirmation.sql`
   - `scripts/007_google_integration.sql` (NEW)

#### 6. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## How It Works

### Authentication Flow

1. User clicks "Get Started with Google" button
2. Redirected to Google OAuth consent screen
3. User grants permissions for:
   - Email & profile access
   - Google Calendar access
   - Gmail send/read access
   - Google Meet access
4. Redirected back to dashboard with automatic login

### Deadline Management

1. Create deadline with title, description, and due date
2. Automatically synced to Google Calendar
3. Email reminder sent to user
4. Can optionally create a Google Meet link for collaboration

### Email Notifications

Reminders are sent based on:
- 24 hours before deadline
- 1 hour before deadline
- 15 minutes before deadline

Can be customized in the notification settings.

## API Endpoints

### Google OAuth
- `GET /api/auth/google` - Initiates OAuth flow
- `GET /api/auth/google/callback` - OAuth callback handler

### Deadlines
- `POST /api/deadlines` - Create new deadline
- `GET /api/deadlines?user_id=<id>` - Get all deadlines

### Calendar
- `POST /api/calendar/sync` - Sync deadline to calendar
- `POST /api/calendar/meet` - Create Google Meet link

### Notifications
- `POST /api/notifications/send` - Send notifications
- `GET /api/notifications/send?api_key=<key>` - Webhook for cron jobs

## Database Schema

### New Tables Added

**google_tokens**
- Stores OAuth tokens for each user
- Refreshed automatically when needed

**google_calendar_events**
- Maps deadlines to Google Calendar events
- Tracks sync status

**email_notifications**
- Stores notification history
- Tracks sent/failed status

## Running Scheduled Tasks

### Option 1: Vercel Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/notifications/send?api_key=<CRON_SECRET>",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Option 2: External Cron Service

Use services like:
- EasyCron
- Cronitor
- GitHub Actions

Call: `https://yourapp.com/api/notifications/send?api_key=<CRON_SECRET>`

## Troubleshooting

### OAuth Issues
- Ensure redirect URI exactly matches in Google Console
- Check if browser cookies are enabled
- Clear browser cache and try again

### Calendar Sync Not Working
- Verify Google Calendar API is enabled
- Check if tokens have expired
- Ensure user has granted calendar permissions

### Email Not Sending
- Check if Gmail App Password is correct
- Verify Gmail address in environment variables
- Check spam folder
- Ensure 2FA is enabled on Google account

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all secrets
- Implement rate limiting on API endpoints
- Store refresh tokens securely
- Regularly rotate API keys

## Future Enhancements

- [ ] Microsoft Teams integration
- [ ] Slack notifications
- [ ] Recurring deadlines
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Dark mode toggle
- [ ] Calendar view customization

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Supabase logs
4. Check browser console for errors

## License

MIT License - feel free to use this project for personal or commercial use.
