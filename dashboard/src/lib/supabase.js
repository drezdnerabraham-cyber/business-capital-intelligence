import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Session-bound Supabase client for use inside Route Handlers. Requests carry the
// admin's Supabase Auth session cookie, so RLS policies see auth.role() = 'authenticated'
// for whoever is logged in — there is no service-role key here, writes to sensitive
// tables (lenders, applications) go through the admin_* RPC functions instead.
export function adminClient() {
  const cookieStore = cookies()
  return createServerClient(url, anonKey, {
    cookies: {
      get(name) { return cookieStore.get(name)?.value },
      set(name, value, options) { cookieStore.set({ name, value, ...options }) },
      remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
    },
  })
}
