# 🔐 Vercel Environment Variables

## Copy and Paste These Into Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## ✅ Required Variables (Add These First)

### 1. Backend API URL
```
Name: NEXT_PUBLIC_BACKEND_URL
Value: http://localhost:8000
```
**Note**: Change to Railway URL after deploying backend

Select: ✅ Production  ✅ Preview  ✅ Development

---

### 2. Supabase URL (Placeholder)
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://placeholder.supabase.co
```

Select: ✅ Production  ✅ Preview  ✅ Development

---

### 3. Supabase Anon Key (Placeholder)
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYwNTgwMDAsImV4cCI6MTk2MTYzNDAwMH0.placeholder
```

Select: ✅ Production  ✅ Preview  ✅ Development

---

## 📋 Optional Variables (Add If Using Google OAuth)

### 4. Google Client ID
```
Name: NEXT_PUBLIC_GOOGLE_CLIENT_ID
Value: your-google-client-id.apps.googleusercontent.com
```

Select: ✅ Production  ✅ Preview  ✅ Development

---

### 5. Google Client Secret
```
Name: GOOGLE_CLIENT_SECRET
Value: your-google-client-secret
```

Select: ✅ Production  ✅ Preview  ✅ Development

---

### 6. App URL
```
Name: NEXT_PUBLIC_APP_URL
Value: https://your-app.vercel.app
```
**Note**: Update with your actual Vercel URL after first deploy

Select: ✅ Production  ✅ Preview  ✅ Development

---

## 🔄 After Backend Deployment

Once you deploy backend to Railway, update this variable:

```
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://your-app.railway.app
```

Then click **Redeploy** in Vercel.

---

## ✅ Checklist

- [ ] Added NEXT_PUBLIC_BACKEND_URL
- [ ] Added NEXT_PUBLIC_SUPABASE_URL
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Selected Production, Preview, Development for each
- [ ] Clicked Save for each variable
- [ ] Clicked Redeploy

---

**After adding all variables, click "Redeploy" to rebuild with the new environment!** 🚀
