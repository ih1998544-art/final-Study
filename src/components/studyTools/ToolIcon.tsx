import React from 'react';
import {
  Bot,
  FileText,
  FileCheck2,
  HelpCircle,
  ListChecks,
  Layers,
  GraduationCap,
  Calendar,
  PenTool,
  Languages,
  Lightbulb,
  Code2,
  Zap,
  Binary,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Bot,
  FileText,
  FileCheck2,
  HelpCircle,
  ListChecks,
  Layers,
  GraduationCap,
  Calendar,
  PenTool,
  Languages,
  Lightbulb,
  Code2,
  Zap,
  Binary,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  blue: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
};

interface ToolIconProps {
  name: string;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({
  name,
  colorScheme = 'emerald',
  size = 'md',
  className = '',
}) => {
  const IconComponent = ICON_MAP[name] || Bot;
  const colors = COLOR_MAP[colorScheme] || COLOR_MAP.emerald;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-sm',
    md: 'w-10 h-10 rounded-xl text-base',
    lg: 'w-12 h-12 rounded-xl text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`flex items-center justify-center shrink-0 border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]} ${className}`}
    >
      <IconComponent className={iconSizes[size]} />
    </div>
  );
};
