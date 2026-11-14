# AI Engineer Prep

Personal, local-first platform to **learn and self-evaluate** high-value AI engineering skills (RAG, agents/MCP, LLM foundations).

- **Cover:** 3D constellation — pick what to study  
- **Book:** full-screen lessons + quizzes  
- **RAG Lab:** configure → break → diagnose (offline)  
- **Progress:** nodes turn red → green from **best quiz score**

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## What you get (MVP)

- Immersive **section-by-section lessons** (tips, pitfalls, interview angles, warm-ups)
- Full-screen **quizzes** with explanations & streaks
- **RAG Lab** on RAG Pipeline — configure → break → diagnose (offline simulation)
- Interactive **3D force-graph** constellation as the map/cover
- Progress in **localStorage** (no account, no paid APIs)
- Content as data under `src/content/` — easy to extend or pivot

## Skill focus

Aligned with junior Applied / Agentic GenAI roles (e.g. Wavestone-style JD):

1. **LLM Foundations** — tokens, prompting, embeddings  
2. **RAG** (depth) — pipeline, chunking strategies, ANN indexes, hybrid/BM25/RRF, rerank, evals  
3. **Agents & MCP** — agent loop, tool calling, MCP basics  

## Stack

Vite · React · TypeScript · react-force-graph-3d · Zustand · Tailwind CSS v4

## Deploy (simplest)

Static site — e.g. Vercel or GitHub Pages after `npm run build` (output in `dist/`).

## Credits / inspiration

- Lesson/quiz flow inspired by open learning apps (stepped lessons + MCQ patterns)
- Curriculum shape inspired by public AI-engineer roadmaps
- 3D cover built with react-force-graph-3d
- Lessons & quizzes written for this project

## Reset progress

Use **Reset** on the cover, or clear `localStorage` key `ai-engineer-prep-progress-v1`.
