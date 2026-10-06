import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Layers } from 'lucide-react';
import { SAMPLE_DOCS } from '../data/sampleDocs';

export default function FileUpload({ onFileUpload, onSelectSample, isProcessing, theme }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const isDark = theme === 'dark';

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    const validExtensions = ['.pdf', '.txt', '.md'];
    const name = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => name.endsWith(ext));

    if (!isValid) {
      alert('Please upload a PDF (.pdf), Text (.txt), or Markdown (.md) file.');
      return;
    }

    onFileUpload(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 flex flex-col justify-center">
      {/* 1. Clean & Legible Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border ${
            isDark
              ? 'bg-[#251D2B] border-[#3E3048] text-[#D0C2D3]'
              : 'bg-[#EFEAE2] border-[#DCD3C7] text-[#6E5D70]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#A594AB]" />
          <span>AI Document Research & QA</span>
        </div>

        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] ${
            isDark ? 'text-white' : 'text-[#201624]'
          }`}
        >
          Upload PDF & Start Asking Questions
        </h1>

        <p
          className={`mt-3.5 text-sm sm:text-base leading-relaxed max-w-xl mx-auto ${
            isDark ? 'text-[#B8AAB9]' : 'text-[#605063]'
          }`}
        >
          Drop your document below to instantly extract insights, ask complex questions with verified page citations, and study with flashcards.
        </p>
      </div>

      {/* 2. Drag & Drop Upload Zone (Generous Spacing & High Legibility) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 shadow-xl ${
          isDark
            ? isDragOver
              ? 'border-[#B8AAB9] bg-[#2A2032] scale-[1.01]'
              : 'border-[#3D2E45] bg-[#1E1823] hover:border-[#6B5578] hover:bg-[#251D2B]'
            : isDragOver
            ? 'border-[#7F6C82] bg-[#F3ECF6] scale-[1.01]'
            : 'border-[#D5C9BC] bg-[#FFFFFF] hover:border-[#7F6C82] hover:bg-[#FAF8F5]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform shadow-md ${
              isDark
                ? 'bg-[#2D2335] text-[#D0C2D3] border border-[#443550]'
                : 'bg-[#F2EBF4] text-[#7F6C82] border border-[#E0D1E3]'
            }`}
          >
            {isProcessing ? (
              <div className="w-7 h-7 border-2 border-[#A594AB] border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#201624]'}`}>
            {isProcessing ? 'Analyzing and indexing document...' : 'Click to browse or drop your PDF here'}
          </h3>

          <p className={`text-xs sm:text-sm mt-2 max-w-sm mb-6 leading-normal ${isDark ? 'text-[#A698A9]' : 'text-[#7A6A7D]'}`}>
            Supports PDF, TXT, and Markdown files up to 50MB. Text is processed securely in your browser.
          </p>

          <button
            type="button"
            disabled={isProcessing}
            className="px-7 py-3 rounded-full bg-[#7F6C82] hover:bg-[#6D5A70] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <FileText className="w-4 h-4" /> Select PDF File
          </button>
        </div>

        {/* Feature badges footer */}
        <div
          className={`mt-8 pt-5 border-t flex items-center justify-center flex-wrap gap-6 text-xs font-medium ${
            isDark ? 'border-[#2F2437] text-[#B8AAB9]' : 'border-[#EAE3D9] text-[#6A5A6D]'
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Page Citations
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Summaries
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Client Privacy
          </span>
        </div>
      </div>

      {/* 3. Sample Documents (Clean Cards with Crisp Typography) */}
      <div className="mt-10">
        <p className={`text-center text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-[#8F7E93]' : 'text-[#8A798D]'}`}>
          Or explore with a sample document:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_DOCS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectSample(doc)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm ${
                isDark
                  ? 'bg-[#1E1823] border-[#2E2335] hover:border-[#7F6C82] hover:bg-[#251D2B]'
                  : 'bg-[#FFFFFF] border-[#E8DFD5] hover:border-[#7F6C82] hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-md border ${
                      isDark
                        ? 'bg-[#2A2030] text-[#D0C2D3] border-[#3E3048]'
                        : 'bg-[#F2EBF4] text-[#6E5A70] border-[#DFCEDF]'
                    }`}
                  >
                    {doc.category}
                  </span>
                  <span className={`text-xs font-mono font-medium ${isDark ? 'text-[#8A7A8D]' : 'text-[#8C7B8E]'}`}>
                    {doc.numPages} Pages
                  </span>
                </div>
                <h4 className={`text-sm font-bold truncate leading-snug ${isDark ? 'text-white' : 'text-[#201624]'}`}>
                  {doc.title}
                </h4>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isDark
                    ? 'bg-[#2A2030] text-[#D0C2D3] group-hover:bg-[#7F6C82] group-hover:text-white'
                    : 'bg-[#EDE5DC] text-[#6E5D70] group-hover:bg-[#7F6C82] group-hover:text-white'
                }`}
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
