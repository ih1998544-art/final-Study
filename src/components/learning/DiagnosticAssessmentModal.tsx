import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import { DiagnosticAssessmentQuestion } from '../../types/learning';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface DiagnosticAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  questions: DiagnosticAssessmentQuestion[];
  onCompleteAssessment: (score: number, total: number) => void;
}

export const DiagnosticAssessmentModal: React.FC<DiagnosticAssessmentModalProps> = ({
  isOpen,
  onClose,
  subjectName,
  questions,
  onCompleteAssessment,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    return Object.entries(selectedAnswers).filter(
      ([qIdx, optIdx]) => questions[Number(qIdx)].correctIndex === optIdx
    ).length;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    const score = calculateScore();
    onCompleteAssessment(score, questions.length);
    onClose();
    // reset for next time
    setIsSubmitted(false);
    setSelectedAnswers({});
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const score = isSubmitted ? calculateScore() : 0;
  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${subjectName}: Diagnostic Baseline Assessment`}
      description="Calibrate your personalized learning path by answering 4 foundational questions."
      size="lg"
    >
      <div className="space-y-6">
        {/* Progress header */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <span className="font-semibold text-slate-700">
            Answered: <strong>{answeredCount}</strong> of {questions.length} questions
          </span>
          <span className="text-emerald-700 font-medium">
            Stage 1: Adaptive Baseline Calibration
          </span>
        </div>

        {/* Questions list */}
        <div className="space-y-5 max-h-[460px] overflow-y-auto pr-1">
          {questions.map((q, qIdx) => {
            const selectedOpt = selectedAnswers[qIdx];
            const hasAnswered = selectedOpt !== undefined;
            const isCorrect = isSubmitted && selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id || qIdx}
                className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      Q{qIdx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {q.question}
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    {q.conceptTested}
                  </span>
                </div>

                {/* Options */}
                <div className="space-y-2 pl-8">
                  {q.options.map((opt, optIdx) => {
                    const isThisSelected = selectedOpt === optIdx;
                    const isThisCorrect = optIdx === q.correctIndex;

                    let buttonStyles =
                      'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100 hover:border-slate-300';

                    if (isSubmitted) {
                      if (isThisCorrect) {
                        buttonStyles =
                          'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                      } else if (isThisSelected && !isCorrect) {
                        buttonStyles =
                          'border-rose-400 bg-rose-50 text-rose-900';
                      } else {
                        buttonStyles =
                          'border-slate-100 bg-slate-50/40 text-slate-400 opacity-60';
                      }
                    } else if (isThisSelected) {
                      buttonStyles =
                        'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${buttonStyles}`}
                      >
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 bg-white border border-slate-200">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                        {isSubmitted && isThisCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {isSubmitted && isThisSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {isSubmitted && (
                  <div className="mt-3 ml-8 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5">
                      Pedagogical Explanation:
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results Banner if Submitted */}
        {isSubmitted && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold font-display text-sm">
                {scorePercentage}%
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">
                  Diagnostic Result: {score} of {questions.length} Correct
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {scorePercentage >= 75
                    ? 'Advanced baseline verified! Accelerated learning path unlocked.'
                    : 'Foundation calibrated! Personalized scaffolding will support key topics.'}
                </p>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={handleFinish}>
              Apply & Launch Path
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        )}

        {/* Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={isSubmitted ? handleReset : onClose}
          >
            {isSubmitted ? 'Retake Assessment' : 'Cancel'}
          </Button>

          {!isSubmitted && (
            <Button
              variant="primary"
              size="sm"
              disabled={answeredCount < questions.length}
              onClick={handleSubmit}
            >
              Submit & Check Baseline
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
