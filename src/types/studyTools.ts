/**
 * Study Zone - Study Tools Domain Types
 * Comprehensive specification for all 15 specialized academic AI tools.
 */

import { AcademicLevel } from './index';
import { QuizQuestionItem, FlashcardItem, StudyPlanDay, CornellNotesData } from './ai';

export type StudyToolId =
  | 'ai_tutor'
  | 'ai_notes'
  | 'ai_summarizer'
  | 'ai_quiz_gen'
  | 'ai_mcq_gen'
  | 'ai_flashcard_gen'
  | 'ai_exam_gen'
  | 'ai_study_planner'
  | 'homework_helper'
  | 'essay_assistant'
  | 'translation_tool'
  | 'concept_explainer'
  | 'coding_tutor'
  | 'revision_assistant'
  | 'formula_helper';

export type ToolCategory =
  | 'core_ai'
  | 'generators'
  | 'testing'
  | 'writing_language'
  | 'stem_coding';

export interface ToolOptionSelect {
  id: string;
  label: string;
  type: 'select';
  options: { label: string; value: string }[];
  defaultValue: string;
}

export interface ToolOptionToggle {
  id: string;
  label: string;
  type: 'toggle';
  defaultValue: boolean;
}

export interface ToolOptionNumber {
  id: string;
  label: string;
  type: 'number';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export type ToolOption = ToolOptionSelect | ToolOptionToggle | ToolOptionNumber;

export interface StudyToolDefinition {
  id: StudyToolId;
  title: string;
  shortName: string;
  badge: string;
  category: ToolCategory;
  description: string;
  detailedInstruction: string;
  inputLabel: string;
  inputPlaceholder: string;
  samplePrompts: string[];
  options: ToolOption[];
  iconName: string;
  colorScheme: 'emerald' | 'blue' | 'indigo' | 'purple' | 'amber' | 'cyan' | 'rose' | 'teal';
}

export interface StudyToolResult {
  id: string;
  toolId: StudyToolId;
  timestamp: string;
  inputPrompt: string;
  options: Record<string, string | number | boolean>;
  formattedMarkdown: string;
  structuredData?: {
    quizQuestions?: QuizQuestionItem[];
    flashcards?: FlashcardItem[];
    studyPlan?: StudyPlanDay[];
    cornellNotes?: CornellNotesData;
    codeSnippet?: { language: string; code: string; explanation?: string };
    formulaSnippet?: { formula: string; variables: { symbol: string; meaning: string; unit: string }[] };
    tableData?: { headers: string[]; rows: string[][] };
  };
  isSaved?: boolean;
}
