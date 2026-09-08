export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'
import { requireUser } from '@/lib/auth'
import {
  isUuid, badRequest,
  SUBMISSION_STATUSES, DECLINE_CATEGORY_VALUES,
} from '@/lib/validate'

export async function PATCH(req, { params }) {
  const sb = adminClient()
  const auth = await requireUser(sb)
  if (auth.response) return auth.response

  if (!isUuid(params.id)) return badRequest('id')

  const body = await req.json()

  if (!SUBMISSION_STATUSES.includes(body.status)) return badRequest('status')
  if (body.decline_category != null && !DECLINE_CATEGORY_VALUES.includes(body.decline_category)) {
    return badRequest('decline_category')
  }

  const updates = {
    status: body.status,
    status_updated_at: new Date().toISOString(),
  }
  if (body.decline_category) updates.decline_category = body.decline_category
  if (body.decline_reason) updates.decline_reason = body.decline_reason
  if (body.status === 'submitted') updates.submitted_at = new Date().toISOString()

  const { data, error } = await sb
    .from('submissions')
    .update(updates)
    .eq('id', params.id)
    .select(`*, lender:lender_id(name, submission_email)`)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
