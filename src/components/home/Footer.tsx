import React from 'react';
import { NavigationTab } from '../../types';

export const Footer: React.FC<{
  onNavigate: (tab: NavigationTab) => void;
}> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-display font-black text-base shadow-xs">
                S
              </span>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                STUDY ZONE
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Learn Smarter. Study Better. Go Further. An AI-powered education ecosystem designed for high-retention learning, adaptive exam preparation, and mastery across every academic discipline.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Verified WCAG AA Accessible</span>
              <span>·</span>
              <span>COPPA & FERPA Compliant</span>
            </div>
          </div>

          {/* Core Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
              Ecosystem
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('ai_tutor')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Study Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subjects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Subject Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('study_tools')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  14 AI Study Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Practice Engine & Quizzes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Study Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Notes & Academic Vault
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Disciplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
              Disciplines
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('subjects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mathematics & Calculus
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subjects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Physics & Chemistry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subjects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Computer Science & AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subjects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Economics & Finance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subjects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Literature & Civics
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
              Plans & Institutional
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Student Free Tier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pro Scholar Plan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  University Partnerships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('design_system')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Design System & Tokens
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Study Zone Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Honor Code</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
