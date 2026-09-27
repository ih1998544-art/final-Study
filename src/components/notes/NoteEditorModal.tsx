import React, { useState, useEffect } from 'react';
import { StudyNote } from '../../types/notesAndResources';
import { Button } from '../ui/Button';
import { X, Sparkles, BookOpen, Tag, Plus, Trash2 } from 'lucide-react';

interface NoteEditorModalProps {
  isOpen: boolean;
  initialNote?: StudyNote | null;
  onClose: () => void;
  onSave: (noteData: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  initialNote,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [category, setCategory] = useState('STEM');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [cuesText, setCuesText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [aiToolSource, setAiToolSource] = useState('AI Notes Generator');

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setSubject(initialNote.subject);
      setCategory(initialNote.category || 'STEM');
      setContent(initialNote.content);
      setSummary(initialNote.summary || '');
      setCuesText((initialNote.cues || []).join('\n'));
      setTags(initialNote.tags || []);
      setIsAiGenerated(initialNote.isAiGenerated || false);
      setAiToolSource(initialNote.aiToolSource || 'AI Notes Generator');
    } else {
      setTitle('');
      setSubject('Mathematics');
      setCategory('STEM');
      setContent('');
      setSummary('');
      setCuesText('');
      setTags(['Study Notes']);
      setIsAiGenerated(false);
      setAiToolSource('AI Notes Generator');
    }
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const cues = cuesText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      subject,
      category,
      content: content.trim(),
      summary: summary.trim() || undefined,
      cues: cues.length > 0 ? cues : undefined,
      tags,
      isAiGenerated,
      aiToolSource: isAiGenerated ? aiToolSource : undefined,
    });

    onClose();
  };

  const subjectsList = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Economics',
    'Biology',
    'English & Writing',
    'Languages',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {initialNote ? 'Edit Study Note' : 'Create New Study Note'}
              </h2>
              <p className="text-xs text-slate-500">
                Organize concepts with Cornell cues, markdown formulas, and subject tags.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Note Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Linear Algebra: Eigenvalues & Diagonalization"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {subjectsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI-Generated Note Flag */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">Save as AI-Generated Output</span>
            </div>
            <div className="flex items-center gap-3">
              {isAiGenerated && (
                <select
                  value={aiToolSource}
                  onChange={(e) => setAiToolSource(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] text-slate-700"
                >
                  <option value="AI Notes Generator">AI Notes Generator</option>
                  <option value="AI Summarizer">AI Summarizer</option>
                  <option value="AI Tutor">AI Tutor</option>
                  <option value="Concept Explainer">Concept Explainer</option>
                  <option value="Formula Helper">Formula Helper</option>
                </select>
              )}
              <input
                type="checkbox"
                checked={isAiGenerated}
                onChange={(e) => setIsAiGenerated(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 font-display">
                Note Body (Markdown & Latex supported)
              </label>
              <span className="text-[10px] text-slate-400">Headings, lists, code blocks</span>
            </div>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or paste note body here... Support markdown like # Heading, - Bullet, $$formula$$"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Cornell Format Option: Cues & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Cornell Cue Questions (1 per line)
              </label>
              <textarea
                rows={3}
                value={cuesText}
                onChange={(e) => setCuesText(e.target.value)}
                placeholder="What is det(A - λI)?&#10;When is matrix diagonalizable?"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Cornell Summary Box (Bottom)
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="2-3 sentence core takeaway..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tags Manager */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 font-display flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Tags & Keywords</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag} className="text-xs cursor-pointer">
                Add Tag
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!title.trim() || !content.trim()}
              className="gap-2 cursor-pointer shadow-xs"
            >
              <span>{initialNote ? 'Update Note' : 'Save Study Note'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
