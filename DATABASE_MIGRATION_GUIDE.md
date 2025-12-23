# Database Migration Guide

## Overview

This guide explains how to apply all database migrations to set up DeadlineSync with full Google integration.

## Prerequisites

- Supabase account (free or paid)
- Access to SQL Editor in Supabase
- Admin privileges in your Supabase project

## Migration Order

Migrations must be applied in this exact order:

1. ✅ `001_create_tables.sql` (Initial setup)
2. ✅ `002_update_auth_settings.sql` (Auth config)
3. ✅ `003_add_additional_tables.sql` (Additional tables)
4. ✅ `004_innovative_features.sql` (Features)
5. ✅ `005_fix_auth_settings.sql` (Fixes)
6. ✅ `006_disable_email_confirmation.sql` (Email)
7. ✅ `007_google_integration.sql` (NEW - Google setup)

## Step-by-Step Migration

### Step 1: Access Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com)
2. Login to your project
3. Click "SQL Editor" in left sidebar
4. Click "New Query"

### Step 2: Run Migrations 1-6

For each migration file (001-006):

1. Open `scripts/[number]_[name].sql`
2. Copy all content
3. Paste into Supabase SQL Editor
4. Click "Run" button
5. Wait for success message
6. Verify in Tables list on left
7. Repeat for next migration

### Step 3: Run Google Integration Migration

**IMPORTANT:** Only run after migrations 001-006 are complete.

1. Open `scripts/007_google_integration.sql`
2. Copy all content (see below for what's in it)
3. Paste into new SQL Editor query
4. Click "Run"
5. Wait for success

### Expected Output

```sql
-- You should see success for:
✓ CREATE TABLE google_tokens
✓ ALTER TABLE users ADD COLUMN google_id
✓ CREATE TABLE google_calendar_events
✓ CREATE TABLE email_notifications
✓ CREATE INDEX idx_google_tokens_user_id
✓ CREATE INDEX idx_google_calendar_events_user_id
✓ CREATE INDEX idx_google_calendar_events_deadline_id
✓ CREATE INDEX idx_email_notifications_user_id
✓ CREATE INDEX idx_email_notifications_status
✓ CREATE INDEX idx_email_notifications_send_at
```

## Migration Details

### What's Created in Migration 007

#### 1. google_tokens Table
Stores encrypted OAuth tokens for each user.

```sql
Columns:
- id (UUID, primary key)
- user_id (UUID, foreign key to users)
- access_token (TEXT) - Current access token
- refresh_token (TEXT) - Refresh token
- expires_at (TIMESTAMP) - Token expiration
- updated_at (TIMESTAMP) - Last update
- created_at (TIMESTAMP) - Created date

Indexes:
- idx_google_tokens_user_id (for fast lookups)
```

#### 2. google_calendar_events Table
Maps deadlines to Google Calendar events.

```sql
Columns:
- id (UUID, primary key)
- user_id (UUID, foreign key)
- deadline_id (UUID, foreign key)
- google_event_id (TEXT) - Calendar event ID
- google_calendar_id (TEXT) - Calendar ID
- synced_at (TIMESTAMP) - Sync timestamp
- updated_at (TIMESTAMP)
- created_at (TIMESTAMP)

Indexes:
- idx_google_calendar_events_user_id
- idx_google_calendar_events_deadline_id
```

#### 3. email_notifications Table
Tracks all email notifications sent.

```sql
Columns:
- id (UUID, primary key)
- user_id (UUID, foreign key)
- deadline_id (UUID, foreign key)
- email_address (TEXT) - Recipient email
- notification_type (TEXT) - reminder/created/updated
- send_at (TIMESTAMP) - Scheduled send time
- sent_at (TIMESTAMP) - Actual send time
- status (TEXT) - pending/sent/failed
- error_message (TEXT) - If failed
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Indexes:
- idx_email_notifications_user_id
- idx_email_notifications_status
- idx_email_notifications_send_at
```

#### 4. Modified users Table
```sql
Added column:
- google_id (TEXT, UNIQUE) - Google user ID

Index:
- idx_users_google_id
```

## Verification Steps

### Check Migration Success

1. **In Supabase Dashboard:**
   - Click "Table Editor" in left sidebar
   - You should see new tables:
     - `google_tokens`
     - `google_calendar_events`
     - `email_notifications`

2. **Verify Columns:**
   - Click each table
   - Confirm columns match documentation above
   - Check indexes exist (Table → Indexes tab)

3. **Test Query:**
   ```sql
   -- Run this in SQL Editor to test
   SELECT * FROM google_tokens LIMIT 1;
   SELECT * FROM google_calendar_events LIMIT 1;
   SELECT * FROM email_notifications LIMIT 1;
   ```
   Should return empty sets (no rows yet), but no errors.

### Common Issues

| Issue | Solution |
|-------|----------|
| "Table already exists" | Table already created - skip this line |
| "Column already exists" | Column already added - skip this line |
| "Foreign key constraint fail" | Required tables don't exist - run 001-006 first |
| "Syntax error" | Check for typos or incomplete copy/paste |

## Rollback (if needed)

To remove Google integration tables:

```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS email_notifications;
DROP TABLE IF EXISTS google_calendar_events;
DROP TABLE IF EXISTS google_tokens;

-- Remove the column from users
ALTER TABLE users DROP COLUMN IF EXISTS google_id;
```

**Only do this if you want to completely remove Google integration.**

## After Migration

### 1. Update Environment Variables
```bash
# In .env.local or deployment platform:
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
```

### 2. Deploy Application
```bash
pnpm build
pnpm start
```

### 3. Test OAuth Flow
1. Click "Get Started with Google"
2. Complete OAuth
3. Check Supabase → `google_tokens` table
4. Should have new row with your token

### 4. Create a Test Deadline
1. In dashboard, create a deadline
2. Check `google_calendar_events` table
3. Should have sync record
4. Check your Google Calendar
5. Should see the event

## Monitoring Migrations

### View Migration History
There's no automatic migration tracking, so:

1. Keep a checklist of migrations run
2. Save the migration files somewhere safe
3. Record the date/time of each migration
4. Document any issues encountered

### Backup Before Migration
Always backup your database before running migrations:

1. Supabase Dashboard → Database → Backups
2. Click "Create backup" button
3. Backups stored for 7 days (Supabase keeps)
4. Can also export CSV of each table

## Troubleshooting

### Migration Failed
If a migration fails:

1. Read error message carefully
2. Check for missing dependencies (001-006 must run first)
3. Try running the problematic SQL manually
4. Check if columns/tables already exist
5. Review logs in Supabase

### Tables Not Appearing
If tables don't show up:

1. Refresh page (F5)
2. Click "Database" → "Tables" again
3. Check for errors in browser console
4. Ensure migration actually completed

### Wrong Data in Tables
If you see unexpected data:

1. Verify you're in correct project
2. Verify you're in correct region
3. Check if this is test project vs production
4. Restore from backup if needed

## Performance Optimization

The migration includes indexes on:
- `user_id` - Fast user lookups
- `deadline_id` - Fast deadline lookups
- `status` - Fast filtering by notification status
- `send_at` - Fast time-based queries

These ensure good performance even with lots of data.

## Scaling Notes

These tables are designed to scale to millions of rows:
- Proper indexing for all queries
- Foreign keys for data integrity
- Timestamps for audit trails
- Status tracking for reliability

## Migration Testing

### Test in Development First
Recommended flow:
1. Create separate Supabase project for testing
2. Run all migrations there
3. Test application thoroughly
4. Verify all features work
5. Only then run on production

### Test Commands
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check indexes exist
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public';

-- Check columns in users table
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users';
```

## Support

If you encounter migration issues:

1. Check Supabase status page
2. Review SQL syntax in documentation
3. Ensure all dependencies installed
4. Check environment variables
5. Review browser console for errors
6. Consult Supabase documentation

---

**Migration Status:** Ready to deploy  
**Last Updated:** December 23, 2025

---

## Checklist for Migration

Use this checklist to track your progress:

- [ ] Read this entire guide
- [ ] Create Supabase backup
- [ ] Run migration 001
- [ ] Run migration 002
- [ ] Run migration 003
- [ ] Run migration 004
- [ ] Run migration 005
- [ ] Run migration 006
- [ ] Run migration 007 (Google Integration)
- [ ] Verify all tables exist
- [ ] Verify all columns exist
- [ ] Verify all indexes exist
- [ ] Update environment variables
- [ ] Deploy application
- [ ] Test OAuth flow
- [ ] Create test deadline
- [ ] Verify calendar sync
- [ ] Check email notification
- [ ] All tests passing ✅
