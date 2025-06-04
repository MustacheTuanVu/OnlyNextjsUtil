'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Đang tải...' }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
      <LoadingSpinner size="lg" className="text-blue-600" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}

interface LoadingCardProps {
  lines?: number;
}

export function LoadingCard({ lines = 3 }: LoadingCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className="h-3 bg-gray-200 rounded" 
            style={{ width: `${Math.random() * 40 + 60}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  loading: boolean;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export function LoadingButton({ 
  children, 
  loading, 
  disabled, 
  className = '', 
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={`
        relative flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2 text-current" />
      )}
      {children}
    </button>
  );
}
