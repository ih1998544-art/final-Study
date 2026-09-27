import React, { useState } from 'react';
import { Layers, ChevronLeft, ChevronRight, RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';
import { FlashcardItem } from '../../types/ai';
import { Button } from '../ui/Button';

export interface InteractiveFlashcardsWidgetProps {
  cards: FlashcardItem[];
}

export const InteractiveFlashcardsWidget: React.FC<InteractiveFlashcardsWidgetProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];
  const isMastered = masteredIds.has(currentCard.id || String(currentIndex));

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = () => {
    const cardKey = currentCard.id || String(currentIndex);
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardKey)) {
        next.delete(cardKey);
      } else {
        next.add(cardKey);
      }
      return next;
    });
  };

  return (
    <div className="my-4 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">
              Spaced Recall Flashcard Deck
            </h4>
            <span className="text-[11px] text-slate-500">
              Active Recall · Click card to flip
            </span>
          </div>
        </div>

        {/* Mastered Progress Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Card <strong>{currentIndex + 1}</strong> of <strong>{cards.length}</strong>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
            {masteredIds.size} / {cards.length} Mastered
          </span>
        </div>
      </div>

      {/* 3D Flippable Card Stage */}
      <div className="py-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[180px] sm:min-h-[200px] p-6 rounded-xl border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between ${
            isFlipped
              ? 'bg-emerald-950 text-emerald-50 border-emerald-800 shadow-md ring-1 ring-emerald-600/30'
              : 'bg-gradient-to-br from-slate-50 to-slate-100/80 text-slate-900 border-slate-200 hover:border-emerald-300 hover:shadow-sm'
          }`}
        >
          {/* Card Top Label */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                isFlipped
                  ? 'bg-emerald-900/80 text-emerald-300'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {isFlipped ? 'Answer & Explanation' : 'Prompt / Question'}
            </span>

            {isMastered && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
                <Check className="w-3 h-3" /> Mastered
              </span>
            )}
          </div>

          {/* Card Content */}
          <div className="my-auto py-3 text-center">
            <p
              className={`text-base sm:text-lg font-medium leading-relaxed font-display ${
                isFlipped ? 'text-emerald-100' : 'text-slate-800'
              }`}
            >
              {isFlipped ? currentCard.back : currentCard.front}
            </p>

            {/* Optional Hint on Front */}
            {!isFlipped && currentCard.hint && showHint && (
              <div className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left">
                <strong>Hint:</strong> {currentCard.hint}
              </div>
            )}
          </div>

          {/* Card Bottom Hint / Instructions */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span>
              {isFlipped ? 'Click again to view question' : 'Click anywhere to reveal explanation'}
            </span>

            {!isFlipped && currentCard.hint && !showHint && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(true);
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Show Hint
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={cards.length <= 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={cards.length <= 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isMastered ? 'secondary' : 'outline'}
            size="sm"
            onClick={toggleMastered}
            className={isMastered ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : ''}
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            {isMastered ? 'Marked Mastered' : 'Mark as Mastered'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsFlipped(false);
              setShowHint(false);
            }}
            title="Reset flip"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};
