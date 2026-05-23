import { Link } from 'react-router-dom'
import { BookOpen, FlaskConical, BarChart2, ArrowRight } from 'lucide-react'
import { useProgressStore } from '@/store/useProgressStore'
import { MODULES } from '@/data/modules'

export function HomePage() {
  const { modules } = useProgressStore()
  const completed = Object.values(modules).filter((m) => m.completed).length

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">OptionsLab</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Learn options from zero — no jargon, no trade recommendations.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-zinc-800/60 rounded-2xl p-4 border border-zinc-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-300">Course Progress</span>
          <span className="text-sm font-semibold text-sky-400">{completed} / {MODULES.length} modules</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all"
            style={{ width: `${(completed / MODULES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/modules"
          className="flex flex-col gap-2 bg-sky-600/20 border border-sky-700/50 rounded-2xl p-4 hover:bg-sky-600/30 transition-colors"
        >
          <BookOpen size={24} className="text-sky-400" />
          <span className="text-sm font-semibold text-white">Continue Learning</span>
          <span className="text-xs text-zinc-400">9 modules, start anywhere</span>
        </Link>
        <Link
          to="/greeks"
          className="flex flex-col gap-2 bg-amber-600/20 border border-amber-700/50 rounded-2xl p-4 hover:bg-amber-600/30 transition-colors"
        >
          <BarChart2 size={24} className="text-amber-400" />
          <span className="text-sm font-semibold text-white">Greek Sandbox</span>
          <span className="text-xs text-zinc-400">Live option calculator</span>
        </Link>
        <Link
          to="/sandbox"
          className="flex flex-col gap-2 bg-violet-600/20 border border-violet-700/50 rounded-2xl p-4 col-span-2 hover:bg-violet-600/30 transition-colors"
        >
          <FlaskConical size={24} className="text-violet-400" />
          <span className="text-sm font-semibold text-white">Paper Trading Sandbox</span>
          <span className="text-xs text-zinc-400">Practice with fake money — $10,000 starting balance</span>
        </Link>
      </div>

      {/* Module list preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">Curriculum</h2>
          <Link to="/modules" className="text-xs text-sky-400 flex items-center gap-1">
            All modules <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {MODULES.slice(0, 4).map((mod) => {
            const prog = modules[mod.id]
            return (
              <Link
                key={mod.id}
                to={`/modules/${mod.slug}`}
                className="flex items-center gap-3 bg-zinc-800/50 rounded-xl px-4 py-3 hover:bg-zinc-800 transition-colors"
              >
                <span className="text-xs font-bold text-zinc-500 w-4">{mod.number}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{mod.title}</div>
                  <div className="text-xs text-zinc-500 truncate">{mod.subtitle}</div>
                </div>
                {prog?.completed ? (
                  <span className="text-xs text-sky-400 font-semibold">✓</span>
                ) : (
                  <ArrowRight size={14} className="text-zinc-600" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
