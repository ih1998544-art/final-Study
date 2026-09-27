import React from 'react';
import { Home, BookOpen, Bot, Award, Sparkles, X, LogIn, LogOut, User, Sun, Moon, Palette } from 'lucide-react';
import { NavigationTab } from '../../types';
import { UserProfile } from '../../types/auth';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

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
  const { themeMode, colorTheme, toggleThemeMode, setColorTheme, availableThemes } = useTheme();

  const quickItems = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'subjects' as NavigationTab, label: 'Subjects', icon: BookOpen },
    { id: 'ai_tutor' as NavigationTab, label: 'AI Suite', icon: Sparkles },
    { id: 'practice' as NavigationTab, label: 'Practice', icon: Award },
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: User },
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
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div className="overflow-y-auto">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-black text-base">
                    S
                  </span>
                  <span className="font-display font-bold text-slate-900 dark:text-white">STUDY ZONE</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme & Color Toggles in Mobile Drawer */}
              <div className="py-3 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mode</span>
                  <button
                    onClick={toggleThemeMode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    title="Toggle Dark/Light Mode"
                  >
                    {themeMode === 'dark' ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-slate-600" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Color Palette</span>
                  <div className="flex items-center gap-1.5">
                    {availableThemes.map((t) => {
                      const isSelected = colorTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setColorTheme(t.id)}
                          className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110 shadow-xs'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ backgroundColor: t.primaryHex }}
                          title={t.label}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <nav className="mt-4 flex flex-col gap-1">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'dashboard', label: 'Student Dashboard' },
                  { id: 'ai_tutor', label: 'Real AI Tools (23 Applications)', highlight: true },
                  { id: 'subjects', label: 'Subjects Catalog' },
                  { id: 'practice', label: 'Practice & Quizzes' },
                  { id: 'planner', label: 'AI Study Planner' },
                  { id: 'analytics', label: 'Progress Analytics' },
                  { id: 'resources', label: 'Notes, Flashcards & Vault' },
                  { id: 'profile', label: 'Scholar Profile' },
                  { id: 'settings', label: 'Account & Settings' },
                  { id: 'pricing', label: 'Pricing Plans' },
                ].map((item) => {
                  const isActive = activeTab === item.id || (item.id === 'ai_tutor' && (activeTab === 'ai_tutor' || activeTab === 'study_tools'));
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id as NavigationTab);
                        onClose();
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-600 text-white font-semibold'
                          : item.highlight
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {userProfile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center text-xs">
                      {userProfile.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {userProfile.name}
                      </div>
                      <div className="text-[10px] text-slate-500">Scholar Lvl 4</div>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onLoginClick?.();
                      onClose();
                    }}
                    className="w-full text-xs"
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onGetStartedClick?.();
                      onClose();
                    }}
                    className="w-full text-xs"
                  >
                    Get Started Free
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around"
      >
        {quickItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'ai_tutor' && (activeTab === 'ai_tutor' || activeTab === 'study_tools'));
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
