#!/bin/bash
# Run this from your local machine to deploy to Vercel.
# Prerequisites: npm install -g vercel && vercel login

set -e

cd "$(dirname "$0")"

echo "Setting environment variables..."
echo "https://sphnjdoeqvrryzvdyzgk.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaG5qZG9lcXZycnl6dmR5emdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NzQ5MzYsImV4cCI6MjEwMjA1MDkzNn0.4snIQpXx6ojE5Cv_3KVNoXK0iwGqS_xaD86SkZZl0bU" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Prompt for sensitive values
read -rsp "Admin email: " ADMIN_EMAIL_VAL && echo
echo "$ADMIN_EMAIL_VAL" | vercel env add ADMIN_EMAIL production

read -rsp "Admin password: " ADMIN_PW_VAL && echo
echo "$ADMIN_PW_VAL" | vercel env add ADMIN_PASSWORD production

read -rsp "JWT secret (press Enter to generate): " JWT_VAL && echo
if [ -z "$JWT_VAL" ]; then
  JWT_VAL=$(openssl rand -hex 32)
  echo "Generated: $JWT_VAL"
fi
echo "$JWT_VAL" | vercel env add ADMIN_JWT_SECRET production

echo "Deploying..."
vercel --prod
echo "Done!"
