#!/bin/bash

# DEPLOYMENT SCRIPT - Copy & Run This

echo "🚀 Starting Deadline Manager Deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clean old builds
echo -e "${BLUE}Step 1: Cleaning old builds...${NC}"
rm -rf .next node_modules
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 2: Install dependencies (Supabase removed)
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✓ Installed${NC}"
echo ""

# Step 3: Build frontend
echo -e "${BLUE}Step 3: Building frontend...${NC}"
pnpm build
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Build successful${NC}"
else
  echo -e "${RED}✗ Build failed${NC}"
  exit 1
fi
echo ""

# Step 4: Verify environment
echo -e "${BLUE}Step 4: Checking environment variables...${NC}"
if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then
  echo -e "${RED}⚠ Missing NEXT_PUBLIC_BACKEND_URL${NC}"
else
  echo -e "${GREEN}✓ Backend URL: $NEXT_PUBLIC_BACKEND_URL${NC}"
fi
echo ""

echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Vercel Dashboard:"
echo "   - NEXT_PUBLIC_BACKEND_URL"
echo "   - NEXT_PUBLIC_APP_URL"
echo ""
echo "2. Deploy:"
echo "   - Via CLI: vercel"
echo "   - Via GitHub: Push and auto-deploy"
echo ""
echo "3. Test:"
echo "   - curl https://your-backend-url/health"
echo "   - Visit https://your-vercel-url.vercel.app"
