import React from 'react';
import {
  Bot,
  BookOpen,
  Calendar,
  BarChart3,
  Flame,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Layers,
  Award,
  Settings,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { UserProfile } from '../../types/auth';

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
  const primaryNavigation = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Student Dashboard',
      icon: BarChart3,
      badge: 'Live',
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Progress Analytics',
      icon: TrendingUp,
      badge: 'Insights',
    },
    {
      id: 'ai_tutor' as NavigationTab,
      label: 'AI Study Agent',
      icon: Bot,
      badge: 'Core',
    },
    {
      id: 'subjects' as NavigationTab,
      label: 'Subject Catalog',
      icon: BookOpen,
    },
    {
      id: 'study_tools' as NavigationTab,
      label: 'Study Tools (15)',
      icon: Layers,
      badge: '15 Tools',
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
      id: 'resources' as NavigationTab,
      label: 'Notes & Vault',
      icon: FileText,
      badge: 'Vault',
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200/90 transition-all duration-200 shrink-0 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Top Brand / Context Bar */}
      <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-bold text-sm shadow-xs shrink-0">
              SZ
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 font-display truncate">
                Study Zone Workspace
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                AI Learning Platform
              </span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex justify-center p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Expand sidebar"
            title="Click to expand sidebar"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-bold text-sm shadow-xs">
              SZ
            </div>
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Ecosystem
          </div>
        )}

        {primaryNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-emerald-600' : 'text-slate-500'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-mono px-1.5 py-0.2 rounded font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Secondary section: Foundation / Design System */}
        <div className="my-2 border-t border-slate-100" />

        {!isCollapsed && (
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Foundation
          </div>
        )}

        <button
          onClick={() => onNavigate('design_system')}
          title={isCollapsed ? 'Design System Foundation' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'design_system'
              ? 'bg-emerald-50 text-emerald-700 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          } ${isCollapsed ? 'justify-center px-2' : ''}`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          {!isCollapsed && <span className="truncate text-left">Design System (Step 1)</span>}
        </button>
      </div>

      {/* Bottom Profile / Study Streak Card */}
      <div className="p-3 border-t border-slate-100">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between group hover:border-emerald-300 transition-colors">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer flex-1"
              title="View Profile"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  (userProfile?.name || 'Jordan Diaz')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-700">
                  {userProfile?.name || 'Jordan Diaz'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono tabular-nums truncate">
                  {userProfile?.academicLevel ? `${userProfile.academicLevel.split(' ')[0]} Scholar` : 'Scholar Profile →'}
                </span>
              </div>
            </button>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onNavigate('settings')}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 text-[11px] font-semibold font-mono tabular-nums">
                <Flame className="w-3 h-3 fill-amber-500" />
                <span>{userStreakDays}d</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center text-xs cursor-pointer hover:ring-2 hover:ring-emerald-500/20"
              title={`${userProfile?.name || 'Jordan Diaz'} (Scholar)`}
            >
              {(userProfile?.name || 'Jordan Diaz')
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
