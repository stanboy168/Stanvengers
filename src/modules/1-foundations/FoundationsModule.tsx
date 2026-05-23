import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { ConceptCard, ConceptSlide, Headline, Body, StatRow } from '@/components/cards/ConceptCard'
import { GlossTerm } from '@/components/glossary/GlossaryModal'
import { ScenarioQuiz } from '@/components/quiz/ScenarioQuiz'
import { useProgressStore } from '@/store/useProgressStore'
import { QUIZZES } from '@/data/quizzes'

const MODULE_ID = 'foundations'

function Slide0() {
  return (
    <ConceptSlide>
      <Headline>What Is an Option?</Headline>
      <Body>
        An <GlossTerm term="option">option</GlossTerm> is a contract between two parties. The buyer
        gets a right; the seller takes on an obligation.
      </Body>
      <Body>
        Specifically, one contract gives you the right to buy or sell{' '}
        <GlossTerm term="multiplier">100 shares</GlossTerm> of a stock at a fixed price, on or
        before a fixed date — regardless of where the stock trades.
      </Body>
      <ConceptCard title="Think of it like a reservation" accent="sky">
        <p>
          A restaurant reservation guarantees you a table at a price (your time). You can show up
          and use it, or not show up and lose the deposit. The restaurant must honor it regardless
          of how busy they are.
        </p>
      </ConceptCard>
    </ConceptSlide>
  )
}

function Slide1() {
  return (
    <ConceptSlide>
      <Headline>Contracts vs. Shares</Headline>
      <Body>
        Stocks trade in shares. Options trade in{' '}
        <strong className="text-white">contracts</strong>, and each contract controls exactly{' '}
        <GlossTerm term="multiplier">100 shares</GlossTerm>.
      </Body>
      <ConceptCard title="The 100-share multiplier" accent="violet">
        <div className="space-y-1">
          <StatRow label="Option premium (per share)" value="$4.50" />
          <StatRow label="Shares per contract" value="× 100" />
          <StatRow label="Total cost of one contract" value="$450" color="gain" />
        </div>
        <p className="text-zinc-400 text-xs mt-3">
          All P/L calculations use this multiplier. Forgetting it is the most common beginner
          mistake.
        </p>
      </ConceptCard>
      <Body>
        You can buy or sell multiple contracts. 5 contracts = rights on 500 shares.
      </Body>
    </ConceptSlide>
  )
}

function Slide2() {
  return (
    <ConceptSlide>
      <Headline>Strike, Expiration, Premium</Headline>
      <Body>Every option contract is defined by three numbers:</Body>
      <ConceptCard title="The three defining parameters" accent="sky">
        <StatRow label="Strike (K)" value="$150" />
        <StatRow label="Expiration" value="Jan 17, 2025" />
        <StatRow label="Premium" value="$3.80 / share" />
      </ConceptCard>
      <Body>
        The <GlossTerm term="strike">strike price</GlossTerm> is where you can transact. The{' '}
        <GlossTerm term="expiration">expiration</GlossTerm> is the deadline. The{' '}
        <GlossTerm term="premium">premium</GlossTerm> is what the buyer pays — it's the option's
        price.
      </Body>
    </ConceptSlide>
  )
}

function Slide3() {
  return (
    <ConceptSlide>
      <Headline>Calls vs. Puts</Headline>
      <ConceptCard title="Call option" accent="sky">
        <p>
          The <GlossTerm term="call">call</GlossTerm> buyer has the right to{' '}
          <strong className="text-white">buy</strong> 100 shares at the strike. Calls gain value
          when the stock rises.
        </p>
      </ConceptCard>
      <ConceptCard title="Put option" accent="rose">
        <p>
          The <GlossTerm term="put">put</GlossTerm> buyer has the right to{' '}
          <strong className="text-white">sell</strong> 100 shares at the strike. Puts gain value
          when the stock falls.
        </p>
      </ConceptCard>
      <Body>
        "Call up, put down" is the simplest mental model — calls profit from rising stocks, puts
        from falling stocks.
      </Body>
    </ConceptSlide>
  )
}

function Slide4() {
  return (
    <ConceptSlide>
      <Headline>Intrinsic vs. Extrinsic Value</Headline>
      <Body>
        An option's premium has two components:{' '}
        <GlossTerm term="intrinsicValue">intrinsic value</GlossTerm> and{' '}
        <GlossTerm term="extrinsicValue">extrinsic value</GlossTerm>.
      </Body>
      <ConceptCard title="Example: $150 call with stock at $162, premium = $14.50" accent="emerald">
        <StatRow label="Intrinsic (in-the-money amount)" value="$12.00" color="gain" />
        <StatRow label="Extrinsic (time value, IV)" value="$2.50" color="neutral" />
        <StatRow label="Total premium" value="$14.50" color="neutral" />
      </ConceptCard>
      <Body>
        Intrinsic value is real, immediate value. Extrinsic is the "what could happen" value — it
        decays to zero by expiration. <GlossTerm term="theta_decay">Time decay</GlossTerm> erodes
        extrinsic value every single day.
      </Body>
    </ConceptSlide>
  )
}

function Slide5() {
  return (
    <ConceptSlide>
      <Headline>American vs. European</Headline>
      <Body>
        US stock options are <strong className="text-white">American-style</strong> — the buyer can
        exercise the option on any day before expiration.
      </Body>
      <Body>
        Index options (like SPX, XSP) are typically{' '}
        <strong className="text-white">European-style</strong> — exercise is only possible at
        expiration.
      </Body>
      <ConceptCard title="Early exercise: usually not worth it" accent="amber">
        <p>
          Exercising early destroys the extrinsic value you paid for. It's almost always better
          to <em>sell</em> the option to close a position rather than exercise it.
        </p>
        <p className="text-zinc-400 text-xs mt-2">
          Exception: sometimes early exercise makes sense for deep ITM calls just before a dividend
          (covered in Module 9).
        </p>
      </ConceptCard>
    </ConceptSlide>
  )
}

function Slide6() {
  return (
    <ConceptSlide>
      <Headline>Bid, Ask, and the Mid</Headline>
      <Body>
        Like stocks, options have a <GlossTerm term="bidAsk">bid-ask spread</GlossTerm>. The bid
        is what buyers will pay; the ask is what sellers want.
      </Body>
      <ConceptCard title="Example option quote" accent="sky">
        <StatRow label="Bid" value="$2.80" color="loss" />
        <StatRow label="Ask" value="$3.10" color="gain" />
        <StatRow label="Mid (midpoint)" value="$2.95" color="neutral" />
        <StatRow label="Spread" value="$0.30 / share = $30" color="loss" />
      </ConceptCard>
      <Body>
        Traders often try to fill near the mid-price. Wide spreads — common in illiquid options —
        mean higher trading costs. Always check the spread before entering a position.
      </Body>
    </ConceptSlide>
  )
}

function Slide7() {
  return (
    <ConceptSlide>
      <Headline>Assignment</Headline>
      <Body>
        When you <em>sell</em> an option, you take on the obligation side. At any time, the buyer
        can exercise — and you will be{' '}
        <GlossTerm term="assignment">assigned</GlossTerm>.
      </Body>
      <ConceptCard title="What assignment means" accent="rose">
        <StatRow label="Short call → assigned" value="Must sell 100 shares at strike" color="loss" />
        <StatRow label="Short put → assigned" value="Must buy 100 shares at strike" color="loss" />
      </ConceptCard>
      <Body>
        Assignment can happen any time before expiration for American options — including overnight.
        Option sellers need to monitor their positions, especially around expiration and dividend
        dates.
      </Body>
    </ConceptSlide>
  )
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7]

export function FoundationsModule() {
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
    if (quizIdx < quizzes.length - 1) {
      setTimeout(() => setQuizIdx(quizIdx + 1), 800)
    } else {
      completeModule(MODULE_ID)
    }
  }

  if (showQuiz && quizzes.length > 0) {
    const q = quizzes[quizIdx]
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
        <ScenarioQuiz key={q.id} question={q} onCorrect={handleQuizCorrect} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="h-1 bg-zinc-800 mx-4 mt-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-500 rounded-full transition-all duration-300"
          style={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Slide count */}
      <div className="px-4 pt-2 pb-1 text-xs text-zinc-500 text-right">
        {idx + 1} / {SLIDES.length}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <CurrentSlide />
      </div>

      {/* Navigation */}
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
          className="flex-1 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          {isLast ? (quizzes.length > 0 ? 'Take Quiz →' : 'Complete Module') : 'Next →'}
        </button>
      </div>
    </div>
  )
}
