import React, { useState, useEffect } from 'react';
import { FlashcardDeck, Flashcard } from '../../types/notesAndResources';
import { Button } from '../ui/Button';
import {
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  Layers,
} from 'lucide-react';

interface FlashcardReviewModalProps {
  isOpen: boolean;
  deck: FlashcardDeck | null;
  onClose: () => void;
  onUpdateCardStatus: (deckId: string, cardId: string, status: 'known' | 'difficult') => void;
}

export const FlashcardReviewModal: React.FC<FlashcardReviewModalProps> = ({
  isOpen,
  deck,
  onClose,
  onUpdateCardStatus,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [knownInSession, setKnownInSession] = useState(0);
  const [difficultInSession, setDifficultInSession] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowHint(false);
      setKnownInSession(0);
      setDifficultInSession(0);
      setIsCompleted(false);
    }
  }, [isOpen, deck?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || isCompleted || !deck || deck.cards.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight' && isFlipped) {
        handleMarkKnown();
      } else if (e.code === 'ArrowLeft' && isFlipped) {
        handleMarkDifficult();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCompleted, isFlipped, currentIndex, deck]);

  if (!isOpen || !deck) return null;

  const cards = deck.cards;
  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleMarkKnown = () => {
    if (!currentCard) return;
    onUpdateCardStatus(deck.id, currentCard.id, 'known');
    setKnownInSession((prev) => prev + 1);
    handleNext();
  };

  const handleMarkDifficult = () => {
    if (!currentCard) return;
    onUpdateCardStatus(deck.id, currentCard.id, 'difficult');
    setDifficultInSession((prev) => prev + 1);
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setKnownInSession(0);
    setDifficultInSession(0);
    setIsCompleted(false);
  };

  if (cards.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-center space-y-4">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 font-display">No cards in this deck</h3>
          <p className="text-xs text-slate-500">Add flashcards to begin your spaced-repetition study review.</p>
          <Button variant="primary" size="sm" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentIndex + (isCompleted ? 1 : 0)) / cards.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {deck.subject}
              </span>
              <span className="text-xs text-slate-400">· Review Session</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display truncate max-w-md">
              {deck.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>
              Card {isCompleted ? cards.length : currentIndex + 1} of {cards.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-700 font-semibold">✓ {knownInSession} Known</span>
              <span className="text-amber-700 font-semibold">⚡ {difficultInSession} Difficult</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* STUDY CARD OR COMPLETION SCREEN */}
        {!isCompleted && currentCard ? (
          <div className="space-y-6">
            {/* The 3D Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full min-h-[260px] sm:min-h-[300px] rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all select-none group"
            >
              {/* Card Top Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-700">
                  {isFlipped ? 'Answer / Solution' : 'Question / Concept'}
                </span>
                <span className="flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Click or Space to Flip</span>
                </span>
              </div>

              {/* Main Prompt or Answer */}
              <div className="my-auto py-4 text-center">
                <p className="text-base sm:text-xl font-bold text-slate-900 font-display leading-relaxed">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              {/* Card Bottom Indicator & Hint */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <div>
                  {currentCard.hint && !isFlipped && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(!showHint);
                      }}
                      className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHint ? `Hint: ${currentCard.hint}` : 'Need a hint?'}</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  Reviews: {currentCard.reviewCount}
                </div>
              </div>
            </div>

            {/* Assessment Action Bar */}
            <div className="pt-2">
              {!isFlipped ? (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setIsFlipped(true)}
                    className="w-full justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <RotateCw className="w-4 h-4 text-emerald-600" />
                    <span>Flip Card to Check Answer (Space)</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleMarkDifficult}
                    className="py-3 px-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Mark Difficult (← Left Arrow)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkKnown}
                    className="py-3 px-4 rounded-xl border border-emerald-300 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Mark Known (Right Arrow →)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* COMPLETION RECAP */
          <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Review Session Completed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                You reviewed all {cards.length} cards in "{deck.title}".
              </p>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Cards</span>
                <span className="text-base font-bold text-slate-900 font-display">{cards.length}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Known</span>
                <span className="text-base font-bold text-emerald-800 font-display">{knownInSession}</span>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span className="text-amber-700 block text-[10px] uppercase font-semibold">Difficult</span>
                <span className="text-base font-bold text-amber-800 font-display">{difficultInSession}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRestart} className="gap-1.5 cursor-pointer">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Restart Review</span>
              </Button>
              <Button variant="primary" size="sm" onClick={onClose} className="cursor-pointer shadow-xs">
                <span>Done & Return</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
