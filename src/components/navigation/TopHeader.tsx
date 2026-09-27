import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sparkles, Settings, ChevronDown, Sun, Moon, Palette, BookOpen, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import { NavigationTab } from '../../types';
import { UserProfile } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';

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
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const { themeMode, colorTheme, toggleThemeMode, setColorTheme, availableThemes } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setIsPaletteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems: { id: NavigationTab; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'ai_tutor', label: 'Real AI Tools', badge: 'Real Apps' },
    { id: 'practice', label: 'Practice' },
  ];

  const secondaryNavItems: { id: NavigationTab; label: string }[] = [
    { id: 'planner', label: 'Planner' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'resources', label: 'Notes & Vault' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-2 hover:opacity-90 transition-opacity text-left shrink-0 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-black text-base shadow-xs">
            S
          </span>
          <span className="tracking-tight">STUDY ZONE</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium">
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'ai_tutor' && (activeTab === 'ai_tutor' || activeTab === 'study_tools'));
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
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
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
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
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isMoreOpen ? 'rotate-180' : ''}`} />
              {isSecondaryActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              )}
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
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
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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

        {/* Zone 3: Actions + Theme Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Theme Mode Toggle (Light/Dark) */}
          <button
            onClick={toggleThemeMode}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark/light theme"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Color Palette Switcher (5 Themes: Emerald, Sapphire, Amethyst, Crimson, Amber) */}
          <div className="relative" ref={paletteRef}>
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
              title="Change Theme Color Palette (5 Colors Available)"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                style={{
                  backgroundColor: availableThemes.find((t) => t.id === colorTheme)?.primaryHex || '#059669',
                }}
              />
              <span className="hidden sm:inline font-mono text-[11px] text-slate-700 dark:text-slate-300 capitalize">
                {colorTheme}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isPaletteOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPaletteOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 pb-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono uppercase font-bold text-slate-400">
                  Select Theme Palette (5 Colors)
                </div>
                {availableThemes.map((theme) => {
                  const isSelected = colorTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setColorTheme(theme.id);
                        setIsPaletteOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: theme.primaryHex }}
                        />
                        <span>{theme.label}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {userProfile ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-left cursor-pointer group"
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
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 leading-tight">
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
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                className="hidden sm:inline-flex text-slate-700 dark:text-slate-200"
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
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Open mobile navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
