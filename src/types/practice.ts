/**
 * Study Zone Practice & Quiz Engine Type Definitions
 * Complete domain models for all 6 question types and 5 testing modes.
 */

export type QuestionType = 
  | 'mcq'
  | 'true_false'
  | 'short_question'
  | 'long_question'
  | 'numerical'
  | 'coding';

export type PracticeMode = 
  | 'topic_practice'
  | 'chapter_test'
  | 'subject_test'
  | 'mock_exam'
  | 'timed_quiz';

export interface PracticeQuestion {
  id: string;
  type: QuestionType;
  question: string;
  marks: number;
  topicName: string;
  subjectName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  explanation: string;
  hint?: string;
  
  // MCQ / True-False specific
  options?: string[];
  correctIndex?: number;

  // Short Question specific
  modelAnswer?: string;
  keyRubricPoints?: string[];

  // Long Question specific
  rubricCriteria?: { criterion: string; marks: number }[];

  // Numerical Problem specific
  correctNumber?: number;
  unit?: string;
  tolerance?: number;
  formula?: string;

  // Coding Problem specific
  starterCode?: string;
  solutionCode?: string;
  language?: string;
  testCases?: { input: string; expectedOutput: string; explanation?: string }[];
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIndex?: number;
  textAnswer?: string;
  numericalAnswer?: string;
  codeAnswer?: string;
  isFlagged?: boolean;
  isCorrect?: boolean;
  marksAwarded?: number;
}

export interface WeakTopicAnalysisItem {
  topic: string;
  subject: string;
  accuracyPercentage: number;
  missedQuestionsCount: number;
  recommendation: string;
}

export interface RecommendedLessonCard {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  xpReward: number;
}

export interface PracticeResult {
  sessionId: string;
  testTitle: string;
  subjectName: string;
  mode: PracticeMode;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  totalTimeAllocatedSeconds?: number;
  xpEarned: number;
  weakTopics: WeakTopicAnalysisItem[];
  recommendedLessons: RecommendedLessonCard[];
  completedAt: string;
}

export interface PracticeTestSummary {
  id: string;
  title: string;
  subjectName: string;
  mode: PracticeMode;
  questionCount: number;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  completedBefore?: boolean;
  lastScorePercentage?: number;
}
