'use client'
import { useEffect, useState } from 'react'
import { fmtDate, fmt$ } from '@/lib/utils'

const FIELD_LABELS = {
  min_credit_score: 'Min Credit Score',
  max_credit_score: 'Max Credit Score',
  min_monthly_revenue: 'Min Monthly Revenue',
  max_monthly_revenue: 'Max Monthly Revenue',
  min_loan_amount: 'Min Loan Amount',
  max_loan_amount: 'Max Loan Amount',
  min_months_in_business: 'Min Months in Business',
}

const isMoney = f => f.includes('revenue') || f.includes('loan')

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [acting, setActing] = useState({})
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function load() {
    const d = await fetch('/api/suggestions').then(r => r.json())
    setSuggestions(d || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function runAnalysis() {
    setRunning(true)
    const d = await fetch('/api/suggestions', { method: 'POST' }).then(r => r.json())
    showToast(`Analysis complete. ${d.created} new suggestion${d.created !== 1 ? 's' : ''} found.`)
    load()
    setRunning(false)
  }

  async function act(id, action) {
    setActing(a => ({ ...a, [id]: action }))
    await fetch(`/api/suggestions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setSuggestions(s => s.filter(x => x.id !== id))
    showToast(action === 'accept' ? 'Rule updated!' : 'Suggestion dismissed.')
    setActing(a => ({ ...a, [id]: null }))
  }

  function fmt(v, field) {
    if (v == null) return '—'
    if (isMoney(field)) return `$${Number(v).toLocaleString()}`
    return String(v)
  }

  return (
    <div className="p-8 max-w-3xl">
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Auto-Learning Suggestions</h1>
          <p className="text-sm text-gray-500 mt-1">
            The system analyzes decline patterns and suggests rule improvements.
          </p>
        </div>
        <button onClick={runAnalysis} disabled={running}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          {running ? 'Analyzing…' : '↻ Run Analysis'}
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading…</div>
      ) : suggestions.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
          <div className="text-lg mb-1">No pending suggestions</div>
          <div className="text-sm">Run analysis once you have 3+ declined submissions with decline reasons logged.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map(s => (
            <div key={s.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{s.lender?.name}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Suggestion</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{s.reason_text}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">{FIELD_LABELS[s.field_name] || s.field_name}: </span>
                      <span className="line-through text-red-500">{fmt(s.current_value, s.field_name)}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="font-semibold text-green-700">{fmt(s.suggested_value, s.field_name)}</span>
                    </div>
                  </div>
                  {s.evidence?.count && (
                    <div className="text-xs text-gray-400 mt-1">Based on {s.evidence.count} data points</div>
                  )}
                  <div className="text-xs text-gray-400 mt-0.5">{fmtDate(s.created_at)}</div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => act(s.id, 'accept')}
                    disabled={!!acting[s.id]}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {acting[s.id] === 'accept' ? '…' : 'Accept'}
                  </button>
                  <button
                    onClick={() => act(s.id, 'dismiss')}
                    disabled={!!acting[s.id]}
                    className="border px-4 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {acting[s.id] === 'dismiss' ? '…' : 'Dismiss'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
