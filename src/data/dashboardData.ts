import {
  WeakTopicItem,
  RecommendedLessonItem,
  RecentActivityItem,
  UpcomingTaskItem,
  WeeklyStudyStat,
  AcademicLevel,
} from '../types';

export interface StudentDashboardData {
  user: {
    fullName: string;
    email: string;
    avatarInitials: string;
    academicLevel: AcademicLevel;
    academicLevelLabel: string;
    scholarLevel: number;
    scholarTitle: string;
    currentXp: number;
    nextLevelXp: number;
    studyStreakDays: number;
    longestStreakDays: number;
    streakFreezeShields: number;
    totalStudyHours: number;
    weeklyStudyHours: number;
    weeklyTargetHours: number;
    completedLessonsCount: number;
    overallAccuracyPercentage: number;
    monthlyAccuracyChange: number; // e.g. +6.2%
  };
  todaysGoal: {
    targetMinutes: number;
    completedMinutes: number;
    targetLessons: number;
    completedLessons: number;
    targetQuestions: number;
    completedQuestions: number;
    aiDrillCompleted: boolean;
  };
  streakDaysMatrix: {
    dayName: string;
    date: string;
    studiedMinutes: number;
    completedGoal: boolean;
    isToday: boolean;
  }[];
  enrolledSubjectsProgress: {
    id: string;
    name: string;
    category: string;
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    currentChapter: string;
    currentLessonTitle: string;
    lastStudied: string;
    badgeColor: string;
  }[];
  weakTopics: WeakTopicItem[];
  recommendations: RecommendedLessonItem[];
  recentActivity: RecentActivityItem[];
  upcomingTasks: UpcomingTaskItem[];
  weeklyStats: WeeklyStudyStat[];
  accuracyBySubject: {
    subject: string;
    accuracy: number;
    quizzesTaken: number;
  }[];
}

export const INITIAL_DASHBOARD_DATA: StudentDashboardData = {
  user: {
    fullName: 'Irshad Hussain',
    email: 'irshad.hussain@studyzone.edu',
    avatarInitials: 'IH',
    academicLevel: 'undergraduate',
    academicLevelLabel: 'Undergraduate · Year 2',
    scholarLevel: 4,
    scholarTitle: 'Senior Scholar',
    currentXp: 4850,
    nextLevelXp: 5000,
    studyStreakDays: 7,
    longestStreakDays: 19,
    streakFreezeShields: 1,
    totalStudyHours: 118.5,
    weeklyStudyHours: 18.5,
    weeklyTargetHours: 20.0,
    completedLessonsCount: 42,
    overallAccuracyPercentage: 88.4,
    monthlyAccuracyChange: 6.2,
  },
  todaysGoal: {
    targetMinutes: 60,
    completedMinutes: 45,
    targetLessons: 4,
    completedLessons: 3,
    targetQuestions: 15,
    completedQuestions: 12,
    aiDrillCompleted: true,
  },
  streakDaysMatrix: [
    { dayName: 'Mon', date: 'Sep 21', studiedMinutes: 140, completedGoal: true, isToday: false },
    { dayName: 'Tue', date: 'Sep 22', studiedMinutes: 120, completedGoal: true, isToday: false },
    { dayName: 'Wed', date: 'Sep 23', studiedMinutes: 160, completedGoal: true, isToday: false },
    { dayName: 'Thu', date: 'Sep 24', studiedMinutes: 90, completedGoal: true, isToday: false },
    { dayName: 'Fri', date: 'Sep 25', studiedMinutes: 180, completedGoal: true, isToday: false },
    { dayName: 'Sat', date: 'Sep 26', studiedMinutes: 210, completedGoal: true, isToday: false },
    { dayName: 'Sun', date: 'Sep 27', studiedMinutes: 110, completedGoal: true, isToday: true },
  ],
  enrolledSubjectsProgress: [
    {
      id: 'math',
      name: 'Mathematics',
      category: 'STEM',
      progressPercentage: 68,
      completedLessons: 16,
      totalLessons: 24,
      currentChapter: 'Chapter 2: Linear Algebra & Matrix Calculus',
      currentLessonTitle: 'Eigenvalues, Eigenvectors & Diagonalization',
      lastStudied: '2 hours ago',
      badgeColor: 'emerald',
    },
    {
      id: 'cs',
      name: 'Computer Science',
      category: 'Computing & Tech',
      progressPercentage: 82,
      completedLessons: 18,
      totalLessons: 22,
      currentChapter: 'Chapter 3: Graph Algorithms & Dynamic Systems',
      currentLessonTitle: 'Dijkstra & A* Shortest Path Optimization',
      lastStudied: 'Yesterday',
      badgeColor: 'blue',
    },
    {
      id: 'physics',
      name: 'Physics',
      category: 'STEM',
      progressPercentage: 54,
      completedLessons: 12,
      totalLessons: 22,
      currentChapter: 'Chapter 2: Rotational Dynamics & Oscillations',
      currentLessonTitle: 'Angular Momentum & Torque Derivations',
      lastStudied: '3 days ago',
      badgeColor: 'purple',
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      category: 'STEM',
      progressPercentage: 45,
      completedLessons: 9,
      totalLessons: 20,
      currentChapter: 'Chapter 2: Organic Reaction Mechanisms',
      currentLessonTitle: 'Electrophilic Addition & Markovnikov Rule',
      lastStudied: '4 days ago',
      badgeColor: 'amber',
    },
    {
      id: 'economics',
      name: 'Economics',
      category: 'Business & Economics',
      progressPercentage: 30,
      completedLessons: 6,
      totalLessons: 20,
      currentChapter: 'Chapter 1: Microeconomic Foundations',
      currentLessonTitle: 'Elasticity, Deadweight Loss & Price Controls',
      lastStudied: '5 days ago',
      badgeColor: 'indigo',
    },
  ],
  weakTopics: [
    {
      id: 'wt-1',
      subjectName: 'Mathematics',
      topicTitle: 'Eigenvalues, Eigenvectors & Diagonalization',
      chapterTitle: 'Linear Algebra (Ch 2)',
      masteryPercentage: 42,
      lastTestedDate: 'Yesterday',
      recommendedAction: 'Geometric Socratic breakdown of characteristic polynomials',
    },
    {
      id: 'wt-2',
      subjectName: 'Chemistry',
      topicTitle: 'SN1 vs SN2 Nucleophilic Substitution Mechanisms',
      chapterTitle: 'Organic Mechanisms (Ch 2)',
      masteryPercentage: 50,
      lastTestedDate: '3 days ago',
      recommendedAction: 'Steric hindrance & carbocation stability comparison drill',
    },
    {
      id: 'wt-3',
      subjectName: 'Computer Science',
      topicTitle: 'Dynamic Programming State Transitions & Memoization',
      chapterTitle: 'Graph & Dynamic Algorithms (Ch 3)',
      masteryPercentage: 58,
      lastTestedDate: '4 days ago',
      recommendedAction: 'Overlapping subproblems & bottom-up tabulation scaffold',
    },
    {
      id: 'wt-4',
      subjectName: 'Economics',
      topicTitle: 'Keynesian Liquidity Trap & IS-LM Equilibria',
      chapterTitle: 'Macroeconomic Principles (Ch 2)',
      masteryPercentage: 60,
      lastTestedDate: '5 days ago',
      recommendedAction: 'Interest rate zero lower bound and quantitative easing case study',
    },
  ],
  recommendations: [
    {
      id: 'rec-1',
      subjectId: 'math',
      subjectName: 'Mathematics',
      title: 'Interactive Socratic Drill: Eigenvalues Visualized',
      durationMinutes: 15,
      difficulty: 'Intermediate',
      reason: 'Diagnosed mastery at 42% in latest diagnostic check',
      xpReward: 50,
    },
    {
      id: 'rec-2',
      subjectId: 'chemistry',
      subjectName: 'Chemistry',
      title: 'Mastering SN1 vs SN2 Reaction Kinetics',
      durationMinutes: 20,
      difficulty: 'Intermediate',
      reason: 'High-frequency board exam question pattern (78% exam weight)',
      xpReward: 60,
    },
    {
      id: 'rec-3',
      subjectId: 'cs',
      subjectName: 'Computer Science',
      title: 'Dynamic Programming Memoization Scaffold',
      durationMinutes: 25,
      difficulty: 'Advanced',
      reason: 'Targeted preparation for technical algorithm assessments',
      xpReward: 75,
    },
    {
      id: 'rec-4',
      subjectId: 'economics',
      subjectName: 'Economics',
      title: 'Active Recall Flashcards: Elasticity & Deadweight Loss',
      durationMinutes: 10,
      difficulty: 'Beginner',
      reason: 'Spaced repetition memory consolidation scheduled today',
      xpReward: 35,
    },
  ],
  recentActivity: [
    {
      id: 'act-1',
      type: 'lesson',
      title: 'Limits, Continuity & L\'Hôpital\'s Rule Proof',
      subjectName: 'Mathematics',
      timestamp: '2 hours ago',
      scoreOrProgress: '100% Completed',
      xpEarned: 45,
    },
    {
      id: 'act-2',
      type: 'quiz',
      title: 'Binary Search Trees & Heap Invariants Quiz',
      subjectName: 'Computer Science',
      timestamp: 'Yesterday',
      scoreOrProgress: 'Score: 95% (19/20)',
      xpEarned: 80,
    },
    {
      id: 'act-3',
      type: 'ai_chat',
      title: 'Socratic Inquiry on Wave-Particle Duality',
      subjectName: 'Physics',
      timestamp: 'Yesterday',
      scoreOrProgress: '6 Socratic Turns',
      xpEarned: 30,
    },
    {
      id: 'act-4',
      type: 'flashcards',
      title: 'Organic Functional Groups (Deck 2)',
      subjectName: 'Chemistry',
      timestamp: '2 days ago',
      scoreOrProgress: '15 Cards Mastered',
      xpEarned: 50,
    },
    {
      id: 'act-5',
      type: 'quiz',
      title: 'Consumer & Producer Surplus Exam Drill',
      subjectName: 'Economics',
      timestamp: '3 days ago',
      scoreOrProgress: 'Score: 88% (22/25)',
      xpEarned: 70,
    },
  ],
  upcomingTasks: [
    {
      id: 'task-1',
      title: 'Linear Algebra Problem Set 4: Subspaces & Rank Theorem',
      subjectName: 'Mathematics',
      dueDate: 'Tomorrow, 5:00 PM',
      isUrgent: true,
      completed: false,
      priority: 'high',
    },
    {
      id: 'task-2',
      title: 'Algorithm Complexity Proof: Master Theorem vs Recursion Tree',
      subjectName: 'Computer Science',
      dueDate: 'In 3 days',
      isUrgent: false,
      completed: false,
      priority: 'high',
    },
    {
      id: 'task-3',
      title: 'Physics Lab Report: Compound Pendulum Harmonic Motion',
      subjectName: 'Physics',
      dueDate: 'Friday, 11:59 PM',
      isUrgent: false,
      completed: false,
      priority: 'medium',
    },
    {
      id: 'task-4',
      title: 'Chemistry Spaced Repetition Flashcard Review (Deck 3)',
      subjectName: 'Chemistry',
      dueDate: 'In 5 days',
      isUrgent: false,
      completed: true,
      priority: 'low',
    },
  ],
  weeklyStats: [
    { day: 'Mon', minutes: 140, lessons: 3, targetMinutes: 120 },
    { day: 'Tue', minutes: 120, lessons: 2, targetMinutes: 120 },
    { day: 'Wed', minutes: 160, lessons: 4, targetMinutes: 120 },
    { day: 'Thu', minutes: 90, lessons: 2, targetMinutes: 120 },
    { day: 'Fri', minutes: 180, lessons: 5, targetMinutes: 120 },
    { day: 'Sat', minutes: 210, lessons: 6, targetMinutes: 120 },
    { day: 'Sun', minutes: 110, lessons: 3, targetMinutes: 120 },
  ],
  accuracyBySubject: [
    { subject: 'Computer Science', accuracy: 94.2, quizzesTaken: 18 },
    { subject: 'Mathematics', accuracy: 89.5, quizzesTaken: 22 },
    { subject: 'Physics', accuracy: 84.0, quizzesTaken: 14 },
    { subject: 'Economics', accuracy: 82.5, quizzesTaken: 10 },
    { subject: 'Chemistry', accuracy: 76.0, quizzesTaken: 12 },
  ],
};
