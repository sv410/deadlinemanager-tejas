#!/usr/bin/env bash
# Pre-deployment verification script

echo "🔍 Pre-Deployment Verification"
echo "=============================="
echo ""

# Check Node version
echo "Checking Node.js version..."
node -v
echo ""

# Check pnpm
echo "Checking pnpm..."
pnpm -v
echo ""

# Check for build artifacts
if [ -d ".next" ]; then
  echo "✓ Previous build found, will be cleaned"
else
  echo "ℹ No previous build"
fi
echo ""

# Check package.json
echo "Checking for Supabase dependencies..."
if grep -q "@supabase" package.json; then
  echo "⚠ Warning: Supabase packages still in package.json"
else
  echo "✓ No Supabase dependencies"
fi
echo ""

# Check environment
echo "Environment variables:"
if [ -n "$NEXT_PUBLIC_BACKEND_URL" ]; then
  echo "✓ NEXT_PUBLIC_BACKEND_URL is set"
else
  echo "ℹ NEXT_PUBLIC_BACKEND_URL not set (will be set in Vercel)"
fi
echo ""

echo "Pre-deployment checks complete!"
echo ""
echo "Next: Run 'pnpm build' to verify compilation"
