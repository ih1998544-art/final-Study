import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  RotateCw,
  Download,
  Share2,
  Code2,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { StudyToolResult } from '../../types/studyTools';
import { Button } from '../ui/Button';
import { InteractiveQuizWidget } from '../ai/InteractiveQuizWidget';
import { InteractiveFlashcardsWidget } from '../ai/InteractiveFlashcardsWidget';
import { InteractiveCornellNotesWidget } from '../ai/InteractiveCornellNotesWidget';
import { InteractiveStudyPlanWidget } from '../ai/InteractiveStudyPlanWidget';

interface ToolResultRendererProps {
  result: StudyToolResult;
  toolTitle: string;
  onRegenerate: () => void;
  onSave: () => void;
  isSaved?: boolean;
}

export const ToolResultRenderer: React.FC<ToolResultRendererProps> = ({
  result,
  toolTitle,
  onRegenerate,
  onSave,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(result.formattedMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result.formattedMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${result.toolId}_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper to render markdown text with basic block parsing
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (key: number) => {
      if (tableRows.length > 0) {
        const [headers, separator, ...dataRows] = tableRows;
        elements.push(
          <div key={`table_${key}`} className="my-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {headers?.map((h, i) => (
                    <th key={i} className="p-3 font-semibold text-slate-900 border-r border-slate-200 last:border-r-0">
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 text-slate-700 border-r border-slate-100 last:border-r-0 font-normal">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Table row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        const cols = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        tableRows.push(cols);
        return;
      } else if (inTable) {
        inTable = false;
        flushTable(idx);
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3
            key={idx}
            className="text-lg sm:text-xl font-bold text-slate-900 font-display mt-6 mb-3 first:mt-0 flex items-center gap-2"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={idx} className="text-sm sm:text-base font-bold text-slate-800 font-display mt-4 mb-2">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      } else if (trimmed.startsWith('##### ')) {
        elements.push(
          <h5 key={idx} className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider mt-3 mb-1">
            {trimmed.replace('##### ', '')}
          </h5>
        );
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote
            key={idx}
            className="my-3 pl-4 border-l-3 border-emerald-500 bg-emerald-50/40 p-3 rounded-r-lg text-slate-800 text-sm italic font-serif"
          >
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        elements.push(
          <li key={idx} className="text-slate-700 text-xs sm:text-sm ml-5 list-disc my-1 leading-relaxed">
            {renderInlineSpans(trimmed.replace(/^(\* |- )/, ''))}
          </li>
        );
      } else if (trimmed.match(/^\d+\.\s/)) {
        elements.push(
          <div key={idx} className="text-slate-700 text-xs sm:text-sm ml-4 my-1.5 leading-relaxed font-medium">
            {renderInlineSpans(trimmed)}
          </div>
        );
      } else if (trimmed === '---') {
        elements.push(<hr key={idx} className="my-5 border-slate-200" />);
      } else if (trimmed.length > 0) {
        elements.push(
          <p key={idx} className="text-slate-700 text-xs sm:text-sm my-2 leading-relaxed">
            {renderInlineSpans(trimmed)}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  // Helper for inline bold, italic, and code highlighting
  const renderInlineSpans = (text: string) => {
    // Basic regex replace for bold **text**
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-800">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md bg-slate-100 text-emerald-800 font-mono text-[11px] sm:text-xs border border-slate-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all animate-in fade-in duration-200">
      {/* Top Result Action Toolbar */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
            Generated Result
          </span>
          <span className="text-[11px] text-slate-400">· {result.timestamp}</span>
        </div>

        {/* Copy, Save, Regenerate Buttons */}
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            className="text-xs h-8 px-2.5 gap-1.5 bg-white hover:bg-slate-50 cursor-pointer"
            title="Copy full text to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </Button>

          {/* Save Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className={`text-xs h-8 px-2.5 gap-1.5 bg-white cursor-pointer ${
              isSaved
                ? 'border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
            title="Save output to your Study Zone library"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-600 fill-emerald-600' : 'text-slate-500'}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>

          {/* Regenerate Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            className="text-xs h-8 px-2.5 gap-1.5 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
            title="Regenerate with current parameters"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Regenerate</span>
          </Button>

          {/* Download Markdown */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-xs h-8 w-8 p-0 text-slate-500 hover:text-slate-800"
            title="Export as Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Result Content Area */}
      <div className="p-5 sm:p-7">
        {/* Render Formatted Markdown */}
        <div className="prose prose-slate max-w-none">
          {renderFormattedMarkdown(result.formattedMarkdown)}
        </div>

        {/* Specialized Interactive Widgets */}
        {result.structuredData?.codeSnippet && (
          <div className="mt-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-slate-300 uppercase">
                  {result.structuredData.codeSnippet.language}
                </span>
              </div>
              <button
                onClick={() => handleCopyCode(result.structuredData!.codeSnippet!.code)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300 leading-relaxed">
              <code>{result.structuredData.codeSnippet.code}</code>
            </pre>
          </div>
        )}

        {result.structuredData?.formulaSnippet && (
          <div className="mt-5 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-display">
              Formula Quick Reference Table
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2 pr-3">Symbol</th>
                    <th className="py-2 pr-3">Physical Meaning</th>
                    <th className="py-2">Standard SI Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.structuredData.formulaSnippet.variables.map((v, i) => (
                    <tr key={i} className="text-slate-800">
                      <td className="py-2 pr-3 font-mono font-bold text-emerald-700">{v.symbol}</td>
                      <td className="py-2 pr-3">{v.meaning}</td>
                      <td className="py-2 font-mono text-slate-500">{v.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {result.structuredData?.quizQuestions && (
          <div className="mt-6">
            <InteractiveQuizWidget quiz={result.structuredData.quizQuestions} />
          </div>
        )}

        {result.structuredData?.flashcards && (
          <div className="mt-6">
            <InteractiveFlashcardsWidget cards={result.structuredData.flashcards} />
          </div>
        )}

        {result.structuredData?.cornellNotes && (
          <div className="mt-6">
            <InteractiveCornellNotesWidget
              data={result.structuredData.cornellNotes}
              onSaveToNotebook={onSave}
              isSaved={isSaved}
            />
          </div>
        )}

        {result.structuredData?.studyPlan && (
          <div className="mt-6">
            <InteractiveStudyPlanWidget plan={result.structuredData.studyPlan} />
          </div>
        )}
      </div>

      {/* Bottom Action Footer: Copy, Save, Regenerate, Export */}
      <div className="px-5 sm:px-7 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{toolTitle}</span>
          <span>· Generated at {result.timestamp}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            className="text-xs h-8 px-3 gap-1.5 bg-white hover:bg-slate-50 cursor-pointer"
            title="Copy full text to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </Button>

          {/* Save Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className={`text-xs h-8 px-3 gap-1.5 bg-white cursor-pointer ${
              isSaved
                ? 'border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
            title="Save output to your Study Zone library"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-600 fill-emerald-600' : 'text-slate-500'}`} />
            <span>{isSaved ? 'Saved to Library' : 'Save'}</span>
          </Button>

          {/* Regenerate Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            className="text-xs h-8 px-3 gap-1.5 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
            title="Regenerate with current parameters"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Regenerate</span>
          </Button>

          {/* Download Markdown */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-xs h-8 px-2.5 gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Export as Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .md</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
