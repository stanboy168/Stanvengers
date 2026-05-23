import { GreekSandbox } from '@/components/diagrams/GreekSandbox'

export function GreekSandboxPage() {
  return (
    <div className="px-4 py-5 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Greek Sandbox</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Adjust any input and see how all five Greeks and the option price respond.
        </p>
      </div>
      <GreekSandbox />
    </div>
  )
}
