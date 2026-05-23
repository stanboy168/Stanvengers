import { useState } from 'react'
import { bsGreeks } from '@/lib/options'

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="text-sky-300 font-semibold tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-sky-400 cursor-pointer"
      />
    </div>
  )
}

interface GreekRowProps {
  name: string
  symbol: string
  value: number
  description: string
  format?: (v: number) => string
  positiveColor?: boolean
}

function GreekRow({ name, symbol, value, description, format, positiveColor = true }: GreekRowProps) {
  const fmt = format ?? ((v: number) => v.toFixed(4))
  const isPos = value >= 0
  const color = positiveColor
    ? isPos ? 'text-sky-400' : 'text-orange-400'
    : isPos ? 'text-orange-400' : 'text-sky-400'

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-zinc-800 last:border-0">
      <div className="w-8 text-center">
        <span className="text-lg font-serif text-zinc-300">{symbol}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white">{name}</div>
        <div className="text-xs text-zinc-500 truncate">{description}</div>
      </div>
      <div className={`text-sm font-semibold tabular-nums ${color}`}>{fmt(value)}</div>
    </div>
  )
}

interface GreekSandboxProps {
  optionType?: 'call' | 'put'
}

export function GreekSandbox({ optionType = 'call' }: GreekSandboxProps) {
  const [type, setType] = useState<'call' | 'put'>(optionType)
  const [spot, setSpot] = useState(100)
  const [strike, setStrike] = useState(100)
  const [days, setDays] = useState(45)
  const [iv, setIv] = useState(30)  // percent
  const [rfr, setRfr] = useState(5) // percent

  const greeks = bsGreeks(type, {
    S: spot,
    K: strike,
    T: days / 365,
    r: rfr / 100,
    sigma: iv / 100,
  })

  return (
    <div className="space-y-5">
      {/* Type toggle */}
      <div className="flex bg-zinc-800 rounded-lg p-1 gap-1">
        {(['call', 'put'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              type === t ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="space-y-4 bg-zinc-800/50 rounded-xl p-4">
        <SliderField label="Spot price (S)" value={spot} min={50} max={200} step={0.5}
          format={(v) => `$${v.toFixed(2)}`} onChange={setSpot} />
        <SliderField label="Strike (K)" value={strike} min={50} max={200} step={0.5}
          format={(v) => `$${v.toFixed(2)}`} onChange={setStrike} />
        <SliderField label="Days to expiry" value={days} min={1} max={365} step={1}
          format={(v) => `${v}d`} onChange={setDays} />
        <SliderField label="Implied Volatility" value={iv} min={1} max={150} step={1}
          format={(v) => `${v}%`} onChange={setIv} />
        <SliderField label="Risk-free rate" value={rfr} min={0} max={10} step={0.25}
          format={(v) => `${v.toFixed(2)}%`} onChange={setRfr} />
      </div>

      {/* Price */}
      <div className="bg-zinc-800/80 rounded-xl p-4 text-center">
        <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Theoretical Price</div>
        <div className="text-3xl font-bold text-white">${greeks.price.toFixed(2)}</div>
        <div className="text-xs text-zinc-500 mt-1">× 100 shares = ${(greeks.price * 100).toFixed(2)} per contract</div>
      </div>

      {/* Greeks */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
        <GreekRow
          name="Delta"
          symbol="Δ"
          value={greeks.delta}
          description={`Price changes ~$${Math.abs(greeks.delta * 100).toFixed(0)}/contract per $1 move`}
          format={(v) => v.toFixed(4)}
        />
        <GreekRow
          name="Gamma"
          symbol="Γ"
          value={greeks.gamma}
          description="Delta change per $1 move in spot"
          format={(v) => v.toFixed(4)}
        />
        <GreekRow
          name="Theta"
          symbol="Θ"
          value={greeks.theta * 100}
          description="P/L per contract per calendar day"
          format={(v) => `$${v.toFixed(2)}/day`}
          positiveColor={false}
        />
        <GreekRow
          name="Vega"
          symbol="V"
          value={greeks.vega * 100}
          description="P/L per contract per 1% IV change"
          format={(v) => `$${v.toFixed(2)}/1% IV`}
        />
        <GreekRow
          name="Rho"
          symbol="ρ"
          value={greeks.rho * 100}
          description="P/L per contract per 1% rate change"
          format={(v) => `$${v.toFixed(2)}/1% rate`}
        />
      </div>
    </div>
  )
}
