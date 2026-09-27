/**
 * Study Zone Core Type Definitions
 * Scalable domain types for the entire AI educational platform
 */

export type AcademicLevel = 
  | 'middle_school'
  | 'high_school'
  | 'undergraduate'
  | 'graduate'
  | 'professional_certification';

export type SubjectCategory = 
  | 'STEM'
  | 'Computing & Tech'
  | 'Humanities'
  | 'Languages'
  | 'Business & Economics'
  | 'Professional Skills'
  | 'Custom';

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  content: {
    overview: string;
    explanation: string;
    keyTakeaways: string[];
    examples: { title: string; detail: string }[];
    formulaOrCodeSnippet?: string;
    checkQuestion: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  };
  completed: boolean;
  xp: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  progressPercentage: number;
  lessons: Lesson[];
  status: 'locked' | 'in_progress' | 'completed';
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  progressPercentage: number;
  topics: Topic[];
}

export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  category: SubjectCategory;
  description: string;
  chapterCount: number;
  topicsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  isCustom?: boolean;
  overallProgress: number; // 0 - 100
  enrolled: boolean;
  lastStudied?: string;
  currentChapterId?: string;
  currentTopicId?: string;
  currentLessonId?: string;
  chapters?: Chapter[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  academicLevel: AcademicLevel;
  enrolledSubjects: string[]; // Subject IDs
  studyStreakDays: number;
  totalStudyMinutes: number;
  xpPoints: number;
  quizAccuracyPercentage: number;
  completedLessonsCount: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface WeakTopicItem {
  id: string;
  subjectName: string;
  topicTitle: string;
  chapterTitle: string;
  masteryPercentage: number;
  lastTestedDate: string;
  recommendedAction: string;
}

export interface RecommendedLessonItem {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reason: string;
  xpReward: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'lesson' | 'quiz' | 'ai_chat' | 'flashcards';
  title: string;
  subjectName: string;
  timestamp: string;
  scoreOrProgress?: string;
  xpEarned: number;
}

export interface UpcomingTaskItem {
  id: string;
  title: string;
  subjectName: string;
  dueDate: string;
  isUrgent?: boolean;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface WeeklyStudyStat {
  day: string; // 'Mon', 'Tue', etc.
  minutes: number;
  lessons: number;
  targetMinutes: number;
}

export type NavigationTab = 
  | 'home'
  | 'dashboard'
  | 'analytics'
  | 'subjects'
  | 'ai_tutor'
  | 'study_tools'
  | 'practice'
  | 'planner'
  | 'resources'
  | 'profile'
  | 'settings'
  | 'pricing'
  | 'design_system';
