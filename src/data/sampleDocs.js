export const SAMPLE_DOCS = [
  {
    id: 'ai-overview',
    title: 'Modern Artificial Intelligence & Large Language Models (2026)',
    category: 'AI & Machine Learning',
    description: 'An overview of transformer architectures, RAG systems, multimodal AI, and agentic workflows.',
    size: '18.4 KB',
    numPages: 4,
    wordCount: 840,
    pages: [
      {
        pageNumber: 1,
        text: "Executive Overview: Artificial Intelligence in 2026. The rapid evolution of Generative AI has transitioned from raw text-generation models into highly autonomous Agentic Systems. Large Language Models (LLMs) such as Gemini, GPT-4o, and Claude 3.5 Sonnet serve as the cognitive core of enterprise reasoning engines. Key advancements include hybrid reasoning architectures that combine test-time compute scaling, tree-of-thought exploration, and dynamic tool invocation.",
      },
      {
        pageNumber: 2,
        text: "Retrieval-Augmented Generation (RAG) Architectures. While LLMs possess immense parametric knowledge, they suffer from knowledge cutoff limits and hallucinations. RAG solves this by retrieving relevant chunks from external vector databases (like Pinecone, Qdrant, Chroma) and injecting verified source documents into the context window. Modern 2026 RAG pipelines employ HyDE (Hypothetical Document Embeddings), multi-query expansion, and reranking algorithms (e.g., Cohere Rerank) to guarantee sub-millisecond, highly accurate context retrieval.",
      },
      {
        pageNumber: 3,
        text: "Agentic Workflows and Tool Calling. The state-of-the-art paradigm shifts from single-turn chat into multi-step agentic execution loops. Agents decompose ambiguous user goals into deterministic execution plans, interact with bash terminals, execute SQL queries against relational databases, search the web in real-time, and iteratively evaluate their own output. Self-reflection and automated unit-test validation loops reduce logical errors by over 74% compared to standard zero-shot prompting.",
      },
      {
        pageNumber: 4,
        text: "Ethics, Governance, and Future Projections. As autonomous AI agents gain execution capabilities across critical infrastructure, safety frameworks have become paramount. Key focus areas include prompt injection defense, differential privacy in fine-tuning, automated red-teaming, and verifiable watermarking. The market for enterprise RAG and autonomous software engineering agents is projected to surpass $120 Billion by 2028.",
      }
    ],
    get fullText() {
      return this.pages.map(p => `--- [Page ${p.pageNumber}] ---\n` + p.text).join('\n\n');
    }
  },
  {
    id: 'startup-pitch',
    title: 'NovaHealth AI - Series A Investor Pitch Deck',
    category: 'Business & Pitch',
    description: 'Pitch deck outlining market size, AI diagnostics product, traction ($2.4M ARR), and $15M Series A funding request.',
    size: '12.1 KB',
    numPages: 3,
    wordCount: 620,
    pages: [
      {
        pageNumber: 1,
        text: "NovaHealth AI: Democratizing Clinical Diagnostics with Autonomous Vision-LLMs. Problem: Over 4.2 billion people lack immediate access to certified radiologists and specialist clinicians. Diagnostic turnaround times average 72 hours, resulting in delayed patient interventions. Solution: NovaHealth AI provides an FDA-cleared multi-modal AI diagnostic co-pilot that analyzes X-rays, MRIs, and CT scans in under 15 seconds with 99.2% accuracy.",
      },
      {
        pageNumber: 2,
        text: "Business Model & Financial Traction: SaaS enterprise model charging hospitals $12 per scan or $85,000 annual subscription per clinical department. Current Metrics: $2.4M ARR with 210% YoY growth. 38 hospital systems deployed across the US and Europe. Gross margin stands at 84%, with a Net Revenue Retention (NRR) rate of 138%. Customer acquisition cost (CAC) payback period is 4.8 months.",
      },
      {
        pageNumber: 3,
        text: "Series A Ask: We are raising $15 Million Series A funding. Allocation: 50% Engineering & Clinical Research, 30% Enterprise Sales Expansion & Go-To-Market, 20% Regulatory Clearances in APAC. Lead investors to date include Sequoia Seed and Founders Fund Health.",
      }
    ],
    get fullText() {
      return this.pages.map(p => `--- [Page ${p.pageNumber}] ---\n` + p.text).join('\n\n');
    }
  }
];
