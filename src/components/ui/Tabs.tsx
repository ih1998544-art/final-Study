import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'segmented' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'segmented',
  className = '',
}) => {
  if (variant === 'underline') {
    return (
      <div
        className={`flex items-center gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar ${className}`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented control style (clean, modern SaaS)
  return (
    <div
      className={`inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/60 overflow-x-auto max-w-full ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="ml-1 text-[11px] font-mono tabular-nums opacity-75">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
