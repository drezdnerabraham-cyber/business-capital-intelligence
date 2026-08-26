import { parseRevenue, parseTIB } from './utils'

export function calculateFitScore(app, lender) {
  const revenue = parseRevenue(app.monthly_revenue)
  const tib = parseTIB(app.time_in_business)
  const loanAmt = parseRevenue(app.funding_amount)
  const credit = app.credit_score ? Number(app.credit_score) : null

  const fail = (min, max, val) => {
    if (min && val !== null && val < min) return true
    if (max && val !== null && val > max) return true
    return false
  }

  if (fail(lender.min_monthly_revenue, lender.max_monthly_revenue, revenue)) return 0
  if (fail(lender.min_months_in_business, null, tib)) return 0
  if (fail(lender.min_credit_score, lender.max_credit_score, credit)) return 0
  if (fail(lender.min_loan_amount, lender.max_loan_amount, loanAmt)) return 0

  if (lender.blocked_industries?.length && app.industry) {
    const ind = app.industry.toLowerCase()
    if (lender.blocked_industries.some(b => ind.includes(b.toLowerCase()))) return 0
  }
  if (lender.blocked_states?.length && app.state) {
    if (lender.blocked_states.includes(app.state.toUpperCase())) return 0
  }

  // Soft scoring (headroom above minimums + commission)
  let score = 50

  // Credit headroom: 0–20 pts
  if (credit && lender.min_credit_score) {
    score += Math.min(20, ((credit - lender.min_credit_score) / 200) * 20)
  } else if (!lender.min_credit_score) score += 10

  // Revenue headroom: 0–15 pts
  if (revenue && lender.min_monthly_revenue) {
    const pct = (revenue - lender.min_monthly_revenue) / lender.min_monthly_revenue
    score += Math.min(15, pct * 15)
  } else if (!lender.min_monthly_revenue) score += 7

  // Loan amount centrality: 0–10 pts
  if (loanAmt && lender.min_loan_amount && lender.max_loan_amount) {
    const mid = (lender.min_loan_amount + lender.max_loan_amount) / 2
    const half = (lender.max_loan_amount - lender.min_loan_amount) / 2
    const distance = Math.abs(loanAmt - mid) / half
    score += Math.max(0, 10 - distance * 10)
  } else if (!lender.min_loan_amount) score += 5

  // Commission bonus: 0–5 pts
  if (lender.commission_rate) score += Math.min(5, (lender.commission_rate / 15) * 5)

  return Math.min(100, Math.round(score))
}

export function routeApplication(app, lenders, historicalRates = {}) {
  const matches = []

  for (const lender of lenders) {
    if (!lender.is_active) continue

    let score = calculateFitScore(app, lender)
    if (score === 0) continue

    const hist = historicalRates[lender.id]
    if (hist && hist.total >= 5) {
      const rate = hist.approved / hist.total
      score = Math.min(100, Math.round(score * (0.5 + rate)))
    }

    const reasons = []
    if (lender.commission_rate) reasons.push(`${lender.commission_rate}% comm`)
    matches.push({
      lender,
      score,
      routing_reason: reasons.join(', ') || 'Meets all criteria',
    })
  }

  return matches.sort((a, b) => b.score - a.score)
}
