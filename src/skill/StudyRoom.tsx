import { clusterMeta, skillById } from '../content/skills'
import { lessons } from '../content/lessons'
import { masteryColor, useProgressStore } from '../progress/store'
import { LessonReader } from './LessonReader'
import { QuizView } from './QuizView'
import { RagLab } from './RagLab'

const LAB_SKILLS = new Set(['rag-pipeline'])

export function StudyRoom() {
  const skillId = useProgressStore((s) => s.selectedSkillId)!
  const studyMode = useProgressStore((s) => s.studyMode)
  const setStudyMode = useProgressStore((s) => s.setStudyMode)
  const selectSkill = useProgressStore((s) => s.selectSkill)
  const markLessonComplete = useProgressStore((s) => s.markLessonComplete)
  const mastery = useProgressStore((s) => s.masteryOf(skillId))
  const progress = useProgressStore((s) => s.bySkill[skillId])

  const skill = skillById[skillId]
  const lesson = lessons[skillId]
  const cluster = clusterMeta[skill.cluster]
  const hasLab = LAB_SKILLS.has(skillId)

  return (
    <div className="study-room">
      <header className="study-topbar">
        <button type="button" className="btn btn-ghost" onClick={() => selectSkill(null)}>
          ← Skill map
        </button>

        <div className="study-title-block">
          <span className="cluster-pill" style={{ borderColor: cluster.accent }}>
            {cluster.label}
          </span>
          <h1>{skill.title}</h1>
        </div>

        <div className="study-mode-switch">
          <button
            type="button"
            className={studyMode === 'learn' ? 'mode is-active' : 'mode'}
            onClick={() => setStudyMode('learn')}
          >
            Learn
          </button>
          <button
            type="button"
            className={studyMode === 'quiz' ? 'mode is-active' : 'mode'}
            onClick={() => setStudyMode('quiz')}
          >
            Quiz
          </button>
          {hasLab && (
            <button
              type="button"
              className={studyMode === 'lab' ? 'mode is-active' : 'mode'}
              onClick={() => setStudyMode('lab')}
            >
              Lab
            </button>
          )}
        </div>

        <div className="study-mastery">
          <span
            className="study-mastery-dot"
            style={{ background: masteryColor(mastery) }}
          />
          {Math.round(mastery * 100)}%
          {progress?.quizAttempts ? (
            <span className="muted-inline"> · {progress.quizAttempts}×</span>
          ) : null}
        </div>
      </header>

      <main className={`study-main ${studyMode === 'lab' ? 'study-main-wide' : ''}`}>
        {studyMode === 'learn' && lesson && (
          <LessonReader
            lesson={lesson}
            onFinished={() => markLessonComplete(skillId)}
            onStartQuiz={() => setStudyMode('quiz')}
          />
        )}
        {studyMode === 'learn' && !lesson && (
          <p className="muted">Lesson coming soon.</p>
        )}
        {studyMode === 'quiz' && (
          <QuizView skillId={skillId} onBackToLesson={() => setStudyMode('learn')} />
        )}
        {studyMode === 'lab' && hasLab && <RagLab />}
      </main>
    </div>
  )
}
