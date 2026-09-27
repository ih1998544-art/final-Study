/**
 * Study Zone - Pricing & Subscription Management Service
 * Clean subscription state management and provider-ready payment architecture.
 */

import { PricingPlan, UserSubscription, PlanId, BillingCycle } from '../types/pricing';

const SUBSCRIPTION_STORAGE_KEY = 'sz_user_subscription_v1';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Scholar',
    subtitle: 'For curious students exploring AI-assisted learning',
    monthlyPrice: 0,
    yearlyPricePerMonth: 0,
    yearlyBillingTotal: 0,
    description: 'Get started with essential study tools, foundational flashcards, and basic AI tutoring inquiries.',
    ctaText: 'Current Plan',
    limits: {
      aiQueriesPerDay: '25 AI queries / day',
      studyToolsAccess: 'Access to 4 core study tools',
      practiceQuestionsLimit: '30 practice questions / day',
      analyticsDepth: 'Basic 7-day study time velocity',
      storageCapacity: '50 MB notes & flashcard storage',
      premiumFeatures: [
        'Standard response speed',
        'Standard Cornell note formatting',
        'Community discussion access',
        'Web browser access',
      ],
    },
    featureHighlights: [
      '25 Socratic AI inquiries daily',
      '4 core study tools (Flashcards, Pomodoro, Cornell, Summarizer)',
      '30 diagnostic practice questions daily',
      'Basic weekly study time chart',
    ],
  },
  {
    id: 'student',
    name: 'Student Scholar',
    subtitle: 'The complete study acceleration suite for university & high school students',
    badge: 'Most Popular',
    isPopular: true,
    monthlyPrice: 9,
    yearlyPricePerMonth: 7.2,
    yearlyBillingTotal: 86.4,
    description: 'Full unconstrained access to all 15 study tools, high-speed Socratic AI, unlimited practice tests, and detailed progress analytics.',
    ctaText: 'Upgrade to Student',
    limits: {
      aiQueriesPerDay: '250 high-velocity AI queries / day',
      studyToolsAccess: 'All 15 interactive study tools unlocked',
      practiceQuestionsLimit: 'Unlimited diagnostic practice questions',
      analyticsDepth: 'Full 9-metric analytics suite + 5 visual charts',
      storageCapacity: '5 GB cloud notes, decks & PDF storage',
      premiumFeatures: [
        'High-velocity priority processing',
        'Leitner automated spaced-repetition scheduler',
        'PDF document indexer & interactive reader',
        'Weekly academic progress digest email',
        'Streak freeze insurance shields (3 per month)',
      ],
    },
    featureHighlights: [
      '250 Socratic AI inquiries daily',
      'All 15 interactive study tools unlocked',
      'Unlimited practice drills & mock quiz banks',
      'Full 9-metric learning analytics with 5 visual charts',
      '5 GB academic vault with PDF reader',
      'Automated spaced repetition & streak protection',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Research',
    subtitle: 'Maximum pedagogical computing for honors theses, med/law preps & deep research',
    badge: 'Research Grade',
    monthlyPrice: 19,
    yearlyPricePerMonth: 15.2,
    yearlyBillingTotal: 182.4,
    description: 'Uncapped AI inquiries, predictive final examination grade forecasting, LaTeX math export, and direct academic concierge support.',
    ctaText: 'Upgrade to Pro',
    limits: {
      aiQueriesPerDay: 'Unlimited priority queries (Zero rate limits)',
      studyToolsAccess: 'All 15 tools + Early access to beta modules',
      practiceQuestionsLimit: 'Unlimited drills + AI question synthesizer',
      analyticsDepth: 'Cohort benchmarking + Predictive final exam model',
      storageCapacity: '50 GB encrypted cloud storage + LaTeX sync',
      premiumFeatures: [
        'Dedicated high-throughput GPU inference pool',
        'Predictive final exam grade forecasting (98% precision)',
        'Full LaTeX & BibTeX academic export pipeline',
        'Custom syllabus synthesis from course syllabus PDFs',
        '24/7 Academic concierge & pedagogical guidance',
      ],
    },
    featureHighlights: [
      'Unlimited priority AI queries with zero wait times',
      'Custom exam syllabus synthesis from course syllabi',
      'Predictive final exam grade modeling & benchmark comparison',
      '50 GB cloud storage with LaTeX & BibTeX export',
      'Early access to next-gen reasoning models',
      'Priority academic concierge support',
    ],
  },
];

export const DEFAULT_USER_SUBSCRIPTION: UserSubscription = {
  planId: 'student', // Pre-activated Student Scholar plan for demo
  billingCycle: 'monthly',
  status: 'active',
  activatedAt: '2026-09-01',
  renewsAt: '2026-10-01',
  cancelAtPeriodEnd: false,
};

class SubscriptionService {
  getSubscription(): UserSubscription {
    try {
      const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_USER_SUBSCRIPTION;
  }

  saveSubscription(sub: UserSubscription): void {
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(sub));
    } catch (e) {
      console.warn('Failed to save subscription state', e);
    }
  }

  updateSubscription(planId: PlanId, billingCycle: BillingCycle): UserSubscription {
    const today = new Date().toISOString().split('T')[0];
    const renewDate = new Date();
    renewDate.setDate(renewDate.getDate() + (billingCycle === 'yearly' ? 365 : 30));

    const updated: UserSubscription = {
      planId,
      billingCycle,
      status: 'active',
      activatedAt: today,
      renewsAt: renewDate.toISOString().split('T')[0],
      cancelAtPeriodEnd: false,
    };

    this.saveSubscription(updated);

    // Sync to backend API
    fetch('/api/subscriptions/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, billingCycle }),
    }).catch(() => {});

    return updated;
  }

  cancelSubscription(): UserSubscription {
    const current = this.getSubscription();
    const updated: UserSubscription = {
      ...current,
      cancelAtPeriodEnd: true,
    };
    this.saveSubscription(updated);

    // Sync to backend API
    fetch('/api/subscriptions/cancel', {
      method: 'POST',
    }).catch(() => {});

    return updated;
  }
}

export const subscriptionService = new SubscriptionService();
