/**
 * Study Zone - Study Progress & Analytics API Routes
 */

import { Router, type Response } from 'express';
import { db } from '../db/database.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const progressRouter = Router();

// GET /api/progress
progressRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const metrics = db.progressMetrics.get(userId) || {
    userId,
    totalStudyHours: 0,
    currentStreakDays: 1,
    longestStreakDays: 1,
    completedLessonsCount: 0,
    totalQuizzesTaken: 0,
    overallAccuracyPercentage: 0,
    xpPoints: 0,
    scholarLevel: 'Novice Scholar (Level 1)',
    weeklyStudyMinutes: [],
    weakTopics: [],
  };

  res.json({ metrics });
});

// POST /api/progress/session
progressRouter.post('/session', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const { durationMinutes, xpEarned, activityType, subject } = req.body;

  let metrics = db.progressMetrics.get(userId);
  if (!metrics) {
    metrics = {
      userId,
      totalStudyHours: 0,
      currentStreakDays: 1,
      longestStreakDays: 1,
      completedLessonsCount: 0,
      totalQuizzesTaken: 0,
      overallAccuracyPercentage: 85,
      xpPoints: 0,
      scholarLevel: 'Novice Scholar (Level 1)',
      weeklyStudyMinutes: [],
      weakTopics: [],
    };
    db.progressMetrics.set(userId, metrics);
  }

  if (typeof durationMinutes === 'number') {
    metrics.totalStudyHours = Number((metrics.totalStudyHours + durationMinutes / 60).toFixed(1));
  }
  if (typeof xpEarned === 'number') {
    metrics.xpPoints += xpEarned;
  }

  res.json({ success: true, metrics });
});

// PUT /api/progress/streak
progressRouter.put('/streak', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const metrics = db.progressMetrics.get(userId);

  if (metrics) {
    metrics.currentStreakDays += 1;
    if (metrics.currentStreakDays > metrics.longestStreakDays) {
      metrics.longestStreakDays = metrics.currentStreakDays;
    }
  }

  res.json({ success: true, currentStreakDays: metrics?.currentStreakDays ?? 1 });
});
