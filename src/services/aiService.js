/**
 * AI Service for DocuMind RAG & Generation
 * Supports Google Gemini API, OpenAI API, and an intelligent Local Hybrid Engine.
 */

// Simple keyword / term matching for local chunk retrieval (RAG)
export function retrieveRelevantChunks(query, docPages, maxChunks = 3) {
  if (!docPages || docPages.length === 0) return [];

  const queryWords = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scoredPages = docPages.map((page) => {
    const textLower = page.text.toLowerCase();
    let score = 0;

    queryWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}`, "gi");
      const matches = textLower.match(regex);
      if (matches) {
        score += matches.length * (word.length > 5 ? 2 : 1);
      }
    });

    return {
      ...page,
      score,
    };
  });

  // Sort descending by score
  const sorted = scoredPages
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    // If no specific match, return first pages as default context
    return docPages.slice(0, maxChunks);
  }

  return sorted.slice(0, maxChunks);
}

// Call Google Gemini API
async function callGemini(apiKey, prompt, systemPrompt = "") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  const contents = [];
  if (systemPrompt) {
    contents.push({
      role: "user",
      parts: [{ text: `System Instruction: ${systemPrompt}` }],
    });
    contents.push({
      role: "model",
      parts: [
        { text: "Understood. I will strictly follow your instructions." },
      ],
    });
  }
  contents.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `Gemini API Error (${response.status})`,
    );
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
  );
}

// Call OpenAI API
async function callOpenAI(apiKey, prompt, systemPrompt = "") {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            systemPrompt ||
            "You are an intelligent document research assistant.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `OpenAI API Error (${response.status})`,
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response generated.";
}

// Local smart generator for offline / zero-key mode
function localSmartAnswer(query, relevantChunks, fullDoc) {
  const qLower = query.toLowerCase();

  // Executive Summary Request
  if (
    qLower.includes("summar") ||
    qLower.includes("overview") ||
    qLower.includes("gist")
  ) {
    return (
      `### 📑 Executive Summary\n\nBased on **${fullDoc.name || "the uploaded document"}** (${fullDoc.numPages || 1} pages):\n\n` +
      relevantChunks
        .map(
          (chunk) =>
            `* **Key Point (Page ${chunk.pageNumber}):** ${chunk.text.slice(0, 180)}...`,
        )
        .join("\n\n") +
      `\n\n> 💡 *Tip: Add your Gemini or OpenAI API Key in Settings for deeper LLM reasoning.*`
    );
  }

  // Action Items / Next steps
  if (
    qLower.includes("action") ||
    qLower.includes("steps") ||
    qLower.includes("recommendation")
  ) {
    return (
      `### ⚡ Extracted Action Items & Takeaways\n\n` +
      `1. **Core Directive:** Review source findings referenced across page ${relevantChunks.map((c) => c.pageNumber).join(", ")}.\n` +
      `2. **Operational Focus:** Implement foundational architectures mentioned in the text.\n` +
      `3. **Verification:** Validate metrics and data points from the document.\n\n` +
      `*Source reference: Page(s) ${relevantChunks.map((c) => c.pageNumber).join(", ")}.*`
    );
  }

  // Targeted context-based reply
  if (relevantChunks.length > 0) {
    const topChunk = relevantChunks[0];
    return `Based on **Page ${topChunk.pageNumber}** of the document:\n\n> "${topChunk.text.slice(0, 240)}..."\n\n**Direct Answer:**\nRegarding your question about *"${query}"*, the document highlights that key solutions and processes are linked to the mechanisms detailed on Page ${topChunk.pageNumber}.\n\n📌 **Sources Used:** Page ${relevantChunks.map((c) => c.pageNumber).join(", ")}`;
  }

  return `I reviewed the document. For the query *"${query}"*, please verify the relevant sections in the document viewer on the left or add an API key for unrestricted deep synthesis.`;
}

// Main Q&A Dispatcher
export async function askDocumentQuestion({
  query,
  document,
  history = [],
  config = {},
}) {
  const { apiKey, provider = "gemini" } = config;
  const relevantChunks = retrieveRelevantChunks(query, document.pages, 4);

  const contextText = relevantChunks
    .map((chunk) => `[Page ${chunk.pageNumber}]:\n${chunk.text}`)
    .join("\n\n");

  const systemPrompt = `You are DocuMind AI, an expert research analyst and document QA assistant. 
You answer questions accurately based SOLELY on the provided document excerpts.
Always cite the specific page numbers (e.g. [Page 2]) when referencing facts. 
Use clear Markdown formatting (bullet points, bold highlights, tables where applicable).
If the document does not contain enough information to answer, state so politely.`;

  const prompt = `Context Excerpts from Document "${document.name || "Uploaded File"}":
----------------------------------------
${contextText}
----------------------------------------

User Question: ${query}

Provide a comprehensive, accurate response with citations based on the context above:`;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      if (provider === "gemini") {
        const reply = await callGemini(apiKey, prompt, systemPrompt);
        return {
          text: reply,
          citations: relevantChunks.map((c) => c.pageNumber),
        };
      } else if (provider === "openai") {
        const reply = await callOpenAI(apiKey, prompt, systemPrompt);
        return {
          text: reply,
          citations: relevantChunks.map((c) => c.pageNumber),
        };
      }
    } catch (err) {
      console.warn("API call failed, falling back to local reasoning:", err);
      const fallback = localSmartAnswer(query, relevantChunks, document);
      return {
        text:
          `*(API Error: ${err.message}. Showing local offline preview)*\n\n` +
          fallback,
        citations: relevantChunks.map((c) => c.pageNumber),
      };
    }
  }

  // Fallback to local smart analysis
  const localReply = localSmartAnswer(query, relevantChunks, document);
  return {
    text: localReply,
    citations: relevantChunks.map((c) => c.pageNumber),
  };
}

// Generate Flashcards
export async function generateFlashcards(document, config = {}) {
  const { apiKey, provider = "gemini" } = config;
  const samplePages = document.pages.slice(0, 4);
  const context = samplePages
    .map((p) => `Page ${p.pageNumber}: ${p.text}`)
    .join("\n\n");

  if (apiKey && apiKey.trim().length > 5) {
    const prompt = `Based on the following document excerpts, generate 4-6 high-yield study flashcards in strict JSON format.
Format:
[
  { "question": "Question text here?", "answer": "Clear concise answer here", "page": 1 }
]

Document:
${context}

Output ONLY valid JSON array without markdown backticks if possible, or standard json codeblock.`;

    try {
      let raw = "";
      if (provider === "gemini") raw = await callGemini(apiKey, prompt);
      else raw = await callOpenAI(apiKey, prompt);

      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn("Flashcard generation fallback", e);
    }
  }

  // Default heuristic flashcards
  return samplePages.map((p, idx) => ({
    question: `What are the key concepts detailed on Page ${p.pageNumber}?`,
    answer: p.text.slice(0, 160) + "...",
    page: p.pageNumber,
  }));
}

// Generate Quiz
export async function generateQuiz(document, config = {}) {
  const { apiKey, provider = "gemini" } = config;
  const samplePages = document.pages.slice(0, 4);
  const context = samplePages
    .map((p) => `Page ${p.pageNumber}: ${p.text}`)
    .join("\n\n");

  if (apiKey && apiKey.trim().length > 5) {
    const prompt = `Based on the following document, generate 4 multiple-choice quiz questions in strict JSON format.
Format:
[
  {
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Explanation citing page number",
    "page": 1
  }
]

Document:
${context}

Output ONLY valid JSON array.`;

    try {
      let raw = "";
      if (provider === "gemini") raw = await callGemini(apiKey, prompt);
      else raw = await callOpenAI(apiKey, prompt);

      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn("Quiz generation fallback", e);
    }
  }

  // Default heuristic quiz
  return [
    {
      question: `What is the primary subject matter analyzed in "${document.name || "this document"}"?`,
      options: [
        "Advanced architectural concepts and domain solutions",
        "Unrelated historical literature",
        "General random numerical dataset",
        "Basic configuration defaults",
      ],
      correctIndex: 0,
      explanation: `The document details core architectural and operational strategies across its pages.`,
      page: 1,
    },
    {
      question: `How does context grounding improve answer accuracy?`,
      options: [
        "By guessing random data",
        "By retrieving verified document chunks and citing pages directly",
        "By deleting source documents",
        "By avoiding model inference",
      ],
      correctIndex: 1,
      explanation: `Retrieval-Augmented Generation (RAG) grounds answers directly in verified document excerpts.`,
      page: 2,
    },
  ];
}
