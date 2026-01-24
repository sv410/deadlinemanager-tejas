# 🚂 Railway Environment Variables (Backend)

## Copy and Paste These Into Railway Dashboard

Go to: **Railway Dashboard → Your Project → Variables Tab**

---

## ✅ Required Variables

### 1. Secret Key (REQUIRED - Generate Random 32+ Characters)
```
Name: SECRET_KEY
Value: your-super-secret-key-change-this-to-random-32-characters-minimum
```

**How to Generate**:
```bash
# Option 1: PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Option 2: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 3: Online
https://randomkeygen.com/ (use "Fort Knox Passwords")
```

---

### 2. Database URL (AUTO-PROVIDED BY RAILWAY)
```
Name: DATABASE_URL
```

**⚠️ DO NOT ADD THIS MANUALLY**
- Railway automatically creates this when you add a PostgreSQL database
- Click "New" → "Database" → "Add PostgreSQL" 
- Railway will inject this variable automatically

---

## 📋 Optional Variables (For Gmail/Calendar Integration)

### 3. Google Client ID
```
Name: GOOGLE_CLIENT_ID
Value: your-google-client-id.apps.googleusercontent.com
```

**Get from**: https://console.cloud.google.com
- Create OAuth 2.0 credentials
- Enable Gmail API and Google Calendar API

---

### 4. Google Client Secret
```
Name: GOOGLE_CLIENT_SECRET
Value: your-google-client-secret
```

---

### 5. Algorithm (Optional - Has Default)
```
Name: ALGORITHM
Value: HS256
```

---

### 6. Access Token Expire (Optional - Has Default)
```
Name: ACCESS_TOKEN_EXPIRE_MINUTES
Value: 30
```

---

## 🗄️ Add PostgreSQL Database

1. In Railway dashboard, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically:
   - Provision a PostgreSQL database
   - Create the `DATABASE_URL` environment variable
   - Link it to your backend service

---

## ✅ Minimal Setup (To Get Started)

Just add these two:

1. **SECRET_KEY** (generate a random 32+ character string)
2. **PostgreSQL Database** (click "Add PostgreSQL" in Railway)

Everything else will work with defaults!

---

## 📝 Complete Variables Summary

```env
# Required
SECRET_KEY=<your-random-32-char-string>
DATABASE_URL=<auto-provided-by-railway>

# Optional
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🚀 After Adding Variables

1. Railway will automatically redeploy
2. Copy your Railway URL (e.g., `https://deadlinemanager-production.up.railway.app`)
3. Use this URL in Vercel's `NEXT_PUBLIC_BACKEND_URL`

---

**Important**: Generate a strong SECRET_KEY before deploying! 🔐
