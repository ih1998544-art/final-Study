import React, { useState } from 'react';
import { BookMarked, Copy, Check, FileDown, Bookmark } from 'lucide-react';
import { CornellNotesData } from '../../types/ai';
import { Button } from '../ui/Button';

export interface InteractiveCornellNotesWidgetProps {
  data: CornellNotesData;
  onSaveToNotebook?: () => void;
  isSaved?: boolean;
}

export const InteractiveCornellNotesWidget: React.FC<InteractiveCornellNotesWidgetProps> = ({
  data,
  onSaveToNotebook,
  isSaved,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyNotes = () => {
    const text = `Cornell Notes: ${data.title}\nSubject: ${data.subject}\n\n[CUES & QUESTIONS]\n${data.cues.map((c) => `- ${c}`).join('\n')}\n\n[DETAILED NOTES]\n${data.notes.join('\n')}\n\n[EXECUTIVE SUMMARY]\n${data.summary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookMarked className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs sm:text-sm font-semibold tracking-wide font-display text-emerald-300 uppercase">
            Cornell Systematic Notes Format
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {onSaveToNotebook && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveToNotebook}
              className={`text-xs py-1 h-7 border-slate-700 ${
                isSaved ? 'text-emerald-400 border-emerald-500' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3 h-3 mr-1" />
              {isSaved ? 'Saved to Notes' : 'Save to Notes'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyNotes}
            className="text-xs py-1 h-7 border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" /> Copy Notes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Cornell 2-Column Grid */}
      <div className="p-5">
        <div className="mb-4 pb-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
            {data.subject}
          </span>
          <h3 className="text-base font-bold text-slate-900 font-display">
            {data.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 rounded-lg overflow-hidden">
          {/* Cues Column (Left 1/3) */}
          <div className="bg-slate-50/80 p-4 border-b md:border-b-0 md:border-r border-slate-200">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Recall Cues & Questions
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              {data.cues.map((cue, idx) => (
                <li key={idx} className="p-2 rounded bg-white border border-slate-200/80 font-medium">
                  {cue}
                </li>
              ))}
            </ul>
          </div>

          {/* Notes Column (Right 2/3) */}
          <div className="md:col-span-2 p-4 bg-white">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Detailed Lecture / Text Notes
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {data.notes.map((note, idx) => (
                <li key={idx} className="pl-1">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary Row (Bottom) */}
        <div className="mt-4 p-4 rounded-lg bg-emerald-50/60 border border-emerald-200/80">
          <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Executive Pedagogical Summary
          </h5>
          <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
            {data.summary}
          </p>
        </div>
      </div>
    </div>
  );
};
