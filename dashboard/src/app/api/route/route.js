export const dynamic = 'force-dynamic'
import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'
import { routeApplication } from '@/lib/router'

// Constant-time compare of two strings; returns false on any length mismatch
// (timingSafeEqual throws on unequal lengths, which itself leaks).
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

async function isAuthorized(req, sb) {
  // Option 1: the external form tool presents x-webhook-secret.
  const secret = process.env.WEBHOOK_SECRET
  const provided = req.headers.get('x-webhook-secret')
  if (secret && provided && safeEqual(provided, secret)) return true

  // Option 2: an authenticated admin triggers a re-route from the dashboard UI.
  const { data: { user } } = await sb.auth.getUser()
  if (user) return true

  return false
}

export async function POST(req) {
  const sb = adminClient()

  if (!(await isAuthorized(req, sb))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { application_id } = await req.json()

  if (!application_id) {
    return NextResponse.json({ error: 'application_id required' }, { status: 400 })
  }

  // Load application
  const { data: app, error: appErr } = await sb
    .from('applications')
    .select('*')
    .eq('id', application_id)
    .single()
  if (appErr) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  // Load active lenders
  const { data: lenders } = await sb.from('lenders').select('*').eq('is_active', true)
  if (!lenders?.length) {
    return NextResponse.json({ error: 'No active lenders configured' }, { status: 422 })
  }

  // Load historical rates per lender
  const { data: subStats } = await sb
    .from('submissions')
    .select('lender_id, status')
    .in('lender_id', lenders.map(l => l.id))
    .in('status', ['approved', 'funded', 'declined'])
    .gte('created_at', new Date(Date.now() - 90 * 86400 * 1000).toISOString())

  const historicalRates = {}
  for (const row of subStats || []) {
    const h = historicalRates[row.lender_id] ??= { total: 0, approved: 0 }
    h.total++
    if (['approved', 'funded'].includes(row.status)) h.approved++
  }

  const matches = routeApplication(app, lenders, historicalRates)
  if (!matches.length) {
    return NextResponse.json({ matches: [], message: 'No lenders matched this application.' })
  }

  // Delete existing pending submissions for this application (re-route)
  await sb.from('submissions').delete().eq('application_id', application_id).eq('status', 'pending')

  // Create submissions for top 3 matches
  const top = matches.slice(0, 3)
  const toInsert = top.map((m, i) => ({
    application_id,
    lender_id: m.lender.id,
    fit_score: m.score,
    routing_reason: m.routing_reason,
    status: i === 0 ? 'pending' : 'pending', // all start pending; user submits manually
  }))

  const { data: created, error: insErr } = await sb
    .from('submissions')
    .insert(toInsert)
    .select(`*, lender:lender_id(name, submission_email, contact_name)`)

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })

  return NextResponse.json({ matches: created, total_matches: matches.length })
}
