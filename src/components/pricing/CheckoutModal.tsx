import React, { useState } from 'react';
import { PricingPlan, BillingCycle } from '../../types/pricing';
import { Button } from '../ui/Button';
import {
  X,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  plan: PricingPlan | null;
  billingCycle: BillingCycle;
  onClose: () => void;
  onConfirmPlan: (planId: PricingPlan['id'], billingCycle: BillingCycle) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  plan,
  billingCycle,
  onClose,
  onConfirmPlan,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !plan) return null;

  const isFree = plan.id === 'free';
  const price = billingCycle === 'yearly' ? plan.yearlyBillingTotal : plan.monthlyPrice;
  const pricePerMonth = billingCycle === 'yearly' ? plan.yearlyPricePerMonth : plan.monthlyPrice;

  const handleActivate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPlan(plan.id, billingCycle);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {isFree ? 'Switch to Free Scholar' : `Activate ${plan.name}`}
              </h3>
              <p className="text-xs text-slate-500">
                {billingCycle === 'yearly' ? 'Annual Billing (20% Savings)' : 'Monthly Flexible Subscription'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Summary Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Selected Plan
              </span>
              <h4 className="text-base font-bold text-slate-900 font-display">
                {plan.name}
              </h4>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 font-display">
                ${pricePerMonth.toFixed(2)}
                <span className="text-xs text-slate-500 font-normal"> / mo</span>
              </div>
              {billingCycle === 'yearly' && !isFree && (
                <span className="text-[11px] font-mono text-emerald-700 font-semibold block">
                  ${plan.yearlyBillingTotal.toFixed(2)} billed annually
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/70 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>AI Queries:</span>
              <strong className="text-slate-900 font-medium">{plan.limits.aiQueriesPerDay}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Study Tools:</span>
              <strong className="text-slate-900 font-medium">{plan.limits.studyToolsAccess}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Practice Limit:</span>
              <strong className="text-slate-900 font-medium">{plan.limits.practiceQuestionsLimit}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Academic Storage:</span>
              <strong className="text-slate-900 font-medium">{plan.limits.storageCapacity}</strong>
            </div>
          </div>
        </div>

        {/* Architecture Notice (Trustworthy & Transparent) */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 font-display">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Subscription Architecture</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            In live deployment, this transaction integrates directly with Stripe or Paddle customer billing.
            Clicking activate will update your student tier immediately for your session without requiring credit card data.
          </p>
        </div>

        {/* Guarantees List */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>14-day full satisfaction academic guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Cancel or switch tiers anytime in 1 click from Settings</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>FERPA & GDPR compliant student data privacy protection</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={isProcessing}
            onClick={handleActivate}
            className="gap-2 cursor-pointer shadow-xs"
          >
            <span>{isProcessing ? 'Activating...' : isFree ? 'Confirm Free Tier' : 'Confirm Plan Activation'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
