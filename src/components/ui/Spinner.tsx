import { cn } from '@/utils/cn';

type SpinnerSize = 'sm' | 'md' | 'lg';

const sizes: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

export default function Spinner({ size = 'md', className }: { size?: SpinnerSize; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={cn(
        'inline-block rounded-full border-gray-200 border-t-indigo-600 animate-spin',
        sizes[size],
        className
      )}
    />
  );
}
