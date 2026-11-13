import type { Lesson } from '../types'

export const lessons: Record<string, Lesson> = {
  'tokens-context': {
    skillId: 'tokens-context',
    summary:
      'LLMs do not read characters — they read tokens. Every product decision about cost, latency, and “how much context” is a token-budget decision.',
    readingMinutes: 6,
    sections: [
      {
        heading: 'What is a token?',
        body: 'A token is a chunk of text produced by a tokenizer — often a subword. “unhappiness” might become several tokens. Rules of thumb (≈4 characters ≈ 1 English token) help for rough estimates; production systems measure with the real tokenizer because billing and context limits are exact.',
        callout: {
          tone: 'tip',
          text: 'When comparing models, compare tokenizer behavior too — the same paragraph can cost different token counts across providers.',
        },
      },
      {
        heading: 'The context window is a budget',
        body: 'Everything sharing one request competes for the same window: system instructions, chat history, retrieved chunks, tool results, and space left for the answer. If you overfill, something is truncated — often silently from the model’s point of view. Good systems pack deliberately: keep stable instructions short, retrieve only what evals justify, and reserve headroom for the completion.',
        example: {
          title: 'Packing order (typical)',
          text: '1) System policy  2) High-signal retrieved passages  3) Recent user turns  4) Current question  5) Empty room for the answer',
        },
      },
      {
        heading: 'Cost and latency follow tokens',
        body: 'Input and output tokens are priced differently. Long contexts raise both money and wait time. Caching repeated prefixes (when the API supports it) and routing easy tasks to smaller models are junior-friendly production habits that interviewers love to hear.',
        callout: {
          tone: 'interview',
          text: 'Be ready to estimate: “If each request sends 3k input tokens and gets 400 output tokens at X price, what is cost per 1k queries?” Rough arithmetic beats buzzwords.',
        },
      },
    ],
    keyTakeaways: [
      'Design around token budgets, not character counts.',
      'Leave headroom for the model response.',
      'More context is not always better — noise hurts quality and cost.',
    ],
    warmup: {
      prompt: 'Name three things that compete for space in a single LLM request.',
      answer:
        'System prompt / instructions, history, retrieved docs or tool outputs, and room for the generated answer.',
    },
  },

  prompting: {
    skillId: 'prompting',
    summary:
      'Treat prompts like engineering specs: role, constraints, format, examples, and what to do when uncertain. Clever wording is optional; clarity is not.',
    readingMinutes: 7,
    sections: [
      {
        heading: 'Prompt as a contract',
        body: 'A production prompt states the job, the allowed knowledge, hard constraints, the output shape, and the failure policy (“if unsure, say so / ask a clarifying question”). Vague prompts create demos. Explicit prompts create systems you can test.',
        callout: {
          tone: 'pitfall',
          text: '“Be helpful and concise” without a schema is not a contract — two runs can disagree on structure and your parser will break.',
        },
      },
      {
        heading: 'Structured output',
        body: 'Ask for JSON (or another schema) and validate in code before side effects. Prefer provider JSON modes or tool/function schemas when available. Free-form prose is for humans; machines need validated fields.',
        example: {
          title: 'Minimal pattern',
          text: 'Prompt → model returns JSON → Zod/Pydantic validate → on failure: retry once with the validation error → else escalate.',
        },
      },
      {
        heading: 'Version and evaluate',
        body: 'Change one thing at a time. Keep a golden set of prompts/inputs with expected properties. Few-shot examples help, but stale examples can teach the wrong behavior — treat them like code comments that can rot.',
        callout: {
          tone: 'interview',
          text: 'Say: “We version prompts, gate releases on evals, and never ship a prompt change because one Slack example looked nicer.”',
        },
      },
    ],
    keyTakeaways: [
      'Instructions + schema + examples beat clever wording.',
      'Validate outputs; do not parse with hope.',
      'Prompt changes need regression checks.',
    ],
    warmup: {
      prompt: 'Why validate structured model output in code instead of trusting the model?',
      answer:
        'Models are non-deterministic and can omit fields or break schema; validation prevents bad data from triggering real actions.',
    },
  },

  embeddings: {
    skillId: 'embeddings',
    summary:
      'Embeddings map text into vectors so similar meanings land nearby. They power semantic search — and they fail in predictable ways you must design around.',
    readingMinutes: 10,
    viz: 'embedding-space',
    sections: [
      {
        heading: 'The core idea',
        body: 'An embedding model turns a string into a fixed-length float vector. Nearby vectors ≈ related meaning. Queries and documents must share the same model version — each model has its own coordinate system.',
        example: {
          title: 'Invariant rule',
          text: 'Never mix vectors from model A and model B in one index. Pin the model id on every vector and plan a full re-embed on upgrades.',
        },
      },
      {
        heading: 'How we compare vectors',
        body: 'Cosine similarity cares about angle (direction), not magnitude. Dot product mixes direction and length. Euclidean distance measures straight-line gap. After L2-normalizing vectors to length 1, cosine and dot product agree on ranking — a detail that shows up in interviews and in bug reports when someone compares raw scores across metrics.',
        callout: {
          tone: 'tip',
          text: 'Do not compare raw scores across different models or metrics. Rank within one consistent setup, then evaluate with labeled hit-rate.',
        },
      },
      {
        heading: 'Strengths and blind spots',
        body: 'Dense embeddings shine on paraphrases and “same idea, different words.” They blur rare IDs, error codes, legalese, negation, and precise numbers. That is why production RAG pairs them with keyword/hybrid search and hard metadata filters.',
        example: {
          title: 'Classic miss',
          text: 'Query “ERR-4412 timeout” → dense returns generic timeout pages; sparse/BM25 finds the exact code.',
        },
        callout: {
          tone: 'interview',
          text: 'Similarity ≠ truth. Embeddings are a retrieval signal, not a correctness guarantee.',
        },
      },
      {
        heading: 'Chunk length vs embedding limits',
        body: 'Embedding models have max input tokens. Oversized chunks get truncated before vectorization — silent information loss. Size chunks in tokens for the embedder you actually use, not in characters from a blog post.',
        callout: {
          tone: 'pitfall',
          text: 'Character-based chunk sizes can overflow embedding limits and quietly drop the end of a section.',
        },
      },
    ],
    keyTakeaways: [
      'Same embedding model for queries and corpus.',
      'Know cosine vs dot vs Euclidean — and when they agree.',
      'Pair embeddings with filters and hybrid search.',
    ],
    warmup: {
      prompt: 'What breaks if you embed documents with model A and queries with model B?',
      answer:
        'Vectors live in incompatible spaces; nearest-neighbor results become meaningless.',
    },
  },

  'rag-pipeline': {
    skillId: 'rag-pipeline',
    summary:
      'RAG answers from your documents in two phases: ingest once, retrieve-and-generate on every question — with citations you can trust.',
    readingMinutes: 12,
    viz: 'rag-pipeline',
    sections: [
      {
        heading: 'Why retrieve instead of pasting everything?',
        body: 'Context windows are finite. Long prompts cost more, respond slower, and bury the useful facts. Retrieval sends a few high-signal chunks so the model can ground answers and cite sources. Fine-tuning is the wrong default for facts that change weekly.',
        callout: {
          tone: 'interview',
          text: 'Fine-tune for stable skills/style; RAG for knowledge that must stay fresh and attributable.',
        },
      },
      {
        heading: 'Two clocks: ingest vs answer',
        body: 'Ingest (offline): clean docs → chunk → embed → index with metadata. Answer (online): embed the question → retrieve top-k → optional rerank → pack a prompt with citations → generate → log traces. Interviewers expect you to draw both clocks, not only the chat box.',
        example: {
          title: 'Whiteboard one-liner',
          text: 'Docs → Chunks → Vectors → Retrieve → (Rerank) → Prompt → Answer + citations',
        },
      },
      {
        heading: 'Grounding and citations',
        body: 'Ask the model to answer only from provided passages and to cite chunk or document ids. Citations are a product feature and a debugging tool: if the cited passage does not support the claim, you found a generation failure even when retrieval looked fine.',
        callout: {
          tone: 'tip',
          text: 'Pass stable source ids into the prompt and require the model to reference them. Validate citations in code when you can.',
        },
      },
      {
        heading: 'Debug by stage',
        body: 'Wrong but fluent answer? First ask: did the gold passage enter the prompt? If no — fix chunking, embeddings, filters, hybrid search, or k. If yes — fix packing, instructions, or faithfulness constraints. Temperature is rarely the first knob.',
        callout: {
          tone: 'pitfall',
          text: 'A polished wrong answer often hides a retrieval miss. Never blend stages when diagnosing.',
        },
      },
      {
        heading: 'When RAG is the wrong tool',
        body: 'Tiny public FAQs that fit in the system prompt, pure creative writing, or tasks that need reliable calculation/tools may not need a vector index. Prefer the simplest architecture that meets evals and latency.',
      },
    ],
    keyTakeaways: [
      'Ingest offline; retrieve then generate online.',
      'Separate retrieval bugs from generation bugs.',
      'Citations and evals turn demos into systems.',
    ],
    warmup: {
      prompt: 'Why retrieve a few chunks instead of stuffing every document into the prompt?',
      answer:
        'Windows are limited; long noisy prompts raise cost/latency and hide facts. Retrieval keeps only relevant evidence and enables citations.',
    },
  },

  chunking: {
    skillId: 'chunking',
    summary:
      'Chunking chooses the unit of text that can be found and shown to the model. Strategy beats “whatever the splitter default is.”',
    readingMinutes: 12,
    sections: [
      {
        heading: 'What a good chunk does',
        body: 'It should be precise enough to match a question, rich enough to support an answer, and small enough that several fit beside instructions and history. Measure size in tokens for your embedding model and LLM — not vague character guesses.',
        callout: {
          tone: 'tip',
          text: 'Start from document structure (headings, sections). Fixed-size windows are a baseline when structure is messy.',
        },
      },
      {
        heading: 'Strategy toolbox',
        body: 'Fixed-size: simple, brittle on structure. Sliding window with overlap: reduces boundary misses. Recursive / structure-aware: split by headings → paragraphs → sentences. Semantic: split where topic shifts (costlier). Parent–child: retrieve small children for precision, then expand to larger parents for generation context.',
        example: {
          title: 'Parent–child in one line',
          text: 'Search the small child; send the parent section to the LLM so precision and context both win.',
        },
        callout: {
          tone: 'interview',
          text: 'Be ready to explain parent–child: small units retrieve well; large units generate well.',
        },
      },
      {
        heading: 'Metadata is half the feature',
        body: 'Attach doc_id, title, section path, page, updated_at, language, tenant/ACL tags, source URI. Filters, citations, deletes, and freshness all depend on this. Chunks without metadata are hard to secure and hard to trust.',
        example: {
          title: 'Minimal set',
          text: 'doc_id · title · section · updated_at · acl_tags · source_uri',
        },
      },
      {
        heading: 'Failure modes',
        body: 'Too big → vague matches and token waste. Too small → missing context. No overlap → answers straddling splits disappear. One global strategy for PDFs, tables, and code → systematic misses. Re-chunk when evals show a pattern — do not only swap models.',
        callout: {
          tone: 'pitfall',
          text: '“Chunk once forever” while questions and corpora evolve is a silent quality killer.',
        },
      },
    ],
    keyTakeaways: [
      'Size chunks in tokens for the models you use.',
      'Know fixed, sliding, recursive, semantic, and parent–child patterns.',
      'Metadata enables filters, ACLs, and citations.',
    ],
    warmup: {
      prompt: 'What problem does parent–child chunking solve?',
      answer:
        'Small chunks retrieve precisely but lack context; large chunks have context but match vaguely. Retrieve children, generate with parents.',
    },
  },

  'vector-retrieval': {
    skillId: 'vector-retrieval',
    summary:
      'Vector search finds nearest neighbors fast. At scale that means approximate indexes — with knobs that trade recall for speed — plus filters that enforce truth about who may see what.',
    readingMinutes: 12,
    sections: [
      {
        heading: 'The online loop',
        body: 'Embed the query → ANN search → top-k ids + scores → hydrate text → return passages for the prompt. Brute force compares against every vector; production indexes avoid that.',
        callout: {
          tone: 'interview',
          text: 'Say “ANN is approximate” and that you would measure hit-rate@k after changing index knobs.',
        },
      },
      {
        heading: 'HNSW and IVF (the two names to know)',
        body: 'HNSW walks a layered neighbor graph from coarse to fine; ef_search (candidate list size) trades work for recall. IVF clusters vectors and searches only nearby clusters; nprobe (clusters probed) is the main knob. You do not need to implement them — you need to know what breaks when knobs are too aggressive.',
        example: {
          title: 'Knob intuition',
          text: 'Lower ef_search / nprobe → faster, more missed neighbors. Raise them when evals show recall pain.',
        },
      },
      {
        heading: 'Metadata filters and permissions',
        body: 'Apply tenant/ACL/language/freshness filters at retrieval time. Prompting “do not leak other customers” is not a control. Prefer filter-then-retrieve (or filtered ANN) over retrieve-then-drop, which can leave you with fewer than k usable hits — or none.',
        callout: {
          tone: 'pitfall',
          text: 'Post-filtering after an unfiltered top-k can silently starve the prompt of allowed evidence.',
        },
      },
      {
        heading: 'Freshness and ops',
        body: 'Track index lag, delete/update semantics, and the pinned embedding model version. A stale index looks exactly like “the model doesn’t know.” Canary queries after every index deploy save weekends.',
        example: {
          title: 'Ops checklist',
          text: 'Lag SLO · delete semantics · model version pinned · canary queries · recall@k on a golden set',
        },
      },
    ],
    keyTakeaways: [
      'ANN trades recall for speed — measure it.',
      'Know HNSW (ef_search) and IVF (nprobe) at a conceptual level.',
      'Permissions belong in retrieval, not only in prompts.',
    ],
    warmup: {
      prompt: 'Why is post-filtering retrieved results by ACL risky?',
      answer:
        'You may discard most of top-k and leave too few (or zero) allowed passages, while a filtered search could have filled k with permitted docs.',
    },
  },

  'hybrid-rerank': {
    skillId: 'hybrid-rerank',
    summary:
      'Sparse search catches exact words; dense search catches meaning. Hybrid fuses both. Rerankers polish a shortlist when evals demand more precision.',
    readingMinutes: 11,
    sections: [
      {
        heading: 'Sparse vs dense',
        body: 'Sparse retrievers (BM25 and friends) use term statistics and inverted indexes — excellent on IDs, error codes, and rare keywords. Dense retrievers compare embeddings — excellent on paraphrases. Real user traffic needs both.',
        example: {
          title: 'BM25 knobs (vocab)',
          text: 'IDF upweights rare terms; k1 controls term-frequency saturation; b length-normalizes long documents.',
        },
      },
      {
        heading: 'Fusion without fragile scores',
        body: 'Raw BM25 scores and cosine scores are not on the same scale. Reciprocal Rank Fusion (RRF) merges ranked lists by rank position — simple, strong, and interview-friendly. Weighted score blends need careful calibration.',
        callout: {
          tone: 'tip',
          text: 'Prefer rank fusion (RRF) unless you have evidence a calibrated score mix wins on your golden set.',
        },
      },
      {
        heading: 'Rerank after recall',
        body: 'Retrieve a wide pool (e.g. 30–50), then score query–passage pairs with a cross-encoder or LLM reranker and keep the best 5–10 for the prompt. Rerank cannot invent a passage that never entered the pool — fix recall first.',
        callout: {
          tone: 'pitfall',
          text: 'Adding a reranker on top of a broken retriever wastes latency and money.',
        },
      },
      {
        heading: 'Climb the ladder with metrics',
        body: 'Keyword → dense → hybrid → rerank. Stop when golden-set targets and latency budgets are met. Complexity is earned, not collected.',
        callout: {
          tone: 'interview',
          text: 'Narrate the ladder and the metric that justified each step — that is senior-shaped thinking at junior level.',
        },
      },
    ],
    keyTakeaways: [
      'Sparse = words; dense = meaning; hybrid = both.',
      'RRF fuses rankings without score gymnastics.',
      'Rerank after you have recall; measure before you add stages.',
    ],
    warmup: {
      prompt: 'Why fuse BM25 and dense rankings with RRF instead of adding raw scores?',
      answer:
        'Scores live on incompatible scales; RRF uses ranks, so neither retriever’s score range dominates by accident.',
    },
  },

  'rag-evaluation': {
    skillId: 'rag-evaluation',
    summary:
      'Evals make RAG engineering, not folklore. Measure retrieval and generation apart, gate releases on a golden set, and feed production misses back into training your judgment.',
    readingMinutes: 12,
    sections: [
      {
        heading: 'Split the problem',
        body: 'Retrieval: did the gold passage appear in top-k? (hit-rate@k, MRR, nDCG). Generation: is the answer faithful to context and correct versus gold? Faithfulness without retrieval success is luck; retrieval without faithful generation still fails the user.',
        callout: {
          tone: 'interview',
          text: 'Draw the split on a whiteboard. It is one of the clearest junior differentiators.',
        },
      },
      {
        heading: 'Build a golden set that hurts usefully',
        body: 'Start with 20–50 questions labeled with expected passages and answers. Include paraphrases, exact-ID queries, multi-hop cases, and permission-sensitive items. Run the suite on every chunking, prompt, model, or index change.',
        example: {
          title: 'Release rule',
          text: 'Block merge if hit-rate@5 or faithfulness drops past the team threshold on the golden set.',
        },
      },
      {
        heading: 'Offline vs online',
        body: 'Offline golden sets catch regressions before users. Online signals (thumbs-down, escalation, citation click-through, edit distance to final agent reply) find new failure modes. Promote painful online cases into the offline set — that loop is the real LLMOps habit.',
      },
      {
        heading: 'Judges and objective checks',
        body: 'LLM-as-judge helps grade open answers but drifts. Calibrate against humans. Prefer cheap objective checks when possible: required entities present, citation ids valid, schema valid, refusal on empty retrieval.',
        callout: {
          tone: 'pitfall',
          text: 'A single uncalibrated judge score is a vanity metric.',
        },
      },
    ],
    keyTakeaways: [
      'Retrieval metrics ≠ generation metrics.',
      'Golden sets gate releases.',
      'Production failures feed the next eval iteration.',
    ],
    warmup: {
      prompt: 'Name one retrieval metric and one generation property you would track.',
      answer:
        'Example: hit-rate@k for retrieval; faithfulness/groundedness (and/or correctness vs gold) for generation.',
    },
  },

  'agent-loop': {
    skillId: 'agent-loop',
    summary:
      'An agent repeatedly plans, calls tools, observes results, and stops — or hits a budget. Frameworks are state machines around this loop.',
    readingMinutes: 7,
    viz: 'agent-loop',
    sections: [
      {
        heading: 'The loop',
        body: 'Reason → choose a tool → execute → append the observation → repeat until a final answer or a stop rule. Multi-agent setups are multiple loops with handoffs; the fundamentals stay the same.',
      },
      {
        heading: 'Control planes matter more than vibes',
        body: 'Set max steps, timeouts, and token budgets. Require human approval for irreversible actions. Prefer narrow tools over a god-mode shell. Autonomy without brakes is a cost and safety incident.',
        callout: {
          tone: 'interview',
          text: 'Talk about stop conditions and least-privilege tools before naming LangGraph.',
        },
      },
      {
        heading: 'Debugging',
        body: 'When agents loop or stall, inspect traces: tool arguments, errors, and intermediate state. Raising temperature rarely fixes a bad tool contract or missing stop rule.',
        callout: {
          tone: 'pitfall',
          text: 'Without tracing, agent failures feel random — they usually are not.',
        },
      },
    ],
    keyTakeaways: [
      'Agents need stop conditions and budgets.',
      'Traces beat guessing.',
      'Small reliable tools beat vague autonomy.',
    ],
    warmup: {
      prompt: 'Why do agent systems need max-steps / budgets?',
      answer:
        'To prevent infinite tool loops, runaway cost, and uncontrolled side effects.',
    },
  },

  'tool-calling': {
    skillId: 'tool-calling',
    summary:
      'Tools are typed APIs the model can invoke. Schema quality, validation, and error messages determine reliability more than the model brand.',
    readingMinutes: 7,
    sections: [
      {
        heading: 'Schemas are the UX for the model',
        body: 'Clear names, descriptions, and JSON schemas teach the model when and how to call a tool. Ambiguous tools cause wrong calls; overlapping tools cause hesitation or thrash.',
      },
      {
        heading: 'Validate before side effects',
        body: 'Treat model-chosen arguments as untrusted input. Validate types and authorize against the user. Return structured errors the model can recover from. Prefer idempotent tools when retries are likely.',
        callout: {
          tone: 'pitfall',
          text: 'Never let raw model JSON hit a payment API or delete endpoint without checks.',
        },
      },
      {
        heading: 'Least privilege',
        body: 'A tool should not exceed what the end user is allowed to do. Agent platforms fail when tools are god-mode wrappers around internal admin APIs.',
        callout: {
          tone: 'interview',
          text: 'Connect tool-calling to security: untrusted args + least privilege + audit logs.',
        },
      },
    ],
    keyTakeaways: [
      'Tool quality = schema + validation + errors.',
      'Never trust model args blindly.',
      'Idempotency makes retries safer.',
    ],
    warmup: {
      prompt: 'What should happen before executing a tool call with model-provided arguments?',
      answer:
        'Validate schema/types and authorize the action for that user; reject or repair on failure.',
    },
  },

  'mcp-intro': {
    skillId: 'mcp-intro',
    summary:
      'MCP (Model Context Protocol) standardizes how hosts connect models to tools and data sources — shared wiring instead of one-off integrations.',
    readingMinutes: 6,
    sections: [
      {
        heading: 'The problem it solves',
        body: 'Every agent host reinventing connectors for files, browsers, and APIs does not scale. MCP defines a common way to expose tools, resources, and prompts so hosts and servers can interoperate.',
      },
      {
        heading: 'Mental model',
        body: 'Hosts (clients) connect to MCP servers that wrap capabilities. The model still decides when to call tools; MCP is the socket layer, not the brain. Knowing host / server / tools / resources is enough vocabulary for most junior interviews.',
        example: {
          title: 'Analogy',
          text: 'USB for AI tools: shared plug shape, many devices (servers), many computers (hosts).',
        },
      },
      {
        heading: 'Security still applies',
        body: 'A standard protocol does not remove least privilege, consent, or audit needs. Each server is still a trust boundary.',
        callout: {
          tone: 'interview',
          text: 'Wavestone-style JDs mention MCP — explain the why (standard connectors) more than message internals on day one.',
        },
      },
    ],
    keyTakeaways: [
      'MCP = standard tool/data connector layer.',
      'Separate protocol knowledge from agent logic.',
      'Every server remains a security boundary.',
    ],
    warmup: {
      prompt: 'In one sentence, what is MCP for?',
      answer:
        'A standard way for AI hosts to connect to external tools and data sources.',
    },
  },
}
