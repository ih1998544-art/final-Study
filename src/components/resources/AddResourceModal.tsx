import React, { useState } from 'react';
import { AcademicResourceItem, ResourceType } from '../../types/notesAndResources';
import { Button } from '../ui/Button';
import { X, Plus, FileText, Link as LinkIcon, BookOpen, Sparkles } from 'lucide-react';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: Omit<AcademicResourceItem, 'id' | 'dateAdded'>) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAddResource,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('pdf');
  const [subject, setSubject] = useState('Mathematics');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [fileSizeOrFormat, setFileSizeOrFormat] = useState('1.8 MB PDF');
  const [previewContent, setPreviewContent] = useState('');
  const [tagsInput, setTagsInput] = useState('Reference, Exam');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddResource({
      title: title.trim(),
      type,
      subject,
      description: description.trim(),
      fileSizeOrFormat: type === 'pdf' ? fileSizeOrFormat : type === 'important_link' ? 'Web Resource' : 'Study Resource',
      url: url.trim() || undefined,
      previewContent: previewContent.trim() || undefined,
      tags: tags.length > 0 ? tags : ['Resource'],
      isBookmarked: false,
    });

    onClose();
  };

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Economics', 'Biology', 'General Academic'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Add Academic Resource</h3>
              <p className="text-xs text-slate-500">Save PDFs, links, or lesson references</p>
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
            <label className="text-xs font-bold text-slate-700 font-display">Resource Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AP Physics Mechanics Formula & Constant Sheet"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">Resource Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ResourceType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="pdf">PDF Document</option>
                <option value="study_material">Study Material / Cheat Sheet</option>
                <option value="saved_lesson">Saved Curriculum Lesson</option>
                <option value="saved_ai_response">Saved AI Response / Proof</option>
                <option value="important_link">Important Academic Link</option>
              </select>
            </div>

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
          </div>

          {type === 'important_link' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">URL Link</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ocw.mit.edu/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display">Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this resource cover and when should it be used?"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Formula, Exam, MIT, Reference"
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
              disabled={!title.trim() || !description.trim()}
              className="cursor-pointer shadow-xs"
            >
              Save Resource
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
