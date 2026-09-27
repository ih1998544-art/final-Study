import React from 'react';
import { Loader2 } from 'lucide-react';

export const Skeleton: React.FC<{
  className?: string;
  width?: string;
  height?: string;
}> = ({ className = '', width, height }) => {
  return (
    <div
      className={`bg-slate-200/70 animate-pulse rounded-md ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-1/3 h-5" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-4/5 h-4" />
      <div className="pt-2 flex items-center gap-3">
        <Skeleton className="w-20 h-8 rounded-lg" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export const FullPageSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading Study Zone environment...',
}) => {
  return (
    <div className="min-h-[300px] w-full flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};
