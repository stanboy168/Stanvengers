import { describe, it, expect } from 'vitest'
import { bsPrice, bsGreeks } from '../blackScholes'
import { normalCDF } from '../math'

// Hull "Options, Futures, and Other Derivatives" 10e examples
// Chapter 15 worked examples for Black-Scholes

describe('normalCDF', () => {
  it('returns 0.5 at x=0', () => {
    expect(normalCDF(0)).toBeCloseTo(0.5, 5)
  })
  it('approaches 1 for large positive x', () => {
    expect(normalCDF(10)).toBeCloseTo(1, 5)
  })
  it('approaches 0 for large negative x', () => {
    expect(normalCDF(-10)).toBeCloseTo(0, 5)
  })
  it('N(1.28) ≈ 0.8997', () => {
    expect(normalCDF(1.28)).toBeCloseTo(0.8997, 3)
  })
  it('is symmetric: N(x) + N(-x) = 1', () => {
    expect(normalCDF(0.5) + normalCDF(-0.5)).toBeCloseTo(1, 8)
    expect(normalCDF(1.96) + normalCDF(-1.96)).toBeCloseTo(1, 8)
  })
})

describe('bsPrice — call', () => {
  // Hull Example 15.6: S=42, K=40, T=0.5, r=0.10, sigma=0.20 → call ≈ 4.76
  const hull156 = { S: 42, K: 40, T: 0.5, r: 0.1, sigma: 0.2 }

  it('prices Hull 15.6 call ≈ 4.76', () => {
    expect(bsPrice('call', hull156)).toBeCloseTo(4.76, 1)
  })

  // At-money call > 0 (has time value)
  it('ATM call has positive price', () => {
    expect(bsPrice('call', { S: 100, K: 100, T: 0.25, r: 0.05, sigma: 0.2 })).toBeGreaterThan(0)
  })

  // Deep ITM call ≈ intrinsic (small time value relative to discount)
  it('deep ITM call price > intrinsic value when T > 0', () => {
    const inputs = { S: 150, K: 50, T: 1 / 365, r: 0.05, sigma: 0.2 }
    const price = bsPrice('call', inputs)
    expect(price).toBeGreaterThanOrEqual(100)
  })

  // Deep OTM call ≈ 0
  it('deep OTM call ≈ 0', () => {
    expect(bsPrice('call', { S: 50, K: 200, T: 0.01, r: 0.05, sigma: 0.2 })).toBeCloseTo(0, 3)
  })

  // At expiry = intrinsic
  it('at expiry call = max(S-K, 0)', () => {
    expect(bsPrice('call', { S: 105, K: 100, T: 0, r: 0.05, sigma: 0.2 })).toBeCloseTo(5, 5)
    expect(bsPrice('call', { S: 95, K: 100, T: 0, r: 0.05, sigma: 0.2 })).toBeCloseTo(0, 5)
  })
})

describe('bsPrice — put', () => {
  // Put-call parity: C - P = S - K*e^(-rT)
  const inputs = { S: 100, K: 100, T: 1, r: 0.05, sigma: 0.25 }

  it('satisfies put-call parity', () => {
    const call = bsPrice('call', inputs)
    const put = bsPrice('put', inputs)
    const parity = inputs.S - inputs.K * Math.exp(-inputs.r * inputs.T)
    expect(call - put).toBeCloseTo(parity, 4)
  })

  it('at expiry put = max(K-S, 0)', () => {
    expect(bsPrice('put', { S: 95, K: 100, T: 0, r: 0.05, sigma: 0.2 })).toBeCloseTo(5, 5)
    expect(bsPrice('put', { S: 105, K: 100, T: 0, r: 0.05, sigma: 0.2 })).toBeCloseTo(0, 5)
  })

  it('deep ITM put price ≥ intrinsic discounted value', () => {
    const inputs2 = { S: 50, K: 150, T: 1 / 365, r: 0.05, sigma: 0.2 }
    expect(bsPrice('put', inputs2)).toBeGreaterThanOrEqual(99)
  })
})

describe('bsGreeks — call', () => {
  const inputs = { S: 100, K: 100, T: 1, r: 0.05, sigma: 0.20 }

  it('call delta is between 0 and 1', () => {
    const { delta } = bsGreeks('call', inputs)
    expect(delta).toBeGreaterThan(0)
    expect(delta).toBeLessThan(1)
  })

  it('ATM call delta is between 0.5 and 0.7 (drift pushes above 0.5)', () => {
    const { delta } = bsGreeks('call', inputs)
    expect(delta).toBeGreaterThan(0.5)
    expect(delta).toBeLessThan(0.70)
  })

  it('gamma > 0 for long call', () => {
    expect(bsGreeks('call', inputs).gamma).toBeGreaterThan(0)
  })

  it('theta < 0 for long call (time decay hurts)', () => {
    expect(bsGreeks('call', inputs).theta).toBeLessThan(0)
  })

  it('vega > 0 for long call (rising IV helps)', () => {
    expect(bsGreeks('call', inputs).vega).toBeGreaterThan(0)
  })

  it('rho > 0 for long call (rising rates help calls)', () => {
    expect(bsGreeks('call', inputs).rho).toBeGreaterThan(0)
  })

  it('deep ITM call delta ≈ 1', () => {
    const { delta } = bsGreeks('call', { S: 200, K: 100, T: 0.01, r: 0.05, sigma: 0.20 })
    expect(delta).toBeCloseTo(1, 1)
  })

  it('deep OTM call delta ≈ 0', () => {
    const { delta } = bsGreeks('call', { S: 50, K: 200, T: 0.01, r: 0.05, sigma: 0.20 })
    expect(delta).toBeCloseTo(0, 2)
  })
})

describe('bsGreeks — put', () => {
  const inputs = { S: 100, K: 100, T: 1, r: 0.05, sigma: 0.20 }

  it('put delta is between -1 and 0', () => {
    const { delta } = bsGreeks('put', inputs)
    expect(delta).toBeLessThan(0)
    expect(delta).toBeGreaterThan(-1)
  })

  it('call and put gammas are equal (same d1)', () => {
    const call = bsGreeks('call', inputs)
    const put = bsGreeks('put', inputs)
    expect(call.gamma).toBeCloseTo(put.gamma, 8)
  })

  it('call and put vegas are equal', () => {
    const call = bsGreeks('call', inputs)
    const put = bsGreeks('put', inputs)
    expect(call.vega).toBeCloseTo(put.vega, 8)
  })

  it('theta < 0 for long put', () => {
    expect(bsGreeks('put', inputs).theta).toBeLessThan(0)
  })

  it('rho < 0 for long put (rising rates hurt puts)', () => {
    expect(bsGreeks('put', inputs).rho).toBeLessThan(0)
  })
})

describe('bsGreeks numerical consistency (finite difference)', () => {
  const base = { S: 100, K: 105, T: 0.5, r: 0.04, sigma: 0.25 }
  const eps = 0.01

  it('delta ≈ finite-difference of price w.r.t. S', () => {
    const up = bsPrice('call', { ...base, S: base.S + eps })
    const dn = bsPrice('call', { ...base, S: base.S - eps })
    const fdDelta = (up - dn) / (2 * eps)
    expect(bsGreeks('call', base).delta).toBeCloseTo(fdDelta, 3)
  })

  it('vega ≈ finite-difference of price w.r.t. sigma (per pp)', () => {
    const dsigma = 0.001
    const up = bsPrice('call', { ...base, sigma: base.sigma + dsigma })
    const dn = bsPrice('call', { ...base, sigma: base.sigma - dsigma })
    const fdVega = (up - dn) / (2 * dsigma) / 100
    expect(bsGreeks('call', base).vega).toBeCloseTo(fdVega, 2)
  })
})
