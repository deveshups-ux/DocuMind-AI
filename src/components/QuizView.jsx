import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizView({ quiz = [], onRegenerate, isLoading }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (quiz.length === 0) {
    return (
      <div className="p-16 text-center text-[#7A6A7D]">
        <HelpCircle className="w-8 h-8 text-[#7F6C82] mx-auto mb-3 animate-pulse" />
        <p className="text-base font-semibold">Formulating comprehension quiz...</p>
      </div>
    );
  }

  const handleSelect = (qIdx, optIdx) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleFinish = () => {
    setShowResults(true);
    const finalScore = calculateScore();
    if (finalScore >= quiz.length * 0.7) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === quiz.length;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]/50">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Comprehension & Knowledge Check
          </h3>
          <p className="text-xs text-[#8C7B8E] mt-1">
            Test your grasp on the source document's core concepts
          </p>
        </div>

        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EDE5DD] hover:bg-[#E2D8CE] text-xs font-bold text-[#5E4D61] transition-colors shadow-xs"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>New Quiz</span>
        </button>
      </div>

      {/* Score Banner if completed */}
      {showResults && (
        <div className="p-6 rounded-[28px] bg-[#7F6C82] text-white flex items-center justify-between shadow-xl animate-fadeIn">
          <div>
            <div className="text-xs font-bold text-[#EADEEA] uppercase tracking-wider">Your Final Score</div>
            <div className="text-2xl sm:text-3xl font-black mt-1">
              {score} / {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-white text-[#5E4C60] text-xs font-bold rounded-full shadow-lg hover:bg-[#FAF8F5] transition-colors"
          >
            Retry Quiz
          </button>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {quiz.map((q, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={qIdx}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E9E0D6] shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm sm:text-base font-bold text-[#201624] leading-snug">
                  {qIdx + 1}. {q.question}
                </h4>
                {q.page && (
                  <span className="shrink-0 text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[#F3ECF5] text-[#6E5971] border border-[#DFCEDF]">
                    Page {q.page}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'bg-[#FAF8F5] border-[#E8DFD5] text-[#3E2E40] hover:border-[#7F6C82] hover:bg-[#F9F5F9]';

                  if (userChoice === optIdx) {
                    optStyle = 'bg-[#F2EBF4] border-[#7F6C82] text-[#3A293C] font-bold shadow-xs';
                  }

                  if (showResults) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (userChoice === optIdx && !isCorrect) {
                      optStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${optStyle}`}
                    >
                      <span className="leading-normal">{opt}</span>
                      {showResults && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {showResults && userChoice === optIdx && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation on submit */}
              {showResults && q.explanation && (
                <div className="pt-3 text-xs sm:text-sm text-[#6E5F70] border-t border-[#F0EAE3] leading-relaxed">
                  <span className="font-bold text-[#201624]">💡 Source Finding: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!showResults && (
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={!allAnswered}
            className="px-8 py-3.5 rounded-full bg-[#7F6C82] hover:bg-[#6D5A70] text-white font-bold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95"
          >
            Submit & Review Results
          </button>
        </div>
      )}
    </div>
  );
}
