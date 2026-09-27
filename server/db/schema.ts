/**
 * Study Zone - Production Backend Database Schemas & Data Models
 * Defines structural types for Users, Auth, Curriculum (Subjects, Chapters, Topics, Lessons),
 * Practice (Questions, Quizzes, Results), Progress, Notes, Flashcards, Study Plans,
 * AI Conversations, Saved Content, and Subscriptions.
 */

// 1. USER & AUTHENTICATION
export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string; // Salted/hashed in production
  name: string;
  academicLevel: string;
  universityOrSchool?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSessionRecord {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// 2. CURRICULUM: SUBJECTS, CHAPTERS, TOPICS, LESSONS
export interface TopicRecord {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  masteryScore?: number;
}

export interface LessonRecord {
  id: string;
  title: string;
  chapterId: string;
  subjectId: string;
  orderIndex: number;
  durationMinutes: number;
  contentMarkdown: string;
  keyTakeaways: string[];
  formulaBlocks?: string[];
  isCompleted: boolean;
}

export interface ChapterRecord {
  id: string;
  subjectId: string;
  number: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  topics: TopicRecord[];
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface SubjectRecord {
  id: string;
  name: string;
  category: 'STEM' | 'Humanities' | 'Social Sciences' | 'Business & Economics' | 'Languages' | 'Computer Science';
  code: string;
  iconName: string;
  accentColor: string;
  description: string;
  academicLevel: string;
  totalChapters: number;
  completedChapters: number;
  totalLessons: number;
  completedLessons: number;
  overallMasteryPercentage: number;
  chapters: ChapterRecord[];
  isCustomGenerated?: boolean;
}

// 3. PRACTICE: QUESTIONS, QUIZZES, RESULTS
export interface QuestionRecord {
  id: string;
  quizId?: string;
  chapterId?: string;
  subjectId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicTag: string;
}

export interface QuizRecord {
  id: string;
  subjectId: string;
  chapterId?: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuestionRecord[];
}

export interface QuizResultRecord {
  id: string;
  quizId: string;
  userId: string;
  subject: string;
  chapterTitle?: string;
  timestamp: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  weakTopicsIdentified: string[];
}

// 4. STUDY PROGRESS & METRICS
export interface ProgressMetricsRecord {
  userId: string;
  totalStudyHours: number;
  currentStreakDays: number;
  longestStreakDays: number;
  completedLessonsCount: number;
  totalQuizzesTaken: number;
  overallAccuracyPercentage: number;
  xpPoints: number;
  scholarLevel: string;
  weeklyStudyMinutes: { day: string; minutes: number }[];
  weakTopics: { id: string; topic: string; subject: string; errorRatePercentage: number }[];
}

// 5. NOTES & CORNELL SUMMARIES
export interface NoteRecord {
  id: string;
  userId: string;
  title: string;
  subject: string;
  content: string;
  summary?: string;
  cues?: string[];
  tags: string[];
  isAiGenerated: boolean;
  aiToolSource?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 6. FLASHCARDS & DECKS
export interface FlashcardItemRecord {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  status: 'unseen' | 'known' | 'difficult';
  reviewCount: number;
  lastReviewed?: string;
}

export interface FlashcardDeckRecord {
  id: string;
  userId: string;
  title: string;
  subject: string;
  description: string;
  badgeColor?: string;
  cards: FlashcardItemRecord[];
  createdAt: string;
  updatedAt: string;
}

// 7. STUDY PLANS & SCHEDULE
export interface StudyTaskRecord {
  id: string;
  time: string;
  subject: string;
  activity: string;
  durationMinutes: number;
  type: 'concept' | 'practice' | 'review' | 'deep_work' | 'break';
  completed: boolean;
}

export interface StudyPlanDayRecord {
  date: string;
  dayOfWeek: string;
  targetMinutes: number;
  completedMinutes: number;
  tasks: StudyTaskRecord[];
}

export interface StudyPlanRecord {
  id: string;
  userId: string;
  title: string;
  generatedDate: string;
  examDate?: string;
  dailyTargetMinutes: number;
  scheduleDays: StudyPlanDayRecord[];
}

// 8. AI CONVERSATIONS & MESSAGES
export interface AIMessageRecord {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  formulaBlocks?: string[];
  actionPromptSuggestions?: string[];
}

export interface AIConversationRecord {
  id: string;
  userId: string;
  title: string;
  subject: string;
  pedagogyStyle: 'Socratic' | 'Step-by-Step' | 'Conceptual' | 'Exam-Cram';
  createdAt: string;
  updatedAt: string;
  messages: AIMessageRecord[];
}

// 9. SAVED CONTENT & ACADEMIC VAULT
export interface SavedResourceRecord {
  id: string;
  userId: string;
  title: string;
  type: 'pdf' | 'saved_lesson' | 'saved_ai_response' | 'study_material' | 'important_link';
  subject: string;
  description: string;
  fileSizeOrFormat?: string;
  url?: string;
  previewContent?: string;
  tags: string[];
  isBookmarked: boolean;
  dateAdded: string;
}

// 10. SUBSCRIPTIONS
export interface SubscriptionRecord {
  userId: string;
  planId: 'free' | 'student' | 'pro';
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'trial' | 'canceled';
  activatedAt: string;
  renewsAt: string;
  cancelAtPeriodEnd: boolean;
}
