import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  Legend,
} from 'recharts'
import type { Leg } from '@/lib/options'
import { buildPayoffCurve, buildTimeCurve, strategyStats } from '@/lib/options'
import { cn } from '@/lib/cn'

interface PayoffDiagramProps {
  legs: Leg[]
  spotCenter?: number         // default: weighted average strike
  spotRange?: number          // ± % around center, default 0.4 (40%)
  showTimeCurve?: boolean     // show a T-day-to-expiry curve in addition
  daysToExpiry?: number       // for time curve, default 30
  iv?: number                 // sigma for time curve, default 0.30
  rfr?: number                // risk-free rate, default 0.05
  height?: number
  className?: string
}

function fmt(v: number) {
  const abs = Math.abs(v)
  return (v >= 0 ? '+' : '') + (abs >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`)
}

function fmtSpot(v: number) {
  return `$${v.toFixed(2)}`
}

// Color-blind-safe: blue-ish for gains, orange-red for losses
const GAIN_COLOR = '#38bdf8'   // sky-400
const LOSS_COLOR = '#fb923c'   // orange-400
const TIME_COLOR = '#a78bfa'   // violet-400
const ZERO_COLOR = '#52525b'   // zinc-600

export function PayoffDiagram({
  legs,
  spotCenter,
  spotRange = 0.4,
  showTimeCurve = false,
  daysToExpiry = 30,
  iv = 0.30,
  rfr = 0.05,
  height = 280,
  className,
}: PayoffDiagramProps) {
  const center = useMemo(
    () => spotCenter ?? legs.reduce((s, l) => s + l.strike, 0) / Math.max(legs.length, 1),
    [legs, spotCenter]
  )
  const spotMin = center * (1 - spotRange)
  const spotMax = center * (1 + spotRange)

  const expiryCurve = useMemo(
    () => buildPayoffCurve(legs, spotMin, spotMax, 200),
    [legs, spotMin, spotMax]
  )

  const timeCurveData = useMemo(
    () =>
      showTimeCurve
        ? buildTimeCurve(legs, spotMin, spotMax, daysToExpiry, rfr, iv, 200)
        : [],
    [legs, spotMin, spotMax, showTimeCurve, daysToExpiry, rfr, iv]
  )

  const stats = useMemo(() => strategyStats(legs), [legs])

  // Merge curves into one data array
  const data = useMemo(() => {
    return expiryCurve.map((pt, i) => ({
      spot: pt.spot,
      expiry: pt.pnl,
      ...(showTimeCurve && timeCurveData[i] ? { today: timeCurveData[i].pnl } : {}),
    }))
  }, [expiryCurve, timeCurveData, showTimeCurve])

  // Split expiry curve into gain/loss segments by color
  // Recharts doesn't support per-point colors on Line, so use a gradient trick via a linearGradient
  // We use two overlapping lines with clipPath — simpler: use a defs gradient
  const yVals = expiryCurve.map((p) => p.pnl)
  const yMin = Math.min(...yVals)
  const yMax = Math.max(...yVals)
  const totalRange = yMax - yMin || 1
  const zeroFraction = yMax / totalRange  // fraction from top where y=0 sits

  // For the gradient, we need the zero fraction relative to the domain
  const gradientId = 'payoff-gradient'

  return (
    <div className={cn('space-y-3', className)}>
      {/* Stats strip */}
      <div className="flex gap-3 text-xs font-semibold">
        <div className="flex-1 rounded-lg bg-orange-950/40 border border-orange-800/50 px-3 py-2 text-center">
          <div className="text-orange-400/80 text-[10px] uppercase tracking-wider mb-0.5">Max Loss</div>
          <div className="text-orange-400">
            {stats.maxLoss === 'unlimited' ? 'Unlimited' : fmt(stats.maxLoss as number)}
          </div>
        </div>
        <div className="flex-1 rounded-lg bg-sky-950/40 border border-sky-800/50 px-3 py-2 text-center">
          <div className="text-sky-400/80 text-[10px] uppercase tracking-wider mb-0.5">Max Profit</div>
          <div className="text-sky-400">
            {stats.maxProfit === 'unlimited' ? 'Unlimited' : fmt(stats.maxProfit as number)}
          </div>
        </div>
        <div className="flex-1 rounded-lg bg-zinc-800/60 border border-zinc-700/50 px-3 py-2 text-center">
          <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-0.5">Breakeven{stats.breakevens.length > 1 ? 's' : ''}</div>
          <div className="text-zinc-200">
            {stats.breakevens.length === 0
              ? 'N/A'
              : stats.breakevens.map((b) => `$${b.toFixed(2)}`).join(' / ')}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset={`${(1 - zeroFraction) * 100}%`} stopColor={GAIN_COLOR} />
                <stop offset={`${(1 - zeroFraction) * 100}%`} stopColor={LOSS_COLOR} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="spot"
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              tick={{ fill: '#71717a', fontSize: 10 }}
              axisLine={{ stroke: '#3f3f46' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: '#71717a', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <ReferenceLine y={0} stroke={ZERO_COLOR} strokeDasharray="4 4" strokeWidth={1} />
            {legs.map((l) => (
              <ReferenceLine
                key={`${l.type}-${l.strike}`}
                x={l.strike}
                stroke="#52525b"
                strokeDasharray="2 4"
                strokeWidth={1}
                label={{ value: `K=${l.strike}`, position: 'top', fill: '#71717a', fontSize: 9 }}
              />
            ))}
            {stats.breakevens.map((be, i) => (
              <ReferenceLine
                key={`be-${i}`}
                x={be}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            ))}
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
              labelStyle={{ color: '#a1a1aa', fontSize: 11 }}
              formatter={(value: unknown, name: unknown) => [
                fmt(Number(value)),
                name === 'expiry' ? 'At Expiration' : `~${daysToExpiry}d Today`,
              ]}
              labelFormatter={(v: unknown) => fmtSpot(Number(v))}
            />
            {showTimeCurve && (
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }}
                formatter={(v) => (v === 'expiry' ? 'At Expiration' : `~${daysToExpiry}d Today`)}
              />
            )}
            <Line
              type="monotone"
              dataKey="expiry"
              stroke={`url(#${gradientId})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#fff', stroke: '#38bdf8', strokeWidth: 2 }}
            />
            {showTimeCurve && (
              <Line
                type="monotone"
                dataKey="today"
                stroke={TIME_COLOR}
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 3, fill: TIME_COLOR }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/** Draggable controls for the diagram */
interface DiagramControlsProps {
  strike: number
  premium: number
  spot: number
  onStrike: (v: number) => void
  onPremium: (v: number) => void
  onSpot: (v: number) => void
  strikeRange?: [number, number]
  premiumRange?: [number, number]
  spotRange?: [number, number]
}

function SliderRow({
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
        <span className="text-zinc-200 font-semibold tabular-nums">{format(value)}</span>
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

export function DiagramControls({
  strike,
  premium,
  spot,
  onStrike,
  onPremium,
  onSpot,
  strikeRange = [50, 300],
  premiumRange = [0.1, 30],
  spotRange: spotR = [50, 300],
}: DiagramControlsProps) {
  return (
    <div className="space-y-4 bg-zinc-800/50 rounded-xl p-4">
      <SliderRow
        label="Strike (K)"
        value={strike}
        min={strikeRange[0]}
        max={strikeRange[1]}
        step={1}
        format={(v) => `$${v}`}
        onChange={onStrike}
      />
      <SliderRow
        label="Premium paid"
        value={premium}
        min={premiumRange[0]}
        max={premiumRange[1]}
        step={0.05}
        format={(v) => `$${v.toFixed(2)}`}
        onChange={onPremium}
      />
      <SliderRow
        label="Current spot"
        value={spot}
        min={spotR[0]}
        max={spotR[1]}
        step={0.5}
        format={(v) => `$${v.toFixed(2)}`}
        onChange={onSpot}
      />
    </div>
  )
}

/** Hook for managing a single-leg diagram state */
export function useSingleLeg(
  type: 'call' | 'put',
  side: 'long' | 'short',
  initialStrike = 100,
  initialPremium = 5
) {
  const [strike, setStrike] = useState(initialStrike)
  const [premium, setPremium] = useState(initialPremium)
  const [spot, setSpot] = useState(initialStrike)

  const legs: Leg[] = [{ type, side, strike, premium, qty: 1 }]

  return { legs, strike, premium, spot, setStrike, setPremium, setSpot }
}
