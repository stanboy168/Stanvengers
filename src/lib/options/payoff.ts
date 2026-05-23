import { bsPrice } from './blackScholes'

export type OptionSide = 'long' | 'short'

export interface Leg {
  type: 'call' | 'put'
  side: OptionSide
  strike: number
  premium: number
  qty: number // number of contracts (100 shares each)
}

export interface PayoffPoint {
  spot: number
  pnl: number
}

const MULTIPLIER = 100

function legPayoffAtExpiry(leg: Leg, spot: number): number {
  const intrinsic = leg.type === 'call'
    ? Math.max(0, spot - leg.strike)
    : Math.max(0, leg.strike - spot)
  const direction = leg.side === 'long' ? 1 : -1
  return direction * (intrinsic - leg.premium) * leg.qty * MULTIPLIER
}

export function payoffAtExpiry(legs: Leg[], spot: number): number {
  return legs.reduce((sum, leg) => sum + legPayoffAtExpiry(leg, spot), 0)
}

export function payoffAtTime(
  legs: Leg[],
  spot: number,
  daysToExpiry: number,
  r: number,
  sigma: number
): number {
  return legs.reduce((sum, leg) => {
    const T = daysToExpiry / 365
    const currentPrice = bsPrice(leg.type, { S: spot, K: leg.strike, T, r, sigma })
    const direction = leg.side === 'long' ? 1 : -1
    return sum + direction * (currentPrice - leg.premium) * leg.qty * MULTIPLIER
  }, 0)
}

export function buildPayoffCurve(
  legs: Leg[],
  spotMin: number,
  spotMax: number,
  steps: number = 200
): PayoffPoint[] {
  const points: PayoffPoint[] = []
  const step = (spotMax - spotMin) / steps
  for (let i = 0; i <= steps; i++) {
    const spot = spotMin + i * step
    points.push({ spot, pnl: payoffAtExpiry(legs, spot) })
  }
  return points
}

export function buildTimeCurve(
  legs: Leg[],
  spotMin: number,
  spotMax: number,
  daysToExpiry: number,
  r: number,
  sigma: number,
  steps: number = 200
): PayoffPoint[] {
  const points: PayoffPoint[] = []
  const step = (spotMax - spotMin) / steps
  for (let i = 0; i <= steps; i++) {
    const spot = spotMin + i * step
    points.push({ spot, pnl: payoffAtTime(legs, spot, daysToExpiry, r, sigma) })
  }
  return points
}

export function strategyStats(legs: Leg[]): {
  maxProfit: number | 'unlimited'
  maxLoss: number | 'unlimited'
  breakevens: number[]
} {
  const strikes = legs.map((l) => l.strike)
  const minSpot = Math.min(...strikes) * 0.5
  const maxSpot = Math.max(...strikes) * 1.5
  const steps = 2000
  const curve = buildPayoffCurve(legs, minSpot, maxSpot, steps)

  const pnls = curve.map((p) => p.pnl)
  const maxPnl = Math.max(...pnls)
  const minPnl = Math.min(...pnls)

  // Detect "unlimited" by checking if edges are still rising/falling
  const edgeLeft = curve[0].pnl
  const edgeRight = curve[curve.length - 1].pnl
  const secondLeft = curve[1].pnl
  const secondRight = curve[curve.length - 2].pnl

  const maxProfit: number | 'unlimited' =
    edgeRight > secondRight && edgeRight === maxPnl ? 'unlimited' : maxPnl
  const maxLoss: number | 'unlimited' =
    edgeLeft < secondLeft && edgeLeft === minPnl ? 'unlimited' : minPnl

  // Find breakevens — use product < 0 to avoid double-counting exact zeros
  const breakevens: number[] = []
  for (let i = 1; i < curve.length; i++) {
    const prev = curve[i - 1]
    const curr = curve[i]
    if (prev.pnl * curr.pnl < 0) {
      const frac = -prev.pnl / (curr.pnl - prev.pnl)
      breakevens.push(prev.spot + frac * (curr.spot - prev.spot))
    } else if (curr.pnl === 0 && prev.pnl !== 0) {
      breakevens.push(curr.spot)
    }
  }

  return { maxProfit, maxLoss, breakevens }
}
