# Environment Variables Guide

## Overview
This document describes all environment variables used by DeadlineSync with Google integration.

## Required Variables

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```
**Description:** Supabase project URL  
**Where to get:** Supabase Dashboard → Settings → API  
**Example:** `https://abcdefgh.supabase.co`

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
**Description:** Supabase anonymous API key for client-side  
**Where to get:** Supabase Dashboard → Settings → API  
**Length:** Long alphanumeric string starting with `ey`

### Google OAuth
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```
**Description:** Google OAuth Client ID (public, safe to expose)  
**Where to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Go to Credentials
4. Create OAuth 2.0 credentials (Web application)
5. Copy Client ID

```env
GOOGLE_CLIENT_SECRET=GOCSP...
```
**Description:** Google OAuth Client Secret (KEEP SECRET!)  
**Where to get:** Same as Client ID, from Google Console  
**⚠️ IMPORTANT:** Never commit to version control, never expose to client

```env
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```
**Description:** OAuth callback URL - must match Google Console  
**Development:** `http://localhost:3000/api/auth/google/callback`  
**Production:** `https://yourdomain.com/api/auth/google/callback`

### Base URL
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
**Description:** Your application's base URL  
**Development:** `http://localhost:3000`  
**Production:** `https://yourdomain.com`  
**Note:** Used for generating links in emails and OAuth callbacks

---

## Optional but Recommended

### Gmail Configuration
```env
GMAIL_APP_EMAIL=your.email@gmail.com
```
**Description:** Gmail account to send reminders from  
**Requirements:** Must have 2-Factor Authentication enabled  
**Example:** `notifications@yourdomain.com`

```env
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```
**Description:** Gmail App Password (NOT your regular password!)  
**How to get:**
1. Enable 2FA on your Gmail account
2. Go to [Google Account → Security](https://myaccount.google.com/security)
3. Find "App passwords" (only appears if 2FA enabled)
4. Generate new app password for "Mail"
5. Copy the 16-character password with spaces
**Format:** Usually 4 groups of 4 characters with spaces

**⚠️ IMPORTANT NOTES:**
- Use App Password, NOT your Gmail password
- 2FA must be enabled first
- App Password is different from regular password
- Never use your actual Gmail password

---

## Security

### Cron Job Security
```env
CRON_SECRET=your_random_secure_key_32_chars_or_more
```
**Description:** Secret key for scheduled reminder webhook  
**How to generate:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Length:** Minimum 32 characters, preferably 64+  
**Usage:** Called in cron job: `/api/notifications/send?api_key=<CRON_SECRET>`  
**⚠️ IMPORTANT:** Change this regularly, don't share

---

## Optional Services

### Google Maps API (Future Use)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```
**Description:** For location-based features (not yet implemented)  
**Optional:** Can be added later

---

## Environment Files

### .env.local (Development)
- NOT committed to version control
- Used locally during development
- Can contain real credentials (only local)

### .env.example (Template)
- Committed to version control
- Template with dummy values
- Shows all available variables

### .env.production (Production)
- Set in deployment platform
- Uses production credentials
- Never committed to Git

---

## Setting Environment Variables

### Development (Local)
1. Copy `.env.example` to `.env.local`
2. Fill in your development values
3. Restart dev server: `pnpm dev`

### Vercel Deployment
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add each variable (public ones show on build)
4. Redeploy

### Other Hosting (Railway, Render, etc.)
1. Add variables in platform settings
2. Deploy/redeploy application
3. Verify in logs

### Docker
```dockerfile
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
ENV GOOGLE_CLIENT_SECRET=xxx
```

---

## Validation

### Check if Variables are Set
```bash
# View all set variables
printenv | grep GOOGLE_
printenv | grep SUPABASE_

# Check specific variable
echo $NEXT_PUBLIC_GOOGLE_CLIENT_ID
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Blank values | Copy from right sources |
| Mismatched redirect URI | Must be exact match in Google |
| Gmail auth fails | Use App Password, not regular password |
| OAuth loop | Check NEXT_PUBLIC_GOOGLE_REDIRECT_URI |

---

## Secrets in Code

### DO ✅
```typescript
// Use in server-side code
const secret = process.env.GOOGLE_CLIENT_SECRET
```

### DON'T ❌
```typescript
// Don't hardcode secrets
const secret = "GOCSP..."

// Don't log secrets
console.log(process.env.GOOGLE_CLIENT_SECRET)

// Don't commit .env.local
git add .env.local  // ❌ Wrong
```

---

## Rotating Secrets

### When to Rotate
- Monthly (best practice)
- After employee departure
- If credentials suspected compromised
- Before major release

### How to Rotate
1. Generate new secret in original service
2. Update environment variable
3. Test thoroughly
4. Disable old secret
5. Verify no errors in logs

---

## Reference Table

| Variable | Required | Where | Type | Sensitive |
|----------|----------|-------|------|-----------|
| NEXT_PUBLIC_SUPABASE_URL | ✅ | Supabase | String | ❌ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | Supabase | String | ⚠️ |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | ✅ | Google | String | ❌ |
| GOOGLE_CLIENT_SECRET | ✅ | Google | String | 🔒 |
| NEXT_PUBLIC_GOOGLE_REDIRECT_URI | ✅ | Config | String | ❌ |
| NEXT_PUBLIC_BASE_URL | ✅ | Config | String | ❌ |
| GMAIL_APP_EMAIL | ⚠️ | Gmail | String | ⚠️ |
| GMAIL_APP_PASSWORD | ⚠️ | Gmail | String | 🔒 |
| CRON_SECRET | ⚠️ | Generate | String | 🔒 |

Legend:
- ✅ = Required
- ⚠️ = Recommended  
- ❌ = Not sensitive (can be in client)
- 🔒 = Highly sensitive (server-only)

---

## Troubleshooting

### Variables Not Showing in Runtime
1. Verify in `.env.local` (development)
2. Verify in platform settings (production)
3. Check for typos
4. Restart dev server
5. Check deployment logs

### Public vs Private
- `NEXT_PUBLIC_*` → Safe to expose to client
- Others → Must be server-side only

### Default Values
```typescript
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
const secret = process.env.GOOGLE_CLIENT_SECRET || ""

if (!clientId || !secret) {
  throw new Error("Missing required environment variables")
}
```

---

## Security Checklist

- [ ] `NEXT_PUBLIC_*` variables don't contain secrets
- [ ] `.env.local` is in `.gitignore`
- [ ] Secrets only used in server-side code
- [ ] No secrets in logs or error messages
- [ ] All variables set in production
- [ ] App Password used (not Gmail password)
- [ ] CRON_SECRET is strong (32+ chars)
- [ ] Variables rotated monthly

---

**Last Updated:** December 23, 2025  
**Version:** 1.0
