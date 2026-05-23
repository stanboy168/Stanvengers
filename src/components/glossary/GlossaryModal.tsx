import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useGlossaryStore } from '@/store/useGlossaryStore'
import { GLOSSARY } from '@/data/glossary'

export function GlossaryModal() {
  const { openTerm, closeGlossary } = useGlossaryStore()
  const entry = openTerm ? GLOSSARY[openTerm] : null

  return (
    <Dialog.Root open={!!openTerm} onOpenChange={(open) => !open && closeGlossary()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 animate-in fade-in" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-700 rounded-t-2xl p-6 max-w-lg mx-auto animate-in slide-in-from-bottom">
          <div className="flex items-start justify-between mb-3">
            <Dialog.Title className="text-lg font-semibold text-white">
              {entry?.term ?? 'Definition'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-zinc-400 hover:text-white p-1 -mr-1">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-zinc-300 text-sm leading-relaxed">
            {entry?.definition ?? 'Term not found.'}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Inline span that opens the glossary when tapped. */
export function GlossTerm({ term, children }: { term: string; children: React.ReactNode }) {
  const openGlossary = useGlossaryStore((s) => s.openGlossary)
  return (
    <button
      onClick={() => openGlossary(term)}
      className="underline decoration-dotted decoration-sky-400 text-sky-300 hover:text-sky-200 cursor-pointer font-medium"
    >
      {children}
    </button>
  )
}
