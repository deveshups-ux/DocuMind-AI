import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Copy, Check, Trash2, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QUICK_ACTIONS = [
  { label: '⚡ Summarize', prompt: 'Please provide a clear executive summary of this document with bullet points.' },
  { label: '📌 Key Takeaways', prompt: 'What are the most critical takeaways and findings from this document?' },
  { label: '📊 Key Figures & Data', prompt: 'List all statistics, financial figures, or numbers mentioned in the document.' },
  { label: '🎯 Action Items', prompt: 'What are the actionable recommendations or next steps proposed in this document?' },
];

export default function ChatInterface({
  messages = [],
  onSendMessage,
  isLoading,
  onCitationClick,
  onClearChat,
  document,
  theme,
}) {
  const [input, setInput] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);
  const isDark = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div
      className={`h-full flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#151118]' : 'bg-[#FAF8F5]'
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between transition-colors ${
          isDark ? 'bg-[#18131B] border-[#2A2030]' : 'bg-white/80 border-[#E8DFD5]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#2E2330]'}`}>
            AI Research Assistant
          </span>
          <span className={`text-xs font-medium ${isDark ? 'text-[#8C7B8E]' : 'text-[#8A798D]'}`}>
            ({document?.numPages || 1} Pages indexed)
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 text-xs font-medium text-[#A694AB] hover:text-rose-500 transition-colors p-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        )}
      </div>

      {/* Quick Actions Strip */}
      <div
        className={`px-4 py-2.5 border-b flex items-center gap-2.5 overflow-x-auto transition-colors ${
          isDark ? 'bg-[#1B151E] border-[#271E2D]' : 'bg-[#F4EFEA] border-[#E8E0D7]'
        }`}
      >
        {QUICK_ACTIONS.map((action, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(action.prompt)}
            disabled={isLoading}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all border shrink-0 shadow-xs ${
              isDark
                ? 'bg-[#221B27] border-[#34283C] text-[#D0C2D3] hover:bg-[#2C2232] hover:border-[#7F6C82]'
                : 'bg-white border-[#DDD3CB] text-[#554658] hover:bg-[#FAF8F5] hover:border-[#7F6C82]'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#7F6C82] flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#201624]'}`}>
                Ask Anything with Verified Citations
              </h3>
              <p className={`text-xs sm:text-sm mt-2 max-w-sm leading-relaxed ${isDark ? 'text-[#B8AAB9]' : 'text-[#6A5A6D]'}`}>
                Click any quick button above or type your question below. Answers will cite exact source pages.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3.5 text-sm leading-relaxed animate-fadeIn ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#7F6C82] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 sm:p-5 relative group shadow-sm ${
                    isUser
                      ? 'bg-[#7F6C82] text-white rounded-br-xs'
                      : isDark
                      ? 'bg-[#1E1823] border border-[#2E2335] text-[#EDE6EE] rounded-bl-xs'
                      : 'bg-white border border-[#E9E0D6] text-[#2A1E2C] rounded-bl-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap font-medium leading-relaxed">{msg.content}</p>
                  ) : (
                    <div>
                      <div className="prose max-w-none text-sm leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {/* Citation badges */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div
                          className={`mt-4 pt-3 border-t flex flex-wrap items-center gap-2 ${
                            isDark ? 'border-[#2D2233]' : 'border-[#F0EAE3]'
                          }`}
                        >
                          <span className="text-[11px] uppercase tracking-wider font-bold font-mono text-[#8C7B8E]">
                            Sources:
                          </span>
                          {msg.citations.map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => onCitationClick && onCitationClick(pageNum)}
                              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 border shadow-xs ${
                                isDark
                                  ? 'bg-[#291F2F] hover:bg-[#34283C] border-[#44334E] text-[#D0C2D3]'
                                  : 'bg-[#F3ECF5] hover:bg-[#E9DFEC] border-[#DFCEDF] text-[#6E5971]'
                              }`}
                            >
                              <BookOpen className="w-3 h-3" />
                              Page {pageNum}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Copy button */}
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${
                          isDark
                            ? 'bg-[#2A2030] text-[#B8AAB9] hover:text-white'
                            : 'bg-[#F4ECF5] text-[#7F6C82] hover:bg-[#7F6C82] hover:text-white'
                        }`}
                        title="Copy response"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isDark ? 'bg-[#2A2030] text-[#B8AAB9]' : 'bg-[#EDE5DD] text-[#5E4D61]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3.5 text-xs justify-start animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-[#7F6C82] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-3 shadow-xs ${
                isDark ? 'bg-[#1E1823] border-[#2E2335] text-[#B8AAB9]' : 'bg-white border-[#E9E0D6] text-[#6E5A70]'
              }`}
            >
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7F6C82] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#7F6C82] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#7F6C82] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Searching document & citing sources...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div
        className={`p-4 border-t transition-colors ${
          isDark ? 'bg-[#18131B] border-[#2A2030]' : 'bg-[#FAF8F5] border-[#E8DFD5]'
        }`}
      >
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this document..."
            disabled={isLoading}
            className={`w-full pl-5 pr-14 py-3.5 rounded-full text-xs sm:text-sm font-medium border transition-all focus:outline-none shadow-xs ${
              isDark
                ? 'bg-[#1F1824] border-[#34273E] text-white placeholder-[#7D6E80] focus:border-[#7F6C82]'
                : 'bg-white border-[#DDD4CB] text-[#2E2330] placeholder-[#9D8E9F] focus:border-[#7F6C82]'
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 w-9 h-9 rounded-full bg-[#7F6C82] hover:bg-[#6C5970] text-white disabled:opacity-30 transition-all flex items-center justify-center shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
