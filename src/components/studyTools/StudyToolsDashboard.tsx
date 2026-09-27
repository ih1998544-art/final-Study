import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Zap,
  BookOpen,
  HelpCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { StudyToolDefinition, StudyToolId, ToolCategory } from '../../types/studyTools';
import { STUDY_TOOLS_REGISTRY, TOOL_CATEGORIES } from '../../data/studyToolsData';
import { studyToolsService } from '../../services/studyToolsService';
import { ToolIcon } from './ToolIcon';
import { ToolWorkspace } from './ToolWorkspace';
import { SavedToolsLibraryModal } from './SavedToolsLibraryModal';
import { Button } from '../ui/Button';

interface StudyToolsDashboardProps {
  initialToolId?: StudyToolId | null;
  onNavigateHome?: () => void;
  onNavigateToPractice?: () => void;
  onNavigateToSubjects?: () => void;
}

export const StudyToolsDashboard: React.FC<StudyToolsDashboardProps> = ({
  initialToolId = null,
  onNavigateHome,
  onNavigateToPractice,
  onNavigateToSubjects,
}) => {
  const [selectedToolId, setSelectedToolId] = useState<StudyToolId | null>(initialToolId);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSavedLibraryOpen, setIsSavedLibraryOpen] = useState(false);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');

  React.useEffect(() => {
    if (initialToolId) {
      setSelectedToolId(initialToolId);
    }
  }, [initialToolId]);

  const savedCount = studyToolsService.getSavedResults().length;

  const selectedTool = STUDY_TOOLS_REGISTRY.find((t) => t.id === selectedToolId) || null;

  // Filter tools based on category and search query
  const filteredTools = STUDY_TOOLS_REGISTRY.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLaunchTool = (toolId: StudyToolId, prompt?: string) => {
    setSelectedToolId(toolId);
    setPrefilledPrompt(prompt || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If a tool is active, render its unified ToolWorkspace
  if (selectedTool) {
    return (
      <ToolWorkspace
        tool={selectedTool}
        onBackToDashboard={() => setSelectedToolId(null)}
        onSelectTool={(id) => {
          setSelectedToolId(id);
          setPrefilledPrompt('');
        }}
        initialPrompt={prefilledPrompt}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 pb-24 md:pb-16">
      {/* Hero Header Area */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-10 border border-slate-800 shadow-lg overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Complete Academic Tool Suite · 15 Tools Active</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-display text-white">
            15 Specialized AI Study Tools
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Purpose-built academic instruments designed for active recall, Cornell note synthesis, diagnostic quiz generation, multi-lens concept deconstruction, and timed exam preparation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSavedLibraryOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-9 gap-2 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-300" />
              <span>Saved Outputs Library</span>
              {savedCount > 0 && (
                <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {savedCount}
                </span>
              )}
            </Button>

            <span className="text-xs text-slate-400">
              ⚡ Infinite AI Generations · Real-time Academic Formatting
            </span>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All 15 Tools
          </button>
          {TOOL_CATEGORIES.map((cat) => {
            const count = STUDY_TOOLS_REGISTRY.filter((t) => t.category === cat.id).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by title or feature..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of All 15 Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool, index) => {
          return (
            <div
              key={tool.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group"
            >
              {/* Tool Card Top: Icon, Title, Badge */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <ToolIcon name={tool.iconName} colorScheme={tool.colorScheme} size="md" />
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                {/* Sample Prompt Quick Chip */}
                {tool.samplePrompts[0] && (
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      Quick Try:
                    </span>
                    <button
                      onClick={() => handleLaunchTool(tool.id, tool.samplePrompts[0])}
                      className="text-left text-[11px] text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 p-2 rounded-lg border border-slate-200/80 hover:border-emerald-200 line-clamp-1 transition-colors w-full cursor-pointer"
                    >
                      "{tool.samplePrompts[0]}"
                    </button>
                  </div>
                )}
              </div>

              {/* Tool Card Footer: Launch Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  {tool.options.length} {tool.options.length === 1 ? 'Option' : 'Options'}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLaunchTool(tool.id)}
                  className="text-xs h-8 px-3 gap-1.5 cursor-pointer"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 font-display">No tools match your query</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search keywords or select "All 15 Tools" to explore the catalog.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Saved Library Modal */}
      <SavedToolsLibraryModal
        isOpen={isSavedLibraryOpen}
        onClose={() => setIsSavedLibraryOpen(false)}
        onOpenToolWithPrompt={(toolId, prompt) => handleLaunchTool(toolId, prompt)}
      />
    </div>
  );
};
