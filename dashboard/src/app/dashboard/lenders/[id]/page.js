'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { INDUSTRIES, US_STATES } from '@/lib/utils'

const EMPTY = {
  name: '', submission_email: '', contact_name: '', notes: '',
  min_monthly_revenue: '', max_monthly_revenue: '',
  min_months_in_business: '',
  min_credit_score: '', max_credit_score: '',
  min_loan_amount: '', max_loan_amount: '',
  blocked_industries: [], blocked_states: [],
  commission_rate: '', commission_points: '',
  is_active: true,
}

function num(v) { return v === '' || v == null ? null : Number(v) }

export default function LenderEdit() {
  const { id } = useParams()
  const isNew = id === 'new'
  const router = useRouter()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/lenders/${id}`).then(r => r.json()).then(d => {
        setForm({ ...EMPTY, ...d,
          min_monthly_revenue: d.min_monthly_revenue ?? '',
          max_monthly_revenue: d.max_monthly_revenue ?? '',
          min_months_in_business: d.min_months_in_business ?? '',
          min_credit_score: d.min_credit_score ?? '',
          max_credit_score: d.max_credit_score ?? '',
          min_loan_amount: d.min_loan_amount ?? '',
          max_loan_amount: d.max_loan_amount ?? '',
          commission_rate: d.commission_rate ?? '',
          commission_points: d.commission_points ?? '',
          blocked_industries: d.blocked_industries || [],
          blocked_states: d.blocked_states || [],
        })
        setLoading(false)
      })
    }
  }, [id, isNew])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function toggleArr(k, v) {
    setForm(f => ({
      ...f,
      [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v]
    }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      min_monthly_revenue: num(form.min_monthly_revenue),
      max_monthly_revenue: num(form.max_monthly_revenue),
      min_months_in_business: num(form.min_months_in_business),
      min_credit_score: num(form.min_credit_score),
      max_credit_score: num(form.max_credit_score),
      min_loan_amount: num(form.min_loan_amount),
      max_loan_amount: num(form.max_loan_amount),
      commission_rate: num(form.commission_rate),
      commission_points: num(form.commission_points),
    }
    const url = isNew ? '/api/lenders' : `/api/lenders/${id}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      showToast(isNew ? 'Lender created!' : 'Saved!')
      if (isNew) router.push(`/dashboard/lenders/${data.id}`)
    } else {
      showToast(data.error || 'Error saving')
    }
  }

  async function deleteLender() {
    if (!confirm(`Delete ${form.name}? This will remove all routing history for this lender.`)) return
    setDeleting(true)
    await fetch(`/api/lenders/${id}`, { method: 'DELETE' })
    router.push('/dashboard/lenders')
  }

  if (loading) return <div className="p-8 text-gray-400">Loading…</div>

  const section = (title) => (
    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-6 mb-3">{title}</div>
  )
  const field = (label, key, type = 'text', hint) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}{hint && <span className="text-xs font-normal text-gray-400 ml-1">{hint}</span>}</label>
      <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  )

  return (
    <div className="p-8 max-w-3xl">
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600 mb-1">← Lenders</button>
          <h1 className="text-2xl font-bold">{isNew ? 'Add Lender' : (form.name || 'Edit Lender')}</h1>
        </div>
        {!isNew && (
          <button onClick={deleteLender} disabled={deleting}
            className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>

      <form onSubmit={save} className="bg-white rounded-xl border p-6 space-y-4">
        {section('Contact Info')}
        <div className="grid grid-cols-2 gap-4">
          {field('Lender Name', 'name')}
          {field('Submission Email', 'submission_email', 'email')}
          {field('Contact Name', 'contact_name')}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        {section('Revenue Criteria')}
        <div className="grid grid-cols-2 gap-4">
          {field('Min Monthly Revenue ($)', 'min_monthly_revenue', 'number', 'leave blank to skip')}
          {field('Max Monthly Revenue ($)', 'max_monthly_revenue', 'number', 'leave blank for no max')}
        </div>

        {section('Credit Score')}
        <div className="grid grid-cols-2 gap-4">
          {field('Min Credit Score', 'min_credit_score', 'number')}
          {field('Max Credit Score', 'max_credit_score', 'number', 'leave blank for no max')}
        </div>

        {section('Loan Amount')}
        <div className="grid grid-cols-2 gap-4">
          {field('Min Loan Amount ($)', 'min_loan_amount', 'number')}
          {field('Max Loan Amount ($)', 'max_loan_amount', 'number')}
        </div>

        {section('Time in Business')}
        {field('Min Months in Business', 'min_months_in_business', 'number', 'e.g. 12 = 1 year, 6 = 6 months')}

        {section('Commission')}
        <div className="grid grid-cols-2 gap-4">
          {field('Commission Rate (%)', 'commission_rate', 'number')}
          {field('Commission Points', 'commission_points', 'number')}
        </div>

        {section('Blocked Industries')}
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map(ind => (
            <button key={ind} type="button" onClick={() => toggleArr('blocked_industries', ind)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                form.blocked_industries.includes(ind)
                  ? 'bg-red-100 border-red-300 text-red-800'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}>
              {ind}
            </button>
          ))}
        </div>

        {section('Blocked States')}
        <div className="flex flex-wrap gap-1.5">
          {US_STATES.map(st => (
            <button key={st} type="button" onClick={() => toggleArr('blocked_states', st)}
              className={`text-xs w-9 py-1 rounded border text-center transition-colors ${
                form.blocked_states.includes(st)
                  ? 'bg-red-100 border-red-300 text-red-800'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}>
              {st}
            </button>
          ))}
        </div>

        {section('Status')}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)}
            className="rounded text-indigo-600" />
          <span className="text-sm">Active (included in routing)</span>
        </label>

        <div className="pt-4 border-t flex justify-end">
          <button type="submit" disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'Saving…' : isNew ? 'Create Lender' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
