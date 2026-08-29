import { parseRevenue } from './utils'

export async function runLearningAnalysis(supabase) {
  const since = new Date(Date.now() - 90 * 86400 * 1000).toISOString()

  const { data: declines } = await supabase
    .from('submissions')
    .select(`id, lender_id, decline_category, created_at,
      application:application_id (monthly_revenue, credit_score, time_in_business, funding_amount)`)
    .eq('status', 'declined')
    .not('decline_category', 'is', null)
    .gte('created_at', since)

  if (!declines?.length) return []

  const lenderIds = [...new Set(declines.map(d => d.lender_id))]
  const { data: lenders } = await supabase.from('lenders').select('*').in('id', lenderIds)
  const lenderMap = Object.fromEntries((lenders || []).map(l => [l.id, l]))

  const byLender = {}
  for (const d of declines) {
    ;(byLender[d.lender_id] ??= []).push(d)
  }

  const candidates = []

  for (const [lid, rows] of Object.entries(byLender)) {
    const lender = lenderMap[lid]
    if (!lender) continue

    // Credit score pattern
    const creditRows = rows.filter(r => r.decline_category === 'low_credit' && r.application?.credit_score)
    if (creditRows.length >= 3) {
      const scores = creditRows.map(r => Number(r.application.credit_score)).sort((a, b) => a - b)
      const p75 = scores[Math.floor(scores.length * 0.75)]
      if (lender.min_credit_score !== null && p75 > lender.min_credit_score) {
        candidates.push({
          lender_id: lid,
          field_name: 'min_credit_score',
          current_value: lender.min_credit_score,
          suggested_value: p75,
          reason_text: `Declined ${creditRows.length} deals for low credit. 75th percentile of declined scores is ${p75} — suggest raising minimum from ${lender.min_credit_score}.`,
          evidence: { declined_scores: scores, count: creditRows.length },
        })
      }
    }

    // Revenue pattern
    const revRows = rows.filter(r => r.decline_category === 'insufficient_revenue' && r.application?.monthly_revenue)
    if (revRows.length >= 3) {
      const revs = revRows.map(r => parseRevenue(r.application.monthly_revenue)).filter(Boolean).sort((a, b) => a - b)
      if (revs.length >= 3) {
        const p75 = revs[Math.floor(revs.length * 0.75)]
        if (lender.min_monthly_revenue !== null && p75 > lender.min_monthly_revenue) {
          const suggested = Math.round(p75 / 1000) * 1000
          candidates.push({
            lender_id: lid,
            field_name: 'min_monthly_revenue',
            current_value: lender.min_monthly_revenue,
            suggested_value: suggested,
            reason_text: `Declined ${revRows.length} deals for insufficient revenue. Suggest raising minimum from $${lender.min_monthly_revenue.toLocaleString()} to $${suggested.toLocaleString()}.`,
            evidence: { declined_revenues: revs, count: revRows.length },
          })
        }
      }
    }
  }

  const inserted = []
  for (const c of candidates) {
    const { data: existing } = await supabase
      .from('lender_suggestions')
      .select('id')
      .eq('lender_id', c.lender_id)
      .eq('field_name', c.field_name)
      .eq('status', 'pending')
      .limit(1)

    if (!existing?.length) {
      const { data } = await supabase.from('lender_suggestions').insert(c).select().single()
      if (data) inserted.push(data)
    }
  }

  return inserted
}

export async function acceptSuggestion(supabase, suggestion) {
  const payload = { [suggestion.field_name]: suggestion.suggested_value }
  await supabase.rpc('admin_update_lender', { p_id: suggestion.lender_id, payload })
  await supabase.from('lender_suggestions').update({ status: 'accepted', reviewed_at: new Date().toISOString() }).eq('id', suggestion.id)
}
