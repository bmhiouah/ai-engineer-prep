export type ClusterId = 'foundations' | 'rag' | 'agents'

export interface Skill {
  id: string
  title: string
  cluster: ClusterId
  short: string
  position: [number, number, number]
  links?: string[]
}

export type CalloutTone = 'tip' | 'pitfall' | 'interview'

export interface LessonSection {
  heading: string
  body: string
  callout?: { tone: CalloutTone; text: string }
  example?: { title: string; text: string }
}

export interface Lesson {
  skillId: string
  summary: string
  readingMinutes: number
  sections: LessonSection[]
  keyTakeaways: string[]
  viz?: 'rag-pipeline' | 'agent-loop' | 'embedding-space'
  /** Quick self-check before the graded quiz */
  warmup?: { prompt: string; answer: string }
}

export interface QuizQuestion {
  id: string
  prompt: string
  choices: string[]
  answer: number
  explanation: string
}

export interface Quiz {
  skillId: string
  questions: QuizQuestion[]
}

export interface SkillProgress {
  quizBest: number
  quizAttempts: number
  lessonCompleted: boolean
  lastVisitedAt: number | null
}

export type StudyMode = 'learn' | 'quiz' | 'lab'
