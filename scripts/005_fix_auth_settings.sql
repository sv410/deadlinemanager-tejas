-- Ensure email confirmation is disabled for instant login
-- This migration updates auth settings to allow immediate login

-- Note: This script documents the auth settings needed
-- Actual auth settings are managed via Supabase dashboard or environment variables

-- The following should be configured in Supabase:
-- 1. Enable email provider
-- 2. Disable "Confirm email" under Authentication > Providers > Email
-- 3. Or set SUPABASE_AUTH_EMAIL_CONFIRMATION to false

-- Create a trigger to auto-confirm users if needed
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the user's email
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Apply to new users if auto-confirm is needed
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   BEFORE INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.auto_confirm_user();

COMMENT ON FUNCTION public.auto_confirm_user() IS 'Auto-confirms user email on signup for instant access';
