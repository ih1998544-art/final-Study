/**
 * Study Zone - AI Study Planner Types
 * Comprehensive domain specification for personalized exam roadmaps,
 * calendar schedules, task states, and weak-topic remediation.
 */

import { AcademicLevel } from './index';

export type TaskStatus = 'pending' | 'completed' | 'skipped' | 'rescheduled';

export type TaskType = 
  | 'subject_study'
  | 'revision'
  | 'practice_quiz'
  | 'weak_area_remedy'
  | 'exam_simulation';

export interface PlannerTask {
  id: string;
  dayName: string; // e.g. "Monday"
  date: string; // e.g. "2026-09-28"
  subject: string; // e.g. "Mathematics"
  topic: string; // e.g. "Eigenvalues & Matrix Diagonalization"
  durationMinutes: number; // e.g. 45
  type: TaskType;
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  isWeakTopicRemedy?: boolean;
  weakTopicNote?: string;
  rescheduledTo?: string; // e.g. "Wednesday"
  notes?: string;
}

export interface DaySchedule {
  dayName: string; // e.g. "Monday"
  date: string; // e.g. "Sep 28"
  isToday: boolean;
  isPreferred: boolean;
  totalMinutes: number;
  tasks: PlannerTask[];
}

export interface ExamTargetConfig {
  examName: string; // e.g. "University Finals & AP Calculus"
  examDate: string; // e.g. "2026-11-15"
  subjects: string[]; // e.g. ["Mathematics", "Physics", "Chemistry", "Computer Science"]
  availableHoursPerDay: number; // e.g. 2.5
  currentLevel: AcademicLevel;
  difficulty: 'Standard' | 'Challenging' | 'Intensive' | 'Mastery Cram';
  goals: string[]; // e.g. ["Target >90% on Final", "Eliminate Weak Topics", "Daily Active Retrieval"]
  preferredStudyDays: string[]; // e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  integrateWeakTopics: boolean;
}

export interface WeeklyOverviewPhase {
  weekNumber: number;
  title: string;
  theme: string;
  focusSubjects: string[];
  targetHours: number;
  revisionFocus: string;
  practiceMilestone: string;
}

export interface RevisionScheduleItem {
  id: string;
  phase: string;
  timeframe: string;
  strategy: string;
  spacedInterval: string;
  topics: string[];
}

export interface PracticeScheduleItem {
  id: string;
  phase: string;
  drillType: string;
  frequency: string;
  targetAccuracy: string;
  recommendedDrills: string[];
}

export interface ExamPrepSchedulePhase {
  id: string;
  countdownDays: string;
  stageName: string;
  focus: string;
  milestones: string[];
}

export interface CompleteStudyPlan {
  id: string;
  title: string;
  createdAt: string;
  config: ExamTargetConfig;
  days: DaySchedule[];
  weeklyOverview: WeeklyOverviewPhase[];
  revisionSchedule: RevisionScheduleItem[];
  practiceSchedule: PracticeScheduleItem[];
  examPrepSchedule: ExamPrepSchedulePhase[];
}
