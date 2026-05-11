import { cn } from '@/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
