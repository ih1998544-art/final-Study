/**
 * Study Zone - AI Study Planner Service
 * Intelligent scheduling engine generating daily, weekly, revision, practice,
 * and exam prep plans directly grounded in student curriculum & weak topics.
 */

import {
  CompleteStudyPlan,
  ExamTargetConfig,
  DaySchedule,
  PlannerTask,
  WeeklyOverviewPhase,
  RevisionScheduleItem,
  PracticeScheduleItem,
  ExamPrepSchedulePhase,
} from '../types/planner';
import { INITIAL_DASHBOARD_DATA } from '../data/dashboardData';

const STORAGE_KEY = 'sz_ai_study_planner_plan';

export const DEFAULT_EXAM_CONFIG: ExamTargetConfig = {
  examName: 'University Term Finals & AP/SAT Honors Examination',
  examDate: '2026-11-18',
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Economics'],
  availableHoursPerDay: 2.5,
  currentLevel: 'undergraduate',
  difficulty: 'Challenging',
  goals: [
    'Score >90% Overall on All Papers',
    'Eliminate 4 High-Risk Weak Topics',
    'Daily Active Retrieval (Spaced Repetition)',
    'Complete 3 Full Timed Practice Mocks',
  ],
  preferredStudyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  integrateWeakTopics: true,
};

class StudyPlannerService {
  /**
   * Generates a complete comprehensive study plan from user configuration
   */
  generatePlan(config: ExamTargetConfig): CompleteStudyPlan {
    const planId = `plan_${Date.now()}`;
    const createdAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const days = this.build7DaySchedule(config);
    const weeklyOverview = this.buildWeeklyOverview(config);
    const revisionSchedule = this.buildRevisionSchedule(config);
    const practiceSchedule = this.buildPracticeSchedule(config);
    const examPrepSchedule = this.buildExamPrepSchedule(config);

    const plan: CompleteStudyPlan = {
      id: planId,
      title: `${config.examName} Mastery Roadmap`,
      createdAt,
      config,
      days,
      weeklyOverview,
      revisionSchedule,
      practiceSchedule,
      examPrepSchedule,
    };

    this.savePlan(plan);
    return plan;
  }

  /**
   * Builds the 7-day schedule with tasks matching:
   * Monday: Mathematics — 45 min, Physics — 30 min, Revision — 20 min
   * and injecting weak topic remedy sessions.
   */
  private build7DaySchedule(config: ExamTargetConfig): DaySchedule[] {
    const weakTopics = INITIAL_DASHBOARD_DATA.weakTopics;
    const daysData: { name: string; date: string; isToday: boolean }[] = [
      { name: 'Monday', date: 'Sep 28', isToday: true },
      { name: 'Tuesday', date: 'Sep 29', isToday: false },
      { name: 'Wednesday', date: 'Sep 30', isToday: false },
      { name: 'Thursday', date: 'Oct 01', isToday: false },
      { name: 'Friday', date: 'Oct 02', isToday: false },
      { name: 'Saturday', date: 'Oct 03', isToday: false },
      { name: 'Sunday', date: 'Oct 04', isToday: false },
    ];

    return daysData.map((d) => {
      const isPreferred = config.preferredStudyDays.includes(d.name);
      let tasks: PlannerTask[] = [];

      if (!isPreferred) {
        // Rest or light recall day
        tasks = [
          {
            id: `task_${d.name}_light_1`,
            dayName: d.name,
            date: d.date,
            subject: 'Spaced Memory Drill',
            topic: 'Active Recall Flashcard Review (Leitner Box 3)',
            durationMinutes: 20,
            type: 'revision',
            status: 'pending',
            priority: 'low',
            notes: 'Rest day light maintenance session to consolidate weekly gains.',
          },
        ];
      } else {
        switch (d.name) {
          case 'Monday':
            tasks = [
              {
                id: `task_mon_1`,
                dayName: 'Monday',
                date: d.date,
                subject: 'Mathematics',
                topic: 'Linear Systems & Eigenvalues Diagonalization',
                durationMinutes: 45,
                type: 'weak_area_remedy',
                status: 'completed',
                priority: 'high',
                isWeakTopicRemedy: true,
                weakTopicNote: `Connected to Diagnostic Quiz: ${weakTopics[0]?.masteryPercentage ?? 42}% mastery detected.`,
                notes: 'Focus on characteristic polynomials det(A - λI) = 0 and eigenspace basis vectors.',
              },
              {
                id: `task_mon_2`,
                dayName: 'Monday',
                date: d.date,
                subject: 'Physics',
                topic: 'Rotational Kinematics & Angular Momentum',
                durationMinutes: 30,
                type: 'subject_study',
                status: 'pending',
                priority: 'medium',
                notes: 'Review torque τ = r × F and moment of inertia integration derivations.',
              },
              {
                id: `task_mon_3`,
                dayName: 'Monday',
                date: d.date,
                subject: 'Revision',
                topic: 'Rapid Active Recall & Cornell Cue Drill',
                durationMinutes: 20,
                type: 'revision',
                status: 'pending',
                priority: 'medium',
                notes: '15-minute quick fire recall on foundational physics mechanics formulas.',
              },
            ];
            break;

          case 'Tuesday':
            tasks = [
              {
                id: `task_tue_1`,
                dayName: 'Tuesday',
                date: d.date,
                subject: 'Chemistry',
                topic: 'SN1 vs SN2 Nucleophilic Substitution Mechanisms',
                durationMinutes: 45,
                type: 'weak_area_remedy',
                status: 'pending',
                priority: 'high',
                isWeakTopicRemedy: true,
                weakTopicNote: `Connected to Diagnostic Quiz: ${weakTopics[1]?.masteryPercentage ?? 50}% mastery detected.`,
                notes: 'Compare carbocation stability, solvent polarities, and stereochemical inversion (Walden inversion).',
              },
              {
                id: `task_tue_2`,
                dayName: 'Tuesday',
                date: d.date,
                subject: 'Computer Science',
                topic: 'Dynamic Programming State Transitions & Memoization',
                durationMinutes: 40,
                type: 'weak_area_remedy',
                status: 'pending',
                priority: 'high',
                isWeakTopicRemedy: true,
                weakTopicNote: `Connected to Diagnostic Quiz: ${weakTopics[2]?.masteryPercentage ?? 58}% mastery detected.`,
                notes: 'Practice bottom-up DP tabulation for knapsack and longest common subsequence.',
              },
              {
                id: `task_tue_3`,
                dayName: 'Tuesday',
                date: d.date,
                subject: 'Practice',
                topic: 'Chemistry 10-Question Diagnostic Quiz',
                durationMinutes: 20,
                type: 'practice_quiz',
                status: 'pending',
                priority: 'medium',
                notes: 'Timed quiz testing steric hindrance and substrate order rates.',
              },
            ];
            break;

          case 'Wednesday':
            tasks = [
              {
                id: `task_wed_1`,
                dayName: 'Wednesday',
                date: d.date,
                subject: 'Mathematics',
                topic: 'Multivariable Calculus: Gradient Vectors & Directional Derivatives',
                durationMinutes: 50,
                type: 'subject_study',
                status: 'pending',
                priority: 'medium',
                notes: 'Work through tangent planes and Lagrange multipliers for constrained optimization.',
              },
              {
                id: `task_wed_2`,
                dayName: 'Wednesday',
                date: d.date,
                subject: 'Economics',
                topic: 'Keynesian Liquidity Trap & IS-LM Equilibria',
                durationMinutes: 35,
                type: 'weak_area_remedy',
                status: 'pending',
                priority: 'high',
                isWeakTopicRemedy: true,
                weakTopicNote: `Connected to Diagnostic Quiz: ${weakTopics[3]?.masteryPercentage ?? 60}% mastery detected.`,
                notes: 'Model monetary transmission breakdown when interest rates hit the zero lower bound.',
              },
              {
                id: `task_wed_3`,
                dayName: 'Wednesday',
                date: d.date,
                subject: 'Revision',
                topic: 'Mid-Week Spaced Retrieval Journal',
                durationMinutes: 20,
                type: 'revision',
                status: 'pending',
                priority: 'low',
                notes: 'Cross-topic synthesis between linear algebra and vector calculus.',
              },
            ];
            break;

          case 'Thursday':
            tasks = [
              {
                id: `task_thu_1`,
                dayName: 'Thursday',
                date: d.date,
                subject: 'Physics',
                topic: 'Thermodynamics & Carnot Heat Engine Efficiency',
                durationMinutes: 45,
                type: 'subject_study',
                status: 'pending',
                priority: 'medium',
                notes: 'Derive Carnot efficiency η = 1 - Tc/Th and calculate entropy changes in cyclic processes.',
              },
              {
                id: `task_thu_2`,
                dayName: 'Thursday',
                date: d.date,
                subject: 'Chemistry',
                topic: 'Chemical Kinetics & Arrhenius Activation Energy',
                durationMinutes: 35,
                type: 'subject_study',
                status: 'pending',
                priority: 'medium',
                notes: 'Plot ln(k) vs 1/T to extract activation energy Ea and pre-exponential factor A.',
              },
              {
                id: `task_thu_3`,
                dayName: 'Thursday',
                date: d.date,
                subject: 'Practice',
                topic: 'Physics Problem Set: 5 Analytical Questions',
                durationMinutes: 25,
                type: 'practice_quiz',
                status: 'pending',
                priority: 'medium',
                notes: 'Numerical practice on adiabatic expansion and reversible heat transfers.',
              },
            ];
            break;

          case 'Friday':
            tasks = [
              {
                id: `task_fri_1`,
                dayName: 'Friday',
                date: d.date,
                subject: 'Computer Science',
                topic: 'Graph Algorithms: Dijkstra & A* Heuristic Search',
                durationMinutes: 45,
                type: 'subject_study',
                status: 'pending',
                priority: 'high',
                notes: 'Implement priority queue relaxation with asymptotic complexity O((V+E) log V).',
              },
              {
                id: `task_fri_2`,
                dayName: 'Friday',
                date: d.date,
                subject: 'Mathematics',
                topic: 'Eigenvalue Proofs & Matrix Orthogonalization (Remediation 2)',
                durationMinutes: 30,
                type: 'weak_area_remedy',
                status: 'pending',
                priority: 'high',
                isWeakTopicRemedy: true,
                weakTopicNote: 'Second remediation pass after Monday intro.',
                notes: 'Gram-Schmidt orthogonalization process and spectral decomposition.',
              },
              {
                id: `task_fri_3`,
                dayName: 'Friday',
                date: d.date,
                subject: 'Revision',
                topic: 'Weekend Executive Summary Synthesis',
                durationMinutes: 25,
                type: 'revision',
                status: 'pending',
                priority: 'medium',
                notes: 'Review error journal entries logged throughout the week.',
              },
            ];
            break;

          case 'Saturday':
            tasks = [
              {
                id: `task_sat_1`,
                dayName: 'Saturday',
                date: d.date,
                subject: 'Exam Simulation',
                topic: 'Full Timed Mock Section: Math & Physics Combo (Past Paper)',
                durationMinutes: 60,
                type: 'exam_simulation',
                status: 'pending',
                priority: 'high',
                notes: 'Exam conditions: no notes, strict 60-minute countdown, full mark-scheme self grading.',
              },
              {
                id: `task_sat_2`,
                dayName: 'Saturday',
                date: d.date,
                subject: 'Practice & Review',
                topic: 'Detailed Mark Scheme Error Audit & Rubric Walkthrough',
                durationMinutes: 30,
                type: 'practice_quiz',
                status: 'pending',
                priority: 'high',
                notes: 'Log every lost mark in the error log. Distinguish arithmetic slips from conceptual gaps.',
              },
            ];
            break;

          default:
            tasks = [];
        }
      }

      const totalMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);

      return {
        dayName: d.name,
        date: d.date,
        isToday: d.isToday,
        isPreferred,
        totalMinutes,
        tasks,
      };
    });
  }

  /**
   * Generates the 4-phase weekly overview
   */
  private buildWeeklyOverview(config: ExamTargetConfig): WeeklyOverviewPhase[] {
    return [
      {
        weekNumber: 1,
        title: 'Week 1: Core Foundation & Weak Area Diagnostic Remediation',
        theme: 'Closing knowledge gaps in linear algebra, organic mechanisms, and algorithms.',
        focusSubjects: ['Mathematics', 'Chemistry', 'Computer Science'],
        targetHours: 15,
        revisionFocus: 'Foundational definitions, theorem derivations, and notation consistency.',
        practiceMilestone: 'Achieve >75% on initial diagnostic test banks.',
      },
      {
        weekNumber: 2,
        title: 'Week 2: Intermediate Rigor & Multi-Subject Scaffolding',
        theme: 'Multivariable calculus, thermodynamics, and IS-LM macroeconomic models.',
        focusSubjects: ['Physics', 'Mathematics', 'Economics'],
        targetHours: 16.5,
        revisionFocus: 'Connecting concepts across subjects (e.g. gradient descent and physical potential).',
        practiceMilestone: 'Complete 3 timed 25-minute question drills per subject.',
      },
      {
        weekNumber: 3,
        title: 'Week 3: Advanced Past Paper Problem Sets & Speed Drills',
        theme: 'High-difficulty past examination questions and tricky distractor analysis.',
        focusSubjects: ['All Enrolled Subjects'],
        targetHours: 17,
        revisionFocus: 'Examiner report traps and mark scheme keyword precision.',
        practiceMilestone: 'Cut average question resolution time by 20%.',
      },
      {
        weekNumber: 4,
        title: 'Week 4: Final Timed Exam Simulations & Rapid Memory Compression',
        theme: 'Full exam simulations under strict test conditions with 1-page cheat sheet creation.',
        focusSubjects: ['Comprehensive Exam Scope'],
        targetHours: 14,
        revisionFocus: '1-page ultra-dense formula sheets and 15-minute quick checklists.',
        practiceMilestone: 'Complete 2 full-length simulated mock exam papers with zero rubric deductions.',
      },
    ];
  }

  /**
   * Generates structured revision schedule with spaced intervals
   */
  private buildRevisionSchedule(config: ExamTargetConfig): RevisionScheduleItem[] {
    return [
      {
        id: 'rev-1',
        phase: 'Immediate Retrieval (Day 1)',
        timeframe: 'Same evening after learning lesson',
        strategy: 'Active Recall Cornell Note Cue Column Cover-Up',
        spacedInterval: '24 Hours',
        topics: [
          'Linear Algebra: Eigenvalues and Characteristic Equation',
          'Organic Chemistry: SN1 vs SN2 Transition States and Solvents',
          'Algorithms: Dynamic Programming Memoization Memo Tables',
        ],
      },
      {
        id: 'rev-2',
        phase: 'Consolidation Spacing (Day 3)',
        timeframe: '72 hours after initial encoding',
        strategy: 'Feynman Technique: Explain in plain English to Study Zone AI Tutor',
        spacedInterval: '3 Days',
        topics: [
          'Rotational Dynamics: Torque as cross product and conservation of L',
          'Economics: Keynesian Liquidity Trap interest rate floor',
          'Thermodynamics: Second Law, Entropy and Carnot cycles',
        ],
      },
      {
        id: 'rev-3',
        phase: 'Interleaved Cross-Testing (Day 7)',
        timeframe: 'Weekly review session',
        strategy: 'Mixed-topic random quiz drawing 2 questions from every chapter',
        spacedInterval: '7 Days',
        topics: [
          'Calculus: Gradient vectors combined with Lagrange multipliers',
          'Chemistry: Reaction coordinate diagrams with Arrhenius activation energy',
          'Computer Science: Graph traversal (Dijkstra vs A*) on weighted meshes',
        ],
      },
      {
        id: 'rev-4',
        phase: 'Long-Term Storage Drill (Day 21)',
        timeframe: 'Pre-exam consolidation block',
        strategy: 'Blank Sheet Brain Dump: Reconstruct all governing formulas from scratch',
        spacedInterval: '3 Weeks',
        topics: [
          'Complete Subject Formula Inventories and SI Dimensional Units',
          'Top 5 Deadliest Pitfalls and Antidote Procedures',
        ],
      },
    ];
  }

  /**
   * Generates practice schedule
   */
  private buildPracticeSchedule(config: ExamTargetConfig): PracticeScheduleItem[] {
    return [
      {
        id: 'prac-1',
        phase: 'Phase 1: Conceptual Diagnostic Drills',
        drillType: 'Targeted Untimed MCQs with Instant Rationale',
        frequency: 'Daily (20 mins per session)',
        targetAccuracy: '80% First-Pass Correctness',
        recommendedDrills: [
          '10-Question Diagnostic Quiz on Linear Algebra Eigenvalues',
          '10-Question MCQ Set on Organic SN1/SN2 Stereochemistry',
          'Interactive Dynamic Programming Tabulation Sandbox',
        ],
      },
      {
        id: 'prac-2',
        phase: 'Phase 2: Timed Multi-Step Problem Solving',
        drillType: 'Calculated Numerical & Analytical Working Drills',
        frequency: '3 Times / Week (40 mins)',
        targetAccuracy: '85% Method Mark Retention',
        recommendedDrills: [
          'Physics Mechanics Past Exam Section (Rotational Dynamics)',
          'Multivariable Optimization Problems with Boundary Constraints',
          'Chemical Reaction Rate and Equilibrium Constant Derivations',
        ],
      },
      {
        id: 'prac-3',
        phase: 'Phase 3: High-Fidelity Mock Exam Papers',
        drillType: 'Strict Exam Conditions (Full Paper Timing, Zero Resources)',
        frequency: 'Weekly on Saturdays (60-90 mins)',
        targetAccuracy: '90%+ Final Scaled Score',
        recommendedDrills: [
          'Complete 2024 Past Term Examination Paper',
          'Comprehensive Multi-Subject Simulated Test Block',
          'Official Scoring Mark Scheme Self-Auditing Rubric',
        ],
      },
    ];
  }

  /**
   * Generates the exam preparation countdown schedule
   */
  private buildExamPrepSchedule(config: ExamTargetConfig): ExamPrepSchedulePhase[] {
    return [
      {
        id: 'ep-1',
        countdownDays: 'T-Minus 40 to 30 Days',
        stageName: 'Stage 1: Foundation Solidification & Weak-Topic Liquidation',
        focus: 'Close all conceptual gaps, resolve homework bottlenecks, master foundational definitions.',
        milestones: [
          'Complete all diagnostic checks for weak topics with >80% accuracy',
          'Build complete active-recall flashcard decks across all chapters',
          'Synthesize structured Cornell notes for all syllabus units',
        ],
      },
      {
        id: 'ep-2',
        countdownDays: 'T-Minus 29 to 14 Days',
        stageName: 'Stage 2: Rubric Calibration & Past Paper Drills',
        focus: 'Transition from passive learning to rigorous timed past paper problem sets.',
        milestones: [
          'Solve past examination papers from the last 5 test years',
          'Master mark scheme keywords and point-allocation rubrics',
          'Eliminate common student arithmetic and dimensional unit omissions',
        ],
      },
      {
        id: 'ep-3',
        countdownDays: 'T-Minus 13 to 3 Days',
        stageName: 'Stage 3: Timed Exam Rehearsal & High-Stakes Conditioning',
        focus: 'Simulate exact exam room timing, pacing, and stress mitigation.',
        milestones: [
          'Complete 2 full-length mock exams at the exact scheduled test time of day',
          'Audit pacing: spend no more than 1.5 minutes per MCQ and 12 minutes per free response',
          'Review error log entries and revise high-frequency pitfalls',
        ],
      },
      {
        id: 'ep-4',
        countdownDays: 'T-Minus 48 to 24 Hours',
        stageName: 'Stage 4: Rapid Memory Compression & Mental Readiness',
        focus: 'Zero new material. Review 1-page cheat sheets, hydrate, and optimize sleep.',
        milestones: [
          'Read 1-page ultra-dense rapid revision cheat sheets',
          'Verify calculator batteries, allowed formulas, and test ID materials',
          'Achieve 8+ hours of deep REM sleep for memory consolidation',
        ],
      },
    ];
  }

  /**
   * Returns current active plan from storage or generates default
   */
  getPlan(): CompleteStudyPlan {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return this.generatePlan(DEFAULT_EXAM_CONFIG);
  }

  /**
   * Saves updated plan to storage
   */
  savePlan(plan: CompleteStudyPlan): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch (e) {
      console.warn('Could not save plan', e);
    }

    // Sync to backend API
    fetch('/api/study-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: plan.title,
        examDate: plan.config.examDate,
        dailyTargetMinutes: Math.round(plan.config.availableHoursPerDay * 60),
      }),
    }).catch(() => {});
  }

  /**
   * Complete task toggle
   */
  toggleTaskStatus(taskId: string): CompleteStudyPlan {
    const plan = this.getPlan();
    let updated = false;

    plan.days.forEach((day) => {
      day.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.status = task.status === 'completed' ? 'pending' : 'completed';
          updated = true;
        }
      });
    });

    if (updated) {
      this.savePlan(plan);
    }
    return plan;
  }

  /**
   * Skip task
   */
  skipTask(taskId: string): CompleteStudyPlan {
    const plan = this.getPlan();
    let updated = false;

    plan.days.forEach((day) => {
      day.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.status = task.status === 'skipped' ? 'pending' : 'skipped';
          updated = true;
        }
      });
    });

    if (updated) {
      this.savePlan(plan);
    }
    return plan;
  }

  /**
   * Reschedule task to a different day
   */
  rescheduleTask(taskId: string, targetDayName: string): CompleteStudyPlan {
    const plan = this.getPlan();
    let targetTask: PlannerTask | null = null;

    // Find and remove task from origin
    plan.days.forEach((day) => {
      const idx = day.tasks.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        targetTask = { ...day.tasks[idx] };
        day.tasks[idx].status = 'rescheduled';
        day.tasks[idx].rescheduledTo = targetDayName;
      }
    });

    // Add to target day if found
    if (targetTask) {
      const destDay = plan.days.find((d) => d.dayName.toLowerCase() === targetDayName.toLowerCase());
      if (destDay) {
        const newTask: PlannerTask = {
          ...(targetTask as PlannerTask),
          id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          dayName: destDay.dayName,
          date: destDay.date,
          status: 'pending',
          rescheduledTo: undefined,
          notes: `Rescheduled from ${(targetTask as PlannerTask).dayName}`,
        };
        destDay.tasks.push(newTask);
        destDay.totalMinutes += newTask.durationMinutes;
      }
      this.savePlan(plan);
    }

    return plan;
  }

  /**
   * Adds custom task to a specific day
   */
  addTask(dayName: string, taskData: Omit<PlannerTask, 'id' | 'status' | 'dayName' | 'date'>): CompleteStudyPlan {
    const plan = this.getPlan();
    const day = plan.days.find((d) => d.dayName.toLowerCase() === dayName.toLowerCase());
    if (day) {
      const newTask: PlannerTask = {
        ...taskData,
        id: `custom_${Date.now()}`,
        dayName: day.dayName,
        date: day.date,
        status: 'pending',
      };
      day.tasks.push(newTask);
      day.totalMinutes += newTask.durationMinutes;
      this.savePlan(plan);
    }
    return plan;
  }

  /**
   * Calculates overall progress metrics
   */
  getProgress(plan: CompleteStudyPlan): {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
    completedMinutes: number;
    totalMinutes: number;
    todaysTasks: PlannerTask[];
    upcomingTasks: PlannerTask[];
    weakRemedyTasks: PlannerTask[];
  } {
    let totalTasks = 0;
    let completedTasks = 0;
    let completedMinutes = 0;
    let totalMinutes = 0;
    let todaysTasks: PlannerTask[] = [];
    let upcomingTasks: PlannerTask[] = [];
    let weakRemedyTasks: PlannerTask[] = [];

    plan.days.forEach((day) => {
      day.tasks.forEach((t) => {
        totalTasks++;
        totalMinutes += t.durationMinutes;

        if (t.status === 'completed') {
          completedTasks++;
          completedMinutes += t.durationMinutes;
        }

        if (day.isToday) {
          todaysTasks.push(t);
        } else if (t.status === 'pending') {
          upcomingTasks.push(t);
        }

        if (t.isWeakTopicRemedy) {
          weakRemedyTasks.push(t);
        }
      });
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      percentage,
      completedMinutes,
      totalMinutes,
      todaysTasks,
      upcomingTasks,
      weakRemedyTasks,
    };
  }

  /**
   * Reset to initial defaults
   */
  resetToDefault(): CompleteStudyPlan {
    localStorage.removeItem(STORAGE_KEY);
    return this.generatePlan(DEFAULT_EXAM_CONFIG);
  }
}

export const studyPlannerService = new StudyPlannerService();
