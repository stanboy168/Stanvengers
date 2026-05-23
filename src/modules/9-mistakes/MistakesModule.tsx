import { ConceptSlide, Headline, Body, ConceptCard } from '@/components/cards/ConceptCard'

export function MistakesModule() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ConceptSlide>
          <Headline>Account-Blowing Mistakes</Headline>
          <Body>What traders learn the hard way — coming soon.</Body>
          <ConceptCard title="This module is under construction" accent="amber">
            <p>
              Full content for this module is planned. The math library, payoff diagrams, and
              quiz infrastructure are all ready — only the curriculum cards need to be written.
            </p>
            <p className="mt-2 text-zinc-400 text-xs">
              See CLAUDE.md for instructions on adding a new module.
            </p>
          </ConceptCard>
          <Body>
            Topics that will be covered here include interactive diagrams and scenario quizzes
            consistent with the rest of the course.
          </Body>
        </ConceptSlide>
      </div>
    </div>
  )
}
