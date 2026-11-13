export type TopK = 1 | 3 | 5
export type ChunkSize = 'tiny' | 'balanced' | 'huge'
export type IndexFreshness = 'fresh' | 'stale'

export interface LabConfig {
  topK: TopK
  hybrid: boolean
  rerank: boolean
  chunkSize: ChunkSize
  indexFreshness: IndexFreshness
}

export type DiagnosisId =
  | 'stale-index'
  | 'too-small-k'
  | 'noisy-context'
  | 'dense-misses-id'
  | 'healthy'

export interface LabDoc {
  id: string
  title: string
  year: number
  hasExactId: boolean
  relevance: number
  preview: string
}

export interface LabScenario {
  id: string
  title: string
  brief: string
  question: string
  /** Config that reproduces the failure when left as-is */
  brokenPreset: LabConfig
  /** A config that recovers a healthy path */
  healthyPreset: LabConfig
  correctDiagnosis: DiagnosisId
  docs: LabDoc[]
}

export interface LabRunResult {
  retrieved: LabDoc[]
  answer: string
  grounded: boolean
  notes: string[]
}

export const diagnoses: { id: DiagnosisId; label: string }[] = [
  { id: 'stale-index', label: 'Stale index — outdated documents retrieved' },
  { id: 'too-small-k', label: 'top_k too small — gold passage never entered the pool' },
  { id: 'noisy-context', label: 'Noisy / oversized context — signal drowned in junk chunks' },
  { id: 'dense-misses-id', label: 'Dense-only miss — exact ID needs sparse/hybrid' },
  { id: 'healthy', label: 'Setup looks healthy for this question' },
]

export const labScenarios: LabScenario[] = [
  {
    id: 'stale-policy',
    title: 'Stale refund policy',
    brief: 'Users ask about the 2025 refund window. The index still favors an old PDF.',
    question: 'How many days do I have to request a refund in 2025?',
    brokenPreset: {
      topK: 3,
      hybrid: true,
      rerank: false,
      chunkSize: 'balanced',
      indexFreshness: 'stale',
    },
    healthyPreset: {
      topK: 3,
      hybrid: true,
      rerank: true,
      chunkSize: 'balanced',
      indexFreshness: 'fresh',
    },
    correctDiagnosis: 'stale-index',
    docs: [
      {
        id: 'pol-2023',
        title: 'Refund Policy 2023',
        year: 2023,
        hasExactId: false,
        relevance: 0.82,
        preview: 'Customers may request a refund within 14 days of purchase…',
      },
      {
        id: 'pol-2025',
        title: 'Refund Policy 2025',
        year: 2025,
        hasExactId: false,
        relevance: 0.88,
        preview: 'Customers may request a refund within 30 days of purchase…',
      },
      {
        id: 'shipping',
        title: 'Shipping FAQ',
        year: 2024,
        hasExactId: false,
        relevance: 0.35,
        preview: 'Standard shipping takes 3–5 business days…',
      },
      {
        id: 'returns-blog',
        title: 'Returns blog (marketing)',
        year: 2022,
        hasExactId: false,
        relevance: 0.4,
        preview: 'We love happy customers! Returns are easy…',
      },
    ],
  },
  {
    id: 'topk-starvation',
    title: 'top_k starvation',
    brief: 'The gold passage ranks #3, but production runs with top_k = 1.',
    question: 'What is the SLA for priority support tickets?',
    brokenPreset: {
      topK: 1,
      hybrid: true,
      rerank: false,
      chunkSize: 'balanced',
      indexFreshness: 'fresh',
    },
    healthyPreset: {
      topK: 5,
      hybrid: true,
      rerank: true,
      chunkSize: 'balanced',
      indexFreshness: 'fresh',
    },
    correctDiagnosis: 'too-small-k',
    docs: [
      {
        id: 'marketing-sla',
        title: 'Marketing one-pager',
        year: 2025,
        hasExactId: false,
        relevance: 0.91,
        preview: 'We care deeply about support quality…',
      },
      {
        id: 'generic-support',
        title: 'Support overview',
        year: 2024,
        hasExactId: false,
        relevance: 0.72,
        preview: 'Reach us by email or chat during business hours…',
      },
      {
        id: 'sla-gold',
        title: 'Priority Support SLA',
        year: 2025,
        hasExactId: false,
        relevance: 0.7,
        preview: 'Priority tickets receive a first response within 4 business hours…',
      },
      {
        id: 'office-hours',
        title: 'Office locations',
        year: 2023,
        hasExactId: false,
        relevance: 0.2,
        preview: 'Paris HQ opens at 9:00 CET…',
      },
    ],
  },
  {
    id: 'exact-error-id',
    title: 'Exact error code',
    brief: 'Dense search paraphrases “timeout”; the user needs ERR-4412.',
    question: 'What does ERR-4412 mean and how do I fix it?',
    brokenPreset: {
      topK: 3,
      hybrid: false,
      rerank: false,
      chunkSize: 'balanced',
      indexFreshness: 'fresh',
    },
    healthyPreset: {
      topK: 3,
      hybrid: true,
      rerank: true,
      chunkSize: 'balanced',
      indexFreshness: 'fresh',
    },
    correctDiagnosis: 'dense-misses-id',
    docs: [
      {
        id: 'timeout-generic',
        title: 'Troubleshooting timeouts',
        year: 2024,
        hasExactId: false,
        relevance: 0.86,
        preview: 'Timeouts often mean the upstream service is slow. Retry with backoff…',
      },
      {
        id: 'err-4412',
        title: 'Error catalog · ERR-4412',
        year: 2025,
        hasExactId: true,
        relevance: 0.55,
        preview: 'ERR-4412: auth token expired mid-request. Refresh the token, then retry once…',
      },
      {
        id: 'network',
        title: 'Network checklist',
        year: 2023,
        hasExactId: false,
        relevance: 0.5,
        preview: 'Check DNS, proxies, and TLS certificates…',
      },
      {
        id: 'err-9901',
        title: 'Error catalog · ERR-9901',
        year: 2025,
        hasExactId: true,
        relevance: 0.3,
        preview: 'ERR-9901: quota exceeded…',
      },
    ],
  },
  {
    id: 'huge-chunks',
    title: 'Huge noisy chunks',
    brief: 'Oversized chunks pull whole manuals into the prompt; the model invents a blend.',
    question: 'What is the max file upload size for the free plan?',
    brokenPreset: {
      topK: 5,
      hybrid: true,
      rerank: false,
      chunkSize: 'huge',
      indexFreshness: 'fresh',
    },
    healthyPreset: {
      topK: 3,
      hybrid: true,
      rerank: true,
      chunkSize: 'balanced',
      indexFreshness: 'fresh',
    },
    correctDiagnosis: 'noisy-context',
    docs: [
      {
        id: 'pricing-blob',
        title: 'Pricing + limits mega-section',
        year: 2025,
        hasExactId: false,
        relevance: 0.8,
        preview:
          '…enterprise SSO… free plan upload limit is 25MB … also see GDPR appendix … GPU pricing …',
      },
      {
        id: 'security',
        title: 'Security whitepaper (long)',
        year: 2024,
        hasExactId: false,
        relevance: 0.45,
        preview: 'Encryption at rest, SOC2, pen tests, vendor list…',
      },
      {
        id: 'upload-precise',
        title: 'Upload limits (precise)',
        year: 2025,
        hasExactId: false,
        relevance: 0.65,
        preview: 'Free plan: 25MB per file. Pro: 250MB per file.',
      },
      {
        id: 'cdn',
        title: 'CDN caching notes',
        year: 2023,
        hasExactId: false,
        relevance: 0.25,
        preview: 'Cache-Control headers for static assets…',
      },
    ],
  },
]

function scoreDoc(doc: LabDoc, scenario: LabScenario, config: LabConfig): number {
  let score = doc.relevance

  if (config.indexFreshness === 'stale') {
    // Prefer older docs when the index is stale
    score += (2026 - doc.year) * 0.08
    if (doc.year >= 2025) score -= 0.35
  } else if (doc.year >= 2025) {
    score += 0.12
  }

  if (config.hybrid && doc.hasExactId) score += 0.45
  if (!config.hybrid && doc.hasExactId) score -= 0.25
  if (!config.hybrid && !doc.hasExactId && scenario.id === 'exact-error-id') score += 0.1

  if (config.chunkSize === 'huge') {
    // Huge chunks boost sprawling docs and bury precise ones
    if (doc.id.includes('blob') || doc.preview.length > 80) score += 0.25
    if (doc.id.includes('precise') || doc.id.includes('gold') || doc.id.includes('err-4412'))
      score -= 0.2
  }
  if (config.chunkSize === 'tiny') {
    score -= 0.05
  }

  if (config.rerank) {
    // Rerank boosts truly on-question docs
    if (doc.id.includes('2025') || doc.id.includes('gold') || doc.id.includes('err-4412') || doc.id.includes('precise'))
      score += 0.2
    if (doc.id.includes('marketing') || doc.id.includes('blog')) score -= 0.15
  }

  return score
}

export function runLab(scenario: LabScenario, config: LabConfig): LabRunResult {
  const ranked = [...scenario.docs]
    .map((d) => ({ doc: d, score: scoreDoc(d, scenario, config) }))
    .sort((a, b) => b.score - a.score)

  const retrieved = ranked.slice(0, config.topK).map((r) => r.doc)
  const notes: string[] = []

  const hasFreshPolicy = retrieved.some((d) => d.id === 'pol-2025')
  const hasStalePolicy = retrieved.some((d) => d.id === 'pol-2023')
  const hasSlaGold = retrieved.some((d) => d.id === 'sla-gold')
  const hasErr = retrieved.some((d) => d.id === 'err-4412')
  const hasPreciseUpload = retrieved.some((d) => d.id === 'upload-precise')
  const hasBlob = retrieved.some((d) => d.id === 'pricing-blob')

  let answer = ''
  let grounded = false

  switch (scenario.id) {
    case 'stale-policy':
      if (hasFreshPolicy) {
        answer = 'According to Refund Policy 2025, you have 30 days to request a refund.'
        grounded = true
      } else if (hasStalePolicy) {
        answer = 'According to our policy, you have 14 days to request a refund.'
        grounded = false
        notes.push('Answer mirrors the 2023 doc still dominating retrieval.')
      } else {
        answer = 'Refunds are usually possible within a couple of weeks.'
        grounded = false
        notes.push('No policy passage retrieved — model improvised.')
      }
      break
    case 'topk-starvation':
      if (hasSlaGold) {
        answer = 'Priority tickets get a first response within 4 business hours.'
        grounded = true
      } else {
        answer = 'We aim to respond to support requests as quickly as possible.'
        grounded = false
        notes.push('Gold SLA chunk never entered top_k.')
      }
      break
    case 'exact-error-id':
      if (hasErr) {
        answer = 'ERR-4412 means the auth token expired mid-request. Refresh the token and retry once.'
        grounded = true
      } else {
        answer = 'This timeout usually means an upstream service is slow — retry with backoff.'
        grounded = false
        notes.push('Dense path favored generic timeout guidance over ERR-4412.')
      }
      break
    case 'huge-chunks':
      if (hasPreciseUpload && !hasBlob) {
        answer = 'Free plan upload limit is 25MB per file.'
        grounded = true
      } else if (hasBlob) {
        answer = 'Free plan uploads are around 25–50MB depending on the product tier mentioned nearby.'
        grounded = false
        notes.push('Oversized chunk mixed adjacent topics; answer blurred the number.')
      } else {
        answer = 'Upload limits vary by plan.'
        grounded = false
      }
      break
    default:
      answer = 'No simulation for this scenario.'
  }

  if (config.chunkSize === 'huge') notes.push('Chunk size is huge — expect topic bleed inside passages.')
  if (config.topK === 1) notes.push('top_k = 1 leaves no room for runner-up evidence.')
  if (!config.hybrid) notes.push('Hybrid off — lexical IDs may be missed.')
  if (config.indexFreshness === 'stale') notes.push('Index freshness set to stale.')
  if (config.rerank) notes.push('Rerank on — shortlist reordered toward sharper matches.')

  return { retrieved, answer, grounded, notes }
}

export function inferDiagnosis(scenario: LabScenario, config: LabConfig): DiagnosisId {
  const result = runLab(scenario, config)
  if (result.grounded) return 'healthy'

  // Prefer the scenario’s intended failure when the broken pattern is active
  if (scenario.id === 'stale-policy' && config.indexFreshness === 'stale') return 'stale-index'
  if (scenario.id === 'topk-starvation' && config.topK === 1) return 'too-small-k'
  if (scenario.id === 'exact-error-id' && !config.hybrid) return 'dense-misses-id'
  if (scenario.id === 'huge-chunks' && config.chunkSize === 'huge') return 'noisy-context'

  if (config.indexFreshness === 'stale') return 'stale-index'
  if (config.topK === 1) return 'too-small-k'
  if (!config.hybrid && scenario.id === 'exact-error-id') return 'dense-misses-id'
  if (config.chunkSize === 'huge') return 'noisy-context'
  return 'noisy-context'
}
