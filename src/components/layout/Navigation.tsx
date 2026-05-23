import { Link, useLocation } from 'react-router-dom'
import { BookOpen, FlaskConical, BarChart2, Home } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/modules', label: 'Learn', Icon: BookOpen },
  { href: '/sandbox', label: 'Sandbox', Icon: FlaskConical },
  { href: '/greeks', label: 'Greeks', Icon: BarChart2 },
]

export function Navigation() {
  const { pathname } = useLocation()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 safe-area-inset-bottom z-50">
      <div className="flex justify-around max-w-lg mx-auto">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors',
                active ? 'text-sky-400' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
