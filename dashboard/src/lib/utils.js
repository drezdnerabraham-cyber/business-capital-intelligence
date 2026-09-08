export function parseRevenue(text) {
  if (text == null) return null
  if (typeof text === 'number') return text
  const s = String(text)
  const clean = s.replace(/[$,\s]/g, '')
  // Handle ranges: "50000-100000" or "$50,000 - $100,000"
  const rangeMatch = s.match(/\$?([\d,]+)\s*[-–to]\s*\$?([\d,]+)/i)
  if (rangeMatch) {
    const lo = parseFloat(rangeMatch[1].replace(/,/g, ''))
    const hi = parseFloat(rangeMatch[2].replace(/,/g, ''))
    return lo // use lower bound for conservative routing
  }
  // "Less than $X"
  const ltMatch = s.match(/less\s+than\s+\$?([\d,k]+)/i)
  if (ltMatch) {
    const v = ltMatch[1].replace(/,/g, '').replace(/k$/i, '000')
    return parseFloat(v) * 0.6
  }
  // "$X+" or "$Xk+"
  const plusMatch = s.match(/\$?([\d,k]+)\+/i)
  if (plusMatch) {
    const v = plusMatch[1].replace(/,/g, '').replace(/k$/i, '000')
    return parseFloat(v)
  }
  // Plain number with optional k suffix
  const numMatch = clean.match(/^([\d.]+)(k?)$/i)
  if (numMatch) return parseFloat(numMatch[1]) * (numMatch[2] ? 1000 : 1)
  return null
}

export function parseTIB(text) {
  if (text == null) return null
  if (typeof text === 'number') return text
  const t = String(text).toLowerCase()
  if (/less\s+than\s+6\s*mo/.test(t) || /<\s*6\s*mo/.test(t)) return 3
  if (/less\s+than\s+1\s*year/.test(t) || /<\s*1\s*year/.test(t)) return 6
  if (/6\s*-?\s*12\s*mo/.test(t)) return 9
  if (/1\s*-?\s*2\s*year/.test(t)) return 18
  if (/2\s*-?\s*3\s*year/.test(t)) return 30
  if (/2\s*-?\s*5\s*year/.test(t)) return 36
  if (/3\s*-?\s*5\s*year/.test(t)) return 48
  if (/5\+\s*year|more\s+than\s+5/.test(t)) return 72
  if (/3\+\s*year|more\s+than\s+3/.test(t)) return 48
  if (/2\+\s*year|more\s+than\s+2/.test(t)) return 30
  if (/1\+\s*year|more\s+than\s+1/.test(t)) return 18
  const monthMatch = t.match(/(\d+)\s*month/)
  if (monthMatch) return parseInt(monthMatch[1])
  const yearMatch = t.match(/(\d+)\s*year/)
  if (yearMatch) return parseInt(yearMatch[1]) * 12
  return null
}

export function fmt$(n) {
  if (n == null || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function scoreBadge(score) {
  if (score >= 80) return 'bg-green-100 text-green-800'
  if (score >= 60) return 'bg-blue-100 text-blue-800'
  if (score >= 40) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

export const STATUS_COLORS = {
  pending:   'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-800',
  approved:  'bg-green-100 text-green-800',
  funded:    'bg-emerald-100 text-emerald-800',
  declined:  'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-500',
}

export const INDUSTRIES = [
  'Adult Entertainment','Cannabis/Marijuana','Gambling','Firearms/Weapons',
  'Cryptocurrency','Legal/Law Firms','Religious Organizations','Nonprofits',
  'Restaurants','Trucking','Construction','Real Estate','Auto Dealers',
  'Staffing','Healthcare','Retail','E-Commerce','Beauty/Salon',
]

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

export const DECLINE_CATEGORIES = [
  { value: 'low_credit', label: 'Low Credit Score' },
  { value: 'insufficient_revenue', label: 'Insufficient Revenue' },
  { value: 'high_risk_industry', label: 'High Risk Industry' },
  { value: 'time_in_business', label: 'Time in Business' },
  { value: 'stacking', label: 'Stacking (Existing MCAs)' },
  { value: 'nsfs', label: 'NSFs / Overdrafts' },
  { value: 'other', label: 'Other' },
]
