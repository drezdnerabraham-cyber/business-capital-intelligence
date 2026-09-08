import { NextResponse } from 'next/server'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const SUBMISSION_STATUSES = [
  'pending', 'submitted', 'approved', 'funded', 'declined', 'withdrawn',
]

// Must match DECLINE_CATEGORIES values in src/lib/utils.js — that's the UI
// dropdown; the DB check constraint uses the same set.
export const DECLINE_CATEGORY_VALUES = [
  'low_credit', 'insufficient_revenue', 'high_risk_industry',
  'time_in_business', 'stacking', 'nsfs', 'other',
]

export const APPLICATION_WRITABLE_FIELDS = ['credit_score', 'status']

export function isUuid(v) {
  return typeof v === 'string' && UUID_RE.test(v)
}

export function badRequest(detail) {
  return NextResponse.json({ error: `invalid_request:${detail}` }, { status: 400 })
}
