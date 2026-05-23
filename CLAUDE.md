# Stanvengers — CLAUDE.md

Primary reference for AI assistants working in this repository. Update when the project changes significantly.

## Project

**OptionsLab** — a mobile-first web app teaching stock options from zero, using interactive payoff diagrams, Greek sandboxes, scenario quizzes, and a paper-trading sandbox. No real money. No trade recommendations.

- **Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, Recharts, Zustand, Radix UI, Vitest
- **GitHub:** `stanboy168/Stanvengers`
- **Dev branch convention:** `claude/<slug>` for AI-driven changes, `feature/<slug>` for human-driven

---

## Commands

```bash
npm run dev        # start dev server
npm run build      # production build (runs tsc + vite build)
npm test           # run all unit tests (vitest run)
npm run test:watch # vitest watch mode
```

---

## Repository Layout

```
src/
├── lib/options/           Pure math — NO React deps, fully unit-tested
│   ├── math.ts            normalCDF, normalPDF
│   ├── blackScholes.ts    bsPrice(), bsGreeks()
│   ├── payoff.ts          payoffAtExpiry(), buildPayoffCurve(), strategyStats()
│   └── __tests__/         Vitest unit tests
│
├── components/
│   ├── cards/             ConceptCard, ConceptSlide, Headline, Body, StatRow
│   ├── diagrams/          PayoffDiagram (Recharts), DiagramControls, GreekSandbox
│   ├── glossary/          GlossaryModal, GlossTerm (tap-to-define)
│   ├── layout/            Navigation (bottom tab bar), Disclaimer (top banner)
│   └── quiz/              ScenarioQuiz (multiple choice + step solution)
│
├── modules/               One directory per curriculum module
│   ├── 1-foundations/     ✅ Fully built (8 slides)
│   ├── 2-basic-positions/ ✅ Fully built (8 slides + interactive diagrams)
│   ├── 3-moneyness-time/  ✅ Fully built (7 slides + animated charts)
│   ├── 4-greeks/          ✅ Fully built (6 slides + live Greek sandbox)
│   └── 5-9-*/             🚧 Stubbed — component exists, needs curriculum content
│
├── pages/                 Route components: Home, Modules, ModuleDetail, GreekSandbox, Sandbox
├── store/                 Zustand: useProgressStore (localStorage), useGlossaryStore
└── data/                  glossary.ts, modules.ts (metadata), quizzes.ts
```

---

## Development Workflow

1. Always develop on a dedicated branch — never commit directly to `main`.
2. Use clear, descriptive commit messages that explain *why* a change was made.
3. Push using `git push -u origin <branch-name>`.
4. Open a pull request for review before merging to `main`.
5. Do not create a pull request unless the user explicitly asks for one.

### Commit message format

```
<type>: <short summary>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## AI Assistant Guidelines

- **Read this file first** before making changes.
- **Do not push to `main`** without explicit user approval.
- **Do not create pull requests** unless explicitly asked.
- **Prefer editing existing files** over creating new ones.
- **Do not add comments** unless the reasoning is non-obvious.
- **Do not add speculative error handling** for scenarios that cannot happen.
- **Keep changes minimal** — implement only what was requested.
- **Run `npm test` and `npm run build`** before pushing any code changes.
- When adding a module: follow the pattern in `1-foundations/FoundationsModule.tsx` exactly.

---

## How to Add a Module (quick reference)

1. Replace the stub in `src/modules/<N>-<slug>/<Component>.tsx` with slide components.
2. Add quiz questions to `src/data/quizzes.ts` under the module's key.
3. Add new glossary terms to `src/data/glossary.ts`.
4. Set `complete: true` in `src/data/modules.ts`.
5. The module is already wired in `src/pages/ModuleDetailPage.tsx` — no routing changes needed.
6. Add math unit tests if you introduce new formulas.

See README.md for full details.

---

## Content Rules (Non-Negotiable)

- **Never recommend a trade, strategy, or ticker.** Use "traders sometimes use…"
- **Show max loss prominently before max profit** — `PayoffDiagram` handles this automatically.
- **Disclaimer is always visible** — do not remove it from `App.tsx`.
- **Use only historical examples** (e.g., "GME Jan 2021") — not live tickers.
- **All option math must have unit tests** — verified against Hull 10e examples and finite-difference checks.

---

## Color Palette (Color-Blind Safe)

Never use pure red/green (inaccessible for red-green color blindness).

| Meaning | Color | Class |
|---------|-------|-------|
| Gain / profit | Sky blue | `text-sky-400` / `#38bdf8` |
| Loss / risk | Orange-red | `text-orange-400` / `#fb923c` |
| T-day curve | Violet | `text-violet-400` / `#a78bfa` |
| Neutral | Zinc | `text-zinc-300` |

---

## Key Invariants

- `src/lib/options/` has zero React imports — keeps math testable in isolation.
- Progress is stored in `localStorage` only — no backend, no auth required.
- The 100-share multiplier is applied in `payoff.ts`, not in components.
- All P/L figures shown to users already include the multiplier.
