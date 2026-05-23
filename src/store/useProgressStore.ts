import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ModuleProgress {
  moduleId: string
  completed: boolean
  completedAt?: number
  quizScores: number[]
}

interface ProgressState {
  modules: Record<string, ModuleProgress>
  streak: number
  lastActiveDate: string | null
  completeModule: (moduleId: string) => void
  recordQuizScore: (moduleId: string, score: number) => void
  getModuleProgress: (moduleId: string) => ModuleProgress
}

const defaultProgress = (moduleId: string): ModuleProgress => ({
  moduleId,
  completed: false,
  quizScores: [],
})

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      modules: {},
      streak: 0,
      lastActiveDate: null,

      completeModule: (moduleId) => {
        const today = new Date().toISOString().slice(0, 10)
        set((state) => {
          const existing = state.modules[moduleId] ?? defaultProgress(moduleId)
          const lastDate = state.lastActiveDate
          const isConsecutive =
            lastDate !== null &&
            new Date(today).getTime() - new Date(lastDate).getTime() <= 86400000
          return {
            modules: {
              ...state.modules,
              [moduleId]: { ...existing, completed: true, completedAt: Date.now() },
            },
            streak: lastDate === today ? state.streak : isConsecutive ? state.streak + 1 : 1,
            lastActiveDate: today,
          }
        })
      },

      recordQuizScore: (moduleId, score) => {
        set((state) => {
          const existing = state.modules[moduleId] ?? defaultProgress(moduleId)
          return {
            modules: {
              ...state.modules,
              [moduleId]: { ...existing, quizScores: [...existing.quizScores, score] },
            },
          }
        })
      },

      getModuleProgress: (moduleId) => {
        return get().modules[moduleId] ?? defaultProgress(moduleId)
      },
    }),
    { name: 'options-lab-progress' }
  )
)
