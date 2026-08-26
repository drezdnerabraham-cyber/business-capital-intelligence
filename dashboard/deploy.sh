#!/bin/bash
# Fallback: the mcalenderintel Vercel project is now connected directly to
# this repo/branch via Git integration, so pushes here deploy automatically.
# Only run this script if you need to deploy manually from a local machine.
# Prerequisites: npm install -g vercel && vercel login

set -e

cd "$(dirname "$0")"

echo "Setting environment variables..."
echo "https://sphnjdoeqvrryzvdyzgk.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaG5qZG9lcXZycnl6dmR5emdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NzQ5MzYsImV4cCI6MjEwMjA1MDkzNn0.4snIQpXx6ojE5Cv_3KVNoXK0iwGqS_xaD86SkZZl0bU" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Admin login is a real Supabase Auth user now (no ADMIN_EMAIL/ADMIN_PASSWORD/ADMIN_JWT_SECRET
# env vars to set) — manage that account from the Supabase dashboard's Authentication tab.

echo "Deploying..."
vercel --prod
echo "Done!"
