import { useState } from 'react'
import { cn } from '@/lib/cn'
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

export interface QuizChoice {
  label: string
  correct: boolean
  explanation: string
}

export interface QuizQuestion {
  id: string
  scenario: string
  question: string
  choices: QuizChoice[]
  solution: string[]  // step-by-step solution lines
}

interface ScenarioQuizProps {
  question: QuizQuestion
  onCorrect?: () => void
}

export function ScenarioQuiz({ question, onCorrect }: ScenarioQuizProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const answered = selected !== null
  const isCorrect = answered && question.choices[selected].correct

  function handleSelect(i: number) {
    if (answered) return
    setSelected(i)
    if (question.choices[i].correct) onCorrect?.()
  }

  return (
    <div className="space-y-4">
      {/* Scenario */}
      <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/60">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Scenario</div>
        <p className="text-zinc-200 text-sm leading-relaxed">{question.scenario}</p>
      </div>

      {/* Question */}
      <p className="text-white font-semibold text-base">{question.question}</p>

      {/* Choices */}
      <div className="space-y-2">
        {question.choices.map((choice, i) => {
          const isSelected = selected === i
          const revealed = answered
          const correct = choice.correct

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(
                'w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors',
                !revealed && 'border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white',
                revealed && correct && 'border-sky-600 bg-sky-950/40 text-sky-200',
                revealed && !correct && isSelected && 'border-orange-600 bg-orange-950/40 text-orange-200',
                revealed && !correct && !isSelected && 'border-zinc-800 text-zinc-500',
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  !revealed && 'border-zinc-600',
                  revealed && correct && 'border-sky-500',
                  revealed && !correct && isSelected && 'border-orange-500',
                  revealed && !correct && !isSelected && 'border-zinc-700',
                )}>
                  {revealed && correct && <CheckCircle size={12} className="text-sky-400" />}
                  {revealed && !correct && isSelected && <XCircle size={12} className="text-orange-400" />}
                </div>
                <div className="flex-1">
                  <span>{choice.label}</span>
                  {revealed && isSelected && (
                    <p className="mt-1 text-xs opacity-80">{choice.explanation}</p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Result banner */}
      {answered && (
        <div className={cn(
          'rounded-xl p-3 text-sm font-semibold text-center',
          isCorrect ? 'bg-sky-950/60 text-sky-300 border border-sky-800' : 'bg-orange-950/60 text-orange-300 border border-orange-800'
        )}>
          {isCorrect ? '✓ Correct!' : '✗ Not quite — see the correct answer above'}
        </div>
      )}

      {/* Step-by-step solution */}
      {answered && (
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {showSolution ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          Step-by-step solution
        </button>
      )}

      {showSolution && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-2">
          {question.solution.map((line, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="text-zinc-500 tabular-nums flex-shrink-0">{i + 1}.</span>
              <span className="text-zinc-300" dangerouslySetInnerHTML={{ __html: line }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
