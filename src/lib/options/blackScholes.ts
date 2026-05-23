import { normalCDF, normalPDF } from './math'

export type OptionType = 'call' | 'put'

export interface BSInputs {
  S: number  // spot price
  K: number  // strike price
  T: number  // time to expiry in years
  r: number  // risk-free rate (annual, e.g. 0.05 = 5%)
  sigma: number // implied volatility (annual, e.g. 0.20 = 20%)
}

export interface BSResult {
  price: number
  delta: number
  gamma: number
  theta: number  // per calendar day
  vega: number   // per 1 percentage point change in IV
  rho: number    // per 1 percentage point change in r
}

function d1d2(inputs: BSInputs): [number, number] {
  const { S, K, T, r, sigma } = inputs
  const sqrtT = Math.sqrt(T)
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT)
  const d2 = d1 - sigma * sqrtT
  return [d1, d2]
}

export function bsPrice(type: OptionType, inputs: BSInputs): number {
  const { S, K, T, r } = inputs
  if (T <= 0) {
    return type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S)
  }
  const [d1, d2] = d1d2(inputs)
  const disc = Math.exp(-r * T)
  if (type === 'call') {
    return S * normalCDF(d1) - K * disc * normalCDF(d2)
  } else {
    return K * disc * normalCDF(-d2) - S * normalCDF(-d1)
  }
}

export function bsGreeks(type: OptionType, inputs: BSInputs): BSResult {
  const { S, K, T, r, sigma } = inputs

  if (T <= 0) {
    const intrinsic = type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S)
    return { price: intrinsic, delta: type === 'call' ? (S > K ? 1 : 0) : (S < K ? -1 : 0), gamma: 0, theta: 0, vega: 0, rho: 0 }
  }

  const [d1, d2] = d1d2(inputs)
  const sqrtT = Math.sqrt(T)
  const disc = Math.exp(-r * T)
  const nd1 = normalCDF(d1)
  const nd2 = normalCDF(d2)
  const nPdfD1 = normalPDF(d1)

  const price = type === 'call'
    ? S * nd1 - K * disc * nd2
    : K * disc * normalCDF(-d2) - S * normalCDF(-d1)

  const delta = type === 'call' ? nd1 : nd1 - 1

  const gamma = nPdfD1 / (S * sigma * sqrtT)

  // theta: rate of change of price per year; divide by 365 for per-day
  const rawTheta = type === 'call'
    ? -(S * nPdfD1 * sigma) / (2 * sqrtT) - r * K * disc * nd2
    : -(S * nPdfD1 * sigma) / (2 * sqrtT) + r * K * disc * normalCDF(-d2)
  const theta = rawTheta / 365

  // vega: per 1 unit of sigma; divide by 100 for per 1pp of IV
  const vega = S * sqrtT * nPdfD1 / 100

  // rho: per 1 unit of r; divide by 100 for per 1pp of r
  const rho = type === 'call'
    ? K * T * disc * nd2 / 100
    : -K * T * disc * normalCDF(-d2) / 100

  return { price, delta, gamma, theta, vega, rho }
}
