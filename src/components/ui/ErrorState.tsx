import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load study data',
  message = 'An unexpected error occurred while communicating with the study service. Please verify your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`bg-rose-50/50 rounded-xl border border-rose-200 p-6 sm:p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
      role="alert"
    >
      <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-3 shrink-0">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900 font-display">
        {title}
      </h3>
      <p className="text-xs text-rose-700/80 mt-1 max-w-xs leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-rose-600" />}
            className="border-rose-300 text-rose-800 hover:bg-rose-100"
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
};
