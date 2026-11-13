import type { Quiz } from '../types'

export const quizzes: Record<string, Quiz> = {
  'tokens-context': {
    skillId: 'tokens-context',
    questions: [
      {
        id: 'tc1',
        prompt: 'What does a context window limit?',
        choices: [
          'Only the model’s training dataset size',
          'How many tokens of input + output can be processed in one request',
          'The number of users allowed on the API',
          'GPU temperature during inference',
        ],
        answer: 1,
        explanation:
          'The context window caps tokens visible in a single call (prompt + generation capacity).',
      },
      {
        id: 'tc2',
        prompt: 'Why can “more retrieved documents” hurt answer quality?',
        choices: [
          'Models refuse long prompts by policy',
          'Noise and overflow can dilute or drop useful evidence',
          'Embeddings become inaccurate above 3 documents',
          'Tokenizers cannot encode Markdown',
        ],
        answer: 1,
        explanation:
          'Irrelevant context and truncation compete with the passages that actually matter.',
      },
      {
        id: 'tc3',
        prompt: 'Best habit when estimating cost?',
        choices: [
          'Count characters and divide by 10',
          'Ignore output tokens; only input matters',
          'Measure with the real tokenizer and include output tokens',
          'Assume 1 word = 1 token always',
        ],
        answer: 2,
        explanation:
          'Billing and limits are token-based; rough rules of thumb are only starting points.',
      },
    ],
  },

  prompting: {
    skillId: 'prompting',
    questions: [
      {
        id: 'pr1',
        prompt: 'What is the safest way to get machine-usable model output?',
        choices: [
          'Ask for “JSON if possible” in plain prose only',
          'Use a schema / structured output mode and validate in code',
          'Increase temperature for more variety',
          'Put the schema only in a comment the model might notice',
        ],
        answer: 1,
        explanation:
          'Schemas + validation turn LLMs into reliable components.',
      },
      {
        id: 'pr2',
        prompt: 'A prompt that lists constraints, format, and uncertainty behavior is best described as:',
        choices: [
          'A temperature schedule',
          'A retrieval index',
          'A specification / contract',
          'A fine-tuning dataset',
        ],
        answer: 2,
        explanation:
          'Production prompts behave like specs, not one-off chat messages.',
      },
      {
        id: 'pr3',
        prompt: 'After changing a system prompt in production, you should:',
        choices: [
          'Ship immediately if one example looks better',
          'Run regression evals on a golden set',
          'Disable all tools for a week',
          'Switch embedding models at the same time',
        ],
        answer: 1,
        explanation:
          'Prompt edits are code changes — gate them with evals.',
      },
    ],
  },

  embeddings: {
    skillId: 'embeddings',
    questions: [
      {
        id: 'em1',
        prompt: 'For semantic search, queries and documents should be embedded with:',
        choices: [
          'Different models to increase diversity',
          'The same embedding model (and version)',
          'A chat LLM’s next-token probabilities only',
          'TF-IDF exclusively',
        ],
        answer: 1,
        explanation:
          'Vectors from different models live in incompatible spaces.',
      },
      {
        id: 'em2',
        prompt: 'Cosine similarity between embeddings primarily measures:',
        choices: [
          'Factual correctness of an answer',
          'Approximate semantic relatedness',
          'SQL join cardinality',
          'GPU utilization',
        ],
        answer: 1,
        explanation:
          'Similarity is a retrieval signal, not a truth guarantee.',
      },
      {
        id: 'em3',
        prompt: 'Embeddings alone often struggle with:',
        choices: [
          'Paraphrases of the same idea',
          'Exact error codes / rare IDs / strong negation',
          'Short English sentences',
          'Storing vectors on disk',
        ],
        answer: 1,
        explanation:
          'That is a major reason to add keyword/hybrid search and filters.',
      },
      {
        id: 'em4',
        prompt: 'After L2-normalizing all vectors to length 1, cosine similarity and dot product:',
        choices: [
          'Become undefined',
          'Agree on ranking (dot equals cosine)',
          'Always disagree',
          'Only work for images',
        ],
        answer: 1,
        explanation:
          'For unit vectors, dot product equals cosine similarity.',
      },
      {
        id: 'em5',
        prompt: 'Why size chunks with tokens (not only characters) before embedding?',
        choices: [
          'Tokenizers ignore characters entirely',
          'Embedding limits and costs are token-based; characters can silently overflow',
          'Characters cannot be stored in JSON',
          'BM25 forbids characters',
        ],
        answer: 1,
        explanation:
          'Oversized inputs get truncated before vectorization — silent loss.',
      },
      {
        id: 'em6',
        prompt: 'You upgrade the embedding model in production. What must you do?',
        choices: [
          'Nothing — vectors are universal',
          'Re-embed the corpus (and pin the new model id); do not mix old and new vectors',
          'Only re-embed queries',
          'Delete metadata',
        ],
        answer: 1,
        explanation:
          'New model = new vector space. Mixing spaces breaks nearest neighbor.',
      },
    ],
  },

  'rag-pipeline': {
    skillId: 'rag-pipeline',
    questions: [
      {
        id: 'rp1',
        prompt: 'The core idea of RAG is to:',
        choices: [
          'Fine-tune the model on every new document daily',
          'Retrieve relevant evidence and generate using that evidence',
          'Replace the LLM with a keyword search engine',
          'Always use the longest possible context window',
        ],
        answer: 1,
        explanation:
          'RAG grounds generation in retrieved context at request time.',
      },
      {
        id: 'rp2',
        prompt: 'If answers are wrong but fluent, what should you check first?',
        choices: [
          'Only the temperature setting',
          'Whether the right passages were retrieved before generation',
          'The CSS of the chat UI',
          'Whether the model logo is correct',
        ],
        answer: 1,
        explanation:
          'Separate retrieval failures from generation failures.',
      },
      {
        id: 'rp3',
        prompt: 'Why retrieve a few chunks instead of pasting the whole corpus into the prompt?',
        choices: [
          'Models refuse long prompts by law',
          'Windows, cost, latency, and buried facts — retrieval keeps high-signal evidence and enables citations',
          'Embeddings stop working above 2 documents',
          'Citations become illegal with short prompts',
        ],
        answer: 1,
        explanation:
          'Retrieval is how you stay inside budgets and keep answers attributable.',
      },
      {
        id: 'rp4',
        prompt: 'Compared to fine-tuning for rapidly changing company facts, RAG is often preferred because:',
        choices: [
          'It never requires evaluation',
          'Documents can be updated without retraining the base model',
          'It eliminates the need for embeddings',
          'It guarantees zero hallucinations',
        ],
        answer: 1,
        explanation:
          'Knowledge updates become index updates — faster and more controllable.',
      },
      {
        id: 'rp5',
        prompt: 'Ingest vs answer: which work happens offline once per document?',
        choices: [
          'Reranking the user question',
          'Chunk → embed → index with metadata',
          'Streaming tokens to the UI',
          'Choosing temperature per keystroke',
        ],
        answer: 1,
        explanation:
          'Ingest prepares the index; answer-time retrieval uses it.',
      },
      {
        id: 'rp6',
        prompt: 'A cited chunk does not support the model’s claim. What failed?',
        choices: [
          'Only the vector database hostname',
          'Generation / grounding — even if retrieval returned something',
          'DNS',
          'The CSS theme',
        ],
        answer: 1,
        explanation:
          'Citations expose faithfulness failures after retrieval.',
      },
      {
        id: 'rp7',
        prompt: 'When might RAG be the wrong default?',
        choices: [
          'Never — always build a vector index',
          'Tiny stable content that fits in the prompt, pure creative tasks, or tool/calc-heavy jobs',
          'Any company with more than one PDF',
          'Only when GPUs are free',
        ],
        answer: 1,
        explanation:
          'Prefer the simplest architecture that meets quality and latency goals.',
      },
    ],
  },

  chunking: {
    skillId: 'chunking',
    questions: [
      {
        id: 'ch1',
        prompt: 'A good chunk is primarily designed to:',
        choices: [
          'Minimize disk usage regardless of meaning',
          'Be retrievable and useful as evidence in a prompt',
          'Match the embedding model’s marketing page',
          'Always be exactly 512 characters',
        ],
        answer: 1,
        explanation:
          'Chunking is a retrieval design problem, not just storage.',
      },
      {
        id: 'ch2',
        prompt: 'Why store metadata (source, title, ACL, updated_at) with chunks?',
        choices: [
          'It is required by all embedding APIs',
          'Filters, citations, and permissions depend on it',
          'It increases cosine similarity',
          'It removes the need for a vector index',
        ],
        answer: 1,
        explanation:
          'Metadata powers filtering, security, freshness, and citations.',
      },
      {
        id: 'ch3',
        prompt: 'Overlap between chunks is mainly used to:',
        choices: [
          'Double billing for tokens',
          'Reduce boundary problems where an answer spans a split',
          'Make BM25 illegal',
          'Force ANN to become exact search',
        ],
        answer: 1,
        explanation:
          'Overlap helps when relevant sentences sit on chunk edges.',
      },
      {
        id: 'ch4',
        prompt: 'Parent–child chunking typically means:',
        choices: [
          'Deleting all small chunks',
          'Retrieve small children for precision, then expand to larger parents for generation context',
          'Training two LLMs',
          'Only using PDF page images',
        ],
        answer: 1,
        explanation:
          'Small units match; large units supply context to the LLM.',
      },
      {
        id: 'ch5',
        prompt: 'Recursive / structure-aware chunking usually splits by:',
        choices: [
          'Random byte offsets only',
          'Headings → paragraphs → sentences (falling back as needed)',
          'GPU temperature',
          'User mouse speed',
        ],
        answer: 1,
        explanation:
          'Respect document structure before falling back to finer splits.',
      },
      {
        id: 'ch6',
        prompt: 'Evals show systematic misses on policy PDFs after a model swap. Best next move?',
        choices: [
          'Only raise temperature',
          'Inspect chunking for that corpus and re-chunk if boundaries are wrong — do not only swap models again',
          'Delete the golden set',
          'Disable citations forever',
        ],
        answer: 1,
        explanation:
          'Chunking failures are not fixed by a new chat model alone.',
      },
    ],
  },

  'vector-retrieval': {
    skillId: 'vector-retrieval',
    questions: [
      {
        id: 'vr1',
        prompt: 'Approximate nearest neighbor (ANN) search trades:',
        choices: [
          'GPUs for CPUs only',
          'A bit of recall for speed/scalability',
          'Embeddings for keywords permanently',
          'JSON for XML',
        ],
        answer: 1,
        explanation:
          'ANN indexes scale; evaluate whether recall stays acceptable.',
      },
      {
        id: 'vr2',
        prompt: 'In a multi-tenant app, retrieval must:',
        choices: [
          'Return all tenants’ docs to maximize recall',
          'Enforce ACL / tenant filters before exposing text to the model',
          'Disable metadata',
          'Always use temperature 0',
        ],
        answer: 1,
        explanation:
          'Security is part of retrieval design, not a prompt afterthought.',
      },
      {
        id: 'vr3',
        prompt: 'A stale vector index most often looks like:',
        choices: [
          'A CSS bug',
          'The model “not knowing” newly added documents',
          'Faster queries',
          'Higher embedding dimensions',
        ],
        answer: 1,
        explanation:
          'Ops freshness issues present as model failures.',
      },
      {
        id: 'vr4',
        prompt: 'In HNSW, raising ef_search generally:',
        choices: [
          'Deletes the graph',
          'Increases candidate exploration — often better recall, more work/latency',
          'Changes the embedding dimension',
          'Disables metadata',
        ],
        answer: 1,
        explanation:
          'ef_search is the classic recall-vs-latency knob for HNSW.',
      },
      {
        id: 'vr5',
        prompt: 'In IVF, nprobe controls:',
        choices: [
          'The tokenizer vocabulary size',
          'How many clusters are searched for a query',
          'The chat UI font',
          'Output temperature',
        ],
        answer: 1,
        explanation:
          'More clusters probed → more recall potential, more compute.',
      },
      {
        id: 'vr6',
        prompt: 'Why is retrieve-then-ACL-filter riskier than filtered retrieval?',
        choices: [
          'It is always faster forever',
          'You may discard most of top-k and under-fill allowed evidence',
          'Filters are illegal',
          'ANN cannot store metadata',
        ],
        answer: 1,
        explanation:
          'Post-filtering can leave fewer than k usable passages.',
      },
    ],
  },

  'hybrid-rerank': {
    skillId: 'hybrid-rerank',
    questions: [
      {
        id: 'hr1',
        prompt: 'Hybrid search typically combines:',
        choices: [
          'Two identical dense indexes only',
          'Dense (vector) and sparse (e.g. BM25) signals',
          'Training and inference GPUs',
          'Prompt length and font size',
        ],
        answer: 1,
        explanation:
          'Lexical + semantic coverage handles IDs and paraphrases.',
      },
      {
        id: 'hr2',
        prompt: 'A reranker usually runs:',
        choices: [
          'Before any retrieval, on the whole corpus',
          'After retrieving a candidate pool, to reorder top results',
          'Only during model pretraining',
          'Instead of embeddings forever',
        ],
        answer: 1,
        explanation:
          'Retrieve broadly, then spend compute to reorder a shortlist.',
      },
      {
        id: 'hr3',
        prompt: 'Reciprocal Rank Fusion (RRF) is commonly used to:',
        choices: [
          'Train embedding models',
          'Merge ranked lists from different retrievers',
          'Compress PDF images',
          'Set API rate limits',
        ],
        answer: 1,
        explanation:
          'RRF merges by rank, avoiding incompatible raw score scales.',
      },
      {
        id: 'hr4',
        prompt: 'BM25 is strongest when the query contains:',
        choices: [
          'Only emojis',
          'Exact rare terms, IDs, or jargon shared with the documents',
          'Pure paraphrases with zero overlapping words (always)',
          'Images only',
        ],
        answer: 1,
        explanation:
          'Sparse lexical matching excels on shared distinctive terms.',
      },
      {
        id: 'hr5',
        prompt: 'Your reranker never sees the gold passage. What should you fix first?',
        choices: [
          'Buy a louder fan',
          'Retrieval recall — widen/fix the candidate pool before reranking',
          'Only the CSS',
          'Disable hybrid search forever',
        ],
        answer: 1,
        explanation:
          'Rerank cannot resurrect a passage that was never retrieved.',
      },
      {
        id: 'hr6',
        prompt: 'Why avoid naively adding BM25 scores to cosine scores?',
        choices: [
          'Addition is illegal in Python',
          'Scores live on incompatible scales; one channel can dominate by accident',
          'Cosine is always zero',
          'BM25 cannot rank',
        ],
        answer: 1,
        explanation:
          'Rank fusion (e.g. RRF) or careful calibration beats raw score addition.',
      },
    ],
  },

  'rag-evaluation': {
    skillId: 'rag-evaluation',
    questions: [
      {
        id: 're1',
        prompt: 'Hit rate @k for retrieval measures:',
        choices: [
          'How often the gold passage appears in the top-k results',
          'Average tokens per answer',
          'GPU memory fragmentation',
          'User interface click speed',
        ],
        answer: 0,
        explanation:
          'Retrieval evals ask whether the right evidence was available.',
      },
      {
        id: 're2',
        prompt: 'Why evaluate retrieval and generation separately?',
        choices: [
          'Because APIs require two invoices',
          'A fluent answer can hide a retrieval miss — and vice versa',
          'Generation never uses retrieved text',
          'Vector DBs cannot be tested',
        ],
        answer: 1,
        explanation:
          'Different stages fail differently; split metrics to debug.',
      },
      {
        id: 're3',
        prompt: 'A golden set should be:',
        choices: [
          'Deleted after the first demo',
          'Reused as a regression gate when prompts/indexes change',
          'Replaced by vibes from Slack',
          'Only questions without labels',
        ],
        answer: 1,
        explanation:
          'Small labeled sets catch regressions before users do.',
      },
      {
        id: 're4',
        prompt: 'Faithfulness / groundedness mainly asks:',
        choices: [
          'Whether the answer is supported by the provided context',
          'Whether the GPU is warm',
          'Whether the logo is centered',
          'Whether BM25 is disabled',
        ],
        answer: 0,
        explanation:
          'Faithfulness checks support from retrieved evidence, not vibes.',
      },
      {
        id: 're5',
        prompt: 'Best use of production thumbs-down tickets?',
        choices: [
          'Ignore them — offline evals are enough',
          'Triage failure modes and promote hard cases into the golden set',
          'Delete the index nightly',
          'Raise temperature globally',
        ],
        answer: 1,
        explanation:
          'Online failures feed offline regression suites.',
      },
      {
        id: 're6',
        prompt: 'LLM-as-judge scores without human calibration are risky because:',
        choices: [
          'Judges never make mistakes',
          'Judges drift and can be gamed — spot-check against humans',
          'JSON cannot store scores',
          'Hit-rate becomes illegal',
        ],
        answer: 1,
        explanation:
          'Calibrate judges; prefer objective checks when possible.',
      },
      {
        id: 're7',
        prompt: 'A prompt change improves one demo question but drops hit-rate@5 on the suite. You should:',
        choices: [
          'Ship immediately',
          'Treat it as a regression — investigate or reject the change',
          'Disable the golden set',
          'Only celebrate the demo',
        ],
        answer: 1,
        explanation:
          'Golden-set gates exist to stop demo-driven regressions.',
      },
    ],
  },

  'agent-loop': {
    skillId: 'agent-loop',
    questions: [
      {
        id: 'al1',
        prompt: 'A typical agent loop is:',
        choices: [
          'Embed → ANN → stop',
          'Reason → tool call → observe → repeat until stop',
          'Train → validate → deploy only once',
          'Chunk → embed → index',
        ],
        answer: 1,
        explanation:
          'Agents iterate with tools until a stop condition.',
      },
      {
        id: 'al2',
        prompt: 'Why set max steps / budgets?',
        choices: [
          'To prevent infinite loops and runaway cost',
          'Because models cannot call tools otherwise',
          'To increase temperature automatically',
          'To disable tracing',
        ],
        answer: 0,
        explanation:
          'Control planes keep agents safe and affordable.',
      },
      {
        id: 'al3',
        prompt: 'When an agent loops on tool calls, first look at:',
        choices: [
          'Only the marketing website',
          'Traces: arguments, errors, and intermediate state',
          'Buying a larger monitor',
          'Deleting the vector index',
        ],
        answer: 1,
        explanation:
          'Debugging agents is an observability problem.',
      },
    ],
  },

  'tool-calling': {
    skillId: 'tool-calling',
    questions: [
      {
        id: 'to1',
        prompt: 'Tool arguments from the model should be treated as:',
        choices: [
          'Always trusted system input',
          'Untrusted input to validate before side effects',
          'Encrypted automatically',
          'Identical to SQL GRANT',
        ],
        answer: 1,
        explanation:
          'Validate and authorize like any user-controlled input.',
      },
      {
        id: 'to2',
        prompt: 'Clear JSON schemas for tools mainly help the model:',
        choices: [
          'Train new embedding weights',
          'Choose tools and fill arguments correctly',
          'Bypass authentication',
          'Reduce disk usage',
        ],
        answer: 1,
        explanation:
          'Descriptions + schemas are how tool choice works.',
      },
      {
        id: 'to3',
        prompt: 'Idempotent tools are valuable because:',
        choices: [
          'Retries become safer',
          'They disable logging',
          'They remove the need for schemas',
          'They guarantee perfect answers',
        ],
        answer: 0,
        explanation:
          'Agents and networks retry; idempotency prevents duplicate damage.',
      },
    ],
  },

  'mcp-intro': {
    skillId: 'mcp-intro',
    questions: [
      {
        id: 'mc1',
        prompt: 'MCP is best described as:',
        choices: [
          'A fine-tuning dataset format',
          'A standard way to connect hosts/models to tools and data sources',
          'A vector database product',
          'A replacement for Python',
        ],
        answer: 1,
        explanation:
          'MCP standardizes tool/data wiring for agent hosts.',
      },
      {
        id: 'mc2',
        prompt: 'In MCP vocabulary, tools are typically exposed by:',
        choices: [
          'MCP servers',
          'The GPU driver only',
          'CSS stylesheets',
          'BM25 indexes exclusively',
        ],
        answer: 0,
        explanation:
          'Servers wrap capabilities; hosts connect to them.',
      },
      {
        id: 'mc3',
        prompt: 'MCP removes the need for:',
        choices: [
          'All security reviews',
          'Nothing — you still design permissions carefully',
          'Schemas for tool arguments',
          'Any evaluation',
        ],
        answer: 1,
        explanation:
          'Protocols do not replace least-privilege design.',
      },
    ],
  },
}
