import type { Skill } from '../types'

/**
 * Content is data — add/remove skills without touching UI code.
 * Links are visual only on the constellation cover.
 */
export const skills: Skill[] = [
  {
    id: 'tokens-context',
    title: 'Tokens & Context',
    cluster: 'foundations',
    short: 'How LLMs see text, windows, and cost.',
    position: [-6.5, 1.2, -1.5],
    links: ['prompting', 'embeddings'],
  },
  {
    id: 'prompting',
    title: 'Prompting & Structured Output',
    cluster: 'foundations',
    short: 'Specs, schemas, and reliable outputs.',
    position: [-5.2, -0.4, 1.2],
    links: ['tokens-context', 'rag-pipeline', 'agent-loop'],
  },
  {
    id: 'embeddings',
    title: 'Embeddings',
    cluster: 'foundations',
    short: 'Vectors that make meaning searchable.',
    position: [-4.0, 1.6, 0.2],
    links: ['tokens-context', 'vector-retrieval', 'chunking'],
  },
  {
    id: 'rag-pipeline',
    title: 'RAG Pipeline',
    cluster: 'rag',
    short: 'End-to-end retrieval-augmented generation.',
    position: [0.2, 2.0, 0],
    links: ['chunking', 'vector-retrieval', 'prompting'],
  },
  {
    id: 'chunking',
    title: 'Chunking & Metadata',
    cluster: 'rag',
    short: 'Split docs so retrieval can succeed.',
    position: [-1.2, 0.3, 1.8],
    links: ['rag-pipeline', 'embeddings', 'vector-retrieval'],
  },
  {
    id: 'vector-retrieval',
    title: 'Vector Retrieval',
    cluster: 'rag',
    short: 'Similarity search in a vector store.',
    position: [1.4, 0.5, 1.6],
    links: ['rag-pipeline', 'embeddings', 'hybrid-rerank'],
  },
  {
    id: 'hybrid-rerank',
    title: 'Hybrid Search & Rerank',
    cluster: 'rag',
    short: 'Blend sparse + dense, then rerank.',
    position: [2.2, -0.8, -0.4],
    links: ['vector-retrieval', 'rag-evaluation'],
  },
  {
    id: 'rag-evaluation',
    title: 'RAG Evaluation',
    cluster: 'rag',
    short: 'Measure retrieval and answer quality.',
    position: [0.6, -1.4, -1.6],
    links: ['rag-pipeline', 'hybrid-rerank'],
  },
  {
    id: 'agent-loop',
    title: 'Agent Loop',
    cluster: 'agents',
    short: 'Reason → act → observe → repeat.',
    position: [5.8, 1.4, -0.6],
    links: ['tool-calling', 'prompting', 'mcp-intro'],
  },
  {
    id: 'tool-calling',
    title: 'Tool Calling',
    cluster: 'agents',
    short: 'Typed tools, schemas, and failures.',
    position: [6.8, -0.2, 1.0],
    links: ['agent-loop', 'mcp-intro'],
  },
  {
    id: 'mcp-intro',
    title: 'MCP Basics',
    cluster: 'agents',
    short: 'Model Context Protocol for tools & data.',
    position: [5.0, -1.0, -1.4],
    links: ['agent-loop', 'tool-calling'],
  },
]

export const skillById = Object.fromEntries(skills.map((s) => [s.id, s]))

export const clusterMeta: Record<
  Skill['cluster'],
  { label: string; accent: string }
> = {
  foundations: { label: 'LLM Foundations', accent: '#5b8fa8' },
  rag: { label: 'RAG', accent: '#3d9b7a' },
  agents: { label: 'Agents & MCP', accent: '#c47a3a' },
}
