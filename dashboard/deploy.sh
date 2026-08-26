#!/bin/bash
# Run this from your local machine to deploy the dashboard to Vercel.
# Prerequisites: npm install -g vercel && vercel login

set -e

cd "$(dirname "$0")"

# Set production env vars on Vercel (run once)
echo "Setting environment variables..."
echo "https://sphnjdoeqvrryzvdyzgk.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaG5qZG9lcXZycnl6dmR5emdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NzQ5MzYsImV4cCI6MjEwMjA1MDkzNn0.4snIQpXx6ojE5Cv_3KVNoXK0iwGqS_xaD86SkZZl0bU" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "drezdnerabraham@gmail.com" | vercel env add ADMIN_EMAIL production
echo "Abemel1346" | vercel env add ADMIN_PASSWORD production
echo "384bbe9037f6ce552475e1b64f0f9351c1c6a37f264465a1fd0bbd1829f8f276" | vercel env add ADMIN_JWT_SECRET production

echo "Deploying..."
vercel --prod

echo "Done!"
