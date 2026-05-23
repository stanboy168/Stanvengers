export interface ModuleMeta {
  id: string
  number: number
  title: string
  subtitle: string
  slug: string
  estimatedMinutes: number
  complete: boolean // fully built vs stubbed
  cardCount: number
  accentColor: string
}

export const MODULES: ModuleMeta[] = [
  {
    id: 'foundations',
    number: 1,
    title: 'Foundations',
    subtitle: 'What an option actually is',
    slug: 'foundations',
    estimatedMinutes: 12,
    complete: true,
    cardCount: 8,
    accentColor: 'sky',
  },
  {
    id: 'basic-positions',
    number: 2,
    title: 'The Four Positions',
    subtitle: 'Long call, long put, short call, short put',
    slug: 'basic-positions',
    estimatedMinutes: 15,
    complete: true,
    cardCount: 8,
    accentColor: 'violet',
  },
  {
    id: 'moneyness-time',
    number: 3,
    title: 'Moneyness & Time',
    subtitle: 'ITM / ATM / OTM and the decay clock',
    slug: 'moneyness-time',
    estimatedMinutes: 12,
    complete: true,
    cardCount: 7,
    accentColor: 'emerald',
  },
  {
    id: 'greeks',
    number: 4,
    title: 'The Greeks',
    subtitle: 'Delta, gamma, theta, vega, rho',
    slug: 'greeks',
    estimatedMinutes: 15,
    complete: true,
    cardCount: 6,
    accentColor: 'amber',
  },
  {
    id: 'pricing',
    number: 5,
    title: 'Pricing Intuition',
    subtitle: 'Black-Scholes: inputs → output',
    slug: 'pricing',
    estimatedMinutes: 10,
    complete: false,
    cardCount: 0,
    accentColor: 'rose',
  },
  {
    id: 'defined-risk',
    number: 6,
    title: 'Defined-Risk Strategies',
    subtitle: 'Spreads, iron condor, iron butterfly',
    slug: 'defined-risk',
    estimatedMinutes: 18,
    complete: false,
    cardCount: 0,
    accentColor: 'sky',
  },
  {
    id: 'undefined-risk',
    number: 7,
    title: 'Undefined-Risk Strategies',
    subtitle: 'Naked positions, straddles, strangles',
    slug: 'undefined-risk',
    estimatedMinutes: 12,
    complete: false,
    cardCount: 0,
    accentColor: 'violet',
  },
  {
    id: 'mechanics',
    number: 8,
    title: 'Trading Mechanics',
    subtitle: 'Orders, fills, expiration, taxes',
    slug: 'mechanics',
    estimatedMinutes: 14,
    complete: false,
    cardCount: 0,
    accentColor: 'emerald',
  },
  {
    id: 'mistakes',
    number: 9,
    title: 'Account-Blowing Mistakes',
    subtitle: 'What traders learn the hard way',
    slug: 'mistakes',
    estimatedMinutes: 10,
    complete: false,
    cardCount: 0,
    accentColor: 'amber',
  },
]
