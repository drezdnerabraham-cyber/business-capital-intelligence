export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

export async function GET(_, { params }) {
  const sb = adminClient()
  const { data, error } = await sb.from('lenders').select('*').eq('id', params.id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req, { params }) {
  const sb = adminClient()
  const body = await req.json()
  const { data, error } = await sb.rpc('admin_update_lender', { p_id: params.id, payload: body })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_, { params }) {
  const sb = adminClient()
  const { error } = await sb.rpc('admin_delete_lender', { p_id: params.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
