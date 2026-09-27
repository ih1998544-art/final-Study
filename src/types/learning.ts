/**
 * Study Zone Complete Learning System Type Definitions
 * Complete domain models for the 11-stage Learning Journey:
 * Assessment → Learning Path → Chapter → Topic → Lesson → Examples → Practice → Quiz → Weak Area Detection → Revision → Mastery
 */

export type ExplanationLevel = 
  | 'simple'       // ELI5, intuitive analogies, non-technical plain English
  | 'normal'       // Standard curriculum textbook clarity
  | 'detailed'     // Rigorous academic proofs, theoretical foundations, derivations
  | 'exam'         // High-yield mark scheme keywords, rubric structure, common pitfalls
  | 'step_by_step';// Numbered stage-by-stage algorithmic or logical walkthrough

export type LearningJourneyStage = 
  | 'assessment'
  | 'path'
  | 'chapter'
  | 'topic'
  | 'lesson'
  | 'examples'
  | 'practice'
  | 'quiz'
  | 'weak_area'
  | 'revision'
  | 'mastery';

export interface MultiDepthExplanation {
  simple: {
    summary: string;
    analogy: string;
    keyPoints: string[];
  };
  normal: {
    overview: string;
    explanation: string;
    keyTakeaways: string[];
  };
  detailed: {
    theoreticalBasis: string;
    formalDerivationOrProof: string;
    advancedImplications: string[];
  };
  exam: {
    rubricRequirements: string[];
    highYieldKeywords: string[];
    modelAnswerSnippet: string;
    commonExaminerTraps: string[];
  };
  stepByStep: {
    steps: { stepNumber: number; title: string; instruction: string; reasoning: string }[];
    verificationCheck: string;
  };
}

export interface PracticeExerciseItem {
  id: string;
  question: string;
  hints: string[];
  options?: string[];
  correctOptionIndex?: number;
  numericalAnswer?: string;
  solutionWalkthrough: string;
}

export interface DiagnosticAssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTested: string;
}

export interface WeakAreaReport {
  detected: boolean;
  scorePercentage: number;
  identifiedGaps: string[];
  prescribedActions: string[];
  aiRevisionPrompt: string;
}

export interface RapidRevisionSheet {
  cheatSheetSummary: string;
  coreFormulasOrPrinciples: string[];
  activeRecallTriggers: { question: string; answer: string }[];
  mnemonics?: string[];
}
