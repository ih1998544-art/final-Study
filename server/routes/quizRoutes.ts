/**
 * Study Zone - Practice Drills, Questions & Quiz API Routes
 */

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database.ts';
import type { QuizResultRecord } from '../db/schema.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const quizRouter = Router();

// GET /api/quizzes
quizRouter.get('/', (req: Request, res: Response) => {
  const subjectId = req.query.subjectId as string | undefined;
  const quizzes = Array.from(db.quizzes.values());
  const filtered = subjectId ? quizzes.filter((q) => q.subjectId === subjectId) : quizzes;
  res.json({ quizzes: filtered, total: filtered.length });
});

// GET /api/quizzes/:id
quizRouter.get('/:id', (req: Request, res: Response) => {
  const quiz = db.quizzes.get(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'NotFound', message: `Quiz "${req.params.id}" not found.` });
  }
  res.json({ quiz });
});

// GET /api/questions
quizRouter.get('/content/questions', (req: Request, res: Response) => {
  const subjectId = req.query.subjectId as string | undefined;
  const questions = Array.from(db.questions.values());
  const filtered = subjectId ? questions.filter((q) => q.subjectId === subjectId) : questions;
  res.json({ questions: filtered, total: filtered.length });
});

// GET /api/quizzes/results
quizRouter.get('/results', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const results = db.quizResults.filter((r) => r.userId === userId);
  res.json({ results, total: results.length });
});

// POST /api/quizzes/submit
quizRouter.post('/submit', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const {
    quizId,
    subject,
    chapterTitle,
    totalQuestions,
    correctAnswers,
    timeTakenSeconds,
    weakTopicsIdentified,
  } = req.body;

  if (totalQuestions === undefined || correctAnswers === undefined) {
    return res.status(400).json({ error: 'ValidationError', message: 'Score parameters are required.' });
  }

  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  const resultRecord: QuizResultRecord = {
    id: `res_${Date.now()}`,
    quizId: quizId || `quiz_${Date.now()}`,
    userId,
    subject: subject || 'General STEM',
    chapterTitle,
    timestamp: 'Today',
    totalQuestions,
    correctAnswers,
    scorePercentage,
    timeTakenSeconds: timeTakenSeconds || 180,
    weakTopicsIdentified: weakTopicsIdentified || [],
  };

  db.quizResults.unshift(resultRecord);

  // Update user progress metrics
  const metrics = db.progressMetrics.get(userId);
  if (metrics) {
    metrics.totalQuizzesTaken += 1;
    metrics.overallAccuracyPercentage = Math.round(
      (metrics.overallAccuracyPercentage * 0.8) + (scorePercentage * 0.2)
    );
    metrics.xpPoints += correctAnswers * 15;
  }

  res.status(201).json({ success: true, result: resultRecord });
});
