import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCw,
  ArrowLeft,
  ChevronDown,
  X,
  Keyboard,
  Info,
  Layers,
  History,
  BookmarkCheck,
} from 'lucide-react';
import { StudyToolDefinition, StudyToolId, StudyToolResult } from '../../types/studyTools';
import { STUDY_TOOLS_REGISTRY } from '../../data/studyToolsData';
import { studyToolsService } from '../../services/studyToolsService';
import { ToolIcon } from './ToolIcon';
import { ToolOptionControl } from './ToolOptionControl';
import { ToolResultRenderer } from './ToolResultRenderer';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface ToolWorkspaceProps {
  tool: StudyToolDefinition;
  onBackToDashboard: () => void;
  onSelectTool: (toolId: StudyToolId) => void;
  initialPrompt?: string;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  onBackToDashboard,
  onSelectTool,
  initialPrompt = '',
}) => {
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [options, setOptions] = useState<Record<string, string | number | boolean>>(() => {
    const initial: Record<string, any> = {};
    tool.options.forEach((opt) => {
      initial[opt.id] = opt.defaultValue;
    });
    return initial;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentResult, setCurrentResult] = useState<StudyToolResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync options when switching tools
  useEffect(() => {
    const freshOptions: Record<string, any> = {};
    tool.options.forEach((opt) => {
      freshOptions[opt.id] = opt.defaultValue;
    });
    setOptions(freshOptions);
    setCurrentResult(null);
    setIsSaved(false);
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
    }
  }, [tool.id, initialPrompt]);

  // Loading animation message sequence
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 3);
    }, 450);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleOptionChange = (optionId: string, val: string | number | boolean) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: val,
    }));
  };

  const handleGenerate = async () => {
    if (!inputPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setIsSaved(false);

    try {
      const result = await studyToolsService.generateToolResult(tool.id, inputPrompt, options);
      setCurrentResult(result);
      showToast({
        type: 'success',
        title: `${tool.shortName} Generated`,
        message: 'Your educational synthesis is ready for review.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Unable to complete synthesis. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResult = () => {
    if (!currentResult) return;
    studyToolsService.saveResult(currentResult);
    setIsSaved(true);
    showToast({
      type: 'success',
      title: 'Saved to Library',
      message: `"${tool.title}" output saved to your Study Zone library.`,
    });
  };

  // Shortcut: Cmd/Ctrl + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  const loadingMessages = [
    'Analyzing prompt and curriculum context...',
    'Synthesizing pedagogical framework and evidence...',
    'Formulating high-yield structured output...',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-24 md:pb-16">
      {/* Top Breadcrumb & Switcher Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All 15 Study Tools</span>
        </button>

        {/* Quick Tool Switcher Dropdown */}
        <div className="relative">
          <select
            value={tool.id}
            onChange={(e) => onSelectTool(e.target.value as StudyToolId)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-slate-800 shadow-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
          >
            {STUDY_TOOLS_REGISTRY.map((t) => (
              <option key={t.id} value={t.id}>
                Switch Tool: {t.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Tool Header Card: Title, Badge, Description */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start gap-4">
        <ToolIcon name={tool.iconName} colorScheme={tool.colorScheme} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {tool.title}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              {tool.badge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {tool.description}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-slate-500 text-xs">
            <Info className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span className="italic">{tool.detailedInstruction}</span>
          </div>
        </div>
      </div>

      {/* Input & Configuration Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-slate-800 font-display">
              {tool.inputLabel}
            </label>
            {inputPrompt.length > 0 && (
              <button
                onClick={() => setInputPrompt('')}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={4}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tool.inputPlaceholder}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all resize-y"
            />
          </div>

          {/* Quick-Fill Sample Prompts */}
          {tool.samplePrompts.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Try Sample Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tool.samplePrompts.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputPrompt(sample);
                      textareaRef.current?.focus();
                    }}
                    className="text-left text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80 hover:border-emerald-200 transition-colors cursor-pointer"
                  >
                    "{sample.slice(0, 55)}..."
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Options Area (Consistent Grid / Flex) */}
        {tool.options.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Tool Options & Parameters
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {tool.options.map((opt) => (
                <ToolOptionControl
                  key={opt.id}
                  option={opt}
                  value={options[opt.id]}
                  onChange={(val) => handleOptionChange(opt.id, val)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Row: Generate Button & Shortcut */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Keyboard className="w-3.5 h-3.5" />
            <span>
              Press <strong className="text-slate-600">⌘ + Enter</strong> to generate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerate}
              disabled={!inputPrompt.trim() || isLoading}
              className="gap-2 px-5 py-2.5 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Generate with {tool.shortName}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 font-display">
              {loadingMessages[loadingStep]}
            </h3>
            <p className="text-xs text-slate-500">
              Applying pedagogical rules and syllabus benchmarks for {tool.title}...
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
            <div className="w-2/3 h-full bg-emerald-600 rounded-full animate-progress" />
          </div>
        </div>
      )}

      {/* Result Area (Copy, Save, Regenerate inside ToolResultRenderer) */}
      {currentResult && !isLoading && (
        <div className="space-y-2">
          <ToolResultRenderer
            result={currentResult}
            toolTitle={tool.title}
            onRegenerate={handleGenerate}
            onSave={handleSaveResult}
            isSaved={isSaved}
          />
        </div>
      )}
    </div>
  );
};
