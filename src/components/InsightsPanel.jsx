import React, { useState } from 'react';
import { Sparkles, BarChart2, BookOpen, HelpCircle } from 'lucide-react';
import FlashcardsView from './FlashcardsView';
import QuizView from './QuizView';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function InsightsPanel({
  document,
  summary,
  isSummarizing,
  flashcards,
  isGeneratingFlashcards,
  quiz,
  isGeneratingQuiz,
  onGenerateSummary,
  onGenerateFlashcards,
  onGenerateQuiz,
  onPageClick,
  theme,
}) {
  const [activeTab, setActiveTab] = useState('summary');
  const isDark = theme === 'dark';

  const readingTimeMinutes = Math.max(1, Math.round((document?.wordCount || 100) / 200));

  return (
    <div className={`h-full flex flex-col transition-colors duration-200 ${isDark ? 'bg-[#151118]' : 'bg-[#FAF8F5]'}`}>
      {/* Tab Navigation Header */}
      <div
        className={`flex items-center gap-2 p-3 border-b overflow-x-auto transition-colors ${
          isDark ? 'bg-[#18131B] border-[#2A2030]' : 'bg-white/80 border-[#E8DFD5]'
        }`}
      >
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            activeTab === 'summary'
              ? 'bg-[#7F6C82] text-white shadow-xs'
              : isDark
              ? 'text-[#A698A9] hover:text-white hover:bg-[#251D2A]'
              : 'text-[#6E5D70] hover:text-[#2E2330] hover:bg-[#EDE5DD]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Executive Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-[#7F6C82] text-white shadow-xs'
              : isDark
              ? 'text-[#A698A9] hover:text-white hover:bg-[#251D2A]'
              : 'text-[#6E5D70] hover:text-[#2E2330] hover:bg-[#EDE5DD]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            activeTab === 'flashcards'
              ? 'bg-[#7F6C82] text-white shadow-xs'
              : isDark
              ? 'text-[#A698A9] hover:text-white hover:bg-[#251D2A]'
              : 'text-[#6E5D70] hover:text-[#2E2330] hover:bg-[#EDE5DD]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Flashcards ({flashcards?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            activeTab === 'quiz'
              ? 'bg-[#7F6C82] text-white shadow-xs'
              : isDark
              ? 'text-[#A698A9] hover:text-white hover:bg-[#251D2A]'
              : 'text-[#6E5D70] hover:text-[#2E2330] hover:bg-[#EDE5DD]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Quiz ({quiz?.length || 0})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'summary' && (
          <div className="p-6 sm:p-8 space-y-5 max-w-3xl mx-auto">
            <div
              className={`flex items-center justify-between pb-4 border-b ${
                isDark ? 'border-[#2A2030]' : 'border-[#E8DFD5]'
              }`}
            >
              <div>
                <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#201624]'}`}>
                  Executive Summary & Takeaways
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-[#A698A9]' : 'text-[#7A6A7D]'}`}>
                  Structured findings distilled directly from the original document pages
                </p>
              </div>
              <button
                onClick={onGenerateSummary}
                disabled={isSummarizing}
                className="px-4 py-2 rounded-full bg-[#7F6C82] hover:bg-[#6D5A70] text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                {isSummarizing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Distilling...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </>
                )}
              </button>
            </div>

            {isSummarizing ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#7F6C82] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className={`text-sm font-semibold ${isDark ? 'text-[#D0C2D3]' : 'text-[#4E3E50]'}`}>
                  Distilling key takeaways across {document?.numPages || 1} pages...
                </p>
              </div>
            ) : summary ? (
              <div
                className={`p-6 sm:p-7 rounded-3xl border shadow-sm ${
                  isDark ? 'bg-[#1C1721] border-[#2C2133] text-[#EDE6EE]' : 'bg-white border-[#E9E0D6] text-[#2A1E2C]'
                }`}
              >
                <div className="prose max-w-none leading-relaxed space-y-3 text-sm sm:text-base">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summary}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center">
                <button
                  onClick={onGenerateSummary}
                  className="px-6 py-3 bg-[#7F6C82] hover:bg-[#6D5A70] text-white text-xs sm:text-sm font-bold rounded-full shadow-md"
                >
                  Generate Executive Summary
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#201624]'}`}>
                Document Corpus & Metrics
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#A698A9]' : 'text-[#7A6A7D]'}`}>
                Word count metrics and section distribution
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? 'bg-[#1C1721] border-[#2C2133]' : 'bg-white border-[#E8DFD5]'}`}>
                <div className="text-[11px] uppercase font-bold text-[#8C7B8E]">Total Pages</div>
                <div className={`text-2xl sm:text-3xl font-extrabold mt-1 ${isDark ? 'text-white' : 'text-[#201624]'}`}>{document?.numPages || 0}</div>
              </div>

              <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? 'bg-[#1C1721] border-[#2C2133]' : 'bg-white border-[#E8DFD5]'}`}>
                <div className="text-[11px] uppercase font-bold text-[#8C7B8E]">Word Count</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#A594AB] mt-1">{document?.wordCount?.toLocaleString() || 0}</div>
              </div>

              <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? 'bg-[#1C1721] border-[#2C2133]' : 'bg-white border-[#E8DFD5]'}`}>
                <div className="text-[11px] uppercase font-bold text-[#8C7B8E]">Est. Read Time</div>
                <div className={`text-2xl sm:text-3xl font-extrabold mt-1 ${isDark ? 'text-[#D0C2D3]' : 'text-[#5E4D61]'}`}>{readingTimeMinutes} min</div>
              </div>

              <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? 'bg-[#1C1721] border-[#2C2133]' : 'bg-white border-[#E8DFD5]'}`}>
                <div className="text-[11px] uppercase font-bold text-[#8C7B8E]">RAG Chunks</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 mt-1">{document?.pages?.length || 1}</div>
              </div>
            </div>

            {/* Page Breakdown */}
            <div className="space-y-2.5 pt-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#D0C2D3]' : 'text-[#4E3E50]'}`}>Page Distribution</h4>
              <div className="space-y-2">
                {document?.pages?.map((page) => {
                  const words = page.text.split(/\s+/).filter(Boolean).length;
                  const percent = Math.min(100, Math.round((words / Math.max(1, (document.wordCount / document.numPages) * 1.5)) * 100));

                  return (
                    <div
                      key={page.pageNumber}
                      onClick={() => onPageClick && onPageClick(page.pageNumber)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs shadow-xs ${
                        isDark
                          ? 'bg-[#1C1721] border-[#2C2133] hover:border-[#7F6C82]'
                          : 'bg-white border-[#E9E0D6] hover:border-[#7F6C82]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[#A594AB] font-bold text-xs">P.{page.pageNumber}</span>
                        <span className={`max-w-[220px] sm:max-w-md truncate font-medium ${isDark ? 'text-[#C4B7C7]' : 'text-[#4E3E50]'}`}>
                          {page.text.slice(0, 75)}...
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-semibold ${isDark ? 'text-[#8A7A8D]' : 'text-[#8C7B8E]'}`}>{words}w</span>
                        <div className={`w-20 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#2D2335]' : 'bg-[#EDE5DD]'}`}>
                          <div className="h-full bg-[#7F6C82] rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            flashcards={flashcards}
            onRegenerate={onGenerateFlashcards}
            isLoading={isGeneratingFlashcards}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            quiz={quiz}
            onRegenerate={onGenerateQuiz}
            isLoading={isGeneratingQuiz}
          />
        )}
      </div>
    </div>
  );
}
