import { create } from 'zustand'

interface GlossaryState {
  openTerm: string | null
  openGlossary: (term: string) => void
  closeGlossary: () => void
}

export const useGlossaryStore = create<GlossaryState>()((set) => ({
  openTerm: null,
  openGlossary: (term) => set({ openTerm: term }),
  closeGlossary: () => set({ openTerm: null }),
}))
