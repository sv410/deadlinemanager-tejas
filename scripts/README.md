# 📊 Database Migration Scripts

This folder contains SQL scripts to set up your Supabase database for DeadlineSync.

---

## Overview

Run these scripts in your Supabase SQL Editor to create all necessary tables, policies, and configurations.

---

## Required Scripts (Must Run)

### 1. `001_create_tables.sql` ⭐ REQUIRED
**Purpose:** Creates the core database schema  
**Creates:**
- `profiles` table - User profile information
- `deadlines` table - Deadline entries
- Row Level Security (RLS) policies for both tables

**Run this first!** All other tables depend on this.

### 2. `002_update_auth_settings.sql` ⭐ REQUIRED
**Purpose:** Configures authentication settings  
**Updates:**
- Auth configuration for email/password signup
- Session settings
- Security policies

**Run after:** `001_create_tables.sql`

### 3. `006_disable_email_confirmation.sql` ⭐ RECOMMENDED
**Purpose:** Disables email confirmation requirement  
**Why:** Makes testing easier during development  
**Note:** For production, you may want to re-enable email confirmation

**Run after:** `002_update_auth_settings.sql`

---

## Optional Scripts (Add Features)

### 4. `003_add_additional_tables.sql`
**Purpose:** Adds extended functionality tables  
**Creates:**
- `tags` table - Deadline tags/labels
- `notifications` table - Notification history
- `user_settings` table - User preferences
- RLS policies for all tables

**Run this if you want:** Tag system, notifications tracking, custom settings

### 5. `007_google_integration.sql`
**Purpose:** Adds Google Calendar and Gmail integration support  
**Creates:**
- `user_google_tokens` table - OAuth tokens storage
- `google_calendar_sync` table - Calendar sync history
- RLS policies

**Run this if you want:** Google Calendar sync, Gmail notifications

### 6. `008_gamification_system.sql`
**Purpose:** Adds gamification features  
**Creates:**
- `user_points` table - Point tracking
- `achievements` table - Achievement definitions
- `user_achievements` table - User achievement progress
- `user_levels` table - Level system
- RLS policies

**Run this if you want:** Points, achievements, levels system

### 7. `009_collaboration_insights.sql`
**Purpose:** Adds team collaboration and insights  
**Creates:**
- `teams` table - Team management
- `team_members` table - Team membership
- `shared_deadlines` table - Shared deadlines
- `productivity_insights` table - Analytics data
- RLS policies

**Run this if you want:** Team features, sharing, analytics

---

## Execution Order

**Minimum Setup (Basic App):**
```
1. 001_create_tables.sql          ← Core tables
2. 002_update_auth_settings.sql   ← Auth config
3. 006_disable_email_confirmation.sql ← Easy testing
```

**Recommended Setup (Most Features):**
```
1. 001_create_tables.sql
2. 002_update_auth_settings.sql
3. 003_add_additional_tables.sql  ← Tags, notifications
4. 006_disable_email_confirmation.sql
5. 007_google_integration.sql     ← Google features
```

**Full Setup (All Features):**
```
1. 001_create_tables.sql
2. 002_update_auth_settings.sql
3. 003_add_additional_tables.sql
4. 006_disable_email_confirmation.sql
5. 007_google_integration.sql
6. 008_gamification_system.sql    ← Gamification
7. 009_collaboration_insights.sql ← Team features
```

---

## How to Run Scripts

### Via Supabase Dashboard

1. Go to your Supabase project
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open a script file (e.g., `001_create_tables.sql`)
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **"Run"** or press `Ctrl+Enter` (Cmd+Enter on Mac)
8. Wait for success message
9. Repeat for next script

### Via Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or run individual scripts
psql $DATABASE_URL < scripts/001_create_tables.sql
```

---

## Verification

After running scripts, verify tables were created:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

**Expected tables (minimum setup):**
- `deadlines`
- `profiles`

**Expected tables (full setup):**
- `achievements`
- `deadlines`
- `google_calendar_sync`
- `notifications`
- `productivity_insights`
- `profiles`
- `shared_deadlines`
- `tags`
- `team_members`
- `teams`
- `user_achievements`
- `user_google_tokens`
- `user_levels`
- `user_points`
- `user_settings`

---

## Troubleshooting

### Error: "relation already exists"
**Cause:** Table already created  
**Solution:** Script already ran successfully, skip it or drop table first

### Error: "permission denied"
**Cause:** Insufficient permissions  
**Solution:** Ensure you're the project owner or have sufficient privileges

### Error: "syntax error"
**Cause:** Incomplete script paste  
**Solution:** Ensure entire script contents are copied and pasted

### Error: "foreign key constraint"
**Cause:** Tables created in wrong order  
**Solution:** Drop all tables and run in correct order

To drop all tables and start fresh:
```sql
-- ⚠️ WARNING: This deletes ALL data!
DROP TABLE IF EXISTS shared_deadlines CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_levels CASCADE;
DROP TABLE IF EXISTS user_points CASCADE;
DROP TABLE IF EXISTS google_calendar_sync CASCADE;
DROP TABLE IF EXISTS user_google_tokens CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS productivity_insights CASCADE;
DROP TABLE IF EXISTS deadlines CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Now re-run scripts in order
```

---

## Database Schema Overview

### Core Tables

**profiles**
- User profile information
- Links to auth.users
- Stores display name, preferences

**deadlines**
- Core deadline entries
- Links to users
- Contains title, description, date, priority, status

### Extended Tables

**tags** - Organize deadlines with labels  
**notifications** - Track sent notifications  
**user_settings** - User preferences and config  
**user_google_tokens** - OAuth tokens for Google  
**google_calendar_sync** - Sync status tracking  
**user_points** - Gamification points  
**achievements** - Achievement definitions  
**user_achievements** - User achievement progress  
**user_levels** - Level system  
**teams** - Team management  
**team_members** - Team membership  
**shared_deadlines** - Shared deadline access  
**productivity_insights** - Analytics and insights  

---

## Row Level Security (RLS)

All tables have RLS enabled for security:

- ✅ Users can only see their own data
- ✅ Users can only modify their own records
- ✅ Team members can see shared team data
- ✅ Prevents unauthorized access

**Do not disable RLS in production!**

---

## Backup Recommendations

Before running scripts in production:

1. **Backup your database:**
   ```bash
   # Via Supabase CLI
   supabase db dump -f backup.sql
   ```

2. **Test in development first:**
   - Create a separate Supabase project for testing
   - Run all scripts there first
   - Verify everything works
   - Then run in production

3. **Enable Point-in-Time Recovery:**
   - Supabase Dashboard → Database → Backups
   - Enable automatic backups

---

## Migration Tips

✅ **Do:**
- Run scripts in order
- Verify each script succeeds before moving to next
- Test in development environment first
- Keep backups
- Document any custom modifications

❌ **Don't:**
- Skip required scripts
- Run scripts out of order
- Modify core tables without testing
- Disable RLS in production
- Delete backup scripts

---

## Need Help?

- Check script comments for detailed information
- Review Supabase documentation: https://supabase.com/docs
- See `DEPLOYMENT_SETUP.md` for full setup guide
- Check error messages carefully - they usually indicate the issue

---

## Summary

**For Basic App:**
- Run: 001, 002, 006
- Time: 5 minutes
- Tables: 2 (profiles, deadlines)

**For Full-Featured App:**
- Run: 001, 002, 003, 006, 007, 008, 009
- Time: 10 minutes
- Tables: 15 (all features)

---

**Last Updated:** February 2026  
**Status:** Production Ready ✅
