# 🚀 Quick Deployment Guide - DeadlineSync

## What is the Process for Deploying This?

This guide provides a **clear, step-by-step process** for deploying the DeadlineSync application to production in **under 30 minutes**.

---

## 📋 Prerequisites

Before deploying, you need:
- [ ] A GitHub account (to host your code)
- [ ] A Vercel account (for frontend hosting - FREE)
- [ ] A Supabase account (for database & auth - FREE)
- [ ] Google Cloud Console account (for OAuth - FREE)

---

## 🎯 Deployment Process (3 Simple Steps)

### **Step 1: Set Up Supabase (Database & Authentication)**

#### 1.1 Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - Project Name: `deadlinesync`
   - Database Password: (generate strong password)
   - Region: (choose closest to you)
4. Click **"Create Project"** (wait 2-3 minutes)

#### 1.2 Set Up Database Tables
1. In your Supabase dashboard, go to **"SQL Editor"**
2. Copy and run `scripts/001_create_tables.sql` (found in this repo)
3. Copy and run `scripts/002_update_auth_settings.sql`

#### 1.3 Get Your Supabase Credentials
1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

---

### **Step 2: Set Up Google OAuth (Authentication)**

#### 2.1 Create Google Cloud Project
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click **"Select a project"** → **"NEW PROJECT"**
3. Name it: `DeadlineSync`
4. Click **"Create"**

#### 2.2 Enable Required APIs
1. Go to **"APIs & Services"** → **"Library"**
2. Search and enable these APIs:
   - **Gmail API**
   - **Google Calendar API**

#### 2.3 Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure consent screen:
   - Choose **"External"**
   - Fill in App name: `DeadlineSync`
   - Add your email as support email
   - Click **"Save and Continue"** through all steps
4. Back to Create OAuth client ID:
   - Application type: **"Web application"**
   - Name: `DeadlineSync Web`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://your-app.vercel.app/api/auth/google/callback` (you'll update this later)
5. Click **"Create"**
6. Copy:
   - **Client ID**
   - **Client Secret**

---

### **Step 3: Deploy to Vercel (Frontend Hosting)**

#### 3.1 Push Code to GitHub
If not already done:
```bash
git add .
git commit -m "Ready for deployment"
git push
```

#### 3.2 Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your `deadlinemanager-tejas` repository
5. Configure:
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `./` (leave default)

#### 3.3 Add Environment Variables
Click **"Environment Variables"** and add these:

| Name | Value | Where to Get |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyz.supabase.co` | From Supabase (Step 1.3) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | From Supabase (Step 1.3) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | From Google Cloud (Step 2.3) |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | From Google Cloud (Step 2.3) |

#### 3.4 Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Copy your production URL (e.g., `https://your-app.vercel.app`)

#### 3.5 Update Google OAuth Redirect URI
1. Go back to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **"APIs & Services"** → **"Credentials"**
3. Click on your OAuth client ID
4. Under **"Authorized redirect URIs"**, add:
   - `https://your-app.vercel.app/api/auth/google/callback`
5. Click **"Save"**

---

## ✅ Verify Your Deployment

Visit your Vercel URL and test:
1. [ ] Site loads without errors
2. [ ] Can click "Sign Up" and create an account
3. [ ] Can log in with your account
4. [ ] Can create a new deadline
5. [ ] Can view your deadlines
6. [ ] Can mark deadlines as complete
7. [ ] Can delete deadlines

---

## 🎊 Congratulations!

Your DeadlineSync application is now **LIVE IN PRODUCTION**! 🚀

**Your Production URL:** `https://your-app.vercel.app`

---

## 🔧 Optional Enhancements

### Enable Email Notifications
See `ENV_VARIABLES_GUIDE.md` for setting up:
- Gmail notifications
- SMTP configuration

### Set Up Custom Domain
In Vercel:
1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Enable Calendar Sync
Already enabled! Users can connect their Google Calendar from the dashboard.

---

## 📚 Additional Resources

For more detailed information:
- **Development Setup:** See `README.md`
- **Detailed Deployment:** See `DEPLOYMENT.md`
- **Environment Variables:** See `ENV_VARIABLES_GUIDE.md`
- **Going Live Checklist:** See `GOING_LIVE_CHECKLIST.md`

---

## 🐛 Troubleshooting

### Issue: "Internal Server Error" on production

**Solution:**
1. Check Vercel **Deployment Logs** for errors
2. Verify all environment variables are set correctly
3. Ensure Supabase database tables are created

### Issue: "OAuth callback error"

**Solution:**
1. Verify redirect URI in Google Cloud Console matches your Vercel URL exactly
2. Make sure it ends with `/api/auth/google/callback`
3. Clear browser cookies and try again

### Issue: Can't create deadlines

**Solution:**
1. Verify Supabase URL and keys are correct
2. Check that SQL scripts were run successfully
3. Ensure user is logged in

---

## 💰 Cost

**Total Cost: $0/month** ✨

- Vercel: **FREE** (Hobby plan)
- Supabase: **FREE** (up to 500MB database, 50MB file storage)
- Google Cloud: **FREE** (OAuth and API calls within free tier limits)

---

## 📞 Need Help?

1. Check the troubleshooting section above
2. Review the detailed guides in the repository
3. Open an issue on GitHub

---

**Last Updated:** February 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
