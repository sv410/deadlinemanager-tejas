# ⚡ Quick Start - Environment Setup

## 5-Minute Setup for Local Development

Follow these steps to get DeadlineSync running locally with all environment variables configured.

---

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Supabase account (free)
- A Google Cloud account (free)

---

## Step 1: Clone and Install (1 minute)

```bash
git clone https://github.com/sv410/deadlinemanager-tejas.git
cd deadlinemanager-tejas
pnpm install
```

---

## Step 2: Create Supabase Project (2 minutes)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Enter name: `deadlinesync`
4. Generate strong password
5. Choose region
6. Click **"Create"**
7. Wait ~2 minutes

### Get Credentials:
- Go to **Settings** → **API**
- Copy **Project URL** (e.g., `https://abc123.supabase.co`)
- Copy **anon public** key (starts with `eyJ...`)

### Setup Database:
1. Go to **SQL Editor**
2. Click **"New query"**
3. Copy contents of `scripts/001_create_tables.sql`
4. Paste and click **"Run"**
5. Repeat for `scripts/002_update_auth_settings.sql`
6. Repeat for `scripts/006_disable_email_confirmation.sql`

---

## Step 3: Create Google OAuth (1 minute)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: `DeadlineSync`
3. Go to **APIs & Services** → **Credentials**
4. Click **"Configure Consent Screen"**
   - Choose **External**
   - Fill in app name and email
   - Save
5. Click **"Create Credentials"** → **"OAuth client ID"**
   - Type: **Web application**
   - Add redirect URI: `http://localhost:3000/api/auth/google/callback`
   - Click **"Create"**
6. Copy **Client ID** and **Client Secret**

---

## Step 4: Configure Environment (30 seconds)

```bash
# Copy the example file
cp .env.example .env.local

# Open in your editor
nano .env.local
# or
code .env.local
```

### Fill in these values:

```env
# From Supabase (Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-key

# From Google Cloud (Step 3)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret

# Leave these as-is for local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

**Save the file!**

---

## Step 5: Start Development Server (30 seconds)

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Verify Setup

Test these features:

1. ✅ Site loads at http://localhost:3000
2. ✅ Click **"Sign Up"** - should open sign up form
3. ✅ Create an account with email/password
4. ✅ Log in successfully
5. ✅ Click **"Add Deadline"** - should open dialog
6. ✅ Create a test deadline
7. ✅ Deadline appears in the list
8. ✅ Can mark deadline as complete
9. ✅ Can delete deadline

**All working?** 🎉 You're ready to develop!

---

## Troubleshooting

### Error: "Invalid Supabase URL"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure no trailing slash
- Format: `https://projectid.supabase.co`

### Error: "OAuth error"
- Verify redirect URI in Google Console
- Must be exactly: `http://localhost:3000/api/auth/google/callback`
- Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is correct

### Error: "Cannot create deadline"
- Ensure SQL scripts ran successfully in Supabase
- Check user is logged in
- Verify RLS policies exist (run `001_create_tables.sql` again)

### Site won't start
- Check `.env.local` exists
- Verify all required variables are set
- Run `pnpm install` again
- Clear `.next` folder: `rm -rf .next && pnpm dev`

---

## Next Steps

### For Local Development:
- Start coding! The app reloads automatically on changes
- Check `ARCHITECTURE.md` to understand the codebase
- See `API_DOCUMENTATION.md` for API routes

### For Production Deployment:
- See `DEPLOYMENT_SETUP.md` for complete deployment guide
- See `VERCEL_SETUP.md` for Vercel environment variables
- See `DEPLOYMENT_QUICKSTART.md` for quick deployment

### Optional Features:
- **Email Notifications:** See `ENV_VARIABLES_GUIDE.md` for Gmail setup
- **Additional Tables:** Run optional SQL scripts in `scripts/` folder
- **Gamification:** Run `scripts/008_gamification_system.sql`
- **Team Features:** Run `scripts/009_collaboration_insights.sql`

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon key |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ✅ Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ Yes | Google OAuth secret |
| `NEXT_PUBLIC_BASE_URL` | ✅ Yes | Your app URL |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | ✅ Yes | OAuth callback URL |
| `GMAIL_APP_EMAIL` | ❌ No | Gmail for notifications |
| `GMAIL_APP_PASSWORD` | ❌ No | Gmail app password |
| `CRON_SECRET` | ❌ No | Webhook security key |

---

## Quick Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Clear build cache
rm -rf .next

# Reset database (⚠️ deletes all data)
# Run in Supabase SQL Editor:
# DROP TABLE deadlines CASCADE;
# DROP TABLE profiles CASCADE;
# Then re-run 001_create_tables.sql
```

---

## Support

**Documentation:**
- `README.md` - Project overview
- `DEPLOYMENT_SETUP.md` - Full deployment guide
- `ENV_VARIABLES_GUIDE.md` - All environment variables
- `scripts/README.md` - Database setup guide

**Need Help?**
- Check error messages carefully
- Review troubleshooting sections
- Open an issue on GitHub

---

**Total Setup Time:** ~5 minutes  
**Cost:** $0 (all free tiers)  
**Difficulty:** ⭐⭐ Easy

---

**Ready to deploy?** See `DEPLOYMENT_SETUP.md` for production deployment!
