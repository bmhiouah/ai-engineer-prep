interface Props {
  kind: 'rag-pipeline' | 'agent-loop' | 'embedding-space'
}

export function ConceptViz({ kind }: Props) {
  if (kind === 'rag-pipeline') {
    return (
      <div className="viz" aria-label="RAG pipeline diagram">
        <div className="viz-flow">
          {['Docs', 'Chunk', 'Embed', 'Index', 'Retrieve', 'Rerank', 'Generate'].map(
            (step, i) => (
              <div key={step} className="viz-step-wrap">
                <div className="viz-step">{step}</div>
                {i < 6 && <span className="viz-arrow">→</span>}
              </div>
            ),
          )}
        </div>
        <p className="viz-caption">
          Diagnose left-to-right: a wrong answer often starts at chunk or retrieve, not generate.
        </p>
      </div>
    )
  }

  if (kind === 'agent-loop') {
    return (
      <div className="viz" aria-label="Agent loop diagram">
        <div className="viz-loop">
          <div className="viz-step">Reason</div>
          <span className="viz-arrow">→</span>
          <div className="viz-step">Tool</div>
          <span className="viz-arrow">→</span>
          <div className="viz-step">Observe</div>
          <span className="viz-arrow">↻</span>
          <div className="viz-step viz-step-accent">Stop / Answer</div>
        </div>
        <p className="viz-caption">
          Budgets and stop rules keep the loop from becoming an infinite cost machine.
        </p>
      </div>
    )
  }

  return (
    <div className="viz" aria-label="Embedding space sketch">
      <svg viewBox="0 0 320 120" className="viz-svg" role="img">
        <title>Nearby points share meaning</title>
        <rect width="320" height="120" rx="12" fill="#14241e" />
        <circle cx="70" cy="55" r="10" fill="#e11d48" opacity="0.85" />
        <circle cx="95" cy="40" r="8" fill="#f97316" opacity="0.9" />
        <circle cx="100" cy="70" r="7" fill="#fb923c" opacity="0.85" />
        <text x="55" y="100" fill="#a8c4b6" fontSize="11" fontFamily="Sora, sans-serif">
          “refund policy”
        </text>
        <circle cx="230" cy="45" r="9" fill="#22c55e" opacity="0.9" />
        <circle cx="250" cy="65" r="7" fill="#4ade80" opacity="0.85" />
        <text x="200" y="100" fill="#a8c4b6" fontSize="11" fontFamily="Sora, sans-serif">
          “return window”
        </text>
        <path
          d="M110 55 C150 20, 180 20, 220 48"
          stroke="#6a8578"
          strokeDasharray="4 3"
          fill="none"
        />
      </svg>
      <p className="viz-caption">
        Similar meaning → nearby vectors. Same embedding model for queries and docs.
      </p>
    </div>
  )
}
