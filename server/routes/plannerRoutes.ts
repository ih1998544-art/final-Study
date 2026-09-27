/**
 * Study Zone - Study Planner & Schedule Management API Routes
 */

import { Router, type Response } from 'express';
import { db } from '../db/database.ts';
import type { StudyPlanRecord, StudyTaskRecord } from '../db/schema.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const plannerRouter = Router();

// GET /api/study-plans
plannerRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const plans = Array.from(db.studyPlans.values()).filter((p) => p.userId === userId);
  res.json({ plans, total: plans.length, activePlan: plans[0] || null });
});

// POST /api/study-plans
plannerRouter.post('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const { title, examDate, dailyTargetMinutes, scheduleDays } = req.body;

  const planId = `plan_${Date.now()}`;
  const newPlan: StudyPlanRecord = {
    id: planId,
    userId,
    title: title || 'Personalized Exam Study Roadmap',
    generatedDate: new Date().toISOString().split('T')[0],
    examDate,
    dailyTargetMinutes: dailyTargetMinutes || 120,
    scheduleDays: scheduleDays || [],
  };

  db.studyPlans.set(planId, newPlan);
  res.status(201).json({ success: true, plan: newPlan });
});

// PUT /api/study-plans/:id/tasks/:taskId/toggle
plannerRouter.put('/:id/tasks/:taskId/toggle', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const plan = db.studyPlans.get(req.params.id);
  if (!plan) {
    return res.status(404).json({ error: 'NotFound', message: `Study plan "${req.params.id}" not found.` });
  }

  let foundTask: StudyTaskRecord | null = null;
  for (const day of plan.scheduleDays) {
    const t = day.tasks.find((task) => task.id === req.params.taskId);
    if (t) {
      t.completed = !t.completed;
      foundTask = t;
      break;
    }
  }

  if (!foundTask) {
    return res.status(404).json({ error: 'NotFound', message: `Task not found in study plan.` });
  }

  res.json({ success: true, task: foundTask });
});

// POST /api/study-plans/:id/tasks
plannerRouter.post('/:id/tasks', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const plan = db.studyPlans.get(req.params.id);
  if (!plan) {
    return res.status(404).json({ error: 'NotFound', message: 'Study plan not found.' });
  }

  const { targetDate, time, subject, activity, durationMinutes, type } = req.body;
  const newTask: StudyTaskRecord = {
    id: `st_${Date.now()}`,
    time: time || '10:00 AM',
    subject: subject || 'General Studies',
    activity: activity || 'Study session',
    durationMinutes: durationMinutes || 45,
    type: type || 'deep_work',
    completed: false,
  };

  const dayRecord = plan.scheduleDays.find((d) => d.date === targetDate) || plan.scheduleDays[0];
  if (dayRecord) {
    dayRecord.tasks.push(newTask);
  }

  res.status(201).json({ success: true, task: newTask });
});
