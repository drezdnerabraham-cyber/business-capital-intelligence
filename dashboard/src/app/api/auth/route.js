export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

const LOGIN_WINDOW_SECONDS = 15 * 60 // 15 minutes
const LOGIN_MAX_ATTEMPTS = 5         // 5 failed attempts per window per IP

export async function POST(req) {
  const supabase = adminClient()

  // IP-scoped fixed-window limit. We bump the counter on failed attempts
  // only, so a successful login doesn't consume the budget.
  const ip = clientIp(req)
  const pre = await checkRateLimit(supabase, 'login', ip, LOGIN_WINDOW_SECONDS, LOGIN_MAX_ATTEMPTS)
  if (!pre.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(pre.retryAfterSeconds ?? LOGIN_WINDOW_SECONDS) } }
    )
  }

  const { email, password } = await req.json()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const supabase = adminClient()
  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
