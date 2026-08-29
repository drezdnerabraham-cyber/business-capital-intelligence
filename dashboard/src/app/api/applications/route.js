export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'
import { requireUser } from '@/lib/auth'
import {
  isUuid, badRequest,
  APPLICATION_WRITABLE_FIELDS, SUBMISSION_STATUSES,
} from '@/lib/validate'

export async function GET(req) {
  const sb = adminClient()
  const auth = await requireUser(sb)
  if (auth.response) return auth.response
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
  // Update credit_score/status on an application via the admin_update_application RPC
  // (applications holds PII, so writes are allowlisted server-side, not a raw table update).
  const sb = adminClient()
  const auth = await requireUser(sb)
  if (auth.response) return auth.response

  const body = await req.json()
  if (!isUuid(body.id)) return badRequest('id')

  // Pin writable columns to an allowlist rather than trusting the RPC alone.
  const payload = {}
  for (const k of APPLICATION_WRITABLE_FIELDS) {
    if (body[k] !== undefined) payload[k] = body[k]
  }
  if (payload.status !== undefined && !SUBMISSION_STATUSES.includes(payload.status)) {
    return badRequest('status')
  }
  if (payload.credit_score !== undefined) {
    const n = Number(payload.credit_score)
    if (!Number.isFinite(n) || n < 0 || n > 1000) return badRequest('credit_score')
    payload.credit_score = n
  }
  if (Object.keys(payload).length === 0) return badRequest('empty')

  const { data, error } = await sb.rpc('admin_update_application', { p_id: body.id, payload })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
