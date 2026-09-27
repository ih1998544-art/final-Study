import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bot,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { WeakAreaReport } from '../../types/learning';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface WeakAreaDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: WeakAreaReport;
  subjectName: string;
  topicTitle: string;
  onLaunchAIReview: (prompt: string) => void;
  onSwitchToStepByStep: () => void;
}

export const WeakAreaDetectionModal: React.FC<WeakAreaDetectionModalProps> = ({
  isOpen,
  onClose,
  report,
  subjectName,
  topicTitle,
  onLaunchAIReview,
  onSwitchToStepByStep,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Weak Area Detection & Diagnostic Report"
      description={`Automated diagnostic analysis for "${topicTitle}" in ${subjectName}.`}
      size="md"
    >
      <div className="space-y-4">
        {/* Diagnostic Score Card */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Attention Required
              </span>
              <h4 className="text-sm font-bold text-slate-900 font-display">
                Mastery Score: {report.scorePercentage}%
              </h4>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-200/60 text-amber-900 border border-amber-300">
            Below 75% Threshold
          </span>
        </div>

        {/* Identified Gaps */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Identified Knowledge Gaps
          </h5>
          <div className="space-y-1.5">
            {report.identifiedGaps.map((gap, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prescribed Remedies */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Recommended Action Plan
          </h5>
          <div className="space-y-1.5">
            {report.prescribedActions.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center gap-2 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onSwitchToStepByStep();
            }}
            className="w-full sm:w-auto text-xs justify-center"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Switch to Step-by-Step Explanation
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onLaunchAIReview(report.aiRevisionPrompt);
            }}
            className="w-full sm:w-auto text-xs justify-center shadow-xs"
          >
            <Bot className="w-3.5 h-3.5 mr-1.5" />
            Launch AI Socratic Coach
          </Button>
        </div>
      </div>
    </Modal>
  );
};
