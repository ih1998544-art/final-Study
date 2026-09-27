import React, { useState } from 'react';
import { AcademicResourceItem, ResourceType } from '../../types/notesAndResources';
import { notesAndResourcesService } from '../../services/notesAndResourcesService';
import { PDFViewerModal } from './PDFViewerModal';
import { AddResourceModal } from './AddResourceModal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  FileText,
  Bookmark,
  ExternalLink,
  BookOpen,
  Sparkles,
  Link as LinkIcon,
  Search,
  Plus,
  Trash2,
  Clock,
  Layers,
  Check,
  Eye,
} from 'lucide-react';

interface AcademicResourcesManagerProps {
  onNavigateToSubjects?: () => void;
  onNavigateToAITutor?: (prompt?: string) => void;
}

export const AcademicResourcesManager: React.FC<AcademicResourcesManagerProps> = ({
  onNavigateToSubjects,
  onNavigateToAITutor,
}) => {
  const [resources, setResources] = useState<AcademicResourceItem[]>(() =>
    notesAndResourcesService.getResources()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<AcademicResourceItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { showToast } = useToast();

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'General Academic', 'STEM'];

  const typeTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Resources', count: resources.length },
    { id: 'pdf', label: 'PDF Documents', count: resources.filter((r) => r.type === 'pdf').length },
    { id: 'saved_lesson', label: 'Saved Lessons', count: resources.filter((r) => r.type === 'saved_lesson').length },
    { id: 'saved_ai_response', label: 'Saved AI Dialogs', count: resources.filter((r) => r.type === 'saved_ai_response').length },
    { id: 'study_material', label: 'Study Materials', count: resources.filter((r) => r.type === 'study_material').length },
    { id: 'important_link', label: 'Academic Links', count: resources.filter((r) => r.type === 'important_link').length },
  ];

  const filteredResources = resources.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || item.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesBookmark = !onlyBookmarked || item.isBookmarked;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSubject && matchesBookmark && matchesSearch;
  });

  const handleToggleBookmark = (id: string, title: string) => {
    notesAndResourcesService.toggleBookmark(id);
    setResources(notesAndResourcesService.getResources());
    showToast({
      type: 'info',
      title: 'Bookmark Updated',
      message: `Updated status for "${title}".`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Remove "${title}" from your library?`)) {
      notesAndResourcesService.deleteResource(id);
      setResources(notesAndResourcesService.getResources());
      showToast({
        type: 'info',
        title: 'Resource Removed',
        message: `"${title}" has been deleted.`,
      });
    }
  };

  const handleAddResource = (data: Omit<AcademicResourceItem, 'id' | 'dateAdded'>) => {
    const added = notesAndResourcesService.addResource(data);
    setResources(notesAndResourcesService.getResources());
    showToast({
      type: 'success',
      title: 'Resource Added',
      message: `"${added.title}" added to academic library.`,
    });
  };

  const getIconForType = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'saved_lesson':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'saved_ai_response':
        return <Sparkles className="w-4 h-4 text-sky-600" />;
      case 'important_link':
        return <LinkIcon className="w-4 h-4 text-indigo-600" />;
      default:
        return <Layers className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search academic PDFs, saved lessons, formula sheets..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs h-9 gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </Button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {typeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedType === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Subject Filter & Bookmarks Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 font-medium">Subject:</span>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedSubject === s
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyBookmarked}
            onChange={(e) => setOnlyBookmarked(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
          />
          <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Bookmarked Only ({resources.filter((r) => r.isBookmarked).length})</span>
        </label>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => {
          return (
            <div
              key={res.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Icon, Type & Bookmark */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                      {getIconForType(res.type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        {res.subject}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                        {res.fileSizeOrFormat}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(res.id, res.title)}
                      className="p-1 rounded text-slate-400 hover:text-amber-500 cursor-pointer"
                      title={res.isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          res.isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(res.id, res.title)}
                      className="p-1 rounded text-slate-300 hover:text-rose-600 cursor-pointer"
                      title="Delete resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-display line-clamp-2">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {res.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {res.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button & Date */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">{res.dateAdded}</span>

                <div>
                  {res.type === 'pdf' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setViewingPdf(res)}
                      className="text-xs h-7 px-3 gap-1 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View PDF</span>
                    </Button>
                  ) : res.url ? (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 text-xs"
                    >
                      <span>{res.externalLinkText || 'Open Link'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : res.type === 'saved_lesson' && onNavigateToSubjects ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onNavigateToSubjects}
                      className="text-xs h-7 px-2.5 gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3 text-emerald-600" />
                      <span>Open Lesson</span>
                    </Button>
                  ) : res.type === 'saved_ai_response' && onNavigateToAITutor ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigateToAITutor(res.title)}
                      className="text-xs h-7 px-2.5 gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Ask AI Tutor</span>
                    </Button>
                  ) : (
                    <span className="text-[11px] text-slate-400">Available offline</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredResources.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-200 p-8 space-y-3">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 font-display">No academic resources found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No materials match your current category, search, or bookmark filter.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer"
            >
              Add New Resource
            </Button>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={Boolean(viewingPdf)}
        resource={viewingPdf}
        onClose={() => setViewingPdf(null)}
      />

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddResource={handleAddResource}
      />
    </div>
  );
};
