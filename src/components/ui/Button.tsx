import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 disabled:bg-indigo-300',
  secondary:
    'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-gray-400 disabled:opacity-50',
  ghost:
    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400 disabled:opacity-50',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
