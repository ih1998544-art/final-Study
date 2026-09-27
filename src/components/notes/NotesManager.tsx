import React, { useState } from 'react';
import { StudyNote } from '../../types/notesAndResources';
import { notesAndResourcesService } from '../../services/notesAndResourcesService';
import { NoteEditorModal } from './NoteEditorModal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  Search,
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  Sparkles,
  Pin,
  Calendar,
  Tag,
  Check,
  Copy,
  ChevronRight,
  X,
  Layers,
} from 'lucide-react';

interface NotesManagerProps {
  onNavigateToStudyTools?: () => void;
}

export const NotesManager: React.FC<NotesManagerProps> = ({ onNavigateToStudyTools }) => {
  const [notes, setNotes] = useState<StudyNote[]>(() => notesAndResourcesService.getNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [filterAiOnly, setFilterAiOnly] = useState(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<StudyNote | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Economics', 'Biology'];

  const filteredNotes = notes.filter((note) => {
    const matchesSubject = selectedSubject === 'all' || note.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesAi = !filterAiOnly || note.isAiGenerated;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSubject && matchesAi && matchesSearch;
  });

  const handleCreateOrUpdate = (noteData: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      const updated = notesAndResourcesService.updateNote(editingNote.id, noteData);
      if (updated) {
        setNotes(notesAndResourcesService.getNotes());
        if (viewingNote?.id === editingNote.id) {
          setViewingNote(updated);
        }
        showToast({
          type: 'success',
          title: 'Note Updated',
          message: `"${updated.title}" successfully saved.`,
        });
      }
    } else {
      const created = notesAndResourcesService.createNote(noteData);
      setNotes(notesAndResourcesService.getNotes());
      showToast({
        type: 'success',
        title: 'Note Created',
        message: `"${created.title}" added to your notebook.`,
      });
    }
    setEditingNote(null);
  };

  const handleDelete = (noteId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      notesAndResourcesService.deleteNote(noteId);
      setNotes(notesAndResourcesService.getNotes());
      if (viewingNote?.id === noteId) {
        setViewingNote(null);
      }
      showToast({
        type: 'info',
        title: 'Note Deleted',
        message: `"${title}" removed from your notebook.`,
      });
    }
  };

  const handleCopyContent = (note: StudyNote) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Note content copied.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title, formulas, or tags..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Buttons Row */}
        <div className="flex items-center gap-2">
          {onNavigateToStudyTools && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToStudyTools}
              className="text-xs h-9 gap-1.5 cursor-pointer bg-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Notes Generator</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingNote(null);
              setIsEditorOpen(true);
            }}
            className="text-xs h-9 gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Note</span>
          </Button>
        </div>
      </div>

      {/* Subject Filter Tabs & AI Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === subj
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {subj === 'all' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterAiOnly}
            onChange={(e) => setFilterAiOnly(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
          />
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI-Generated Only ({notes.filter((n) => n.isAiGenerated).length})</span>
        </label>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => {
          return (
            <div
              key={note.id}
              onClick={() => setViewingNote(note)}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                {/* Card Header: Subject, AI Badge & Pin */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {note.subject}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {note.isAiGenerated && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{note.aiToolSource || 'AI'}</span>
                      </span>
                    )}
                    {note.isPinned && (
                      <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {note.title}
                  </h3>
                  {note.summary && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {note.summary}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {note.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                    >
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{note.tags.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-mono">{note.updatedAt}</span>

                <div className="flex items-center gap-1">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyContent(note);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Copy note text"
                  >
                    {copiedId === note.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingNote(note);
                      setIsEditorOpen(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Edit note"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id, note.title);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-200 p-8 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 font-display">No study notes found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No notes match your current search and subject filters. Create a new note or save AI generated summaries.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingNote(null);
                setIsEditorOpen(true);
              }}
              className="cursor-pointer"
            >
              Create Note Now
            </Button>
          </div>
        )}
      </div>

      {/* Note Reader Modal */}
      {viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-display">
                    {viewingNote.subject}
                  </span>
                  {viewingNote.isAiGenerated && (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{viewingNote.aiToolSource}</span>
                    </span>
                  )}
                  <span className="text-xs text-slate-400">· Updated {viewingNote.updatedAt}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  {viewingNote.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyContent(viewingNote)}
                  className="text-xs h-8 gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingNote(viewingNote);
                    setIsEditorOpen(true);
                  }}
                  className="text-xs h-8 gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Button>

                <button
                  onClick={() => setViewingNote(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Note Body with Cornell Format Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Cue Column if Cornell format */}
              {viewingNote.cues && viewingNote.cues.length > 0 && (
                <div className="lg:col-span-1 bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
                    Cornell Active Recall Cues
                  </div>
                  <div className="space-y-2">
                    {viewingNote.cues.map((cue, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                      >
                        ❓ {cue}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Content Column */}
              <div
                className={`${
                  viewingNote.cues && viewingNote.cues.length > 0 ? 'lg:col-span-2' : 'col-span-full'
                } space-y-4`}
              >
                <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {viewingNote.content}
                </div>

                {/* Summary Box */}
                {viewingNote.summary && (
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-display block">
                      Executive Summary & Key Takeaway
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      {viewingNote.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Row */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {viewingNote.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <span className="font-mono text-[11px] text-slate-400">
                Created on {viewingNote.createdAt}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        initialNote={editingNote}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNote(null);
        }}
        onSave={handleCreateOrUpdate}
      />
    </div>
  );
};
