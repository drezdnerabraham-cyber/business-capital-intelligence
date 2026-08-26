'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const nav = [
  { href: '/dashboard', label: 'Overview', icon: '◈' },
  { href: '/dashboard/applications', label: 'Applications', icon: '◻' },
  { href: '/dashboard/lenders', label: 'Lenders', icon: '◉' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '▦' },
  { href: '/dashboard/suggestions', label: 'Suggestions', icon: '◈' },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-slate-700">
          <div className="text-sm font-bold tracking-wide text-indigo-400">BACKSTONE CAPITAL</div>
          <div className="text-xs text-slate-400 mt-0.5">Lender Routing</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(item => {
            const active = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-slate-700">
          <button onClick={logout} className="text-xs text-slate-400 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
