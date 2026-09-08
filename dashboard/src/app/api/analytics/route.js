export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'
import { requireUser } from '@/lib/auth'

export async function GET(req) {
  const sb = adminClient()
  const auth = await requireUser(sb)
  if (auth.response) return auth.response
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '90')
  const since = new Date(Date.now() - days * 86400 * 1000).toISOString()

  const { data: subs } = await sb
    .from('submissions')
    .select(`
      id, status, fit_score, created_at, submitted_at, status_updated_at,
      decline_category,
      lender:lender_id(id, name, commission_rate)
    `)
    .gte('created_at', since)

  if (!subs) return NextResponse.json([])

  const byLender = {}
  for (const s of subs) {
    const lid = s.lender?.id
    if (!lid) continue
    const bucket = byLender[lid] ??= {
      id: lid,
      name: s.lender.name,
      commission_rate: s.lender.commission_rate,
      total: 0, submitted: 0, approved: 0, funded: 0, declined: 0,
      decline_categories: {},
      decision_times: [],
    }
    bucket.total++
    if (['submitted','approved','funded','declined'].includes(s.status)) bucket.submitted++
    if (s.status === 'approved') bucket.approved++
    if (s.status === 'funded') bucket.funded++
    if (s.status === 'declined') {
      bucket.declined++
      if (s.decline_category) {
        bucket.decline_categories[s.decline_category] = (bucket.decline_categories[s.decline_category] || 0) + 1
      }
    }
    if (s.submitted_at && s.status_updated_at && s.status !== 'pending') {
      const ms = new Date(s.status_updated_at) - new Date(s.submitted_at)
      if (ms > 0) bucket.decision_times.push(ms / 86400000)
    }
  }

  const stats = Object.values(byLender).map(b => {
    const decided = b.approved + b.funded + b.declined
    const topDecline = Object.entries(b.decline_categories).sort((a, z) => z[1] - a[1])[0]
    return {
      id: b.id, name: b.name, commission_rate: b.commission_rate,
      total_submissions: b.total, submitted: b.submitted,
      approved: b.approved + b.funded, declined: b.declined,
      approval_rate: decided ? Math.round((b.approved + b.funded) / decided * 100) : null,
      avg_days_to_decision: b.decision_times.length
        ? Math.round(b.decision_times.reduce((a, v) => a + v, 0) / b.decision_times.length * 10) / 10
        : null,
      top_decline_reason: topDecline ? topDecline[0] : null,
    }
  }).sort((a, b) => b.total_submissions - a.total_submissions)

  return NextResponse.json(stats)
}
