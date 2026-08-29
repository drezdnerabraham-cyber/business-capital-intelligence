import { NextResponse } from 'next/server'

// Shared auth guard for API route handlers. The middleware only protects
// /dashboard/*, so every mutating /api/* handler must call this — the
// anon-key SSR client + cookies alone is not proof of authentication.
export async function requireUser(sb) {
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return { user: null, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) }
  }
  return { user, response: null }
}
