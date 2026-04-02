#!/bin/bash
# Implementation Verification Script
# Run this to verify all Vercel Blob Storage implementation is complete

echo "=========================================="
echo "Implementation Verification Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
CHECKS_PASSED=0
CHECKS_TOTAL=0

# Function to check
check() {
  CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
  echo -n "Checking: $1... "
}

# Function to pass
pass() {
  echo -e "${GREEN}✓${NC}"
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
}

# Function to fail
fail() {
  echo -e "${RED}✗${NC}"
}

echo "📁 API Endpoints"
check "api/submit-brief.ts exists"
[ -f "api/submit-brief.ts" ] && pass || fail

check "api/get-briefs.ts exists"
[ -f "api/get-briefs.ts" ] && pass || fail

check "api/delete-brief.ts exists"
[ -f "api/delete-brief.ts" ] && pass || fail

check "api/record-start.ts exists"
[ -f "api/record-start.ts" ] && pass || fail

echo ""
echo "📝 Configuration Files"
check "vercel.json has API rewrites"
grep -q '"/api/\(.\+\)"' vercel.json && pass || fail

check "env.example has DASHBOARD_PIN_SECRET"
grep -q "DASHBOARD_PIN_SECRET" env.example && pass || fail

echo ""
echo "📦 Dependencies"
check "@vercel/blob installed"
grep -q '"@vercel/blob"' package.json && pass || fail

echo ""
echo "🎨 Frontend Integration"
check "BriefForm uses /api/submit-brief"
grep -q "fetch('/api/submit-brief'" src/pages/BriefForm.tsx && pass || fail

check "BriefForm uses /api/record-start"
grep -q "fetch('/api/record-start'" src/pages/BriefForm.tsx && pass || fail

check "Dashboard uses /api/get-briefs"
grep -q "fetch(\`/api/get-briefs" src/pages/Dashboard.tsx && pass || fail

check "Dashboard uses /api/delete-brief"
grep -q "delete-brief" src/pages/Dashboard.tsx && pass || fail

echo ""
echo "📚 Documentation"
check "IMPLEMENTATION.md exists"
[ -f "IMPLEMENTATION.md" ] && pass || fail

check "DEPLOYMENT_GUIDE.md exists"
[ -f "DEPLOYMENT_GUIDE.md" ] && pass || fail

check "TESTING_GUIDE.md exists"
[ -f "TESTING_GUIDE.md" ] && pass || fail

check "READINESS_CHECKLIST.md exists"
[ -f "READINESS_CHECKLIST.md" ] && pass || fail

check "EXECUTIVE_SUMMARY.md exists"
[ -f "EXECUTIVE_SUMMARY.md" ] && pass || fail

echo ""
echo "🔨 Build"
check "npm run build passes"
npm run build > /dev/null 2>&1 && pass || fail

echo ""
echo "=========================================="
echo "Results: $CHECKS_PASSED/$CHECKS_TOTAL checks passed"
echo "=========================================="

if [ $CHECKS_PASSED -eq $CHECKS_TOTAL ]; then
  echo -e "${GREEN}✓ ALL CHECKS PASSED - READY FOR DEPLOYMENT${NC}"
  exit 0
else
  echo -e "${RED}✗ SOME CHECKS FAILED - REVIEW ABOVE${NC}"
  exit 1
fi
