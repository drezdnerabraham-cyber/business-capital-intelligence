'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { fmtDate, STATUS_COLORS } from '@/lib/utils'

export default function Applications() {
  const [data, setData] = useState({ applications: [], total: 0 })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [routing, setRouting] = useState({})

  const load = useCallback(() => {
    setLoading(true)
    const qs = new URLSearchParams({ page, ...(search ? { q: search } : {}) })
    fetch(`/api/applications?${qs}`).then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [page, search])

  useEffect(() => { load() }, [load])

  async function route(appId, e) {
    e.stopPropagation()
    setRouting(r => ({ ...r, [appId]: true }))
    await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: appId }),
    })
    setRouting(r => ({ ...r, [appId]: false }))
    load()
  }

  const totalPages = Math.ceil(data.total / 25)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <span className="text-sm text-gray-500">{data.total} total</span>
      </div>

      <div className="mb-4">
        <input
          type="search" placeholder="Search by business name…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="border rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Business</th>
              <th className="px-4 py-3 text-left">Revenue / Mo</th>
              <th className="px-4 py-3 text-left">Loan Ask</th>
              <th className="px-4 py-3 text-left">Credit</th>
              <th className="px-4 py-3 text-left">State</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Routing</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            ) : data.applications.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No applications found.</td></tr>
            ) : data.applications.map(a => {
              const subs = a.submissions || []
              const topStatus = subs.find(s => s.status !== 'pending')?.status || (subs.length ? 'pending' : null)
              return (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/applications/${a.id}`} className="font-medium text-indigo-600 hover:underline block">
                      {a.business_name || a.contact_name || 'Unnamed'}
                    </Link>
                    <div className="text-xs text-gray-400">{a.industry}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{a.monthly_revenue || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{a.funding_amount || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{a.credit_score || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{a.state || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(a.created_at)}</td>
                  <td className="px-4 py-3">
                    {subs.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {subs.map(s => (
                          <span key={s.id} className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.status] || ''}`}>
                            {s.lenders?.name?.split(' ')[0]} · {s.fit_score}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not routed</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={e => route(a.id, e)}
                      disabled={routing[a.id]}
                      className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-100 disabled:opacity-50 whitespace-nowrap"
                    >
                      {routing[a.id] ? 'Routing…' : subs.length ? 'Re-route' : 'Route →'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
        </div>
      )}
    </div>
  )
}
