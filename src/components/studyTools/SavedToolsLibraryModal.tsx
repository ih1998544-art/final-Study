import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Search,
  BookOpen,
  Calendar,
  X,
} from 'lucide-react';
import { StudyToolId, StudyToolResult } from '../../types/studyTools';
import { STUDY_TOOLS_REGISTRY } from '../../data/studyToolsData';
import { studyToolsService } from '../../services/studyToolsService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ToolIcon } from './ToolIcon';
import { useToast } from '../ui/Toast';

interface SavedToolsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenToolWithPrompt: (toolId: StudyToolId, prompt: string) => void;
}

export const SavedToolsLibraryModal: React.FC<SavedToolsLibraryModalProps> = ({
  isOpen,
  onClose,
  onOpenToolWithPrompt,
}) => {
  const [savedItems, setSavedItems] = useState<StudyToolResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<StudyToolResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const items = studyToolsService.getSavedResults();
      setSavedItems(items);
      setSelectedItem(items[0] || null);
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    studyToolsService.removeSavedResult(id);
    const updated = savedItems.filter((item) => item.id !== id);
    setSavedItems(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(updated[0] || null);
    }
    showToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Result removed from your saved library.',
    });
  };

  const handleCopy = async (item: StudyToolResult) => {
    try {
      await navigator.clipboard.writeText(item.formattedMarkdown);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
      showToast({
        type: 'success',
        title: 'Copied to Clipboard',
        message: 'Saved content copied.',
      });
    } catch {
      // Fallback
    }
  };

  const filteredItems = savedItems.filter(
    (item) =>
      item.inputPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.toolId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.formattedMarkdown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Saved Study Tools Library"
      size="xl"
    >
      <div className="flex flex-col h-[70vh]">
        {/* Search & Counter Bar */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your saved notes, quizzes, flashcards, formulas..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500 shrink-0 font-medium">
            {savedItems.length} Saved {savedItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {savedItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 font-display">
              No Saved Results Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              When you generate notes, quizzes, flashcards, or study plans with any of the 15 tools, click the "Save" button to keep them here for quick revision.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 mt-2">
            {/* List column */}
            <div className="w-full md:w-2/5 overflow-y-auto pr-0 md:pr-3 space-y-2 py-2 max-h-[220px] md:max-h-none">
              {filteredItems.map((item) => {
                const toolDef = STUDY_TOOLS_REGISTRY.find((t) => t.id === item.toolId);
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <ToolIcon name={toolDef?.iconName || 'Bot'} size="sm" colorScheme={toolDef?.colorScheme} />
                        <span className="text-xs font-bold text-slate-900 truncate font-display">
                          {toolDef?.shortName || item.toolId}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      "{item.inputPrompt}"
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Preview Column */}
            <div className="w-full md:w-3/5 overflow-y-auto pl-0 md:pl-4 py-2 flex flex-col justify-between">
              {selectedItem ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {selectedItem.toolId.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 font-display">
                        "{selectedItem.inputPrompt}"
                      </h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(selectedItem)}
                        className="h-8 px-2 text-xs"
                      >
                        {copiedId === selectedItem.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(selectedItem.id)}
                        className="h-8 px-2 text-xs text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          onOpenToolWithPrompt(selectedItem.toolId, selectedItem.inputPrompt);
                          onClose();
                        }}
                        className="h-8 px-2.5 text-xs gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open in Tool</span>
                      </Button>
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed max-h-[380px] overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono whitespace-pre-wrap">
                    {selectedItem.formattedMarkdown}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                  Select an item to view preview
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
