/**
 * Study Zone - Pricing & Subscription Domain Types
 */

export type BillingCycle = 'monthly' | 'yearly';
export type PlanId = 'free' | 'student' | 'pro';

export interface PlanLimits {
  aiQueriesPerDay: string;
  studyToolsAccess: string;
  practiceQuestionsLimit: string;
  analyticsDepth: string;
  storageCapacity: string;
  premiumFeatures: string[];
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  subtitle: string;
  badge?: string;
  isPopular?: boolean;
  monthlyPrice: number;
  yearlyPricePerMonth: number;
  yearlyBillingTotal: number;
  description: string;
  ctaText: string;
  limits: PlanLimits;
  featureHighlights: string[];
}

export interface UserSubscription {
  planId: PlanId;
  billingCycle: BillingCycle;
  status: 'active' | 'trial' | 'canceled';
  activatedAt: string;
  renewsAt: string;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentProviderConfig {
  provider: 'stripe' | 'paddle' | 'lemon_squeezy';
  currency: string;
  merchantId?: string;
  isLiveMode: boolean;
}
