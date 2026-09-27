import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { X, Layers, Sparkles } from 'lucide-react';

interface DeckCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeck: (data: { title: string; subject: string; description: string; badgeColor?: string }) => void;
}

export const DeckCreatorModal: React.FC<DeckCreatorModalProps> = ({
  isOpen,
  onClose,
  onCreateDeck,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('emerald');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onCreateDeck({
      title: title.trim(),
      subject,
      description: description.trim(),
      badgeColor: color,
    });

    onClose();
  };

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Economics', 'Biology', 'Languages'];
  const colors = [
    { id: 'emerald', label: 'Emerald' },
    { id: 'sky', label: 'Sky' },
    { id: 'amber', label: 'Amber' },
    { id: 'purple', label: 'Purple' },
    { id: 'rose', label: 'Rose' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Create Flashcard Deck</h3>
              <p className="text-xs text-slate-500">Organize spaced-repetition card sets</p>
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
            <label className="text-xs font-bold text-slate-700 font-display">Deck Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics: Electromagnetic Induction"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">Accent Theme</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {colors.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display">Deck Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of syllabus units or exam topics covered in this deck..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
              disabled={!title.trim() || !description.trim()}
              className="cursor-pointer shadow-xs"
            >
              Create Deck
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
