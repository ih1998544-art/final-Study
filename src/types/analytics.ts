/**
 * Study Zone - Progress Analytics Domain Types
 * Comprehensive data contracts for learning velocity, subject accuracy,
 * topic mastery spectrum, time distribution, quiz performance, and revision priorities.
 */

export interface CoreAnalyticsMetrics {
  // 1. Study Time
  totalStudyHours: number;
  weeklyStudyHours: number;
  weeklyTargetHours: number;
  dailyAverageMinutes: number;

  // 2. Weekly Progress
  weeklyCompletionPercentage: number;
  weeklyHoursChangePercent: number; // e.g. +12.5% vs previous week

  // 3. Subject Accuracy
  overallAccuracyPercentage: number;
  monthlyAccuracyDelta: number; // e.g. +6.2%

  // 4. Quiz Performance
  totalQuizzesTaken: number;
  averageQuizScore: number;
  highestQuizScore: number;
  perfectScoresCount: number;

  // 5. Topic Mastery
  totalTopicsTracked: number;
  masteredTopicsCount: number; // >= 85%
  proficientTopicsCount: number; // 70 - 84%
  developingTopicsCount: number; // 50 - 69%
  criticalTopicsCount: number; // < 50%

  // 6. Study Streak
  currentStreakDays: number;
  longestStreakDays: number;
  streakFreezeShields: number;

  // 7. Completed Lessons
  completedLessonsCount: number;
  totalSyllabusLessons: number;
  syllabusCompletionRate: number; // percentage

  // 8. Practice Questions
  practiceQuestionsSolved: number;
  practiceQuestionsCorrect: number;
  practiceQuestionAccuracy: number;

  // 9. Exam Scores
  latestMockExamScore: number;
  projectedGrade: string; // e.g. "A / 4.0 GPA"
  examReadinessPercentage: number;
}

export interface WeeklyChartDataPoint {
  dayName: string; // 'Mon', 'Tue', etc.
  date: string; // 'Sep 21', etc.
  studiedMinutes: number;
  targetMinutes: number;
  lessonsCompleted: number;
  isToday: boolean;
}

export interface SubjectPerformanceMetric {
  subjectId: string;
  subjectName: string;
  category: string;
  accuracyPercentage: number;
  completedLessons: number;
  totalLessons: number;
  totalStudyHours: number;
  quizzesTaken: number;
  averageScore: number;
  benchmarkPercentage: number; // Peer / Class benchmark e.g. 75%
  colorHex: string;
}

export interface TopicMasteryItem {
  id: string;
  topicTitle: string;
  subjectName: string;
  masteryPercentage: number; // 0 - 100
  tier: 'mastered' | 'proficient' | 'developing' | 'critical';
  confidenceScore: number; // 1 - 5
  lastTestedDate: string;
  questionsAttempted: number;
  correctAnswersCount: number;
}

export interface StudyTimeDistributionItem {
  activityId: string;
  activityLabel: string;
  hours: number;
  percentage: number;
  colorHex: string;
  description: string;
}

export interface QuizAccuracyTrendPoint {
  id: string;
  quizTitle: string;
  subjectName: string;
  date: string;
  scorePercentage: number;
  rollingAverage: number;
  questionsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface StrongTopicItem {
  id: string;
  topicTitle: string;
  subjectName: string;
  chapterTitle: string;
  masteryPercentage: number;
  retentionScore: number; // 0 - 100
  questionsSolved: number;
  streakDaysConsistent: number;
  keyStrength: string;
}

export interface WeakTopicItemAnalytics {
  id: string;
  topicTitle: string;
  subjectName: string;
  chapterTitle: string;
  masteryPercentage: number;
  lastTestedDate: string;
  primaryDeficit: string;
  recommendedAction: string;
  urgency: 'high' | 'medium';
}

export interface ImprovingTopicItem {
  id: string;
  topicTitle: string;
  subjectName: string;
  previousMastery: number;
  currentMastery: number;
  percentageGain: number; // e.g. +18%
  studySessionsCount: number;
  recentMilestone: string;
}

export interface RecommendedRevisionItem {
  id: string;
  topicTitle: string;
  subjectName: string;
  urgency: 'Immediate (Today)' | 'High (48 Hours)' | 'Scheduled (This Week)';
  estimatedMinutes: number;
  pedagogicalReason: string;
  suggestedActionType: 'ai_tutor' | 'flashcards' | 'practice_quiz' | 'formula_sheet';
  suggestedPrompt?: string;
}
