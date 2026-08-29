export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'
import { requireUser } from '@/lib/auth'
import { runLearningAnalysis } from '@/lib/learner'

export async function GET() {
  const sb = adminClient()
  const auth = await requireUser(sb)
  if (auth.response) return auth.response
  const { data, error } = await sb
    .from('lender_suggestions')
    .select(`*, lender:lender_id(name)`)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST() {
  const sb = adminClient()
  const auth = await requireUser(sb)
  if (auth.response) return auth.response
  const inserted = await runLearningAnalysis(sb)
  return NextResponse.json({ created: inserted.length, suggestions: inserted })
}
