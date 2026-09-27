import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'unboxed';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  children,
  ...props
}) => {
  if (variant === 'unboxed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium ${className}`}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />}
        {children}
      </span>
    );
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantClasses = {
    brand: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const dotColors = {
    brand: 'bg-emerald-600',
    neutral: 'bg-slate-500',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    danger: 'bg-rose-600',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
};
