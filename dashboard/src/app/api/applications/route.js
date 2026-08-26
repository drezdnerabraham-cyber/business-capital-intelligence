export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

export async function GET(req) {
  const sb = adminClient()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 25
  const offset = (page - 1) * limit
  const search = searchParams.get('q')

  let query = sb
    .from('applications')
    .select(`id, created_at, business_name, contact_name, email, phone,
      industry, state, monthly_revenue, time_in_business, funding_amount,
      credit_score, status, submitted_at,
      submissions(id, status, fit_score, lender_id, lenders(name))`, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.ilike('business_name', `%${search}%`)
  }

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ applications: data || [], total: count || 0, page, limit })
}

export async function PATCH(req) {
  // Update credit_score or other fields on application
  const sb = adminClient()
  const { id, ...fields } = await req.json()
  const { data, error } = await sb.from('applications').update(fields).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
