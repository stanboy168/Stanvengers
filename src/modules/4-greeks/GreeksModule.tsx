import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { ConceptCard, ConceptSlide, Headline, Body, StatRow } from '@/components/cards/ConceptCard'
import { GlossTerm } from '@/components/glossary/GlossaryModal'
import { GreekSandbox } from '@/components/diagrams/GreekSandbox'
import { ScenarioQuiz } from '@/components/quiz/ScenarioQuiz'
import { useProgressStore } from '@/store/useProgressStore'
import { QUIZZES } from '@/data/quizzes'

const MODULE_ID = 'greeks'

function Slide0() {
  return (
    <ConceptSlide>
      <Headline>The Greeks: Your Dashboard</Headline>
      <Body>
        The Greeks are sensitivity measures — they tell you how your option's value changes as
        different inputs shift. You don't have to memorize formulas; you need to understand the
        direction and relative magnitude.
      </Body>
      <ConceptCard title="The five Greeks" accent="amber">
        <StatRow label="Delta (Δ)" value="How much price moves per $1 in stock" />
        <StatRow label="Gamma (Γ)" value="How fast delta changes" />
        <StatRow label="Theta (Θ)" value="Daily time decay in dollars" />
        <StatRow label="Vega (V)" value="Sensitivity to volatility" />
        <StatRow label="Rho (ρ)" value="Sensitivity to interest rates" />
      </ConceptCard>
      <Body>
        Think of the Greeks like a car dashboard: they describe what's happening right now, not
        where you'll end up.
      </Body>
    </ConceptSlide>
  )
}

function Slide1() {
  return (
    <ConceptSlide>
      <Headline>Delta (Δ)</Headline>
      <Body>
        <GlossTerm term="delta">Delta</GlossTerm> tells you how much the option price changes for
        every $1 move in the stock.
      </Body>
      <ConceptCard title="Delta ranges" accent="sky">
        <StatRow label="Long call" value="0 to +1" color="gain" />
        <StatRow label="Long put" value="−1 to 0" color="loss" />
        <StatRow label="ATM option (approx)" value="±0.50" color="neutral" />
        <StatRow label="Deep ITM call" value="≈ +1.00 (moves like stock)" color="gain" />
        <StatRow label="Deep OTM call" value="≈ 0.00 (barely moves)" color="neutral" />
      </ConceptCard>
      <Body>
        Delta also approximates the probability that the option expires in the money — an ATM
        option at 0.50 delta is roughly a coin flip. (This is an approximation, not a precise
        statement.)
      </Body>
      <Body>
        Delta is not static. As the stock moves, delta changes — that's what gamma measures.
      </Body>
    </ConceptSlide>
  )
}

function Slide2() {
  return (
    <ConceptSlide>
      <Headline>Gamma (Γ) &amp; Theta (Θ)</Headline>
      <Body>
        <GlossTerm term="gamma">Gamma</GlossTerm> is the rate of change of delta. High gamma means
        your delta is unstable — one big move can dramatically alter your position's behavior.
      </Body>
      <ConceptCard title="Gamma" accent="violet">
        <p>
          ATM options near expiration have the highest gamma. This is why short options are
          especially dangerous in the final days before expiration — a small stock move can create a
          large unexpected loss.
        </p>
      </ConceptCard>
      <Body>
        <GlossTerm term="theta">Theta</GlossTerm> is the daily dollar decay. For a long option,
        theta is negative — you lose money each day just from time passing. For short options,
        theta is positive — you profit from decay.
      </Body>
      <ConceptCard title="Gamma-Theta tradeoff" accent="amber">
        <p>
          Long options have positive gamma (gains accelerate) but negative theta (decay hurts).
          Short options collect theta but face gamma risk. This tension is fundamental to options
          trading.
        </p>
      </ConceptCard>
    </ConceptSlide>
  )
}

function Slide3() {
  return (
    <ConceptSlide>
      <Headline>Vega (V) &amp; Rho (ρ)</Headline>
      <Body>
        <GlossTerm term="vega">Vega</GlossTerm> measures sensitivity to{' '}
        <GlossTerm term="impliedVolatility">implied volatility</GlossTerm>. Long options have
        positive vega — rising IV increases their value. Short options have negative vega.
      </Body>
      <ConceptCard title="Vega example" accent="sky">
        <p>
          If your call has vega of $0.15 per 1% IV change (per share), a 5pp rise in IV adds
          roughly $0.75/share to the option's value. Per contract: $75.
        </p>
      </ConceptCard>
      <Body>
        <GlossTerm term="rho">Rho</GlossTerm> measures sensitivity to the risk-free interest rate.
        It's generally the smallest and least important Greek for short-dated equity options —
        but it matters more for LEAPS (long-dated options) and when rates are changing rapidly.
      </Body>
      <ConceptCard title="Remember" accent="violet">
        <p>
          All Greeks describe sensitivities at a single instant. As time, price, and IV change,
          every Greek shifts. The sandbox below lets you explore this live.
        </p>
      </ConceptCard>
    </ConceptSlide>
  )
}

function Slide4() {
  return (
    <ConceptSlide>
      <Headline>Greek Sandbox</Headline>
      <Body>
        Move any slider and watch all five Greeks update instantly. Notice how theta and vega are
        largest ATM, and how delta approaches 1 (or −1) for deep ITM options.
      </Body>
      <GreekSandbox />
    </ConceptSlide>
  )
}

function Slide5() {
  return (
    <ConceptSlide>
      <Headline>Module Summary</Headline>
      <ConceptCard title="Greeks at a glance" accent="amber">
        <StatRow label="Δ Delta" value="$1 stock move → option Δ change" />
        <StatRow label="Γ Gamma" value="Delta change per $1 move" />
        <StatRow label="Θ Theta" value="Dollar decay per calendar day" />
        <StatRow label="V Vega" value="Dollar change per 1% IV move" />
        <StatRow label="ρ Rho" value="Dollar change per 1% rate move" />
      </ConceptCard>
      <Body>
        Up next: Black-Scholes — the model that generates these Greeks and the theoretical option
        price. You'll see what each input does without needing any math.
      </Body>
    </ConceptSlide>
  )
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5]
const MODULE_COLOR = 'bg-amber-600 hover:bg-amber-500'
const PROGRESS_COLOR = 'bg-amber-500'

export function GreeksModule() {
  const [idx, setIdx] = useState(0)
  const [quizIdx, setQuizIdx] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const { completeModule, recordQuizScore } = useProgressStore()
  const quizzes = QUIZZES[MODULE_ID] ?? []
  const CurrentSlide = SLIDES[idx]
  const isLast = idx === SLIDES.length - 1

  function next() {
    if (idx < SLIDES.length - 1) setIdx(idx + 1)
    else setShowQuiz(true)
  }

  function handleQuizCorrect() {
    recordQuizScore(MODULE_ID, 1)
    if (quizIdx < quizzes.length - 1) setTimeout(() => setQuizIdx(quizIdx + 1), 800)
    else completeModule(MODULE_ID)
  }

  if (showQuiz && quizzes.length > 0) {
    return (
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setShowQuiz(false); setIdx(SLIDES.length - 1) }}
            className="text-zinc-400 hover:text-white flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> Back
          </button>
          <span className="text-xs text-zinc-500">Quiz {quizIdx + 1} / {quizzes.length}</span>
        </div>
        <ScenarioQuiz key={quizzes[quizIdx].id} question={quizzes[quizIdx]} onCorrect={handleQuizCorrect} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-1 bg-zinc-800 mx-4 mt-4 rounded-full overflow-hidden">
        <div className={`h-full ${PROGRESS_COLOR} rounded-full transition-all duration-300`}
          style={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }} />
      </div>
      <div className="px-4 pt-2 pb-1 text-xs text-zinc-500 text-right">{idx + 1} / {SLIDES.length}</div>
      <div className="flex-1 overflow-y-auto"><CurrentSlide /></div>
      <div className="px-4 pb-4 flex items-center gap-3">
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
          className="p-3 rounded-xl bg-zinc-800 text-zinc-400 disabled:opacity-30 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className={`flex-1 py-3 ${MODULE_COLOR} text-white rounded-xl font-semibold text-sm transition-colors`}>
          {isLast ? (quizzes.length > 0 ? 'Take Quiz →' : 'Complete Module') : 'Next →'}
        </button>
      </div>
    </div>
  )
}
