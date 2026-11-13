import { useEffect, useState } from 'react'
import type { Lesson } from '../types'
import { ConceptViz } from './ConceptViz'

interface Props {
  lesson: Lesson
  onFinished: () => void
  onStartQuiz: () => void
}

export function LessonReader({ lesson, onFinished, onStartQuiz }: Props) {
  const [step, setStep] = useState(0)
  const [warmupOpen, setWarmupOpen] = useState(false)
  const totalSteps = lesson.sections.length + 1 // + takeaways
  const isTakeaways = step >= lesson.sections.length
  const section = !isTakeaways ? lesson.sections[step] : null
  const progress = ((step + 1) / totalSteps) * 100

  useEffect(() => {
    setStep(0)
    setWarmupOpen(false)
  }, [lesson.skillId])

  return (
    <div className="reader">
      <div className="reader-progress" aria-hidden>
        <div className="reader-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="reader-meta">
        Section {Math.min(step + 1, totalSteps)} of {totalSteps} · ~{lesson.readingMinutes} min read
      </p>

      {step === 0 && (
        <header className="reader-opener">
          <p className="reader-summary">{lesson.summary}</p>
          {lesson.viz && <ConceptViz kind={lesson.viz} />}
        </header>
      )}

      {!isTakeaways && section && (
        <article className="reader-section" key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
          {section.example && (
            <div className="callout callout-example">
              <strong>{section.example.title}</strong>
              <p>{section.example.text}</p>
            </div>
          )}
          {section.callout && (
            <div className={`callout callout-${section.callout.tone}`}>
              <span className="callout-label">
                {section.callout.tone === 'tip' && 'Tip'}
                {section.callout.tone === 'pitfall' && 'Pitfall'}
                {section.callout.tone === 'interview' && 'Interview angle'}
              </span>
              <p>{section.callout.text}</p>
            </div>
          )}
        </article>
      )}

      {isTakeaways && (
        <article className="reader-section">
          <h2>Key takeaways</h2>
          <ul className="takeaway-list">
            {lesson.keyTakeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          {lesson.warmup && (
            <div className="warmup">
              <h3>Check your understanding</h3>
              <p className="warmup-q">{lesson.warmup.prompt}</p>
              {!warmupOpen ? (
                <button type="button" className="btn btn-ghost" onClick={() => setWarmupOpen(true)}>
                  Show answer
                </button>
              ) : (
                <p className="warmup-a">{lesson.warmup.answer}</p>
              )}
            </div>
          )}

          <div className="reader-finish">
            <p>Ready to lock it in?</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onFinished()
                onStartQuiz()
              }}
            >
              Take the quiz →
            </button>
          </div>
        </article>
      )}

      <nav className="reader-nav">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          ← Back
        </button>
        {!isTakeaways ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setStep((s) => s + 1)}
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              onFinished()
              onStartQuiz()
            }}
          >
            Skip to quiz
          </button>
        )}
      </nav>
    </div>
  )
}
