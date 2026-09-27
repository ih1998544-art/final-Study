import React, { useState } from 'react';
import { PRICING_PLANS, subscriptionService } from '../../services/subscriptionService';
import { BillingCycle, PricingPlan, UserSubscription } from '../../types/pricing';
import { PricingPlanCard } from './PricingPlanCard';
import { PlanComparisonTable } from './PlanComparisonTable';
import { CheckoutModal } from './CheckoutModal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  HelpCircle,
  ChevronDown,
  RotateCcw,
  Zap,
  Award,
  Clock,
  CreditCard,
} from 'lucide-react';

interface PricingPageProps {
  onNavigateHome?: () => void;
  onNavigateToDashboard?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigateHome,
  onNavigateToDashboard,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [subscription, setSubscription] = useState<UserSubscription>(() =>
    subscriptionService.getSubscription()
  );
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { showToast } = useToast();

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlanForCheckout(plan);
  };

  const handleConfirmPlanActivation = (planId: PricingPlan['id'], cycle: BillingCycle) => {
    const updated = subscriptionService.updateSubscription(planId, cycle);
    setSubscription(updated);
    showToast({
      type: 'success',
      title: 'Plan Activated',
      message: `Your account is now upgraded to ${planId.toUpperCase()} Scholar Tier (${cycle} billing).`,
    });
  };

  const faqs = [
    {
      q: 'Can I switch or cancel my plan anytime?',
      a: 'Yes, absolutely. There are zero lock-in contracts. You can switch between Monthly and Annual billing or downgrade to Free Scholar at any time from your Account Settings. If you cancel, you will maintain full access through the end of your billing cycle.',
    },
    {
      q: 'How do daily AI query limits reset?',
      a: 'Daily AI tutor queries reset automatically every 24 hours at midnight UTC. The Student Scholar tier provides 250 high-velocity queries daily, which is more than enough for intensive exam preparation and homework inquiry. Pro Research provides uncapped queries.',
    },
    {
      q: 'Is there a school or campus institutional discount?',
      a: 'Students registering with a verified academic email (.edu, .ac.uk, etc.) automatically receive priority server queuing. For university departments, high school AP programs, or study clubs looking for bulk campus licenses, our academic team provides custom group pricing.',
    },
    {
      q: 'Does Study Zone follow strict FERPA & GDPR student privacy regulations?',
      a: 'Yes. We strictly uphold academic privacy. Student notes, uploaded syllabus documents, test responses, and Socratic dialogues are encrypted in transit and at rest with 256-bit encryption and are never sold to advertisers or third-party brokers.',
    },
    {
      q: 'Can I use one subscription across all my academic subjects?',
      a: 'Yes! Your subscription covers all subjects—Mathematics, Physics, Chemistry, Computer Science, Economics, Biology, and any custom subjects you synthesize with our AI curriculum engine.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 pb-24 md:pb-16">
      {/* 1. Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent Academic Pricing · Built for Student Success</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
          Invest in Your Academic Excellence
        </h1>

        <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Choose the plan that fits your study velocity. Unlimited practice drills, 15 interactive study tools, Socratic AI tutoring, and deep learning analytics.
        </p>

        {/* Monthly / Yearly Billing Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 select-none">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Active Subscription Notification Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-display">
                Active Scholar Membership
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 capitalize">
                {subscription.planId} Tier
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Renews on {subscription.renewsAt} · {subscription.billingCycle} billing cycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All 15 Tools & 250 Daily AI Queries Unlocked</span>
          </span>
        </div>
      </div>

      {/* 3. Three Pricing Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => (
          <PricingPlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            isCurrentPlan={subscription.planId === plan.id}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>

      {/* 4. Trust & Security Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-200 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="block text-slate-900 font-display">256-Bit SSL Encryption</strong>
            <span className="text-[11px] text-slate-500">Bank-level transport security</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <RotateCcw className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="block text-slate-900 font-display">Cancel Anytime</strong>
            <span className="text-[11px] text-slate-500">1-click automated cancellation</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="block text-slate-900 font-display">FERPA / GDPR Compliant</strong>
            <span className="text-[11px] text-slate-500">Zero data selling or third-party ads</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="block text-slate-900 font-display">Instant Activation</strong>
            <span className="text-[11px] text-slate-500">Zero downtime onboarding</span>
          </div>
        </div>
      </div>

      {/* 5. Comprehensive Feature Comparison Table */}
      <PlanComparisonTable />

      {/* 6. Academic FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Frequently Asked Academic Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Common questions regarding billing, query limits, and institutional compliance.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Checkout / Plan Switch Confirmation Modal */}
      <CheckoutModal
        isOpen={Boolean(selectedPlanForCheckout)}
        plan={selectedPlanForCheckout}
        billingCycle={billingCycle}
        onClose={() => setSelectedPlanForCheckout(null)}
        onConfirmPlan={handleConfirmPlanActivation}
      />
    </div>
  );
};
