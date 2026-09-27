import React from 'react';
import { Home, BookOpen, Bot, Award, Wrench, X, Sparkles, LogIn, LogOut, User } from 'lucide-react';
import { NavigationTab } from '../../types';
import { UserProfile } from '../../types/auth';
import { Button } from '../ui/Button';

export interface MobileNavProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
  userProfile?: UserProfile | null;
  onLogout?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onNavigate,
  isOpen,
  onClose,
  onLoginClick,
  onGetStartedClick,
  userProfile,
  onLogout,
}) => {
  const quickItems = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'subjects' as NavigationTab, label: 'Subjects', icon: BookOpen },
    { id: 'ai_tutor' as NavigationTab, label: 'AI Tutor', icon: Bot },
    { id: 'practice' as NavigationTab, label: 'Practice', icon: Award },
    { id: 'study_tools' as NavigationTab, label: 'Tools', icon: Wrench },
  ];

  return (
    <>
      {/* Mobile Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-black text-base">
                    S
                  </span>
                  <span className="font-display font-bold text-slate-900">STUDY ZONE</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1.5">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'dashboard', label: 'Student Dashboard' },
                  { id: 'analytics', label: 'Progress Analytics' },
                  { id: 'subjects', label: 'Subjects' },
                  { id: 'ai_tutor', label: 'AI Tutor' },
                  { id: 'study_tools', label: 'Study Tools' },
                  { id: 'practice', label: 'Practice & Quizzes' },
                  { id: 'planner', label: 'AI Study Planner' },
                  { id: 'resources', label: 'Notes, Flashcards & Vault' },
                  { id: 'profile', label: 'Scholar Profile' },
                  { id: 'settings', label: 'Account & Settings' },
                  { id: 'pricing', label: 'Pricing Plans' },
                  { id: 'design_system', label: 'Design System & Foundation' },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id as NavigationTab);
                        onClose();
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-2.5">
              {userProfile ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                        {userProfile.avatarUrl ? (
                          <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                        ) : (
                          userProfile.name[0]
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{userProfile.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{userProfile.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center"
                      onClick={() => {
                        onClose();
                        onNavigate('profile');
                      }}
                      leftIcon={<User className="w-4 h-4" />}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                      onClick={() => {
                        onClose();
                        onLogout?.();
                      }}
                      leftIcon={<LogOut className="w-4 h-4" />}
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => {
                      onClose();
                      onLoginClick?.();
                    }}
                    leftIcon={<LogIn className="w-4 h-4" />}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      onClose();
                      onGetStartedClick?.();
                    }}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Start Learning Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Thumb Navigation (Clean 5-tab bar, height <= 60px) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        {quickItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
