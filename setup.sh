#!/bin/bash
# Automated setup — pushes this template to GitHub and creates a Vercel project
# Reads tokens from ../capstone-studios/crm-dashboard/.env.local
#
# Usage:
#   cd /Users/adarshdayalan/Documents/capstone-site-template
#   bash setup.sh

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Capstone Site Template — Automated Setup${NC}"
echo ""

# Load env vars from CRM
ENV_FILE="../capstone-studios/crm-dashboard/.env.local"
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}Error: $ENV_FILE not found${NC}"
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

# Verify required tokens
if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${RED}Error: GITHUB_TOKEN not set in $ENV_FILE${NC}"
  exit 1
fi
if [ -z "$GITHUB_OWNER" ]; then
  echo -e "${RED}Error: GITHUB_OWNER not set in $ENV_FILE${NC}"
  exit 1
fi
if [ -z "$VERCEL_TOKEN" ]; then
  echo -e "${RED}Error: VERCEL_TOKEN not set in $ENV_FILE${NC}"
  exit 1
fi

echo -e "${GREEN}✓${NC} Loaded tokens from .env.local"
echo "  GitHub owner: $GITHUB_OWNER"
echo ""

REPO_NAME="capstone-site-template"

# ── Step 1: Create GitHub repo ──
echo -e "${BLUE}[1/5]${NC} Creating GitHub repo '$GITHUB_OWNER/$REPO_NAME'..."

CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"Premium one-pager template for Capstone Studios client sites\",
    \"private\": false,
    \"auto_init\": false,
    \"is_template\": true
  }")

HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
BODY=$(echo "$CREATE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
  echo -e "${GREEN}✓${NC} Repo created: https://github.com/$GITHUB_OWNER/$REPO_NAME"
elif [ "$HTTP_CODE" = "422" ]; then
  echo -e "${YELLOW}⚠${NC}  Repo already exists — continuing"
else
  echo -e "${RED}✗ Failed to create repo (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
  exit 1
fi
echo ""

# ── Step 2: Initialize local git ──
echo -e "${BLUE}[2/5]${NC} Initializing local git repo..."

if [ ! -d ".git" ]; then
  git init -q
  git branch -M main
  echo -e "${GREEN}✓${NC} Git initialized"
else
  echo -e "${YELLOW}⚠${NC}  Git already initialized"
fi

# Check if remote exists
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "https://${GITHUB_TOKEN}@github.com/$GITHUB_OWNER/$REPO_NAME.git"
else
  git remote add origin "https://${GITHUB_TOKEN}@github.com/$GITHUB_OWNER/$REPO_NAME.git"
fi

# Set git user if not already set locally
if ! git config user.email >/dev/null 2>&1; then
  git config user.email "capstone@local"
  git config user.name "Capstone Setup"
fi

echo ""

# ── Step 3: Commit and push ──
echo -e "${BLUE}[3/5]${NC} Committing and pushing to GitHub..."

git add .
if git diff --cached --quiet; then
  echo -e "${YELLOW}⚠${NC}  Nothing new to commit"
else
  git commit -q -m "Initial template commit"
  echo -e "${GREEN}✓${NC} Committed"
fi

# Force push (template setup, fresh state)
git push -u origin main 2>&1 | tail -3
echo -e "${GREEN}✓${NC} Pushed to GitHub"
echo ""

# ── Step 4: Mark as template repo via API ──
echo -e "${BLUE}[4/5]${NC} Marking repo as a GitHub template..."

TEMPLATE_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X PATCH \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$GITHUB_OWNER/$REPO_NAME" \
  -d '{"is_template": true}')

HTTP_CODE=$(echo "$TEMPLATE_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓${NC} Marked as template"
else
  echo -e "${YELLOW}⚠${NC}  Template flag returned $HTTP_CODE (non-critical)"
fi
echo ""

# ── Step 5: Create Vercel project ──
echo -e "${BLUE}[5/5]${NC} Creating Vercel project..."

VERCEL_BODY="{
  \"name\": \"$REPO_NAME\",
  \"framework\": \"nextjs\",
  \"gitRepository\": {
    \"type\": \"github\",
    \"repo\": \"$GITHUB_OWNER/$REPO_NAME\"
  }
}"

VERCEL_URL="https://api.vercel.com/v10/projects"
if [ -n "$VERCEL_TEAM_ID" ]; then
  VERCEL_URL="${VERCEL_URL}?teamId=${VERCEL_TEAM_ID}"
fi

VERCEL_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  "$VERCEL_URL" \
  -d "$VERCEL_BODY")

HTTP_CODE=$(echo "$VERCEL_RESPONSE" | tail -n1)
BODY=$(echo "$VERCEL_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  echo -e "${GREEN}✓${NC} Vercel project created"
elif [ "$HTTP_CODE" = "409" ]; then
  echo -e "${YELLOW}⚠${NC}  Vercel project already exists"
else
  echo -e "${RED}✗ Vercel project creation failed (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
  echo ""
  echo "You can manually create it at https://vercel.com/new/import?s=https://github.com/$GITHUB_OWNER/$REPO_NAME"
fi
echo ""

# ── Done ──
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "Template repo: https://github.com/$GITHUB_OWNER/$REPO_NAME"
echo "Vercel project: https://${REPO_NAME}.vercel.app"
echo ""
echo "Next: each client will get their own copy of this repo"
echo "created automatically by the CRM deploy API."
echo -e "${GREEN}════════════════════════════════════════${NC}"
