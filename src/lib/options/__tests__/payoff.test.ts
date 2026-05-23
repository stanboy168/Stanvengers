import { describe, it, expect } from 'vitest'
import { payoffAtExpiry, strategyStats } from '../payoff'
import type { Leg } from '../payoff'

describe('payoffAtExpiry — long call', () => {
  const leg: Leg = { type: 'call', side: 'long', strike: 100, premium: 5, qty: 1 }

  it('OTM: loses full premium', () => {
    expect(payoffAtExpiry([leg], 95)).toBeCloseTo(-500)
  })
  it('at breakeven (105): P/L = 0', () => {
    expect(payoffAtExpiry([leg], 105)).toBeCloseTo(0)
  })
  it('ITM: profit = (S - K - premium) * 100', () => {
    expect(payoffAtExpiry([leg], 115)).toBeCloseTo(1000)
  })
})

describe('payoffAtExpiry — long put', () => {
  const leg: Leg = { type: 'put', side: 'long', strike: 100, premium: 5, qty: 1 }

  it('OTM: loses full premium', () => {
    expect(payoffAtExpiry([leg], 110)).toBeCloseTo(-500)
  })
  it('at breakeven (95): P/L = 0', () => {
    expect(payoffAtExpiry([leg], 95)).toBeCloseTo(0)
  })
  it('ITM: profit = (K - S - premium) * 100', () => {
    expect(payoffAtExpiry([leg], 80)).toBeCloseTo(1500)
  })
})

describe('payoffAtExpiry — short call', () => {
  const leg: Leg = { type: 'call', side: 'short', strike: 100, premium: 5, qty: 1 }

  it('OTM: keeps full premium', () => {
    expect(payoffAtExpiry([leg], 95)).toBeCloseTo(500)
  })
  it('at breakeven (105): P/L = 0', () => {
    expect(payoffAtExpiry([leg], 105)).toBeCloseTo(0)
  })
  it('ITM: loses (S - K - premium) * 100', () => {
    expect(payoffAtExpiry([leg], 120)).toBeCloseTo(-1500)
  })
})

describe('payoffAtExpiry — short put', () => {
  const leg: Leg = { type: 'put', side: 'short', strike: 100, premium: 5, qty: 1 }

  it('OTM: keeps full premium', () => {
    expect(payoffAtExpiry([leg], 110)).toBeCloseTo(500)
  })
  it('at breakeven (95): P/L = 0', () => {
    expect(payoffAtExpiry([leg], 95)).toBeCloseTo(0)
  })
  it('loses money below breakeven', () => {
    expect(payoffAtExpiry([leg], 80)).toBeCloseTo(-1500)
  })
})

describe('payoffAtExpiry — bull call spread', () => {
  // Buy 100c @ 5, sell 110c @ 2
  const legs: Leg[] = [
    { type: 'call', side: 'long', strike: 100, premium: 5, qty: 1 },
    { type: 'call', side: 'short', strike: 110, premium: 2, qty: 1 },
  ]
  const net = 3 // net debit

  it('below lower strike: loses net debit', () => {
    expect(payoffAtExpiry(legs, 95)).toBeCloseTo(-net * 100)
  })
  it('above upper strike: achieves max profit', () => {
    expect(payoffAtExpiry(legs, 115)).toBeCloseTo((10 - net) * 100)
  })
  it('at breakeven (103): P/L ≈ 0', () => {
    expect(payoffAtExpiry(legs, 103)).toBeCloseTo(0, 0)
  })
})

describe('payoffAtExpiry — iron condor', () => {
  // Sell 90p/85p put spread + sell 110c/115c call spread
  const legs: Leg[] = [
    { type: 'put', side: 'long', strike: 85, premium: 1, qty: 1 },
    { type: 'put', side: 'short', strike: 90, premium: 2.5, qty: 1 },
    { type: 'call', side: 'short', strike: 110, premium: 2.5, qty: 1 },
    { type: 'call', side: 'long', strike: 115, premium: 1, qty: 1 },
  ]
  const credit = 3 // net credit received

  it('inside tent: keeps full credit', () => {
    expect(payoffAtExpiry(legs, 100)).toBeCloseTo(credit * 100, 0)
  })
  it('far below: max loss', () => {
    expect(payoffAtExpiry(legs, 70)).toBeCloseTo((credit - 5) * 100, 0)
  })
  it('far above: max loss', () => {
    expect(payoffAtExpiry(legs, 130)).toBeCloseTo((credit - 5) * 100, 0)
  })
})

describe('strategyStats', () => {
  it('long call: maxProfit = unlimited, maxLoss = -premium * 100', () => {
    const legs: Leg[] = [{ type: 'call', side: 'long', strike: 100, premium: 5, qty: 1 }]
    const stats = strategyStats(legs)
    expect(stats.maxProfit).toBe('unlimited')
    expect(stats.maxLoss).toBeCloseTo(-500, 0)
    expect(stats.breakevens.length).toBe(1)
    expect(stats.breakevens[0]).toBeCloseTo(105, 0)
  })

  it('long put: maxProfit finite, maxLoss = -premium * 100', () => {
    const legs: Leg[] = [{ type: 'put', side: 'long', strike: 100, premium: 5, qty: 1 }]
    const stats = strategyStats(legs)
    expect(typeof stats.maxProfit).toBe('number')
    expect(stats.maxLoss).toBeCloseTo(-500, 0)
    expect(stats.breakevens[0]).toBeCloseTo(95, 0)
  })

  it('bull call spread: max profit and loss are both finite', () => {
    const legs: Leg[] = [
      { type: 'call', side: 'long', strike: 100, premium: 5, qty: 1 },
      { type: 'call', side: 'short', strike: 110, premium: 2, qty: 1 },
    ]
    const stats = strategyStats(legs)
    expect(typeof stats.maxProfit).toBe('number')
    expect(typeof stats.maxLoss).toBe('number')
    expect(stats.maxProfit as number).toBeCloseTo(700, 0)
    expect(stats.maxLoss as number).toBeCloseTo(-300, 0)
  })
})
