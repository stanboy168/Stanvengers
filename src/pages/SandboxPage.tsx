import { useState } from 'react'
import { PayoffDiagram } from '@/components/diagrams/PayoffDiagram'
import { ConceptCard, StatRow } from '@/components/cards/ConceptCard'
import type { Leg } from '@/lib/options'

const PRESET_STRATEGIES: { name: string; legs: Leg[] }[] = [
  {
    name: 'Long Call',
    legs: [{ type: 'call', side: 'long', strike: 100, premium: 5, qty: 1 }],
  },
  {
    name: 'Long Put',
    legs: [{ type: 'put', side: 'long', strike: 100, premium: 5, qty: 1 }],
  },
  {
    name: 'Bull Call Spread',
    legs: [
      { type: 'call', side: 'long', strike: 95, premium: 7, qty: 1 },
      { type: 'call', side: 'short', strike: 105, premium: 3, qty: 1 },
    ],
  },
  {
    name: 'Bear Put Spread',
    legs: [
      { type: 'put', side: 'long', strike: 105, premium: 7, qty: 1 },
      { type: 'put', side: 'short', strike: 95, premium: 3, qty: 1 },
    ],
  },
  {
    name: 'Iron Condor',
    legs: [
      { type: 'put', side: 'long', strike: 85, premium: 1, qty: 1 },
      { type: 'put', side: 'short', strike: 90, premium: 2.5, qty: 1 },
      { type: 'call', side: 'short', strike: 110, premium: 2.5, qty: 1 },
      { type: 'call', side: 'long', strike: 115, premium: 1, qty: 1 },
    ],
  },
  {
    name: 'Straddle',
    legs: [
      { type: 'call', side: 'long', strike: 100, premium: 5, qty: 1 },
      { type: 'put', side: 'long', strike: 100, premium: 5, qty: 1 },
    ],
  },
]

export function SandboxPage() {
  const [selected, setSelected] = useState(0)
  const strategy = PRESET_STRATEGIES[selected]

  const totalCost = strategy.legs.reduce((s, l) => {
    const dir = l.side === 'long' ? 1 : -1
    return s + dir * l.premium * 100 * l.qty
  }, 0)

  return (
    <div className="px-4 py-5 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Strategy Sandbox</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Explore preset strategies with live payoff diagrams. No real money.
        </p>
      </div>

      {/* Strategy selector */}
      <div className="flex flex-wrap gap-2">
        {PRESET_STRATEGIES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setSelected(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selected === i
                ? 'bg-sky-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Legs */}
      <ConceptCard title={`${strategy.name} — legs`} accent="sky">
        {strategy.legs.map((l, i) => (
          <StatRow
            key={i}
            label={`${l.side === 'long' ? 'Buy' : 'Sell'} $${l.strike} ${l.type}`}
            value={`$${(l.premium * 100 * l.qty).toFixed(0)} ${l.side === 'long' ? 'debit' : 'credit'}`}
            color={l.side === 'long' ? 'loss' : 'gain'}
          />
        ))}
        <StatRow
          label="Net position cost"
          value={`${totalCost >= 0 ? '+' : ''}$${totalCost.toFixed(0)} ${totalCost >= 0 ? 'debit' : 'credit'}`}
          color={totalCost > 0 ? 'loss' : 'gain'}
        />
      </ConceptCard>

      {/* Payoff diagram */}
      <PayoffDiagram legs={strategy.legs} showTimeCurve daysToExpiry={21} height={300} />

      <div className="text-xs text-zinc-500 text-center">
        All strategies shown use hypothetical $100 underlying and synthetic premiums for illustration.
        Not a reflection of real market prices.
      </div>
    </div>
  )
}
