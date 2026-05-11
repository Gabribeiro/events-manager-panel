import { cn } from '@/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant =
  | 'active'
  | 'closed'
  | 'cancelled'
  | 'vip'
  | 'normal'
  | 'inside'
  | 'outside'
  | 'default';

const variants: Record<BadgeVariant, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-amber-100 text-amber-700 border-amber-200',
  cancelled: 'bg-red-100 text-red-600 border-red-200',
  vip: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  normal: 'bg-gray-100 text-gray-600 border-gray-200',
  inside: 'bg-green-100 text-green-700 border-green-200',
  outside: 'bg-gray-100 text-gray-500 border-gray-200',
  default: 'bg-gray-100 text-gray-600 border-gray-200',
};

const labels: Partial<Record<BadgeVariant, string>> = {
  active: 'Ativo',
  closed: 'Encerrado',
  cancelled: 'Cancelado',
  vip: 'VIP',
  normal: 'Normal',
  inside: 'Dentro',
  outside: 'Fora',
};

type BadgeProps = {
  variant: BadgeVariant;
  children?: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

export default function Badge({ variant, children, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap',
        variants[variant],
        className
      )}
      {...rest}
    >
      {children ?? labels[variant] ?? variant}
    </span>
  );
}
