import React, { useState } from 'react';
import {
  Bot,
  User,
  Copy,
  Check,
  Bookmark,
  RotateCcw,
  Sparkles,
  GraduationCap,
  Award,
  Zap,
  Calendar,
  Flame,
  Code2,
} from 'lucide-react';
import { AIMessage, AIRole } from '../../types/ai';
import { AI_ROLES } from '../../data/aiConstants';
import { Button } from '../ui/Button';
import { InteractiveQuizWidget } from './InteractiveQuizWidget';
import { InteractiveFlashcardsWidget } from './InteractiveFlashcardsWidget';
import { InteractiveStudyPlanWidget } from './InteractiveStudyPlanWidget';
import { InteractiveCornellNotesWidget } from './InteractiveCornellNotesWidget';

export interface ChatMessageItemProps {
  message: AIMessage;
  onCopy: (content: string) => void;
  onSave: (message: AIMessage) => void;
  onRegenerate?: () => void;
  onSelectFollowup?: (prompt: string) => void;
  isLastAssistantMessage?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onCopy,
  onSave,
  onRegenerate,
  onSelectFollowup,
  isLastAssistantMessage = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const isUser = message.sender === 'user';
  const roleId: AIRole = message.metadata?.role || 'tutor';
  const roleMeta = AI_ROLES[roleId] || AI_ROLES.tutor;

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Render role icon
  const getRoleIcon = () => {
    switch (roleId) {
      case 'teacher':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'exam_coach':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'practice_partner':
        return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'study_planner':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'revision_assistant':
        return <Flame className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bot className="w-4 h-4 text-emerald-600" />;
    }
  };

  // Helper to format basic markdown-style text into clean presentation
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-3 leading-relaxed text-sm sm:text-base text-slate-800">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Heading 3
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="text-base sm:text-lg font-bold text-slate-900 font-display mt-4 pt-1 border-b border-slate-100 pb-1 flex items-center gap-2"
              >
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          // Heading 4
          if (trimmed.startsWith('#### ')) {
            return (
              <h4
                key={idx}
                className="text-sm sm:text-base font-bold text-slate-900 font-display mt-3 text-emerald-800"
              >
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }
          // Bullet point
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            const rawText = trimmed.replace(/^(\* |- |• )/, '');
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(rawText) }} />
              </div>
            );
          }
          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const match = trimmed.match(/^(\d+)\.\s(.*)$/);
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2 text-slate-700">
                <span className="font-semibold text-emerald-700 text-xs font-mono mt-0.5 shrink-0">
                  {match?.[1]}.
                </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: formatInlineMarkdown(match?.[2] || ''),
                  }}
                />
              </div>
            );
          }
          // Formula block: $$...$$
          if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
            const formula = trimmed.slice(2, -2).trim();
            return (
              <div
                key={idx}
                className="my-3 p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-center text-sm sm:text-base overflow-x-auto shadow-inner border border-slate-800"
              >
                {formula}
              </div>
            );
          }
          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Standard paragraph
          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
            />
          );
        })}
      </div>
    );
  };

  // Helper for inline markdown like **bold**, *italic*, and `code`
  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-emerald-700 font-mono text-xs">$1</code>')
      .replace(/\\\( (.*?) \\\)/g, '<span class="font-mono text-emerald-800 bg-emerald-50/80 px-1 rounded">$1</span>');
  };

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 my-4 group">
        <div className="max-w-[85%] sm:max-w-[75%] bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 sm:px-5 py-3.5 shadow-sm text-sm sm:text-base leading-relaxed">
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div className="flex items-center justify-end gap-2 mt-1.5 text-[11px] text-emerald-100/90 font-mono">
            <span>{message.timestamp}</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1 shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex items-start gap-3 my-5 group">
      {/* Role Avatar */}
      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0 mt-1 shadow-xs">
        {getRoleIcon()}
      </div>

      {/* Main Message Bubble */}
      <div className="flex-1 min-w-0 max-w-[95%] sm:max-w-[88%] bg-white rounded-2xl rounded-tl-sm border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 font-display">
              {roleMeta.name}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              {roleMeta.badge}
            </span>
            {message.metadata?.mode && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase font-mono tracking-wider font-semibold">
                {message.metadata.mode}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {message.timestamp}
          </span>
        </div>

        {/* Content text */}
        <div className="prose-content">
          {renderFormattedContent(message.content)}
        </div>

        {/* Optional Code Snippet block */}
        {message.metadata?.codeSnippet && (
          <div className="my-3 rounded-xl bg-slate-950 text-slate-100 overflow-hidden border border-slate-800 shadow-md">
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
              <span className="font-mono text-emerald-400 font-medium flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                {message.metadata.codeSnippet.language}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(message.metadata!.codeSnippet!.code)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-slate-200">
              <code>{message.metadata.codeSnippet.code}</code>
            </pre>
          </div>
        )}

        {/* Embedded Interactive Widgets */}
        {message.metadata?.quiz && message.metadata.quiz.length > 0 && (
          <InteractiveQuizWidget quiz={message.metadata.quiz} />
        )}

        {message.metadata?.flashcards && message.metadata.flashcards.length > 0 && (
          <InteractiveFlashcardsWidget cards={message.metadata.flashcards} />
        )}

        {message.metadata?.studyPlan && message.metadata.studyPlan.length > 0 && (
          <InteractiveStudyPlanWidget plan={message.metadata.studyPlan} />
        )}

        {message.metadata?.cornellNotes && (
          <InteractiveCornellNotesWidget
            data={message.metadata.cornellNotes}
            onSaveToNotebook={() => onSave(message)}
            isSaved={message.metadata.isSaved}
          />
        )}

        {/* Suggested Followups */}
        {message.metadata?.suggestedFollowups && message.metadata.suggestedFollowups.length > 0 && onSelectFollowup && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Suggested Next Steps
            </span>
            <div className="flex flex-wrap gap-2">
              {message.metadata.suggestedFollowups.map((followup, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowup(followup)}
                  className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-800 transition-all font-medium flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{followup}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions Bar: Copy, Save, Regenerate */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSave(message)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                message.metadata?.isSaved
                  ? 'text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{message.metadata?.isSaved ? 'Saved to Notes' : 'Save Response'}</span>
            </button>

            {isLastAssistantMessage && onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Study Zone AI Verified Model
          </div>
        </div>
      </div>
    </div>
  );
};
