# ⚙️ Vercel Environment Variables Setup

## Quick Reference

Copy these exact environment variables to your Vercel project:

---

## Required Variables

### 1. Supabase Configuration

```
NEXT_PUBLIC_SUPABASE_URL
```
**Value:** `https://your-project-id.supabase.co`  
**Get from:** Supabase Dashboard → Settings → API → Project URL

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)  
**Get from:** Supabase Dashboard → Settings → API → Project API keys → anon public

---

### 2. Google OAuth Configuration

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID
```
**Value:** `123456789-abc123def456.apps.googleusercontent.com`  
**Get from:** Google Cloud Console → Credentials → OAuth 2.0 Client ID

```
GOOGLE_CLIENT_SECRET
```
**Value:** `GOCSPX-abc123xyz789`  
**Get from:** Google Cloud Console → Credentials → OAuth 2.0 Client Secret  
**⚠️ Important:** Mark as "Sensitive" in Vercel

---

### 3. Base URLs

```
NEXT_PUBLIC_BASE_URL
```
**Value:** `https://your-app.vercel.app`  
**Note:** Use your actual Vercel deployment URL

```
NEXT_PUBLIC_GOOGLE_REDIRECT_URI
```
**Value:** `https://your-app.vercel.app/api/auth/google/callback`  
**Note:** Must match exactly with Google Cloud Console configuration

---

## Optional Variables

### Email Notifications (Optional)

```
GMAIL_APP_EMAIL
```
**Value:** `your-email@gmail.com`  
**Required for:** Sending email reminders

```
GMAIL_APP_PASSWORD
```
**Value:** `xxxx xxxx xxxx xxxx` (16-character app password)  
**Get from:** Google Account → Security → App passwords  
**⚠️ Important:** Mark as "Sensitive" in Vercel  
**Note:** NOT your regular Gmail password. Must create app-specific password with 2FA enabled.

---

### Cron Job Security (Optional)

```
CRON_SECRET
```
**Value:** Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`  
**Required for:** Scheduled notification webhooks  
**⚠️ Important:** Mark as "Sensitive" in Vercel

---

## How to Add in Vercel

### Method 1: Via Vercel Dashboard

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. For each variable:
   - Enter **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter **Value**
   - Select **Environment:** Production, Preview, Development (check all)
   - Click **"Save"**

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your value when prompted

# Repeat for all variables...
```

### Method 3: Import from .env file

1. Create a file `vercel-env.txt` with format:
```
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
NEXT_PUBLIC_GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"
NEXT_PUBLIC_GOOGLE_REDIRECT_URI="https://your-app.vercel.app/api/auth/google/callback"
```

2. In Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Look for "Import" or "Add from .env" option
   - Upload your file

**⚠️ Security:** Delete `vercel-env.txt` after importing!

---

## Environment Targets

When adding variables, select which environments they apply to:

- ✅ **Production** - Live deployment
- ✅ **Preview** - Pull request deployments
- ✅ **Development** - Local development (via `vercel dev`)

**Recommendation:** Check all three for consistency.

---

## After Adding Variables

### Important: Redeploy

Environment variables only take effect after redeployment:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

OR trigger a new deployment:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## Verification Checklist

After adding all variables:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- [ ] `GOOGLE_CLIENT_SECRET` is set (marked sensitive)
- [ ] `NEXT_PUBLIC_BASE_URL` matches your Vercel URL
- [ ] `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` matches your Vercel URL + callback path
- [ ] All variables applied to Production, Preview, and Development
- [ ] Redeployed after adding variables
- [ ] App loads without environment variable errors

---

## Testing Environment Variables

### Test in Vercel Deployment

1. Visit your deployment URL
2. Open browser console (F12)
3. Type: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
4. Should show your Supabase URL (not undefined)

**Note:** Only `NEXT_PUBLIC_*` variables are visible in browser. Server-only variables (like `GOOGLE_CLIENT_SECRET`) won't be visible, and that's correct!

### Test Server-Side Variables

Check Vercel Function Logs:
1. Go to Vercel Dashboard
2. Click on your deployment
3. Click **"Functions"** tab
4. Check logs for any "undefined" environment variable errors

---

## Common Issues

### Issue: Variables not working after adding

**Solution:** Redeploy the application. Variables only take effect after rebuild.

### Issue: "undefined" in production but works locally

**Solution:**
- Verify variable is added in Vercel
- Check spelling matches exactly (including case)
- Ensure "Production" environment is checked
- Redeploy the app

### Issue: GOOGLE_CLIENT_SECRET exposed in browser

**Solution:** 
- This variable should NOT start with `NEXT_PUBLIC_`
- It's correctly named as `GOOGLE_CLIENT_SECRET` (no prefix)
- It's only accessible server-side, which is correct

### Issue: OAuth redirect mismatch

**Solution:**
- Ensure `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` matches exactly what's in Google Cloud Console
- Must be `https://` for production (not `http://`)
- Check for trailing slashes or typos

---

## Security Best Practices

### ✅ DO:
- Mark sensitive variables (secrets, passwords) as "Sensitive" in Vercel
- Use `NEXT_PUBLIC_` prefix only for variables that must be public
- Keep client secrets server-side (no `NEXT_PUBLIC_` prefix)
- Rotate secrets regularly
- Use strong, random values for CRON_SECRET

### ❌ DON'T:
- Commit `.env.local` to git
- Share environment variable values publicly
- Use `NEXT_PUBLIC_` for secrets
- Copy production secrets to preview/development without considering security
- Use real Gmail passwords (use app passwords only)

---

## Production-Specific Configuration

When deploying to production, update these values:

```
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://your-app.vercel.app/api/auth/google/callback
```

And update in Google Cloud Console:
- Authorized JavaScript origins: `https://your-app.vercel.app`
- Authorized redirect URIs: `https://your-app.vercel.app/api/auth/google/callback`

---

## Quick Setup Script

Copy and customize this template for your Vercel setup:

```bash
# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
# Paste: https://your-project.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development
# Paste: eyJ...

# Google OAuth
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production preview development
# Paste: xxx.apps.googleusercontent.com

vercel env add GOOGLE_CLIENT_SECRET production preview development
# Paste: GOCSPX-xxx

# Base URLs
vercel env add NEXT_PUBLIC_BASE_URL production
# Paste: https://your-app.vercel.app

vercel env add NEXT_PUBLIC_GOOGLE_REDIRECT_URI production
# Paste: https://your-app.vercel.app/api/auth/google/callback
```

---

## Summary

**Minimum Required (6 variables):**
1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. `GOOGLE_CLIENT_SECRET`
5. `NEXT_PUBLIC_BASE_URL`
6. `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`

**Optional (3 variables):**
7. `GMAIL_APP_EMAIL`
8. `GMAIL_APP_PASSWORD`
9. `CRON_SECRET`

**After setup:**
- ✅ Redeploy application
- ✅ Test authentication
- ✅ Test deadline creation
- ✅ Verify all features work

---

**Need Help?**
- See `DEPLOYMENT_SETUP.md` for detailed setup
- See `ENV_VARIABLES_GUIDE.md` for variable descriptions
- Check Vercel documentation for more details

---

**Last Updated:** February 2026  
**Status:** Production Ready ✅
