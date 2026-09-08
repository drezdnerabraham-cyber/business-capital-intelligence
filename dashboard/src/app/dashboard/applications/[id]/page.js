'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fmtDate, fmt$, STATUS_COLORS, DECLINE_CATEGORIES, scoreBadge } from '@/lib/utils'

export default function ApplicationDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [app, setApp] = useState(null)
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [routing, setRouting] = useState(false)
  const [creditScore, setCreditScore] = useState('')
  const [savingCredit, setSavingCredit] = useState(false)
  const [updating, setUpdating] = useState({})
  const [declineForm, setDeclineForm] = useState({})
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function load() {
    const res = await fetch(`/api/applications?page=1`)
    const d = await res.json()
    const found = d.applications.find(a => a.id === id)
    if (found) {
      setApp(found)
      setSubs(found.submissions || [])
      setCreditScore(found.credit_score || '')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function routeApp() {
    setRouting(true)
    const res = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: id }),
    })
    const d = await res.json()
    if (d.matches) {
      setSubs(d.matches)
      showToast(`Routed to ${d.matches.length} lender${d.matches.length !== 1 ? 's' : ''}. Top match: ${d.matches[0]?.lender?.name}`)
    } else {
      showToast(d.error || d.message || 'No lenders matched.')
    }
    setRouting(false)
  }

  async function saveCredit() {
    setSavingCredit(true)
    await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, credit_score: creditScore ? parseInt(creditScore) : null }),
    })
    setSavingCredit(false)
    showToast('Credit score saved.')
  }

  async function updateStatus(subId, status) {
    setUpdating(u => ({ ...u, [subId]: true }))
    const body = { status }
    const df = declineForm[subId]
    if (df) { body.decline_category = df.category; body.decline_reason = df.reason }
    const res = await fetch(`/api/submissions/${subId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const updated = await res.json()
    setSubs(s => s.map(x => x.id === subId ? { ...x, ...updated } : x))
    setUpdating(u => ({ ...u, [subId]: false }))
    showToast(`Status updated to ${status}`)
  }

  if (loading) return <div className="p-8 text-gray-400">Loading…</div>
  if (!app) return <div className="p-8 text-gray-500">Application not found. <button onClick={() => router.back()} className="text-indigo-600 underline">Go back</button></div>

  const fields = [
    ['Business Name', app.business_name],
    ['Contact Name', app.contact_name],
    ['Email', app.email],
    ['Phone', app.phone],
    ['Industry', app.industry],
    ['State', app.state],
    ['Monthly Revenue', app.monthly_revenue],
    ['Time in Business', app.time_in_business],
    ['Loan Amount Requested', app.funding_amount],
    ['Submitted', fmtDate(app.created_at)],
  ]

  return (
    <div className="p-8 max-w-5xl">
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600 mb-1">← Applications</button>
          <h1 className="text-2xl font-bold">{app.business_name || app.contact_name || 'Application'}</h1>
          <div className="text-sm text-gray-500 mt-0.5">{app.industry} {app.state ? `· ${app.state}` : ''} · {fmtDate(app.created_at)}</div>
        </div>
        <button onClick={routeApp} disabled={routing}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          {routing ? 'Routing…' : subs.length ? '↺ Re-route' : '→ Route to Lender'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Application Details */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Application Details</h2>
          <dl className="space-y-2">
            {fields.map(([label, val]) => val ? (
              <div key={label} className="flex justify-between text-sm">
                <dt className="text-gray-500">{label}</dt>
                <dd className="font-medium text-right max-w-xs truncate">{val}</dd>
              </div>
            ) : null)}
          </dl>
        </div>

        {/* Credit Score */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Credit Score</h2>
          <p className="text-sm text-gray-500 mb-3">Enter the owner's FICO score to improve routing accuracy.</p>
          <div className="flex gap-2">
            <input
              type="number" min="300" max="850" placeholder="e.g. 650"
              value={creditScore} onChange={e => setCreditScore(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={saveCredit} disabled={savingCredit}
              className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50">
              {savingCredit ? 'Saving…' : 'Save'}
            </button>
          </div>
          {app.credit_score && (
            <div className="mt-3 text-sm text-gray-600">Current: <span className="font-semibold">{app.credit_score}</span></div>
          )}
        </div>
      </div>

      {/* Submissions */}
      <div className="bg-white rounded-xl border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Lender Submissions</h2>
          <span className="text-sm text-gray-500">{subs.length} lender{subs.length !== 1 ? 's' : ''}</span>
        </div>

        {subs.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            No submissions yet. Click "Route to Lender" above to match this application.
          </div>
        ) : (
          <div className="divide-y">
            {subs.map(s => (
              <div key={s.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.lender?.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.status]}`}>
                        {s.status}
                      </span>
                      {s.fit_score && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreBadge(s.fit_score)}`}>
                          Fit: {s.fit_score}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.lender?.submission_email}</div>
                    {s.routing_reason && (
                      <div className="text-xs text-gray-400 mt-0.5">Reason: {s.routing_reason}</div>
                    )}
                    {s.status === 'declined' && s.decline_category && (
                      <div className="mt-1 text-xs text-red-600">
                        Declined: {DECLINE_CATEGORIES.find(c => c.value === s.decline_category)?.label}
                        {s.decline_reason && ` — ${s.decline_reason}`}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={s.status}
                      onChange={e => {
                        if (e.target.value === 'declined') {
                          setDeclineForm(f => ({ ...f, [s.id]: { category: '', reason: '' } }))
                        }
                        updateStatus(s.id, e.target.value)
                      }}
                      disabled={updating[s.id]}
                      className="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="funded">Funded</option>
                      <option value="declined">Declined</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>
                </div>

                {/* Decline reason form */}
                {declineForm[s.id] !== undefined && s.status !== 'declined' && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg space-y-2">
                    <select
                      value={declineForm[s.id]?.category || ''}
                      onChange={e => setDeclineForm(f => ({ ...f, [s.id]: { ...f[s.id], category: e.target.value } }))}
                      className="w-full border rounded px-2 py-1 text-xs"
                    >
                      <option value="">Select decline reason…</option>
                      {DECLINE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input
                      type="text" placeholder="Additional notes (optional)"
                      value={declineForm[s.id]?.reason || ''}
                      onChange={e => setDeclineForm(f => ({ ...f, [s.id]: { ...f[s.id], reason: e.target.value } }))}
                      className="w-full border rounded px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
