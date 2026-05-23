import { useState, useMemo } from 'react'
import { ChevronLeft } from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Legend
} from 'recharts'
import { ConceptCard, ConceptSlide, Headline, Body, StatRow } from '@/components/cards/ConceptCard'
import { GlossTerm } from '@/components/glossary/GlossaryModal'
import { PayoffDiagram } from '@/components/diagrams/PayoffDiagram'
import { ScenarioQuiz } from '@/components/quiz/ScenarioQuiz'
import { bsPrice } from '@/lib/options'
import { useProgressStore } from '@/store/useProgressStore'
import { QUIZZES } from '@/data/quizzes'
import type { Leg } from '@/lib/options'

const MODULE_ID = 'moneyness-time'

function Slide0() {
  const [spot, setSpot] = useState(100)
  const strike = 100
  const itm = spot > strike
  const atm = Math.abs(spot - strike) < 2

  const moneyness = atm ? 'ATM' : itm ? 'ITM' : 'OTM'
  const mColor = atm ? 'text-amber-400' : itm ? 'text-sky-400' : 'text-orange-400'

  return (
    <ConceptSlide>
      <Headline>Moneyness: ITM, ATM, OTM</Headline>
      <Body>
        <GlossTerm term="itm">Moneyness</GlossTerm> describes the relationship between the stock
        price and the strike. Drag the slider to see it change.
      </Body>
      <div className="bg-zinc-800/60 rounded-xl p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Stock price (K = $100)</span>
            <span className="text-white font-semibold">${spot.toFixed(0)}</span>
          </div>
          <input type="range" min={60} max={140} step={1} value={spot}
            onChange={(e) => setSpot(Number(e.target.value))}
            className="w-full h-1.5 accent-sky-400 cursor-pointer" />
        </div>
        <div className={`text-center text-2xl font-bold py-2 ${mColor}`}>{moneyness}</div>
        <StatRow
          label="Call intrinsic value"
          value={`$${Math.max(0, spot - strike).toFixed(2)}`}
          color={spot > strike ? 'gain' : 'neutral'}
        />
        <StatRow
          label="Put intrinsic value"
          value={`$${Math.max(0, strike - spot).toFixed(2)}`}
          color={spot < strike ? 'gain' : 'neutral'}
        />
      </div>
    </ConceptSlide>
  )
}

function Slide1() {
  return (
    <ConceptSlide>
      <Headline>ITM / ATM / OTM Defined</Headline>
      <ConceptCard title="Call options" accent="sky">
        <StatRow label="ITM" value="Spot > Strike" color="gain" />
        <StatRow label="ATM" value="Spot ≈ Strike" color="neutral" />
        <StatRow label="OTM" value="Spot < Strike" color="loss" />
      </ConceptCard>
      <ConceptCard title="Put options" accent="violet">
        <StatRow label="ITM" value="Spot < Strike" color="gain" />
        <StatRow label="ATM" value="Spot ≈ Strike" color="neutral" />
        <StatRow label="OTM" value="Spot > Strike" color="loss" />
      </ConceptCard>
      <Body>
        ATM options have the highest extrinsic value and the highest sensitivity to the Greeks.
        Deep ITM options behave more like stock; deep OTM options are mostly lottery tickets.
      </Body>
    </ConceptSlide>
  )
}

/** Animated theta-decay curve */
function ThetaDecayChart() {
  const strike = 100
  const sigma = 0.30
  const r = 0.05

  const data = useMemo(() => {
    const points = []
    for (let d = 90; d >= 0; d -= 1) {
      const T = d / 365
      const atm = bsPrice('call', { S: strike, K: strike, T, r, sigma })
      const otm = bsPrice('call', { S: strike * 0.9, K: strike, T, r, sigma })
      points.push({ days: d, atm: parseFloat(atm.toFixed(3)), otm: parseFloat(otm.toFixed(3)) })
    }
    return points
  }, [])

  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
          <XAxis dataKey="days" reversed tick={{ fill: '#71717a', fontSize: 10 }}
            label={{ value: 'Days to expiry', position: 'insideBottom', fill: '#52525b', fontSize: 10, offset: -2 }}
            axisLine={{ stroke: '#3f3f46' }} tickLine={false} />
          <YAxis tickFormatter={(v: number) => `$${v.toFixed(1)}`} tick={{ fill: '#71717a', fontSize: 10 }}
            axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
            formatter={(v: unknown, name: unknown) => [`$${Number(v).toFixed(2)}`, name === 'atm' ? 'ATM call' : 'OTM call']}
            labelFormatter={(v: unknown) => `${Number(v)} days left`}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }}
            formatter={(v) => v === 'atm' ? 'ATM call ($100 strike)' : 'OTM call ($90 spot)' } />
          <ReferenceLine x={21} stroke="#52525b" strokeDasharray="3 3" strokeWidth={1}
            label={{ value: '3 weeks', position: 'top', fill: '#52525b', fontSize: 9 }} />
          <Line type="monotone" dataKey="atm" stroke="#38bdf8" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="otm" stroke="#a78bfa" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function Slide2() {
  return (
    <ConceptSlide>
      <Headline>Time Decay (Theta)</Headline>
      <Body>
        Options lose extrinsic value every day — slowly at first, then rapidly in the final weeks.
        This is <GlossTerm term="theta_decay">time decay</GlossTerm>, quantified by the Greek{' '}
        <GlossTerm term="theta">theta</GlossTerm>.
      </Body>
      <ThetaDecayChart />
      <Body>
        Notice how the ATM option (blue) holds value longer, then falls sharply in the final 3
        weeks. OTM options (purple) decay faster in percentage terms.
      </Body>
    </ConceptSlide>
  )
}

/** IV vs HV slider visualization */
function IVSlider() {
  const [iv, setIv] = useState(30)
  const hv = 25 // fixed historical vol
  const strike = 100
  const T = 30 / 365
  const r = 0.05
  const spot = 100

  const price = bsPrice('call', { S: spot, K: strike, T, r, sigma: iv / 100 })
  const hvPrice = bsPrice('call', { S: spot, K: strike, T, r, sigma: hv / 100 })
  const rich = iv > hv

  return (
    <div className="space-y-3 bg-zinc-800/60 rounded-xl p-4">
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Implied Volatility (IV)</span>
          <span className={`font-semibold ${rich ? 'text-orange-400' : 'text-sky-400'}`}>{iv}%</span>
        </div>
        <input type="range" min={5} max={80} step={1} value={iv}
          onChange={(e) => setIv(Number(e.target.value))}
          className="w-full h-1.5 accent-sky-400 cursor-pointer" />
      </div>
      <StatRow label="Historical Volatility (HV)" value={`${hv}%`} color="neutral" />
      <StatRow label="ATM call price at IV" value={`$${price.toFixed(2)}`} color={rich ? 'loss' : 'gain'} />
      <StatRow label="ATM call price at HV" value={`$${hvPrice.toFixed(2)}`} color="neutral" />
      <div className={`text-xs text-center font-semibold rounded-lg py-2 ${rich ? 'text-orange-300 bg-orange-950/40' : 'text-sky-300 bg-sky-950/40'}`}>
        {rich
          ? `IV > HV by ${iv - hv}pp — options appear expensive relative to recent moves`
          : iv === hv
          ? 'IV = HV — options are "fairly priced"'
          : `IV < HV by ${hv - iv}pp — options appear cheap relative to recent moves`
        }
      </div>
    </div>
  )
}

function Slide3() {
  return (
    <ConceptSlide>
      <Headline>IV vs. Historical Volatility</Headline>
      <Body>
        <GlossTerm term="impliedVolatility">Implied Volatility (IV)</GlossTerm> is the market's
        forward guess at how much the stock will move.{' '}
        <GlossTerm term="historicalVolatility">Historical Volatility (HV)</GlossTerm> is how much
        it actually moved in the past.
      </Body>
      <IVSlider />
      <Body>
        Comparing IV to HV is one way traders assess whether options are expensive or cheap — but
        it's not a perfect signal.
      </Body>
    </ConceptSlide>
  )
}

function Slide4() {
  const legs: Leg[] = [
    { type: 'call', side: 'long', strike: 100, premium: 5, qty: 1 }
  ]
  return (
    <ConceptSlide>
      <Headline>Time Value at Different Strikes</Headline>
      <Body>
        ATM options carry the most time value. As you go deeper ITM or further OTM, extrinsic
        value shrinks. The diagram shows a $100 call with $5 premium.
      </Body>
      <PayoffDiagram legs={legs} spotCenter={100} showTimeCurve daysToExpiry={30} />
      <Body>
        The solid line is P/L at expiration. The dashed purple line is approximate P/L with 30
        days remaining — notice the "bump" of time value.
      </Body>
    </ConceptSlide>
  )
}

function Slide5() {
  return (
    <ConceptSlide>
      <Headline>IV Crush</Headline>
      <Body>
        Before a big known event (earnings, FDA decision), IV rises because the market expects a
        large move. After the event, IV collapses — even if the stock moved. This is called{' '}
        <strong className="text-white">IV crush</strong>.
      </Body>
      <ConceptCard title="Historical example: GME, Jan 2021" accent="amber">
        <p>
          IV on GME options surged above 500% during the Jan 2021 short squeeze. Option premiums
          were extraordinarily expensive relative to realized volatility. After the peak, IV
          collapsed rapidly — buyers at the peak faced steep losses from IV crush, even if GME
          continued moving.
        </p>
        <p className="text-zinc-400 text-xs mt-2">
          This example is historical, used for illustration only — not a trading signal.
        </p>
      </ConceptCard>
      <Body>
        Strategies that involve buying options through earnings bear IV-crush risk. Module 9 covers
        this in detail.
      </Body>
    </ConceptSlide>
  )
}

function Slide6() {
  return (
    <ConceptSlide>
      <Headline>Module Summary</Headline>
      <ConceptCard title="Key takeaways" accent="emerald">
        <StatRow label="ITM call" value="Spot > Strike → has intrinsic value" />
        <StatRow label="ATM" value="Highest extrinsic & gamma" />
        <StatRow label="OTM" value="Only extrinsic value (lottery)" />
        <StatRow label="Theta" value="Extrinsic decays — slowly, then fast" />
        <StatRow label="IV vs HV" value="Market's guess vs realized reality" />
      </ConceptCard>
      <Body>
        Next up: the Greeks — the dashboard of metrics that tell you how your position will behave
        as the stock, time, and volatility change.
      </Body>
    </ConceptSlide>
  )
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6]
const MODULE_COLOR = 'bg-emerald-600 hover:bg-emerald-500'
const PROGRESS_COLOR = 'bg-emerald-500'

export function MoneynessTimeModule() {
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
