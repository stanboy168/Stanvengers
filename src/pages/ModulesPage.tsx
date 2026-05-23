import { Link } from 'react-router-dom'
import { Clock, ArrowRight, Lock } from 'lucide-react'
import { MODULES } from '@/data/modules'
import { useProgressStore } from '@/store/useProgressStore'
import { cn } from '@/lib/cn'

const accentBorderMap: Record<string, string> = {
  sky: 'border-sky-800/60',
  violet: 'border-violet-800/60',
  emerald: 'border-emerald-800/60',
  amber: 'border-amber-800/60',
  rose: 'border-rose-800/60',
}

const accentTextMap: Record<string, string> = {
  sky: 'text-sky-400',
  violet: 'text-violet-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  rose: 'text-rose-400',
}

export function ModulesPage() {
  const { modules } = useProgressStore()

  return (
    <div className="px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">Curriculum</h1>
      <p className="text-zinc-400 text-sm">
        Modules 1–4 are fully interactive. Modules 5–9 are coming soon.
      </p>

      <div className="space-y-3">
        {MODULES.map((mod) => {
          const prog = modules[mod.id]
          const isComplete = mod.complete
          const isDone = prog?.completed

          return (
            <Link
              key={mod.id}
              to={`/modules/${mod.slug}`}
              className={cn(
                'block rounded-2xl border p-4 transition-colors',
                accentBorderMap[mod.accentColor],
                isComplete
                  ? 'hover:bg-zinc-800/60 bg-zinc-900/80'
                  : 'bg-zinc-900/40 opacity-70'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  isDone ? 'bg-sky-600 text-white' : 'bg-zinc-800 text-zinc-400'
                )}>
                  {isDone ? '✓' : mod.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{mod.title}</span>
                    {!isComplete && <Lock size={12} className="text-zinc-600 flex-shrink-0" />}
                  </div>
                  <p className="text-zinc-500 text-xs mt-0.5">{mod.subtitle}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn('text-xs font-medium', accentTextMap[mod.accentColor])}>
                      {isComplete ? `${mod.cardCount} cards` : 'Coming soon'}
                    </span>
                    {isComplete && (
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <Clock size={10} /> ~{mod.estimatedMinutes} min
                      </span>
                    )}
                    {isDone && (
                      <span className="text-xs text-sky-400 font-semibold">Completed</span>
                    )}
                  </div>
                </div>
                {isComplete && <ArrowRight size={16} className="text-zinc-600 flex-shrink-0 mt-1" />}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
