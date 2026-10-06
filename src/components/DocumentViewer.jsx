import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Copy, Check, BookOpen } from 'lucide-react';

export default function DocumentViewer({ document, highlightedPage, onPageSelect, theme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  const pages = document?.pages || [];
  const activePage = pages[currentPageIndex] || { pageNumber: 1, text: 'No content available.' };

  // Jump to highlighted page when updated from chat citation
  React.useEffect(() => {
    if (highlightedPage) {
      const foundIdx = pages.findIndex(p => p.pageNumber === highlightedPage);
      if (foundIdx !== -1) {
        setCurrentPageIndex(foundIdx);
      }
    }
  }, [highlightedPage, pages]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activePage.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const highlightMatches = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          className={`font-bold px-1.5 py-0.5 rounded ${
            isDark ? 'bg-[#7F6C82] text-white' : 'bg-[#D9CADB] text-[#342438]'
          }`}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`h-full flex flex-col border-r transition-colors duration-200 ${
        isDark ? 'bg-[#151118] border-[#2A2030]' : 'bg-[#F6F2EC] border-[#E8DFD5]'
      }`}
    >
      {/* Header & Controls */}
      <div
        className={`p-4 border-b space-y-3 transition-colors ${
          isDark ? 'bg-[#1A151E] border-[#2A2030]' : 'bg-[#FAF8F5] border-[#E8DFD5]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#A594AB]" />
            <span className={`text-xs font-bold tracking-tight uppercase ${isDark ? 'text-white' : 'text-[#2E2330]'}`}>
              Document Reader
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-xs ${
              isDark
                ? 'bg-[#251D2A] text-[#D0C2D3] hover:bg-[#302636]'
                : 'bg-[#EDE5DD] text-[#5E4D61] hover:bg-[#E2D8CE]'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        {/* Search inside Document */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#8A798D]' : 'text-[#9A8A9D]'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords in page..."
            className={`w-full pl-9 pr-4 py-2 rounded-full text-xs font-medium border transition-colors focus:outline-none ${
              isDark
                ? 'bg-[#1F1824] border-[#34273E] text-white placeholder-[#7D6E80] focus:border-[#7F6C82]'
                : 'bg-white border-[#DDD4CB] text-[#2E2330] placeholder-[#9D8E9F] focus:border-[#7F6C82]'
            }`}
          />
        </div>
      </div>

      {/* Main Page Viewer (Clear Typography & Generous Reading Line Height) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div
          className={`p-6 sm:p-8 rounded-2xl border shadow-sm min-h-[400px] ${
            isDark
              ? 'bg-[#1C1721] border-[#2C2133] text-[#EDE6EE]'
              : 'bg-white border-[#E9E1D8] text-[#2A1E2C]'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 mb-4 border-b text-[11px] font-mono font-semibold ${
              isDark ? 'border-[#2D2335] text-[#8C7B8E]' : 'border-[#F0EAE3] text-[#8C7B8E]'
            }`}
          >
            <span className="uppercase tracking-wider">PAGE {activePage.pageNumber} OF {pages.length}</span>
            <span>{activePage.text.split(/\s+/).filter(Boolean).length} WORDS</span>
          </div>

          <div className="whitespace-pre-line select-text text-sm sm:text-base leading-[1.75] font-normal">
            {highlightMatches(activePage.text, searchQuery)}
          </div>
        </div>
      </div>

      {/* Page Navigation Footer */}
      <div
        className={`p-3 border-t flex items-center justify-between transition-colors ${
          isDark ? 'bg-[#18131B] border-[#2A2030]' : 'bg-[#FAF8F5] border-[#E8DFD5]'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
            disabled={currentPageIndex === 0}
            className={`p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
              isDark ? 'bg-[#251D2A] text-[#D0C2D3] hover:bg-[#302636]' : 'bg-[#EDE5DD] text-[#5E4D61] hover:bg-[#E2D8CE]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`text-xs font-bold px-2 font-mono ${isDark ? 'text-[#D0C2D3]' : 'text-[#5E4D61]'}`}>
            {currentPageIndex + 1} / {pages.length}
          </span>
          <button
            onClick={() => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1))}
            disabled={currentPageIndex === pages.length - 1}
            className={`p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
              isDark ? 'bg-[#251D2A] text-[#D0C2D3] hover:bg-[#302636]' : 'bg-[#EDE5DD] text-[#5E4D61] hover:bg-[#E2D8CE]'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[160px] py-1">
          {pages.map((p, idx) => (
            <button
              key={p.pageNumber}
              onClick={() => setCurrentPageIndex(idx)}
              className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all ${
                currentPageIndex === idx
                  ? 'bg-[#7F6C82] text-white shadow-xs'
                  : isDark
                  ? 'bg-[#251D2A] text-[#8C7B8E] hover:bg-[#302636]'
                  : 'bg-[#EDE5DD] text-[#6E5D70] hover:bg-[#E2D8CE]'
              }`}
            >
              {p.pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
