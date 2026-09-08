'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fmtDate, fmt$, STATUS_COLORS } from '@/lib/utils'

export default function Overview() {
  const [apps, setApps] = useState([])
  const [lenders, setLenders] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/applications?page=1').then(r => r.json()),
      fetch('/api/lenders').then(r => r.json()),
      fetch('/api/suggestions').then(r => r.json()),
    ]).then(([a, l, s]) => {
      setApps(a.applications || [])
      setLenders(l || [])
      setSuggestions(s || [])
      setLoading(false)
    })
  }, [])

  const totalSubs = apps.reduce((acc, a) => acc + (a.submissions?.length || 0), 0)
  const approved = apps.reduce((acc, a) =>
    acc + (a.submissions?.filter(s => ['approved','funded'].includes(s.status)).length || 0), 0)
  const active = lenders.filter(l => l.is_active).length

  const statCard = (label, value, sub) => (
    <div className="bg-white rounded-xl border p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-bold mt-1">{loading ? '—' : value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      {suggestions.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-amber-800">{suggestions.length} auto-learning suggestion{suggestions.length !== 1 ? 's' : ''} pending</div>
            <div className="text-sm text-amber-600">The system detected patterns in declined deals.</div>
          </div>
          <Link href="/dashboard/suggestions" className="text-sm font-medium text-amber-800 underline">Review →</Link>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCard('Total Applications', apps.length, 'all time')}
        {statCard('Total Submissions', totalSubs, 'across all lenders')}
        {statCard('Approved / Funded', approved, 'lifetime')}
        {statCard('Active Lenders', active, `of ${lenders.length} total`)}
      </div>

      <div className="bg-white rounded-xl border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Recent Applications</h2>
          <Link href="/dashboard/applications" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Business</th>
                <th className="px-6 py-3 text-left">Revenue</th>
                <th className="px-6 py-3 text-left">Loan Ask</th>
                <th className="px-6 py-3 text-left">Submitted</th>
                <th className="px-6 py-3 text-left">Submissions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading…</td></tr>
              ) : apps.slice(0, 8).map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/applications/${a.id}`} className="font-medium text-indigo-600 hover:underline">
                      {a.business_name || a.contact_name || 'Unnamed'}
                    </Link>
                    <div className="text-xs text-gray-400">{a.industry} {a.state ? `· ${a.state}` : ''}</div>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{a.monthly_revenue || '—'}</td>
                  <td className="px-6 py-3 text-gray-600">{a.funding_amount || '—'}</td>
                  <td className="px-6 py-3 text-gray-500">{fmtDate(a.created_at)}</td>
                  <td className="px-6 py-3">
                    {(a.submissions?.length || 0) > 0 ? (
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                        {a.submissions.length} lender{a.submissions.length !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <Link href={`/dashboard/applications/${a.id}`}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full hover:bg-indigo-100">
                        Route →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
