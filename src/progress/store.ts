import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SkillProgress, StudyMode } from '../types'

interface ProgressState {
  bySkill: Record<string, SkillProgress>
  selectedSkillId: string | null
  studyMode: StudyMode
  selectSkill: (id: string | null) => void
  setStudyMode: (mode: StudyMode) => void
  markLessonComplete: (skillId: string) => void
  recordQuiz: (skillId: string, scoreRatio: number) => void
  resetAll: () => void
  /** 0–1 from best quiz score only */
  masteryOf: (skillId: string) => number
}

const empty = (): SkillProgress => ({
  quizBest: 0,
  quizAttempts: 0,
  lessonCompleted: false,
  lastVisitedAt: null,
})

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      bySkill: {},
      selectedSkillId: null,
      studyMode: 'learn',

      selectSkill: (id) => {
        set({
          selectedSkillId: id,
          studyMode: 'learn',
        })
        if (id) {
          set((s) => ({
            bySkill: {
              ...s.bySkill,
              [id]: {
                ...(s.bySkill[id] ?? empty()),
                lastVisitedAt: Date.now(),
              },
            },
          }))
        }
      },

      setStudyMode: (mode) => set({ studyMode: mode }),

      markLessonComplete: (skillId) => {
        set((s) => {
          const prev = s.bySkill[skillId] ?? empty()
          return {
            bySkill: {
              ...s.bySkill,
              [skillId]: { ...prev, lessonCompleted: true },
            },
          }
        })
      },

      recordQuiz: (skillId, scoreRatio) => {
        set((s) => {
          const prev = s.bySkill[skillId] ?? empty()
          return {
            bySkill: {
              ...s.bySkill,
              [skillId]: {
                ...prev,
                quizAttempts: prev.quizAttempts + 1,
                quizBest: Math.max(prev.quizBest, scoreRatio),
              },
            },
          }
        })
      },

      resetAll: () =>
        set({ bySkill: {}, selectedSkillId: null, studyMode: 'learn' }),

      masteryOf: (skillId) => get().bySkill[skillId]?.quizBest ?? 0,
    }),
    { name: 'ai-engineer-prep-progress-v1' },
  ),
)

/** Interpolate node color: red → amber → green by quiz mastery */
export function masteryColor(mastery: number): string {
  const t = Math.min(1, Math.max(0, mastery))
  const r = Math.round(220 + (34 - 220) * t)
  const g = Math.round(38 + (197 - 38) * t)
  const b = Math.round(38 + (94 - 38) * t)
  return `rgb(${r}, ${g}, ${b})`
}
