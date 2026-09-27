/**
 * Study Zone - Authentication & User Profile Domain Types
 */

export type AcademicLevel = 
  | 'Middle School'
  | 'High School (AP / IB)'
  | 'Undergraduate (College)'
  | 'Graduate / Master\'s'
  | 'Doctorate / Research'
  | 'Professional / Lifelong Learner';

export type LearningStyle = 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading & Writing' | 'Multimodal';

export interface StudyPreferences {
  dailyTargetMinutes: number; // e.g. 120
  preferredSessionDurationMinutes: number; // e.g. 45
  breakIntervalMinutes: number; // e.g. 10
  preferredStudyTime: 'Early Morning' | 'Afternoon' | 'Evening' | 'Late Night';
  focusIntensity: 'Relaxed' | 'Balanced' | 'Intensive' | 'Mastery Cram';
  aiAssistanceLevel: 'Socratic Questioning' | 'Direct Step-by-Step' | 'Conceptual Analogies';
}

export interface StudyHistoryEntry {
  id: string;
  timestamp: string; // ISO date or formatted
  activityTitle: string;
  activityType: 'Quiz' | 'Lesson' | 'AI Tutor' | 'Flashcards' | 'Practice Drill' | 'Mock Exam';
  subject: string;
  durationMinutes: number;
  scorePercentage?: number;
  notesSummary?: string;
}

export interface UserProgressOverview {
  totalHoursStudied: number;
  currentStreakDays: number;
  longestStreakDays: number;
  completedLessonsCount: number;
  totalQuizzesTaken: number;
  averageAccuracyPercentage: number;
  scholarLevel: string; // e.g., "Senior Scholar (Level 4)"
  xpPoints: number;
}

export interface UserSavedContentOverview {
  notesCount: number;
  flashcardDecksCount: number;
  resourcesCount: number;
  bookmarkedLessonsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  academicLevel: AcademicLevel;
  universityOrSchool?: string;
  joinedDate: string;
  enrolledSubjects: string[];
  learningGoals: string[];
  preferredLearningStyle: LearningStyle;
  studyPreferences: StudyPreferences;
  progress: UserProgressOverview;
  studyHistory: StudyHistoryEntry[];
  savedContent: UserSavedContentOverview;
}

export interface UserSettings {
  account: {
    fullName: string;
    email: string;
    twoFactorEnabled: boolean;
    sessionTimeoutMinutes: number;
  };
  learningPreferences: StudyPreferences & {
    autoSpacedRepetition: boolean;
    soundFeedbackEnabled: boolean;
    defaultCornellNotes: boolean;
  };
  notifications: {
    emailDailyDigest: boolean;
    dailyStudyReminder: boolean;
    reminderTime: string; // '18:00'
    streakAlerts: boolean;
    quizMilestones: boolean;
    weeklyProgressDigest: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactDensity: boolean;
    fontSize: 'normal' | 'large' | 'compact';
    highContrastMode: boolean;
  };
}

export type AuthMode = 'login' | 'signup' | 'forgot_password' | 'reset_password';
