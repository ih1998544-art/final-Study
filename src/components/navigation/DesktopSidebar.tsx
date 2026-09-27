import React from 'react';
import {
  Bot,
  BookOpen,
  Calendar,
  BarChart3,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Settings,
  TrendingUp,
  FileText,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { UserProfile } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';

export interface DesktopSidebarProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userStreakDays?: number;
  userProfile?: UserProfile | null;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  userStreakDays = 7,
  userProfile,
}) => {
  const { themeMode, colorTheme, toggleThemeMode, setColorTheme, availableThemes } = useTheme();

  const primaryNavigation = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Student Dashboard',
      icon: BarChart3,
      badge: 'Live',
    },
    {
      id: 'ai_tutor' as NavigationTab,
      label: 'Real AI Tools',
      icon: Sparkles,
      badge: 'Live Apps',
    },
    {
      id: 'subjects' as NavigationTab,
      label: 'Subject Catalog',
      icon: BookOpen,
    },
    {
      id: 'practice' as NavigationTab,
      label: 'Practice & Quizzes',
      icon: Award,
    },
    {
      id: 'planner' as NavigationTab,
      label: 'AI Study Planner',
      icon: Calendar,
      badge: 'Smart',
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Progress Analytics',
      icon: TrendingUp,
      badge: 'Insights',
    },
    {
      id: 'resources' as NavigationTab,
      label: 'Notes & Vault',
      icon: FileText,
      badge: 'Vault',
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200/90 dark:border-slate-800 transition-all duration-200 shrink-0 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-black text-sm shadow-xs shrink-0">
              S
            </span>
            <div className="flex flex-col">
              <span className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                STUDY ZONE
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold leading-tight mt-0.5">
                AI ACADEMIC ECOSYSTEM
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-black text-sm shadow-xs">
              S
            </span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {primaryNavigation.map((item) => {
          const isActive =
            activeTab === item.id ||
            (item.id === 'ai_tutor' && (activeTab === 'ai_tutor' || activeTab === 'study_tools'));
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer group ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-650 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-emerald-600'
                }`}
              />
              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                        isActive
                          ? 'bg-emerald-700/80 text-emerald-100'
                          : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Theme Switchers in Sidebar */}
      {!isCollapsed && (
        <div className="px-3 py-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono text-[10px] uppercase font-semibold">Mode</span>
            <button
              onClick={toggleThemeMode}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 cursor-pointer border border-slate-200 dark:border-slate-800"
              title="Click to cycle theme mode (7 modes available)"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-indigo-400" />
              <span className="capitalize">{themeMode}</span>
              <span className="text-[9px] text-slate-400">↺</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono text-[10px] uppercase font-semibold">Palette</span>
            <div className="flex items-center gap-1.5">
              {availableThemes.map((t) => {
                const isSelected = colorTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setColorTheme(t.id)}
                    className={`w-4 h-4 rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110 shadow-xs'
                        : 'opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: t.primaryHex }}
                    title={`${t.label} (${t.badge})`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Footer User Info */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between group hover:border-emerald-300 transition-colors">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer flex-1"
              title="View Profile"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  (userProfile?.name || 'Irshad Hussain')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600">
                  {userProfile?.name || 'Irshad Hussain'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tabular-nums truncate">
                  Scholar Profile →
                </span>
              </div>
            </button>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onNavigate('settings')}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60 text-[11px] font-semibold font-mono tabular-nums">
                <Flame className="w-3 h-3 fill-amber-500" />
                <span>{userStreakDays}d</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center text-xs cursor-pointer hover:ring-2 hover:ring-emerald-500/20"
              title={`${userProfile?.name || 'Irshad Hussain'} (Scholar)`}
            >
              {(userProfile?.name || 'Irshad Hussain')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
