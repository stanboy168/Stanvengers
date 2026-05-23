import type { QuizQuestion } from '@/components/quiz/ScenarioQuiz'

export const QUIZZES: Record<string, QuizQuestion[]> = {
  foundations: [
    {
      id: 'f1',
      scenario:
        'You buy one AAPL call option with a $180 strike, expiring in 30 days, for a premium of $3.20 per share.',
      question: 'How much do you pay in total for this contract?',
      choices: [
        { label: '$3.20', correct: false, explanation: 'That\'s the per-share premium. One contract controls 100 shares.' },
        { label: '$320', correct: true, explanation: '$3.20 × 100 shares = $320. Every standard US equity option controls 100 shares.' },
        { label: '$32.00', correct: false, explanation: 'Close, but the multiplier is 100, not 10.' },
        { label: '$3,200', correct: false, explanation: 'That would be $32 × 100. The premium here is $3.20 per share.' },
      ],
      solution: [
        'Each standard US equity option contract controls <strong>100 shares</strong>.',
        'Premium quoted = $3.20 <em>per share</em>.',
        'Total cost = $3.20 × 100 = <strong>$320</strong>.',
        'This $320 is your maximum possible loss if AAPL stays below $180 at expiration.',
      ],
    },
    {
      id: 'f2',
      scenario:
        'A call option has a strike of $150, the stock is trading at $162, and the option\'s total premium is $14.50.',
      question: 'How much of that $14.50 premium is intrinsic value?',
      choices: [
        { label: '$14.50 — it\'s all intrinsic', correct: false, explanation: 'Intrinsic value is only the in-the-money amount: $162 − $150 = $12.' },
        { label: '$12.00', correct: true, explanation: 'Intrinsic = max(0, Stock − Strike) = max(0, $162 − $150) = $12.' },
        { label: '$2.50', correct: false, explanation: 'That\'s the extrinsic (time) value, not the intrinsic value.' },
        { label: '$0 — calls have no intrinsic value', correct: false, explanation: 'ITM calls do have intrinsic value equal to the in-the-money amount.' },
      ],
      solution: [
        'Intrinsic value = <strong>max(0, Spot − Strike)</strong> for a call.',
        'Here: max(0, $162 − $150) = <strong>$12.00</strong>.',
        'Extrinsic (time) value = Total premium − Intrinsic = $14.50 − $12.00 = <strong>$2.50</strong>.',
        'At expiration, all extrinsic value decays to zero — only intrinsic value remains.',
      ],
    },
  ],

  'basic-positions': [
    {
      id: 'bp1',
      scenario:
        'AAPL is at $180. You own a $185 call expiring Friday, which you bought for $1.20. AAPL closes Friday at $184.50.',
      question: 'What is your P&L at expiration?',
      choices: [
        { label: '+$330 profit', correct: false, explanation: 'The call expires OTM — AAPL ($184.50) never reached the strike ($185).' },
        { label: '−$120 (lose the full premium)', correct: true, explanation: 'Strike $185 > Spot $184.50, so the call expires worthless. You lose your entire $1.20 premium × 100 = $120.' },
        { label: '−$50 (only partial loss)', correct: false, explanation: 'The option expires all-or-nothing OTM — there\'s no partial intrinsic value when out of the money.' },
        { label: '+$450 (intrinsic value)', correct: false, explanation: 'Intrinsic value of a call = max(0, Spot − Strike). Since $184.50 < $185, intrinsic value = $0.' },
      ],
      solution: [
        'At expiration, a call has value only if <strong>Spot > Strike</strong>.',
        'AAPL closed at $184.50, which is <em>below</em> the $185 strike.',
        'Intrinsic value = max(0, $184.50 − $185) = max(0, −$0.50) = <strong>$0</strong>.',
        'The contract expires worthless.',
        'Total P&L = −$1.20 premium × 100 shares = <strong>−$120</strong>.',
        'The breakeven was $185 + $1.20 = $186.20 — AAPL needed to reach $186.20 to profit.',
      ],
    },
    {
      id: 'bp2',
      scenario:
        'Traders sometimes use a short put to potentially acquire shares at a lower price. You sell one XYZ $95 put for $3.00, with XYZ currently at $100. XYZ drops to $88 at expiration.',
      question: 'What is your P&L?',
      choices: [
        { label: '+$300 (kept the premium)', correct: false, explanation: 'The put is in the money — you\'re assigned at $95 while the stock is worth $88.' },
        { label: '−$400', correct: true, explanation: 'You sold the put for $3.00. At expiration you buy shares at $95 (assigned), but they\'re worth $88. Loss = ($88 − $95 + $3.00) × 100 = −$4.00 × 100 = −$400.' },
        { label: '−$700', correct: false, explanation: 'That would be if you forgot to count the premium received. Net per share = $88 − $95 + $3.00 = −$4.' },
        { label: '−$1,200', correct: false, explanation: 'That would be the loss without any premium. Remember short puts collect premium upfront.' },
      ],
      solution: [
        'You <em>sold</em> the put for $3.00, so you received $300 upfront.',
        'XYZ expires at $88 — below the $95 strike — so you are <strong>assigned</strong>.',
        'Assignment means you buy 100 shares at $95 even though they\'re worth $88.',
        'Per-share loss on shares: $88 − $95 = −$7.00.',
        'Add back premium received: −$7.00 + $3.00 = <strong>−$4.00 per share</strong>.',
        'Total P&L = −$4.00 × 100 = <strong>−$400</strong>.',
        'Breakeven = $95 − $3.00 = $92.00. The short put was profitable above $92.',
      ],
    },
  ],

  'moneyness-time': [
    {
      id: 'mt1',
      scenario:
        'Stock XYZ is trading at $50. Consider three put options: a $45 put, a $50 put, and a $55 put.',
      question: 'Which put option is in the money (ITM)?',
      choices: [
        { label: 'The $45 put (below the stock price)', correct: false, explanation: 'For a put, ITM means the strike is ABOVE the stock price, so you could sell at a profit.' },
        { label: 'The $50 put (at the stock price)', correct: false, explanation: 'The $50 put is at the money (ATM), not in the money.' },
        { label: 'The $55 put (above the stock price)', correct: true, explanation: 'A put is ITM when Strike > Spot. You have the right to sell at $55 when the stock is at $50 — that\'s $5 of intrinsic value.' },
        { label: 'None of them', correct: false, explanation: 'The $55 put has intrinsic value of $55 − $50 = $5, so it is definitely ITM.' },
      ],
      solution: [
        'A <strong>put</strong> is ITM when <strong>Strike > Spot</strong> (you can sell high).',
        'A <strong>call</strong> is ITM when <strong>Strike < Spot</strong> (you can buy low).',
        '$55 put with XYZ at $50: Intrinsic = max(0, $55 − $50) = <strong>$5</strong> → ITM.',
        '$50 put: Intrinsic = max(0, $50 − $50) = $0 → ATM.',
        '$45 put: Intrinsic = max(0, $45 − $50) = $0 → OTM.',
      ],
    },
  ],

  greeks: [
    {
      id: 'g1',
      scenario:
        'You own an AAPL call with a delta of 0.40. AAPL moves up $2 in one day. All else equal.',
      question: 'By approximately how much does your option price change?',
      choices: [
        { label: '+$0.40 per share', correct: false, explanation: 'Delta of 0.40 means price changes $0.40 per $1 move. A $2 move gives $0.80 change per share.' },
        { label: '+$0.80 per share (+$80 per contract)', correct: true, explanation: 'Delta × Spot move = 0.40 × $2 = $0.80 per share. One contract = 100 shares = $80 gain.' },
        { label: '+$2.00 per share', correct: false, explanation: 'Delta = 1.0 would mean the option moves dollar-for-dollar with the stock. At delta 0.40 it moves less.' },
        { label: '+$0.04 per share', correct: false, explanation: 'Check the math: 0.40 delta × $2 move = $0.80, not $0.04.' },
      ],
      solution: [
        'Delta tells you how much the option price changes for a <strong>$1 move</strong> in the stock.',
        'Delta of 0.40 → option moves $0.40 per $1 stock move.',
        'Stock moved $2, so: 0.40 × $2 = <strong>$0.80 per share</strong> change in option price.',
        'One contract controls 100 shares: $0.80 × 100 = <strong>$80 per contract</strong> gain.',
        'Note: this is an approximation. Gamma causes delta to change as the stock moves.',
      ],
    },
  ],
}
