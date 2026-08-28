import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="border-b border-border/60 px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <span className="text-lg">🎵</span>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">Moodify AI</h1>
            <p className="text-xs text-muted-foreground">Music Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary ring-1 ring-primary/25'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/60 p-4">
        <p className="text-xs text-muted-foreground">
          114K tracks · 114 genres · 4 moods
        </p>
      </div>
    </aside>
  )
}
