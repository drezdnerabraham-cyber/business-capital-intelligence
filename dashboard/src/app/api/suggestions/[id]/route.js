export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'
import { acceptSuggestion } from '@/lib/learner'

export async function PATCH(req, { params }) {
  const sb = adminClient()
  const { action } = await req.json()

  if (action === 'accept') {
    const { data: s } = await sb.from('lender_suggestions').select('*').eq('id', params.id).single()
    if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await acceptSuggestion(sb, s)
    return NextResponse.json({ ok: true, action: 'accepted' })
  }

  if (action === 'dismiss') {
    await sb.from('lender_suggestions').update({ status: 'dismissed', reviewed_at: new Date().toISOString() }).eq('id', params.id)
    return NextResponse.json({ ok: true, action: 'dismissed' })
  }

  return NextResponse.json({ error: 'action must be accept or dismiss' }, { status: 400 })
}
