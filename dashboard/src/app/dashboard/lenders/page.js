'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Lenders() {
  const [lenders, setLenders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  async function load() {
    const d = await fetch('/api/lenders').then(r => r.json())
    setLenders(d || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleActive(l) {
    await fetch(`/api/lenders/${l.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !l.is_active }),
    })
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lenders</h1>
        <Link href="/dashboard/lenders/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Add Lender
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Lender</th>
              <th className="px-5 py-3 text-left">Min Revenue</th>
              <th className="px-5 py-3 text-left">Min Credit</th>
              <th className="px-5 py-3 text-left">Loan Range</th>
              <th className="px-5 py-3 text-left">Commission</th>
              <th className="px-5 py-3 text-left">Submissions</th>
              <th className="px-5 py-3 text-left">Approval Rate</th>
              <th className="px-5 py-3 text-left">Active</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={9} className="px-5 py-8 text-center text-gray-400">Loading…</td></tr>
            ) : lenders.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-gray-400">{l.submission_email}</div>
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {l.min_monthly_revenue ? `$${Number(l.min_monthly_revenue).toLocaleString()}` : '—'}
                </td>
                <td className="px-5 py-3 text-gray-600">{l.min_credit_score || '—'}</td>
                <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                  {l.min_loan_amount ? `$${Number(l.min_loan_amount/1000).toFixed(0)}k` : '—'}
                  {l.max_loan_amount ? ` – $${Number(l.max_loan_amount/1000).toFixed(0)}k` : ''}
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {l.commission_rate ? `${l.commission_rate}%` : '—'}
                  {l.commission_points ? ` + ${l.commission_points}pts` : ''}
                </td>
                <td className="px-5 py-3 text-gray-600">{l.stats?.total_submissions || 0}</td>
                <td className="px-5 py-3">
                  {l.stats?.approval_rate !== null ? (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      l.stats.approval_rate >= 60 ? 'bg-green-100 text-green-800' :
                      l.stats.approval_rate >= 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{l.stats.approval_rate}%</span>
                  ) : <span className="text-gray-400 text-xs">—</span>}
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleActive(l)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${l.is_active ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${l.is_active ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/dashboard/lenders/${l.id}`} className="text-xs text-indigo-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
