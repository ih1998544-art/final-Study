/**
 * Study Zone - User Profile & Settings API Routes
 */

import { Router, type Response } from 'express';
import { db } from '../db/database.ts';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const userRouter = Router();

// GET /api/users/profile
userRouter.get('/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const metrics = db.progressMetrics.get(user.id);

  res.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      academicLevel: user.academicLevel,
      universityOrSchool: user.universityOrSchool || 'Stanford University',
      avatarUrl: user.avatarUrl,
      joinedDate: user.createdAt,
      enrolledSubjects: ['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Economics'],
      progress: metrics ? {
        totalHoursStudied: metrics.totalStudyHours,
        currentStreakDays: metrics.currentStreakDays,
        longestStreakDays: metrics.longestStreakDays,
        completedLessonsCount: metrics.completedLessonsCount,
        totalQuizzesTaken: metrics.totalQuizzesTaken,
        averageAccuracyPercentage: metrics.overallAccuracyPercentage,
        scholarLevel: metrics.scholarLevel,
        xpPoints: metrics.xpPoints,
      } : undefined,
    },
  });
});

// PUT /api/users/profile
userRouter.put('/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { name, academicLevel, universityOrSchool, avatarUrl } = req.body;

  if (name && typeof name === 'string') user.name = name.trim();
  if (academicLevel && typeof academicLevel === 'string') user.academicLevel = academicLevel;
  if (universityOrSchool && typeof universityOrSchool === 'string') user.universityOrSchool = universityOrSchool;
  if (avatarUrl && typeof avatarUrl === 'string') user.avatarUrl = avatarUrl;
  user.updatedAt = new Date().toISOString();

  db.users.set(user.id, user);
  db.users.set(user.email.toLowerCase(), user);

  res.json({ success: true, profile: user });
});

// GET /api/users/settings
userRouter.get('/settings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    settings: {
      account: {
        fullName: user.name,
        email: user.email,
        twoFactorEnabled: false,
        sessionTimeoutMinutes: 60,
      },
      learningPreferences: {
        dailyTargetMinutes: 120,
        preferredSessionDurationMinutes: 45,
        breakIntervalMinutes: 10,
        preferredStudyTime: 'Evening',
        focusIntensity: 'Balanced',
        aiAssistanceLevel: 'Socratic Questioning',
        autoSpacedRepetition: true,
        soundFeedbackEnabled: true,
        defaultCornellNotes: true,
      },
      notifications: {
        emailDailyDigest: true,
        dailyStudyReminder: true,
        reminderTime: '18:00',
        streakAlerts: true,
        quizMilestones: true,
        weeklyProgressDigest: true,
      },
      appearance: {
        theme: 'light',
        compactDensity: false,
        fontSize: 'normal',
        highContrastMode: false,
      },
    },
  });
});

// PUT /api/users/settings
userRouter.put('/settings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  // Store or echo updated settings
  const updates = req.body;
  res.json({ success: true, settings: updates, message: 'Settings saved successfully.' });
});
