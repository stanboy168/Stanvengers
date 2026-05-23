import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { FoundationsModule } from '@/modules/1-foundations/FoundationsModule'
import { BasicPositionsModule } from '@/modules/2-basic-positions/BasicPositionsModule'
import { MoneynessTimeModule } from '@/modules/3-moneyness-time/MoneynessTimeModule'
import { GreeksModule } from '@/modules/4-greeks/GreeksModule'
import { PricingModule } from '@/modules/5-pricing/PricingModule'
import { DefinedRiskModule } from '@/modules/6-defined-risk/DefinedRiskModule'
import { UndefinedRiskModule } from '@/modules/7-undefined-risk/UndefinedRiskModule'
import { MechanicsModule } from '@/modules/8-mechanics/MechanicsModule'
import { MistakesModule } from '@/modules/9-mistakes/MistakesModule'
import { MODULES } from '@/data/modules'

const COMPONENT_MAP: Record<string, React.ComponentType> = {
  foundations: FoundationsModule,
  'basic-positions': BasicPositionsModule,
  'moneyness-time': MoneynessTimeModule,
  greeks: GreeksModule,
  pricing: PricingModule,
  'defined-risk': DefinedRiskModule,
  'undefined-risk': UndefinedRiskModule,
  mechanics: MechanicsModule,
  mistakes: MistakesModule,
}

export function ModuleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const meta = MODULES.find((m) => m.slug === slug)
  const Component = slug ? COMPONENT_MAP[slug] : null

  if (!Component || !meta) {
    return (
      <div className="px-4 py-6 text-zinc-400">
        Module not found. <Link to="/modules" className="text-sky-400">Back to curriculum</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100dvh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 flex-shrink-0">
        <Link to="/modules" className="text-zinc-400 hover:text-white p-1 -ml-1">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-zinc-500">Module {meta.number}</div>
          <div className="text-sm font-semibold text-white truncate">{meta.title}</div>
        </div>
      </div>

      {/* Module content */}
      <div className="flex-1 overflow-hidden">
        <Component />
      </div>
    </div>
  )
}
