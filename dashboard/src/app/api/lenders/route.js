export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

export async function GET() {
  const sb = adminClient()
  const { data, error } = await sb
    .from('lenders')
    .select(`*, submissions(id, status)`)
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const lenders = (data || []).map(l => {
    const subs = l.submissions || []
    const total = subs.filter(s => ['approved','funded','declined'].includes(s.status)).length
    const approved = subs.filter(s => ['approved','funded'].includes(s.status)).length
    return {
      ...l,
      submissions: undefined,
      stats: { total_submissions: subs.length, decided: total, approved, approval_rate: total ? Math.round(approved / total * 100) : null },
    }
  })

  return NextResponse.json(lenders)
}

export async function POST(req) {
  const sb = adminClient()
  const body = await req.json()
  const { data, error } = await sb.rpc('admin_insert_lender', { payload: body })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
