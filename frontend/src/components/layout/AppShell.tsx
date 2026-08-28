import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { NAV_ITEMS } from '@/lib/constants'

export function AppShell() {
  const { pathname } = useLocation()
  const current = NAV_ITEMS.find((item) => item.path === pathname) ?? NAV_ITEMS[0]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Sidebar />

      <main className="flex flex-1 flex-col">
        <header className="border-b border-border/60 px-8 py-6">
          <h2 className="text-2xl font-semibold tracking-tight">{current.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{current.description}</p>
        </header>

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
