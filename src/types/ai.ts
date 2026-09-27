/**
 * Study Zone AI Agent Type Definitions
 * Complete domain models for the AI Workspace, Personas, Learning Modes, and Session Management
 */

import { AcademicLevel } from './index';
export type { AcademicLevel };

export type AIRole = 
  | 'tutor' 
  | 'teacher' 
  | 'exam_coach' 
  | 'practice_partner' 
  | 'study_planner' 
  | 'revision_assistant';

export interface AIRoleMetadata {
  id: AIRole;
  name: string;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  avatarIcon: string;
  tone: string;
}

export type LearningMode = 
  | 'explain'
  | 'solve'
  | 'teach'
  | 'summarize'
  | 'quiz'
  | 'practice'
  | 'revise'
  | 'translate'
  | 'notes'
  | 'flashcards'
  | 'exam_prep'
  | 'study_plan';

export interface LearningModeMetadata {
  id: LearningMode;
  label: string;
  iconName: string;
  description: string;
  placeholderPrompt: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  userSelectedIndex?: number;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  hint?: string;
  mastered?: boolean;
}

export interface StudyPlanDay {
  period: string; // e.g., "Day 1" or "Week 1"
  theme: string;
  tasks: { id: string; label: string; durationMinutes: number; completed: boolean }[];
  milestoneGoal: string;
}

export interface CornellNotesData {
  title: string;
  subject: string;
  cues: string[];
  notes: string[];
  summary: string;
}

export interface AIMessageMetadata {
  mode: LearningMode;
  role: AIRole;
  subjectName?: string;
  academicLevel?: AcademicLevel;
  difficulty?: DifficultyLevel;
  codeSnippet?: { language: string; code: string };
  formula?: string;
  quiz?: QuizQuestionItem[];
  flashcards?: FlashcardItem[];
  studyPlan?: StudyPlanDay[];
  cornellNotes?: CornellNotesData;
  suggestedFollowups?: string[];
  isSaved?: boolean;
  savedNoteId?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: AIMessageMetadata;
}

export interface AIChatSession {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  role: AIRole;
  academicLevel: AcademicLevel;
  difficulty: DifficultyLevel;
  activeMode: LearningMode;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedNote {
  id: string;
  title: string;
  subjectName: string;
  mode: LearningMode;
  content: string;
  timestamp: string;
  tags: string[];
}

export type QuickActionType = 
  | 'explain' 
  | 'solve' 
  | 'quiz' 
  | 'notes' 
  | 'exam_prep' 
  | 'flashcards';
