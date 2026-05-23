import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { ConceptCard, ConceptSlide, Headline, Body, StatRow } from '@/components/cards/ConceptCard'
import { GlossTerm } from '@/components/glossary/GlossaryModal'
import { PayoffDiagram, DiagramControls, useSingleLeg } from '@/components/diagrams/PayoffDiagram'
import { ScenarioQuiz } from '@/components/quiz/ScenarioQuiz'
import { useProgressStore } from '@/store/useProgressStore'
import { QUIZZES } from '@/data/quizzes'

const MODULE_ID = 'basic-positions'

function Slide0() {
  return (
    <ConceptSlide>
      <Headline>The Four Basic Positions</Headline>
      <Body>
        Every options position is built from four building blocks. You can either{' '}
        <strong className="text-white">buy (long)</strong> or{' '}
        <strong className="text-white">sell (short)</strong> a call or a put.
      </Body>
      <ConceptCard title="The 2×2 matrix" accent="violet">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div />
          <div className="text-center font-semibold text-sky-400">Call</div>
          <div className="text-center font-semibold text-violet-400">Put</div>
          <div className="font-semibold text-zinc-300">Long (buy)</div>
          <div className="text-center text-zinc-300 bg-zinc-800 rounded p-1.5">Profit when ↑</div>
          <div className="text-center text-zinc-300 bg-zinc-800 rounded p-1.5">Profit when ↓</div>
          <div className="font-semibold text-zinc-300">Short (sell)</div>
          <div className="text-center text-zinc-300 bg-zinc-800 rounded p-1.5">Profit when ↓ or flat</div>
          <div className="text-center text-zinc-300 bg-zinc-800 rounded p-1.5">Profit when ↑ or flat</div>
        </div>
      </ConceptCard>
      <Body>
        The next four slides each walk through one position, ending with a diagram you can interact
        with.
      </Body>
    </ConceptSlide>
  )
}

function Slide1() {
  const { legs, strike, premium, setStrike, setPremium, setSpot, spot } = useSingleLeg(
    'call', 'long', 100, 5
  )
  return (
    <ConceptSlide>
      <Headline>Long Call</Headline>
      <Body>
        You <em>buy</em> a <GlossTerm term="call">call</GlossTerm>. You pay the premium upfront.
        Maximum loss is limited to that premium. Maximum profit is theoretically unlimited — the
        stock can rise forever.
      </Body>
      <ConceptCard title="Key numbers" accent="sky">
        <StatRow label="Max loss" value={`$${(premium * 100).toFixed(0)}`} color="loss" />
        <StatRow label="Breakeven at expiry" value={`$${(strike + premium).toFixed(2)}`} color="neutral" />
        <StatRow label="Max profit" value="Unlimited" color="gain" />
      </ConceptCard>
      <PayoffDiagram legs={legs} spotCenter={strike} />
      <DiagramControls
        strike={strike} premium={premium} spot={spot}
        onStrike={setStrike} onPremium={setPremium} onSpot={setSpot}
        strikeRange={[70, 150]} premiumRange={[0.5, 20]}
      />
    </ConceptSlide>
  )
}

function Slide2() {
  const { legs, strike, premium, setStrike, setPremium, setSpot, spot } = useSingleLeg(
    'put', 'long', 100, 5
  )
  return (
    <ConceptSlide>
      <Headline>Long Put</Headline>
      <Body>
        You <em>buy</em> a <GlossTerm term="put">put</GlossTerm>. You pay the premium upfront.
        Maximum loss is the premium. Maximum profit is large — but capped at the strike price (a
        stock can only fall to zero).
      </Body>
      <ConceptCard title="Key numbers" accent="violet">
        <StatRow label="Max loss" value={`$${(premium * 100).toFixed(0)}`} color="loss" />
        <StatRow label="Breakeven at expiry" value={`$${(strike - premium).toFixed(2)}`} color="neutral" />
        <StatRow label="Max profit" value={`$${((strike - premium) * 100).toFixed(0)}`} color="gain" />
      </ConceptCard>
      <PayoffDiagram legs={legs} spotCenter={strike} />
      <DiagramControls
        strike={strike} premium={premium} spot={spot}
        onStrike={setStrike} onPremium={setPremium} onSpot={setSpot}
        strikeRange={[70, 150]} premiumRange={[0.5, 20]}
      />
    </ConceptSlide>
  )
}

function Slide3() {
  const { legs, strike, premium, setStrike, setPremium, setSpot, spot } = useSingleLeg(
    'call', 'short', 100, 5
  )
  return (
    <ConceptSlide>
      <Headline>Short Call</Headline>
      <Body>
        You <em>sell</em> a call. You collect the premium immediately. Maximum profit is that
        premium. Maximum loss is{' '}
        <strong className="text-orange-400">theoretically unlimited</strong> — if the stock rockets,
        your losses grow with it.
      </Body>
      <ConceptCard title="Key numbers" accent="rose">
        <StatRow label="Max loss" value="Unlimited" color="loss" />
        <StatRow label="Breakeven at expiry" value={`$${(strike + premium).toFixed(2)}`} color="neutral" />
        <StatRow label="Max profit" value={`$${(premium * 100).toFixed(0)}`} color="gain" />
      </ConceptCard>
      <ConceptCard title="Important" accent="amber">
        <p>
          Naked short calls require margin approval and carry the highest risk of any basic
          position. Traders sometimes use them in the context of covered calls (owning the shares),
          which caps the upside but eliminates the unlimited-loss risk.
        </p>
      </ConceptCard>
      <PayoffDiagram legs={legs} spotCenter={strike} />
      <DiagramControls
        strike={strike} premium={premium} spot={spot}
        onStrike={setStrike} onPremium={setPremium} onSpot={setSpot}
        strikeRange={[70, 150]} premiumRange={[0.5, 20]}
      />
    </ConceptSlide>
  )
}

function Slide4() {
  const { legs, strike, premium, setStrike, setPremium, setSpot, spot } = useSingleLeg(
    'put', 'short', 100, 5
  )
  return (
    <ConceptSlide>
      <Headline>Short Put</Headline>
      <Body>
        You <em>sell</em> a put. You collect the premium. If the stock falls below the strike,
        you're obligated to buy 100 shares at the strike — even if the stock is worth far less.
      </Body>
      <ConceptCard title="Key numbers" accent="rose">
        <StatRow label="Max loss" value={`$${((strike - premium) * 100).toFixed(0)} (stock → $0)`} color="loss" />
        <StatRow label="Breakeven at expiry" value={`$${(strike - premium).toFixed(2)}`} color="neutral" />
        <StatRow label="Max profit" value={`$${(premium * 100).toFixed(0)}`} color="gain" />
      </ConceptCard>
      <PayoffDiagram legs={legs} spotCenter={strike} />
      <DiagramControls
        strike={strike} premium={premium} spot={spot}
        onStrike={setStrike} onPremium={setPremium} onSpot={setSpot}
        strikeRange={[70, 150]} premiumRange={[0.5, 20]}
      />
    </ConceptSlide>
  )
}

function Slide5() {
  return (
    <ConceptSlide>
      <Headline>Buyer vs. Seller Mindset</Headline>
      <Body>
        Buyers pay premium and need a significant move to profit. Sellers collect premium and profit
        when the stock goes nowhere — or in the "right" direction.
      </Body>
      <ConceptCard title="The tradeoff" accent="violet">
        <div className="space-y-3">
          <div>
            <p className="text-sky-400 font-medium text-sm">Option buyer</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Limited risk, unlimited or large reward, low probability of max profit, needs movement.
            </p>
          </div>
          <div>
            <p className="text-amber-400 font-medium text-sm">Option seller</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Collects premium, profits from time decay, higher probability of profit, but catastrophic
              potential loss for naked positions.
            </p>
          </div>
        </div>
      </ConceptCard>
      <Body>
        Neither approach is inherently better. Each has contexts where it makes sense. Understanding
        both is how you build a complete toolkit.
      </Body>
    </ConceptSlide>
  )
}

function Slide6() {
  return (
    <ConceptSlide>
      <Headline>Closing a Position</Headline>
      <Body>
        You don't have to hold a position until expiration. Most options traders{' '}
        <strong className="text-white">close by trading the option back</strong> before expiry.
      </Body>
      <ConceptCard title="How to close" accent="sky">
        <StatRow label="Long call → close by" value="Selling the call" color="neutral" />
        <StatRow label="Short call → close by" value="Buying the call back" color="neutral" />
        <StatRow label="Long put → close by" value="Selling the put" color="neutral" />
        <StatRow label="Short put → close by" value="Buying the put back" color="neutral" />
      </ConceptCard>
      <Body>
        Closing early preserves any remaining extrinsic value. Exercising destroys it. Unless you
        specifically want the shares, close rather than exercise.
      </Body>
    </ConceptSlide>
  )
}

function Slide7() {
  return (
    <ConceptSlide>
      <Headline>Module Summary</Headline>
      <ConceptCard title="The four positions at a glance" accent="violet">
        <StatRow label="Long call" value="Profit ↑, risk = premium" color="gain" />
        <StatRow label="Long put" value="Profit ↓, risk = premium" color="gain" />
        <StatRow label="Short call" value="Premium in, unlimited risk" color="loss" />
        <StatRow label="Short put" value="Premium in, large downside risk" color="loss" />
      </ConceptCard>
      <Body>
        In the next module you'll learn how{' '}
        <GlossTerm term="itm">moneyness</GlossTerm> and{' '}
        <GlossTerm term="theta_decay">time decay</GlossTerm> interact — the two forces that shape
        every option position.
      </Body>
    </ConceptSlide>
  )
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7]

export function BasicPositionsModule() {
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
          <button
            onClick={() => { setShowQuiz(false); setIdx(SLIDES.length - 1) }}
            className="text-zinc-400 hover:text-white flex items-center gap-1 text-sm"
          >
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
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-300"
          style={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }}
        />
      </div>
      <div className="px-4 pt-2 pb-1 text-xs text-zinc-500 text-right">
        {idx + 1} / {SLIDES.length}
      </div>
      <div className="flex-1 overflow-y-auto">
        <CurrentSlide />
      </div>
      <div className="px-4 pb-4 flex items-center gap-3">
        <button
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="p-3 rounded-xl bg-zinc-800 text-zinc-400 disabled:opacity-30 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          {isLast ? (quizzes.length > 0 ? 'Take Quiz →' : 'Complete Module') : 'Next →'}
        </button>
      </div>
    </div>
  )
}

