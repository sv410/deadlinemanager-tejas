# 🚀 Complete Deployment Setup Guide

## Overview
This guide will help you set up all environment variables and Supabase connections needed to deploy DeadlineSync.

---

## Part 1: Supabase Setup

### Step 1.1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the details:
   - **Organization:** Select or create one
   - **Project Name:** `deadlinesync` (or your preferred name)
   - **Database Password:** Generate a strong password (save it securely!)
   - **Region:** Choose the closest region to your users
   - **Pricing Plan:** Free tier works perfectly
4. Click **"Create new project"**
5. Wait 2-3 minutes for project initialization

### Step 1.2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **"API"** in the left sidebar
3. You'll see:
   - **Project URL** - Copy this (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key - Copy this (starts with `eyJ...`)

**Save these values! You'll need them for environment variables.**

### Step 1.3: Run Database Migrations

Execute the SQL scripts in order in your Supabase SQL Editor:

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Run each script in sequence:

#### Required Scripts (Must Run):
```sql
-- 1. Run: scripts/001_create_tables.sql
-- Creates profiles and deadlines tables with RLS policies

-- 2. Run: scripts/002_update_auth_settings.sql
-- Configures authentication settings

-- 3. Run: scripts/006_disable_email_confirmation.sql
-- Disables email confirmation for easier testing (optional but recommended)
```

#### Optional Scripts (Run if you want these features):
```sql
-- 4. Run: scripts/003_add_additional_tables.sql
-- Adds tags, notifications, and settings tables

-- 5. Run: scripts/007_google_integration.sql
-- Adds Google Calendar/Gmail integration support

-- 6. Run: scripts/008_gamification_system.sql
-- Adds gamification features (points, achievements, levels)

-- 7. Run: scripts/009_collaboration_insights.sql
-- Adds collaboration and productivity insights
```

**How to run:**
- Open each `.sql` file from the `scripts/` folder
- Copy the entire contents
- Paste into Supabase SQL Editor
- Click **"Run"** or press Ctrl+Enter
- Verify success message (no errors)

### Step 1.4: Verify Database Setup

Run this query to verify tables were created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see: `deadlines`, `profiles`, and optionally more tables depending on which scripts you ran.

---

## Part 2: Google OAuth Setup

### Step 2.1: Create Google Cloud Project

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click **"Select a project"** dropdown at the top
3. Click **"NEW PROJECT"**
4. Fill in:
   - **Project name:** `DeadlineSync` (or your choice)
   - **Organization:** Leave default or select
5. Click **"Create"**
6. Wait for project creation (10-20 seconds)

### Step 2.2: Enable Required APIs

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search and enable these APIs:
   - **Google Calendar API** (for calendar sync)
   - **Gmail API** (for email notifications)
   - **Google People API** (for user info)

For each API:
- Click on the API name
- Click **"Enable"**
- Wait for confirmation

### Step 2.3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace)
3. Click **"Create"**
4. Fill in App Information:
   - **App name:** `DeadlineSync`
   - **User support email:** Your email
   - **App logo:** Optional (skip for now)
   - **Application home page:** `http://localhost:3000` (change later for production)
   - **Developer contact information:** Your email
5. Click **"Save and Continue"**
6. **Scopes:** Click **"Add or Remove Scopes"**
   - Select: `userinfo.email`
   - Select: `userinfo.profile`
   - Select: `openid`
   - (Optional) `calendar` - for calendar integration
   - (Optional) `gmail.send` - for email notifications
7. Click **"Update"** then **"Save and Continue"**
8. **Test users:** Add your email address for testing
9. Click **"Save and Continue"**
10. Review and click **"Back to Dashboard"**

### Step 2.4: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Configure:
   - **Application type:** Web application
   - **Name:** `DeadlineSync Web Client`
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for development)
     - `https://your-app.vercel.app` (add after Vercel deployment)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://your-app.vercel.app/api/auth/google/callback` (add after Vercel deployment)
4. Click **"Create"**
5. A popup will show your credentials:
   - **Client ID:** Copy this (ends with `.apps.googleusercontent.com`)
   - **Client Secret:** Copy this (starts with `GOCSPX-`)

**⚠️ IMPORTANT:** Save both values securely. The Client Secret should never be shared or committed to version control.

---

## Part 3: Environment Variables Setup

### Step 3.1: Create Local Environment File

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your values:

```env
# Supabase (from Part 1)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google OAuth (from Part 2)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### Step 3.2: Optional Environment Variables

Add these if you want additional features:

```env
# Gmail Notifications (Optional)
GMAIL_APP_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Cron Job Secret (Optional)
CRON_SECRET=your-random-secure-key-here
```

**To generate CRON_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**To get Gmail App Password:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account → Security](https://myaccount.google.com/security)
3. Search for "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

---

## Part 4: Verify Local Setup

### Step 4.1: Install Dependencies

```bash
pnpm install
```

If you don't have pnpm:
```bash
npm install -g pnpm
pnpm install
```

### Step 4.2: Test the Application

```bash
pnpm dev
```

The app should start at `http://localhost:3000`

### Step 4.3: Test Authentication

1. Open `http://localhost:3000`
2. Click **"Sign Up"** or **"Login"**
3. Try creating an account
4. Try logging in with Google OAuth
5. Create a test deadline
6. Verify it appears in the list

**If you see errors:**
- Check browser console (F12)
- Check terminal output
- Verify environment variables are correct
- Check Supabase dashboard for errors

---

## Part 5: Deploy to Vercel

### Step 5.1: Prepare for Deployment

1. Ensure all changes are committed:
   ```bash
   git add .
   git commit -m "Setup environment variables and Supabase"
   git push
   ```

2. Ensure `.env.local` is in `.gitignore` (already done)

### Step 5.2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your repository: `sv410/deadlinemanager-tejas`
5. Configure Project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `pnpm build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### Step 5.3: Add Environment Variables in Vercel

Click **"Environment Variables"** and add ALL of these:

| Variable Name | Value | Where to Get |
|---------------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | Google Cloud Console → Credentials |
| `NEXT_PUBLIC_BASE_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL (get after first deploy) |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | `https://your-app.vercel.app/api/auth/google/callback` | Your Vercel URL + callback path |

**Optional Variables:**
| Variable Name | Value |
|---------------|-------|
| `GMAIL_APP_EMAIL` | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` |
| `CRON_SECRET` | `your-generated-secret` |

**Important:** Set environment for **Production**, **Preview**, and **Development**

### Step 5.4: Initial Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Once deployed, copy your Vercel URL (e.g., `https://deadlinemanager-tejas.vercel.app`)

### Step 5.5: Update OAuth Redirect URLs

**Critical Step:** Update Google OAuth settings with your production URL

1. Go back to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **"APIs & Services"** → **"Credentials"**
3. Click on your OAuth 2.0 Client ID
4. Under **"Authorized redirect URIs"**, ADD:
   - `https://your-actual-vercel-url.vercel.app/api/auth/google/callback`
5. Click **"Save"**

### Step 5.6: Update Vercel Environment Variables

1. Go back to Vercel dashboard
2. Go to your project → **Settings** → **Environment Variables**
3. Update these variables:
   - `NEXT_PUBLIC_BASE_URL` → Set to your actual Vercel URL
   - `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` → Set to `https://your-vercel-url.vercel.app/api/auth/google/callback`
4. **Redeploy** the application for changes to take effect:
   - Go to **Deployments**
   - Click **"..."** on the latest deployment
   - Click **"Redeploy"**

---

## Part 6: Verify Production Deployment

### Step 6.1: Test Production App

Visit your Vercel URL and test:

1. ✅ Site loads without errors
2. ✅ Can navigate to Sign Up page
3. ✅ Can create an account
4. ✅ Can log in with email
5. ✅ Can log in with Google OAuth
6. ✅ Can create a deadline
7. ✅ Can view deadlines
8. ✅ Can edit/delete deadlines
9. ✅ Can view calendar
10. ✅ Can view analytics

### Step 6.2: Check for Errors

If something doesn't work:

1. **Check Vercel Logs:**
   - Vercel Dashboard → Your Project → Deployments → Click deployment → View Function Logs

2. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for red error messages

3. **Common Issues:**
   - **OAuth Error:** Verify redirect URIs match exactly
   - **Database Error:** Check Supabase credentials
   - **Build Error:** Check Vercel build logs
   - **CORS Error:** Check Supabase CORS settings

### Step 6.3: Enable CORS in Supabase (if needed)

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to **Site URL**: `https://your-app.vercel.app`
4. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Part 7: Optional Features Setup

### Email Notifications

If you added Gmail credentials:

1. Test email sending via the app
2. Check Gmail app password is correct
3. Verify 2FA is enabled on Gmail

### Scheduled Notifications (Cron)

To enable automatic reminder emails:

1. **Option A: Vercel Cron**
   - Add to `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/notifications/send?api_key=YOUR_CRON_SECRET",
       "schedule": "0 * * * *"
     }]
   }
   ```

2. **Option B: External Cron Service**
   - Use [cron-job.org](https://cron-job.org) or similar
   - Set URL: `https://your-app.vercel.app/api/notifications/send?api_key=YOUR_CRON_SECRET`
   - Set schedule: Every hour

---

## Troubleshooting

### Issue: "Invalid Supabase credentials"
**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check no extra spaces in values
- Ensure keys are in Vercel environment variables

### Issue: "OAuth callback mismatch"
**Solution:**
- Check redirect URI in Google Console matches exactly
- Ensure it's `https://` (not `http://`) for production
- Verify `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` environment variable
- Clear browser cache and cookies

### Issue: "Cannot create deadline"
**Solution:**
- Check browser console for errors
- Verify database tables exist (run SQL scripts)
- Check RLS policies are enabled
- Ensure user is authenticated

### Issue: "Build failed on Vercel"
**Solution:**
- Check Vercel build logs
- Verify all environment variables are set
- Ensure `pnpm-lock.yaml` is committed
- Try local build: `pnpm build`

---

## Security Checklist

Before going live:

- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets committed to repository
- [ ] All environment variables set in Vercel
- [ ] Google OAuth redirect URIs are correct
- [ ] CORS settings configured in Supabase
- [ ] RLS policies enabled on all tables
- [ ] Gmail app password (not regular password) used
- [ ] CRON_SECRET is random and secure
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Database password is strong

---

## Summary

You've successfully:
✅ Created Supabase project and database  
✅ Set up Google OAuth credentials  
✅ Configured environment variables  
✅ Deployed to Vercel  
✅ Verified the deployment works  

**Your app is now live at:** `https://your-app.vercel.app`

---

## Next Steps

1. Share your app URL with users
2. Monitor Vercel analytics
3. Check Supabase usage dashboard
4. Set up custom domain (optional)
5. Enable additional features as needed

---

## Support

If you need help:
- Check this guide's troubleshooting section
- Review `DEPLOYMENT_QUICKSTART.md`
- Review `ENV_VARIABLES_GUIDE.md`
- Check Vercel documentation
- Check Supabase documentation

---

**Last Updated:** February 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
