import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sparkles, Settings, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { NavigationTab } from '../../types';
import { UserProfile } from '../../types/auth';

export interface TopHeaderProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
  userProfile?: UserProfile | null;
  onOpenSettings?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onNavigate,
  onOpenMobileMenu,
  isMobileMenuOpen = false,
  onLoginClick,
  onGetStartedClick,
  userProfile,
  onOpenSettings,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'ai_tutor', label: 'AI Tutor' },
    { id: 'practice', label: 'Practice' },
  ];

  const secondaryNavItems: { id: NavigationTab; label: string }[] = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'study_tools', label: 'Study Tools' },
    { id: 'planner', label: 'Planner' },
    { id: 'resources', label: 'Notes & Vault' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2 hover:opacity-90 transition-opacity text-left shrink-0 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-black text-base shadow-xs">
            S
          </span>
          <span className="tracking-tight">STUDY ZONE</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with subtle active/hover state */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium">
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-emerald-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}

          {/* Extended items on xl screens */}
          <div className="hidden xl:flex items-center gap-5 lg:gap-7">
            {secondaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-emerald-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* More dropdown for md/lg viewports */}
          <div className="xl:hidden relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex items-center gap-1 py-1 transition-colors whitespace-nowrap cursor-pointer ${
                isSecondaryActive
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isMoreOpen ? 'rotate-180' : ''}`} />
              {isSecondaryActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {secondaryNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMoreOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {userProfile ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all text-left cursor-pointer group"
                title="View Scholar Profile"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    userProfile.name[0]
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 leading-tight">
                    {userProfile.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium leading-tight">
                    Scholar Lvl 4
                  </div>
                </div>
              </button>

              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Settings & Workspace Preferences"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className="hidden sm:inline-flex text-slate-700"
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onGetStartedClick}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Get Started
              </Button>
            </>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
