/**
 * Study Zone - Subjects, Chapters, Topics & Lessons Routes
 */

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database.ts';
import type { SubjectRecord, ChapterRecord, LessonRecord } from '../db/schema.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const subjectRouter = Router();

// GET /api/subjects
subjectRouter.get('/', (_req: Request, res: Response) => {
  const subjects = Array.from(db.subjects.values());
  res.json({ subjects, total: subjects.length });
});

// GET /api/subjects/:id
subjectRouter.get('/:id', (req: Request, res: Response) => {
  const subject = db.subjects.get(req.params.id);
  if (!subject) {
    return res.status(404).json({ error: 'NotFound', message: `Subject "${req.params.id}" not found.` });
  }
  res.json({ subject });
});

// POST /api/subjects/synthesize
subjectRouter.post('/synthesize', (req: Request, res: Response) => {
  const { title, category, academicLevel } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'ValidationError', message: 'Subject title is required.' });
  }

  const cleanTitle = title.trim();
  const id = `custom_${cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
  const code = cleanTitle.substring(0, 4).toUpperCase() + '-101';

  const newSubject: SubjectRecord = {
    id,
    name: cleanTitle,
    category: category || 'STEM',
    code,
    iconName: 'BookOpen',
    accentColor: 'emerald',
    description: `Comprehensive AI-synthesized academic syllabus for ${cleanTitle} with 3 structured chapters and active recall diagnostics.`,
    academicLevel: academicLevel || 'College Core / AP',
    totalChapters: 3,
    completedChapters: 0,
    totalLessons: 9,
    completedLessons: 0,
    overallMasteryPercentage: 0,
    isCustomGenerated: true,
    chapters: [
      {
        id: `${id}-ch-1`,
        subjectId: id,
        number: 1,
        title: `Foundations of ${cleanTitle}`,
        description: `Core definitions, theoretical frameworks, and basic notation in ${cleanTitle}.`,
        estimatedMinutes: 90,
        isUnlocked: true,
        isCompleted: false,
        topics: [
          { id: `${id}-top-1`, title: 'Core Principles & Axioms', estimatedMinutes: 30, completed: false },
          { id: `${id}-top-2`, title: 'Fundamental Theorems & Invariants', estimatedMinutes: 30, completed: false },
          { id: `${id}-top-3`, title: 'Introductory Problem Applications', estimatedMinutes: 30, completed: false },
        ],
      },
      {
        id: `${id}-ch-2`,
        subjectId: id,
        number: 2,
        title: `Intermediate Analysis in ${cleanTitle}`,
        description: `Computational techniques, analytical methods, and problem-solving strategies.`,
        estimatedMinutes: 120,
        isUnlocked: true,
        isCompleted: false,
        topics: [
          { id: `${id}-top-4`, title: 'Analytical Methodology', estimatedMinutes: 40, completed: false },
          { id: `${id}-top-5`, title: 'Step-by-Step Derivations', estimatedMinutes: 40, completed: false },
          { id: `${id}-top-6`, title: 'Exam Trap Identification', estimatedMinutes: 40, completed: false },
        ],
      },
      {
        id: `${id}-ch-3`,
        subjectId: id,
        number: 3,
        title: `Advanced Topics & Exam Mastery in ${cleanTitle}`,
        description: `Synthesis, boundary conditions, and mock examination integration.`,
        estimatedMinutes: 140,
        isUnlocked: false,
        isCompleted: false,
        topics: [
          { id: `${id}-top-7`, title: 'Complex Multivariable Systems', estimatedMinutes: 45, completed: false },
          { id: `${id}-top-8`, title: 'Past Examination Case Studies', estimatedMinutes: 45, completed: false },
          { id: `${id}-top-9`, title: 'Capstone Diagnostic Verification', estimatedMinutes: 50, completed: false },
        ],
      },
    ],
  };

  db.subjects.set(newSubject.id, newSubject);
  res.status(201).json({ success: true, subject: newSubject });
});

// PUT /api/subjects/:id/progress
subjectRouter.put('/:id/progress', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const subject = db.subjects.get(req.params.id);
  if (!subject) {
    return res.status(404).json({ error: 'NotFound', message: `Subject "${req.params.id}" not found.` });
  }

  const { chapters, overallProgress } = req.body;
  if (chapters && Array.isArray(chapters)) {
    subject.chapters = chapters;
    subject.completedChapters = chapters.filter((c: ChapterRecord) => c.isCompleted).length;
  }
  if (typeof overallProgress === 'number') {
    subject.overallMasteryPercentage = overallProgress;
  }

  db.subjects.set(subject.id, subject);
  res.json({ success: true, subject });
});

// GET /api/lessons
subjectRouter.get('/content/lessons', (req: Request, res: Response) => {
  const subjectId = req.query.subjectId as string | undefined;
  const lessons = Array.from(db.lessons.values());
  const filtered = subjectId ? lessons.filter((l) => l.subjectId === subjectId) : lessons;
  res.json({ lessons: filtered, total: filtered.length });
});

// GET /api/lessons/:id
subjectRouter.get('/content/lessons/:id', (req: Request, res: Response) => {
  const lesson = db.lessons.get(req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: 'NotFound', message: `Lesson "${req.params.id}" not found.` });
  }
  res.json({ lesson });
});

// PUT /api/lessons/:id/complete
subjectRouter.put('/content/lessons/:id/complete', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  let lesson = db.lessons.get(req.params.id);
  if (!lesson) {
    // dynamically register if completed in lesson workspace
    lesson = {
      id: req.params.id,
      title: req.body.title || 'Academic Unit Lesson',
      chapterId: req.body.chapterId || 'ch-1',
      subjectId: req.body.subjectId || 'math',
      orderIndex: 1,
      durationMinutes: 30,
      contentMarkdown: '',
      keyTakeaways: [],
      isCompleted: true,
    };
    db.lessons.set(lesson.id, lesson);
  } else {
    lesson.isCompleted = true;
  }

  // Award progress points
  const userId = req.user?.id || 'usr_849201';
  const metrics = db.progressMetrics.get(userId);
  if (metrics) {
    metrics.completedLessonsCount += 1;
    metrics.xpPoints += 50;
  }

  res.json({ success: true, lesson, xpAwarded: 50 });
});
