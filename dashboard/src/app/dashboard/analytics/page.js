'use client'
import { useEffect, useState } from 'react'

const DECLINE_LABELS = {
  low_credit: 'Low Credit',
  insufficient_revenue: 'Low Revenue',
  high_risk_industry: 'High Risk Industry',
  time_in_business: 'Time in Business',
  stacking: 'Stacking',
  nsfs: 'NSFs',
  other: 'Other',
}

export default function Analytics() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(90)

  async function load(d) {
    setLoading(true)
    const data = await fetch(`/api/analytics?days=${d}`).then(r => r.json())
    setStats(data || [])
    setLoading(false)
  }

  useEffect(() => { load(days) }, [days])

  const totals = stats.reduce((acc, r) => ({
    total: acc.total + r.total_submissions,
    approved: acc.approved + r.approved,
    declined: acc.declined + r.declined,
  }), { total: 0, approved: 0, declined: 0 })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lender Analytics</h1>
        <select value={days} onChange={e => setDays(Number(e.target.value))}
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
          <option value={180}>Last 6 months</option>
          <option value={365}>Last 12 months</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Total Submissions</div>
          <div className="text-3xl font-bold mt-1">{totals.total}</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Approved / Funded</div>
          <div className="text-3xl font-bold mt-1 text-green-600">{totals.approved}</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-sm text-gray-500">Declined</div>
          <div className="text-3xl font-bold mt-1 text-red-500">{totals.declined}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Lender</th>
              <th className="px-5 py-3 text-right">Submissions</th>
              <th className="px-5 py-3 text-right">Approved</th>
              <th className="px-5 py-3 text-right">Declined</th>
              <th className="px-5 py-3 text-right">Approval Rate</th>
              <th className="px-5 py-3 text-right">Avg Days to Decision</th>
              <th className="px-5 py-3 text-left">Top Decline Reason</th>
              <th className="px-5 py-3 text-right">Commission</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400">Loading…</td></tr>
            ) : stats.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                No submission data yet. Route some applications to see analytics.
              </td></tr>
            ) : stats.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{r.name}</td>
                <td className="px-5 py-3 text-right text-gray-600">{r.total_submissions}</td>
                <td className="px-5 py-3 text-right text-green-600">{r.approved}</td>
                <td className="px-5 py-3 text-right text-red-500">{r.declined}</td>
                <td className="px-5 py-3 text-right">
                  {r.approval_rate !== null ? (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.approval_rate >= 60 ? 'bg-green-100 text-green-800' :
                      r.approval_rate >= 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{r.approval_rate}%</span>
                  ) : '—'}
                </td>
                <td className="px-5 py-3 text-right text-gray-600">
                  {r.avg_days_to_decision != null ? `${r.avg_days_to_decision}d` : '—'}
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {r.top_decline_reason ? DECLINE_LABELS[r.top_decline_reason] || r.top_decline_reason : '—'}
                </td>
                <td className="px-5 py-3 text-right text-gray-600">
                  {r.commission_rate ? `${r.commission_rate}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
