export interface GlossaryEntry {
  term: string
  definition: string
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  option: {
    term: 'Option',
    definition:
      'A contract that gives the buyer the right — but not the obligation — to buy or sell 100 shares of an underlying stock at a specific price (the strike) on or before a specific date (expiration).',
  },
  call: {
    term: 'Call Option',
    definition:
      'An option that gives the buyer the right to buy 100 shares at the strike price. Buyers profit when the stock rises above the strike. Sellers profit when the stock stays below the strike.',
  },
  put: {
    term: 'Put Option',
    definition:
      'An option that gives the buyer the right to sell 100 shares at the strike price. Buyers profit when the stock falls below the strike. Sellers profit when the stock stays above the strike.',
  },
  strike: {
    term: 'Strike Price',
    definition:
      'The agreed-upon price at which the option buyer can buy (call) or sell (put) 100 shares. Also called the exercise price.',
  },
  premium: {
    term: 'Premium',
    definition:
      'The price paid to buy an option contract, quoted per share. Multiply by 100 to get the total dollar cost. The premium is the maximum loss for the buyer.',
  },
  expiration: {
    term: 'Expiration',
    definition:
      'The date on which an option contract expires and becomes worthless if not exercised. After expiration, the contract no longer exists.',
  },
  intrinsicValue: {
    term: 'Intrinsic Value',
    definition:
      'The in-the-money amount of an option. For a call: max(0, Stock Price − Strike). For a put: max(0, Strike − Stock Price). An OTM option has zero intrinsic value.',
  },
  extrinsicValue: {
    term: 'Extrinsic Value',
    definition:
      'Also called time value. The portion of the premium above intrinsic value, reflecting time remaining, implied volatility, and interest rates. All extrinsic value decays to zero at expiration.',
  },
  itm: {
    term: 'In the Money (ITM)',
    definition:
      'A call is ITM when the stock price is above the strike. A put is ITM when the stock price is below the strike. ITM options have intrinsic value.',
  },
  atm: {
    term: 'At the Money (ATM)',
    definition:
      'An option whose strike price is at or very near the current stock price. ATM options have the highest extrinsic value and highest gamma.',
  },
  otm: {
    term: 'Out of the Money (OTM)',
    definition:
      'A call is OTM when the stock price is below the strike. A put is OTM when the stock price is above the strike. OTM options consist entirely of extrinsic value.',
  },
  delta: {
    term: 'Delta (Δ)',
    definition:
      'How much the option\'s price changes for every $1 move in the stock. Calls have positive delta (0 to 1); puts have negative delta (−1 to 0). An ATM option has delta near ±0.50.',
  },
  gamma: {
    term: 'Gamma (Γ)',
    definition:
      'How fast delta changes as the stock price moves. High gamma means delta can shift quickly, creating larger-than-expected moves. Gamma is highest for ATM options near expiration.',
  },
  theta: {
    term: 'Theta (Θ)',
    definition:
      'How much the option\'s value decays each calendar day, all else equal. Option buyers have negative theta (time hurts them). Sellers have positive theta (time helps them).',
  },
  vega: {
    term: 'Vega (V)',
    definition:
      'How much the option\'s price changes for every 1 percentage-point change in implied volatility. Long options have positive vega; short options have negative vega.',
  },
  rho: {
    term: 'Rho (ρ)',
    definition:
      'How much the option\'s price changes for every 1 percentage-point change in the risk-free interest rate. Generally the smallest Greek in practical impact.',
  },
  impliedVolatility: {
    term: 'Implied Volatility (IV)',
    definition:
      'The market\'s forward-looking estimate of how much a stock will move, derived by working the Black-Scholes formula backwards from the market price. Higher IV = more expensive options.',
  },
  historicalVolatility: {
    term: 'Historical Volatility (HV)',
    definition:
      'How much the stock actually moved in the past, measured as the annualized standard deviation of daily returns. Compare HV to IV to assess whether options appear cheap or expensive.',
  },
  assignment: {
    term: 'Assignment',
    definition:
      'When an option seller is obligated to fulfill the contract. A short call seller must sell 100 shares; a short put seller must buy 100 shares. Assignment can happen any time before expiration for American-style options.',
  },
  exercise: {
    term: 'Exercise',
    definition:
      'When an option buyer chooses to use their right — buying shares (call) or selling shares (put) at the strike price. Early exercise is usually suboptimal for calls on non-dividend stocks.',
  },
  spread: {
    term: 'Spread',
    definition:
      'A strategy using two or more option legs on the same underlying. Spreads cap both maximum profit and maximum loss, making them defined-risk strategies.',
  },
  ironCondor: {
    term: 'Iron Condor',
    definition:
      'A four-leg strategy selling an OTM put spread and an OTM call spread simultaneously. Profits when the stock stays in a range between the two short strikes. Max profit = net credit received.',
  },
  theta_decay: {
    term: 'Time Decay',
    definition:
      'The gradual erosion of an option\'s extrinsic value as expiration approaches. Decay is not linear — it accelerates in the final weeks before expiration.',
  },
  multiplier: {
    term: '100-Share Multiplier',
    definition:
      'Each standard US equity option contract controls 100 shares. If a call is priced at $2.50, the total cost is $250 (2.50 × 100). All P/L calculations must include this multiplier.',
  },
  breakeven: {
    term: 'Breakeven',
    definition:
      'The stock price at expiration where a position has zero profit or loss. For a long call: Strike + Premium. For a long put: Strike − Premium.',
  },
  bidAsk: {
    term: 'Bid-Ask Spread',
    definition:
      'The difference between the highest price a buyer will pay (bid) and the lowest price a seller will accept (ask). Wider spreads = more slippage. Trading near the mid-price reduces costs.',
  },
  blackScholes: {
    term: 'Black-Scholes Model',
    definition:
      'A mathematical model for pricing European options. It takes five inputs (spot, strike, time, volatility, risk-free rate) and outputs a theoretical fair value and the Greeks.',
  },
}
