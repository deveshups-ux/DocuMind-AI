import React, { useState } from 'react';
import { Sparkles, RotateCw, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FlashcardsView({ flashcards = [], onRegenerate, isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState(new Set());

  if (flashcards.length === 0) {
    return (
      <div className="p-16 text-center text-[#7A6A7D]">
        <Sparkles className="w-8 h-8 text-[#7F6C82] mx-auto mb-3 animate-spin" />
        <p className="text-base font-semibold">Synthesizing study flashcards...</p>
      </div>
    );
  }

  const current = flashcards[currentIndex] || flashcards[0];
  const isCardMastered = mastered.has(currentIndex);

  const toggleMastered = (e) => {
    e.stopPropagation();
    const next = new Set(mastered);
    if (next.has(currentIndex)) {
      next.delete(currentIndex);
    } else {
      next.add(currentIndex);
      if (next.size === flashcards.length) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }
    setMastered(next);
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto p-4 sm:p-6 justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]/40">
        <div>
          <h3 className="text-xl font-bold tracking-tight">
            Study & Recall Flashcards
          </h3>
          <p className="text-xs text-[#8C7B8E] mt-0.5">
            Card {currentIndex + 1} of {flashcards.length} • {mastered.size} Mastered
          </p>
        </div>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EDE5DD] hover:bg-[#E2D8CE] text-xs font-semibold text-[#5E4D61] transition-colors shadow-xs"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Flip Card (Plum Card) */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="my-6 min-h-[300px] p-8 sm:p-10 rounded-[32px] bg-[#7F6C82] text-white shadow-xl cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] relative overflow-hidden"
      >
        <div className="flex items-center justify-between text-xs text-[#EFE4EF] font-semibold">
          <span className="uppercase tracking-wider text-[11px]">
            {isFlipped ? '💡 Answer / Explanation' : '❓ Question (Tap to flip)'}
          </span>
          {current.page && (
            <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs text-white font-mono">
              Page {current.page}
            </span>
          )}
        </div>

        <div className="my-auto py-6">
          <p className="text-lg sm:text-xl font-semibold text-white text-center leading-relaxed">
            {isFlipped ? current.answer : current.question}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/20 text-xs font-medium">
          <span className="text-[#EADEEA] text-xs">Click anywhere to flip</span>
          <button
            onClick={toggleMastered}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              isCardMastered
                ? 'bg-white text-[#5E4C60] shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCardMastered ? 'Mastered!' : 'Mark Mastered'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            setIsFlipped(false);
            setCurrentIndex(prev => Math.max(0, prev - 1));
          }}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#EDE5DD] hover:bg-[#E2D8CE] text-xs font-bold text-[#5E4D61] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {flashcards.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === i
                  ? 'w-6 bg-[#7F6C82]'
                  : mastered.has(i)
                  ? 'bg-emerald-500'
                  : 'bg-[#DDD3CB]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            setIsFlipped(false);
            setCurrentIndex(prev => Math.min(flashcards.length - 1, prev + 1));
          }}
          disabled={currentIndex === flashcards.length - 1}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#EDE5DD] hover:bg-[#E2D8CE] text-xs font-bold text-[#5E4D61] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-xs"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
