import { cn } from '@/utils/cn';
import type { SelectHTMLAttributes } from 'react';

type SelectOption = { value: string; label: string };

type SelectProps = {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ label, options, placeholder, className, id, ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100',
          'px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:bg-gray-50 dark:disabled:bg-gray-700',
          className
        )}
        {...rest}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
