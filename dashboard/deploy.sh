#!/bin/bash
# Fallback: the mcalenderintel Vercel project is now connected directly to
# this repo/branch via Git integration, so pushes here deploy automatically.
# Only run this script if you need to deploy manually from a local machine.
# Prerequisites: npm install -g vercel && vercel login
#
# Env vars are no longer hardcoded here — that tied key rotation to a repo
# commit and defeated environment isolation. Preferred flow: run
#   vercel env pull .env.local
# to sync from the Vercel dashboard, or paste the values when prompted below.

set -e

cd "$(dirname "$0")"

echo "Setting environment variables..."
read -p "NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
read -sp "NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
echo
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Admin login is a real Supabase Auth user now (no ADMIN_EMAIL/ADMIN_PASSWORD/ADMIN_JWT_SECRET
# env vars to set) — manage that account from the Supabase dashboard's Authentication tab.

echo "Deploying..."
vercel --prod
echo "Done!"
