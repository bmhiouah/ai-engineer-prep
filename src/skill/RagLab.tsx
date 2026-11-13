import { useMemo, useState } from 'react'
import {
  diagnoses,
  inferDiagnosis,
  labScenarios,
  runLab,
  type ChunkSize,
  type DiagnosisId,
  type IndexFreshness,
  type LabConfig,
  type TopK,
} from '../content/ragLab'

export function RagLab() {
  const [scenarioId, setScenarioId] = useState(labScenarios[0].id)
  const scenario = labScenarios.find((s) => s.id === scenarioId) ?? labScenarios[0]
  const [config, setConfig] = useState<LabConfig>(scenario.brokenPreset)
  const [diagnosis, setDiagnosis] = useState<DiagnosisId | null>(null)
  const [checked, setChecked] = useState(false)
  const [solved, setSolved] = useState<Record<string, boolean>>({})

  const result = useMemo(() => runLab(scenario, config), [scenario, config])
  const expected = inferDiagnosis(scenario, config)

  function loadScenario(id: string) {
    const next = labScenarios.find((s) => s.id === id) ?? labScenarios[0]
    setScenarioId(next.id)
    setConfig(next.brokenPreset)
    setDiagnosis(null)
    setChecked(false)
  }

  const correct = checked && diagnosis === scenario.correctDiagnosis

  return (
    <div className="lab">
      <header className="lab-hero">
        <p className="lab-kicker">RAG Lab</p>
        <h2>Configure. Break. Diagnose.</h2>
        <p className="lab-lede">
          Tune the system, watch what gets retrieved, then name the failure. No API calls — every
          outcome is simulated from the scenario.
        </p>
      </header>

      <div className="lab-scenarios">
        {labScenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`lab-scenario-chip ${s.id === scenario.id ? 'is-active' : ''} ${solved[s.id] ? 'is-solved' : ''}`}
            onClick={() => loadScenario(s.id)}
          >
            {s.title}
            {solved[s.id] ? ' ✓' : ''}
          </button>
        ))}
      </div>

      <p className="lab-brief">{scenario.brief}</p>
      <p className="lab-question">
        <span>User question</span>
        {scenario.question}
      </p>

      <div className="lab-grid">
        <section className="lab-card">
          <h3>Configuration</h3>
          <label className="lab-field">
            top_k
            <select
              value={config.topK}
              onChange={(e) => {
                setChecked(false)
                setConfig((c) => ({ ...c, topK: Number(e.target.value) as TopK }))
              }}
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </label>
          <label className="lab-field">
            Chunk size
            <select
              value={config.chunkSize}
              onChange={(e) => {
                setChecked(false)
                setConfig((c) => ({ ...c, chunkSize: e.target.value as ChunkSize }))
              }}
            >
              <option value="tiny">Tiny</option>
              <option value="balanced">Balanced</option>
              <option value="huge">Huge</option>
            </select>
          </label>
          <label className="lab-field">
            Index freshness
            <select
              value={config.indexFreshness}
              onChange={(e) => {
                setChecked(false)
                setConfig((c) => ({
                  ...c,
                  indexFreshness: e.target.value as IndexFreshness,
                }))
              }}
            >
              <option value="fresh">Fresh</option>
              <option value="stale">Stale</option>
            </select>
          </label>
          <label className="lab-toggle">
            <input
              type="checkbox"
              checked={config.hybrid}
              onChange={(e) => {
                setChecked(false)
                setConfig((c) => ({ ...c, hybrid: e.target.checked }))
              }}
            />
            Hybrid search (dense + sparse)
          </label>
          <label className="lab-toggle">
            <input
              type="checkbox"
              checked={config.rerank}
              onChange={(e) => {
                setChecked(false)
                setConfig((c) => ({ ...c, rerank: e.target.checked }))
              }}
            />
            Rerank shortlist
          </label>
          <div className="lab-presets">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setConfig(scenario.brokenPreset)
                setChecked(false)
                setDiagnosis(null)
              }}
            >
              Load broken preset
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setConfig(scenario.healthyPreset)
                setChecked(false)
                setDiagnosis(null)
              }}
            >
              Load healthy preset
            </button>
          </div>
        </section>

        <section className="lab-card">
          <h3>Retrieved ({result.retrieved.length})</h3>
          <ul className="lab-docs">
            {result.retrieved.map((d, i) => (
              <li key={d.id}>
                <div className="lab-doc-top">
                  <strong>
                    #{i + 1} {d.title}
                  </strong>
                  <span>{d.year}</span>
                </div>
                <p>{d.preview}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="lab-card lab-card-wide">
          <h3>Model answer</h3>
          <p className={`lab-answer ${result.grounded ? 'is-good' : 'is-bad'}`}>
            {result.answer}
          </p>
          <p className="lab-grounded">
            {result.grounded ? 'Grounded in retrieved evidence' : 'Weak / wrong grounding'}
          </p>
          {result.notes.length > 0 && (
            <ul className="lab-notes">
              {result.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="lab-card lab-diagnose">
        <h3>Your diagnosis</h3>
        <ul className="lab-diagnosis-list">
          {diagnoses.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className={`lab-diagnosis ${diagnosis === d.id ? 'is-selected' : ''}`}
                onClick={() => {
                  setDiagnosis(d.id)
                  setChecked(false)
                }}
              >
                {d.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!diagnosis}
          onClick={() => {
            if (!diagnosis) return
            setChecked(true)
            if (diagnosis === scenario.correctDiagnosis) {
              setSolved((s) => ({ ...s, [scenario.id]: true }))
            }
          }}
        >
          Check diagnosis
        </button>
        {checked && (
          <div className={`lab-feedback ${correct ? 'is-good' : 'is-bad'}`}>
            {correct ? (
              <p>Correct — that is the primary failure mode for this scenario.</p>
            ) : (
              <p>
                Not the primary failure. Hint: with the broken preset, the system still exhibits{' '}
                <em>{diagnoses.find((d) => d.id === scenario.correctDiagnosis)?.label}</em>.
                Simulator signal for your current knobs: {diagnoses.find((d) => d.id === expected)?.label}.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
