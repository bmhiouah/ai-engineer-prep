import { useEffect, useMemo, useState } from 'react'
import { quizzes } from '../content/quizzes'
import { masteryColor, useProgressStore } from '../progress/store'

interface Props {
  skillId: string
  onBackToLesson: () => void
}

export function QuizView({ skillId, onBackToLesson }: Props) {
  const quiz = quizzes[skillId]
  const recordQuiz = useProgressStore((s) => s.recordQuiz)
  const quizBest = useProgressStore((s) => s.bySkill[skillId]?.quizBest ?? 0)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setIndex(0)
    setPicked(null)
    setCorrectCount(0)
    setDone(false)
    setStreak(0)
  }, [skillId])

  const question = quiz?.questions[index]
  const total = quiz?.questions.length ?? 0
  const scoreRatio = useMemo(
    () => (total === 0 ? 0 : correctCount / total),
    [correctCount, total],
  )

  if (!quiz || !question) {
    return <p className="muted">Quiz coming soon for this skill.</p>
  }

  if (done) {
    const pct = Math.round(scoreRatio * 100)
    const bestPct = Math.round(Math.max(quizBest, scoreRatio) * 100)
    const passed = scoreRatio >= 0.67
    return (
      <div className="quiz-shell">
        <div className="quiz-result-card">
          <p className="quiz-kicker">{passed ? 'Well done' : 'Almost there'}</p>
          <h2 style={{ color: masteryColor(scoreRatio) }}>{pct}%</h2>
          <p>
            <strong>{correctCount}</strong> of {total} correct
          </p>
          <p className="muted">
            Personal best: <strong>{bestPct}%</strong>
          </p>
          <div className="quiz-result-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setIndex(0)
                setPicked(null)
                setCorrectCount(0)
                setDone(false)
                setStreak(0)
              }}
            >
              Retry quiz
            </button>
            <button type="button" className="btn btn-ghost" onClick={onBackToLesson}>
              Re-read lesson
            </button>
          </div>
        </div>
      </div>
    )
  }

  const revealed = picked !== null
  const bar = ((index + (revealed ? 1 : 0)) / total) * 100

  return (
    <div className="quiz-shell">
      <div className="quiz-top">
        <div className="quiz-bar" aria-hidden>
          <div className="quiz-bar-fill" style={{ width: `${bar}%` }} />
        </div>
        <div className="quiz-top-meta">
          <span>
            Question {index + 1} / {total}
          </span>
          {streak > 1 && <span className="streak">Streak ×{streak}</span>}
        </div>
      </div>

      <div className="quiz-card">
        <h2 className="quiz-prompt">{question.prompt}</h2>
        <ul className="quiz-choices">
          {question.choices.map((choice, i) => {
            let state = ''
            if (revealed && i === question.answer) state = 'is-correct'
            else if (revealed && i === picked && i !== question.answer) state = 'is-wrong'
            return (
              <li key={choice}>
                <button
                  type="button"
                  className={`quiz-choice ${state}`}
                  disabled={revealed}
                  onClick={() => setPicked(i)}
                >
                  <span className="quiz-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{choice}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {revealed && (
          <div className="quiz-explain">
            <p className={picked === question.answer ? 'ok' : 'bad'}>
              {picked === question.answer ? 'Correct.' : 'Not quite.'}
            </p>
            <p>{question.explanation}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const isCorrect = picked === question.answer
                const nextCorrect = isCorrect ? correctCount + 1 : correctCount
                const nextStreak = isCorrect ? streak + 1 : 0
                if (index + 1 >= total) {
                  recordQuiz(skillId, nextCorrect / total)
                  setCorrectCount(nextCorrect)
                  setStreak(nextStreak)
                  setDone(true)
                } else {
                  setCorrectCount(nextCorrect)
                  setStreak(nextStreak)
                  setIndex((v) => v + 1)
                  setPicked(null)
                }
              }}
            >
              {index + 1 >= total ? 'See results' : 'Next question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
