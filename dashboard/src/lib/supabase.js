import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
// RLS is disabled on all dashboard tables, so anon key works when no service role key is set
const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function adminClient() {
  return createClient(url, apiKey, { auth: { persistSession: false } })
}
