import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { X, PlusCircle, HelpCircle } from 'lucide-react';

interface CardEditorModalProps {
  isOpen: boolean;
  deckTitle: string;
  onClose: () => void;
  onAddCard: (card: { front: string; back: string; hint?: string }) => void;
}

export const CardEditorModal: React.FC<CardEditorModalProps> = ({
  isOpen,
  deckTitle,
  onClose,
  onAddCard,
}) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    onAddCard({
      front: front.trim(),
      back: back.trim(),
      hint: hint.trim() || undefined,
    });

    setFront('');
    setBack('');
    setHint('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Add Card to Deck</h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{deckTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display">
              Card Front (Question / Prompt / Concept)
            </label>
            <textarea
              required
              rows={3}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="e.g. What is the characteristic equation used to solve for matrix eigenvalues?"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display">
              Card Back (Answer / Derivation / Explanation)
            </label>
            <textarea
              required
              rows={4}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="e.g. det(A - λI) = 0. Roots of this polynomial define the eigenvalues."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Study Hint (Optional)</span>
            </label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="e.g. Think about when (A - λI)v = 0 has a non-trivial solution"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!front.trim() || !back.trim()}
              className="cursor-pointer shadow-xs"
            >
              Add Card
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
