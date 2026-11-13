import { clusterMeta, skills } from '../content/skills'
import { SkillGraph } from '../graph/SkillGraph'
import { masteryColor, useProgressStore } from '../progress/store'

/** Book cover: pick what to study. The lesson/quiz is the book itself. */
export function Cover() {
  const bySkill = useProgressStore((s) => s.bySkill)
  const masteryOf = useProgressStore((s) => s.masteryOf)
  const resetAll = useProgressStore((s) => s.resetAll)
  const selectSkill = useProgressStore((s) => s.selectSkill)

  const mastered = skills.filter((s) => masteryOf(s.id) >= 0.67).length
  const attempts = Object.values(bySkill).reduce((a, p) => a + p.quizAttempts, 0)
  const avg =
    skills.reduce((acc, s) => acc + masteryOf(s.id), 0) / Math.max(1, skills.length)

  return (
    <div className="cover">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <strong>SkillForge</strong>
            <span className="brand-sub">AI Engineer prep</span>
          </div>
        </div>
        <div className="topbar-stats">
          <span>{mastered}/{skills.length} mastered</span>
          <span>{Math.round(avg * 100)}% complete</span>
          <span>{attempts} quizzes taken</span>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              if (confirm('Reset all progress?')) resetAll()
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <div className="cover-body">
        <SkillGraph />
        <aside className="cover-aside">
          <p className="eyebrow">SkillForge</p>
          <h2>Your skill map</h2>
          <p className="lede">
            Explore the field. Open a skill to study, then take the quiz. As you score higher, its
            star shifts from red to green.
          </p>
          <ul className="legend">
            <li>
              <span className="dot" style={{ background: masteryColor(0) }} /> Not started
            </li>
            <li>
              <span className="dot" style={{ background: masteryColor(0.5) }} /> In progress
            </li>
            <li>
              <span className="dot" style={{ background: masteryColor(1) }} /> Mastered
            </li>
          </ul>

          <div className="cover-clusters">
            {(Object.keys(clusterMeta) as Array<keyof typeof clusterMeta>).map((id) => {
              const meta = clusterMeta[id]
              const clusterSkills = skills.filter((s) => s.cluster === id)
              return (
                <div key={id} className="dock-group">
                  <span className="dock-label" style={{ color: meta.accent }}>
                    {meta.label}
                  </span>
                  <div className="dock-skills">
                    {clusterSkills.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="dock-chip"
                        onClick={() => selectSkill(s.id)}
                        style={{
                          boxShadow: `inset 3px 0 0 ${masteryColor(masteryOf(s.id))}`,
                        }}
                      >
                        {s.title}
                        <span className="chip-pct">{Math.round(masteryOf(s.id) * 100)}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
