import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ConceptCardProps {
  title: string
  children: ReactNode
  className?: string
  accent?: 'sky' | 'violet' | 'emerald' | 'amber' | 'rose'
}

const accentMap = {
  sky: 'border-sky-700/60 bg-sky-950/20',
  violet: 'border-violet-700/60 bg-violet-950/20',
  emerald: 'border-emerald-700/60 bg-emerald-950/20',
  amber: 'border-amber-700/60 bg-amber-950/20',
  rose: 'border-rose-700/60 bg-rose-950/20',
}

export function ConceptCard({ title, children, className, accent = 'sky' }: ConceptCardProps) {
  return (
    <div className={cn('rounded-2xl border p-5 space-y-3', accentMap[accent], className)}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">{title}</h3>
      <div className="text-zinc-200 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

/** Full-screen concept slide — one idea per screen */
export function ConceptSlide({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-h-0 flex flex-col gap-5 px-4 py-5', className)}>{children}</div>
  )
}

export function Headline({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-white leading-tight">{children}</h2>
}

export function Body({ children }: { children: ReactNode }) {
  return <p className="text-zinc-300 text-base leading-relaxed">{children}</p>
}

interface StatRowProps {
  label: string
  value: string
  color?: 'gain' | 'loss' | 'neutral'
}

const colorMap = { gain: 'text-sky-400', loss: 'text-orange-400', neutral: 'text-zinc-300' }

export function StatRow({ label, value, color = 'neutral' }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
      <span className="text-zinc-400 text-sm">{label}</span>
      <span className={cn('text-sm font-semibold tabular-nums', colorMap[color])}>{value}</span>
    </div>
  )
}
