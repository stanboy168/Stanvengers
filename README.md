# OptionsLab

A guided, simulator-based course that turns options theory into intuition through interactive payoff diagrams, scenario quizzes, and a paper-trading sandbox.

**Target user:** Adult retail investor who has a brokerage account but has never traded options. Sessions of 5–15 minutes on a phone.

**Content rules:** Educational only. No trade recommendations. All math is unit-tested.

---

## Getting Started

```bash
npm install
npm run dev        # development server
npm run build      # production build
npm test           # run all math unit tests
npm run test:watch # watch mode
```

---

## Curriculum Order

The course is designed to be taken in sequence. Each module builds on the previous one.

| # | Module | Status | Key Topics |
|---|--------|--------|------------|
| 1 | Foundations | ✅ Full | Contracts, 100-multiplier, strike, expiration, premium, intrinsic/extrinsic, American/European, assignment |
| 2 | The Four Positions | ✅ Full | Long/short call/put, interactive payoff diagrams, closing vs. exercising |
| 3 | Moneyness & Time | ✅ Full | ITM/ATM/OTM, theta decay curve, IV vs. HV, IV crush |
| 4 | The Greeks | ✅ Full | Delta, gamma, theta, vega, rho — with interactive Greek sandbox |
| 5 | Pricing Intuition | 🚧 Stub | Black-Scholes inputs → output, no derivations |
| 6 | Defined-Risk Strategies | 🚧 Stub | Vertical spreads, iron condor, iron butterfly |
| 7 | Undefined-Risk Strategies | 🚧 Stub | Naked calls/puts, straddles, strangles, margin risk |
| 8 | Trading Mechanics | 🚧 Stub | Order types, fills, expiration, PDT, taxes |
| 9 | Account-Blowing Mistakes | 🚧 Stub | Earnings IV crush, pin risk, dividend assignment, illiquid contracts |

---

## Architecture

```
src/
├── lib/
│   └── options/           Pure math — no React dependencies
│       ├── math.ts        normalCDF, normalPDF
│       ├── blackScholes.ts  bsPrice(), bsGreeks()
│       ├── payoff.ts      payoffAtExpiry(), buildPayoffCurve(), strategyStats()
│       └── __tests__/     Unit tests (Vitest)
│
├── components/
│   ├── cards/             ConceptCard, ConceptSlide, Headline, Body, StatRow
│   ├── diagrams/          PayoffDiagram, DiagramControls, GreekSandbox
│   ├── glossary/          GlossaryModal, GlossTerm
│   ├── layout/            Navigation, Disclaimer
│   └── quiz/              ScenarioQuiz
│
├── modules/
│   ├── 1-foundations/     FoundationsModule.tsx
│   ├── 2-basic-positions/ BasicPositionsModule.tsx
│   ├── 3-moneyness-time/  MoneynessTimeModule.tsx
│   ├── 4-greeks/          GreeksModule.tsx
│   └── 5-9-*/             Stubs — same pattern, needs content
│
├── pages/                 Route-level components (one per URL)
├── store/                 Zustand stores (progress, glossary)
└── data/                  Static content (modules metadata, glossary terms, quizzes)
```

---

## How to Add a New Module

1. **Create the directory and component:**

   ```bash
   mkdir -p src/modules/5-pricing
   touch src/modules/5-pricing/PricingModule.tsx
   ```

2. **Write slides** — each slide is a React component using `ConceptSlide`, `Headline`, `Body`, `ConceptCard`. One concept per slide. Aim for 60–120 words of text. Add a diagram if you can.

   ```tsx
   function Slide0() {
     return (
       <ConceptSlide>
         <Headline>Black-Scholes: The Black Box</Headline>
         <Body>Five inputs go in, a price comes out...</Body>
         <ConceptCard title="Inputs" accent="rose">
           <StatRow label="Spot price (S)" value="Where the stock is now" />
         </ConceptCard>
       </ConceptSlide>
     )
   }
   ```

3. **Add quiz questions** to `src/data/quizzes.ts` under the module's key. Each question needs:
   - `scenario`: the setup (real but historical example or hypothetical)
   - `question`: one clear question
   - 4 choices with `correct: true/false` and `explanation`
   - `solution`: array of step-by-step HTML strings

4. **Register glossary terms** in `src/data/glossary.ts` for any bolded terms. Use `<GlossTerm term="yourKey">word</GlossTerm>` inline.

5. **Update modules metadata** in `src/data/modules.ts` — set `complete: true`, update `cardCount` and `estimatedMinutes`.

6. **Wire the module** in `src/pages/ModuleDetailPage.tsx` — import the component and add it to `COMPONENT_MAP`.

7. **Write tests** for any new math in `src/lib/options/__tests__/`.

---

## Content Rules (Non-Negotiable)

- **Never recommend a trade, strategy, or ticker.** Use "traders sometimes use…", not "you should…"
- **Show max loss before max profit** — `PayoffDiagram` does this automatically
- **The disclaimer is always visible** — `Disclaimer` component is mounted in `App.tsx`
- **Use historical examples** (e.g., "GME Jan 2021") not live tickers
- **Math must be correct** — add unit tests for any new formula

---

## Color Palette (Color-Blind Safe)

| Meaning | Color | Tailwind class |
|---------|-------|---------------|
| Gain / profit | Sky blue | `text-sky-400`, `bg-sky-950` |
| Loss / risk | Orange-red | `text-orange-400`, `bg-orange-950` |
| Time curve | Violet | `text-violet-400` |
| Neutral | Zinc | `text-zinc-300` |

Do not use pure red/green — inaccessible for red-green color blindness.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI |
| Vite | Bundler |
| Tailwind CSS v4 | Styling |
| Recharts | Payoff and decay charts |
| Zustand + persist | Progress tracking (localStorage) |
| Radix UI | Accessible dialog, slider |
| Vitest | Math unit tests |
| react-router-dom | Client-side routing |

---

## Out of Scope (v1)

- Live market data
- Real brokerage connections
- Social or leaderboard features
- Crypto options, futures options
- Real-money anything
