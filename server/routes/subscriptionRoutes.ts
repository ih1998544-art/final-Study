/**
 * Study Zone - Subscriptions & Billing API Routes
 */

import { Router, type Response } from 'express';
import { db } from '../db/database.ts';
import type { SubscriptionRecord } from '../db/schema.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const subscriptionRouter = Router();

// GET /api/subscriptions/current
subscriptionRouter.get('/current', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  let subscription = db.subscriptions.get(userId);

  if (!subscription) {
    subscription = {
      userId,
      planId: 'student',
      billingCycle: 'monthly',
      status: 'active',
      activatedAt: '2026-09-01',
      renewsAt: '2026-10-01',
      cancelAtPeriodEnd: false,
    };
    db.subscriptions.set(userId, subscription);
  }

  res.json({ subscription });
});

// POST /api/subscriptions/checkout
subscriptionRouter.post('/checkout', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const { planId, billingCycle } = req.body;

  if (!planId || !['free', 'student', 'pro'].includes(planId)) {
    return res.status(400).json({ error: 'ValidationError', message: 'Valid planId is required (free, student, or pro).' });
  }

  const updatedSubscription: SubscriptionRecord = {
    userId,
    planId: planId as 'free' | 'student' | 'pro',
    billingCycle: billingCycle === 'yearly' ? 'yearly' : 'monthly',
    status: 'active',
    activatedAt: new Date().toISOString().split('T')[0],
    renewsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    cancelAtPeriodEnd: false,
  };

  db.subscriptions.set(userId, updatedSubscription);
  res.json({ success: true, subscription: updatedSubscription, message: `Subscribed to ${planId.toUpperCase()} plan successfully.` });
});

// POST /api/subscriptions/cancel
subscriptionRouter.post('/cancel', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const subscription = db.subscriptions.get(userId);

  if (subscription) {
    subscription.cancelAtPeriodEnd = true;
  }

  res.json({ success: true, message: 'Subscription will not renew at the end of the current billing cycle.' });
});
