export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

export async function POST(req) {
  const { email, password } = await req.json()
  const supabase = adminClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const supabase = adminClient()
  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
