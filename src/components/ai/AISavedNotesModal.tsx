import React, { useState } from 'react';
import {
  Bookmark,
  Search,
  Trash2,
  Copy,
  Check,
  FileDown,
  BookOpen,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';
import { SavedNote } from '../../types/ai';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface AISavedNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: SavedNote[];
  onDeleteNote: (id: string) => void;
  onSelectNote: (note: SavedNote) => void;
}

export const AISavedNotesModal: React.FC<AISavedNotesModalProps> = ({
  isOpen,
  onClose,
  savedNotes,
  onDeleteNote,
  onSelectNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = savedNotes.filter((note) => {
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.subjectName.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    const combined = savedNotes
      .map(
        (n) =>
          `========================================\n${n.title}\nSubject: ${n.subjectName} | Mode: ${n.mode} | Date: ${n.timestamp}\n========================================\n\n${n.content}\n\n`
      )
      .join('\n');

    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudyZone-Saved-Notes-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Saved Notes & Study Artifacts"
      description={`You have ${savedNotes.length} saved AI study notes and pedagogical summaries.`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Search bar & Export */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search saved notes by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>
          {savedNotes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="shrink-0 w-full sm:w-auto text-xs"
            >
              <FileDown className="w-3.5 h-3.5 mr-1.5" />
              Export All (.txt)
            </Button>
          )}
        </div>

        {/* Notes list */}
        <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Bookmark className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {searchQuery ? 'No notes matched your search' : 'No saved notes yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try a different keyword or subject title.'
                  : 'Click the "Save Response" button on any AI response in your chat to bookmark it here.'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {note.subjectName}
                      </span>
                      <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {note.mode}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {note.timestamp}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">
                      {note.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(note.id, note.content)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Copy content"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>

                <div className="pt-1 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
