import { cn } from '@/utils/cn';
import type { InputHTMLAttributes, ReactNode } from 'react';

type InputProps = {
  label?: string;
  icon?: ReactNode;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, icon, error, className, id, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500',
            icon ? 'pl-9 pr-3 py-2' : 'px-3 py-2',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
