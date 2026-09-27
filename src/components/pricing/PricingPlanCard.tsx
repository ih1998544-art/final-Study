import React from 'react';
import { PricingPlan, BillingCycle } from '../../types/pricing';
import { Button } from '../ui/Button';
import {
  Check,
  Sparkles,
  Bot,
  Layers,
  Award,
  TrendingUp,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface PricingPlanCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
  isCurrentPlan: boolean;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingPlanCard: React.FC<PricingPlanCardProps> = ({
  plan,
  billingCycle,
  isCurrentPlan,
  onSelectPlan,
}) => {
  const isFree = plan.id === 'free';
  const price = billingCycle === 'yearly' ? plan.yearlyPricePerMonth : plan.monthlyPrice;

  return (
    <div
      className={`rounded-2xl bg-white p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 relative ${
        plan.isPopular
          ? 'border-2 border-emerald-500 shadow-lg ring-1 ring-emerald-500/20'
          : 'border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Popular Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {plan.name}
            </h3>
            {isCurrentPlan && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Current Plan
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">
            {plan.subtitle}
          </p>
        </div>

        {/* Price Block */}
        <div className="pt-2 pb-1 border-b border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-900 font-display">
              ${isFree ? '0' : price.toFixed(price % 1 === 0 ? 0 : 2)}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ month</span>
          </div>

          <div className="h-5 mt-0.5">
            {billingCycle === 'yearly' && !isFree ? (
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                Billed annually (${plan.yearlyBillingTotal.toFixed(0)}/yr) · Save 20%
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                {isFree ? 'Free forever for students' : 'Billed monthly · Cancel anytime'}
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          {isCurrentPlan ? (
            <Button
              variant="outline"
              size="md"
              disabled
              className="w-full justify-center text-xs sm:text-sm font-bold bg-slate-50 text-slate-400 border-slate-200 cursor-default"
            >
              Current Active Plan
            </Button>
          ) : (
            <Button
              variant={plan.isPopular ? 'primary' : 'outline'}
              size="md"
              onClick={() => onSelectPlan(plan)}
              className="w-full justify-center text-xs sm:text-sm font-bold cursor-pointer shadow-xs"
            >
              {plan.ctaText}
            </Button>
          )}
        </div>

        {/* Limits Breakdown Section */}
        <div className="pt-4 space-y-2.5 text-xs border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display block">
            Plan Specifications & Limits
          </span>

          {/* AI Queries Limit */}
          <div className="flex items-start gap-2 text-slate-700">
            <Bot className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong>AI Limits:</strong> {plan.limits.aiQueriesPerDay}
            </span>
          </div>

          {/* Study Tools Limit */}
          <div className="flex items-start gap-2 text-slate-700">
            <Layers className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong>Study Tools:</strong> {plan.limits.studyToolsAccess}
            </span>
          </div>

          {/* Practice Questions Limit */}
          <div className="flex items-start gap-2 text-slate-700">
            <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong>Practice Drills:</strong> {plan.limits.practiceQuestionsLimit}
            </span>
          </div>

          {/* Analytics Depth */}
          <div className="flex items-start gap-2 text-slate-700">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong>Analytics:</strong> {plan.limits.analyticsDepth}
            </span>
          </div>

          {/* Storage Capacity */}
          <div className="flex items-start gap-2 text-slate-700">
            <HardDrive className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong>Storage Vault:</strong> {plan.limits.storageCapacity}
            </span>
          </div>
        </div>

        {/* Premium Features List */}
        <div className="pt-4 space-y-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display block">
            Premium Features Included
          </span>

          <div className="space-y-1.5 text-xs text-slate-600">
            {plan.limits.premiumFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
