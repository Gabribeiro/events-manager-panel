'use client';

import { useEffect, useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useLang } from '@/providers/LanguageProvider';
import type { EventStatus } from '@/types';

export type SortOrder = 'asc' | 'desc';

interface EventFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (status: EventStatus | '') => void;
  onSortToggle: () => void;
  sortOrder: SortOrder;
  statusFilter: EventStatus | '';
}

export default function EventFilters({
  onSearchChange,
  onStatusChange,
  onSortToggle,
  sortOrder,
  statusFilter,
}: EventFiltersProps) {
  const { t } = useLang();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(search), 300);
    return () => clearTimeout(timer);
  }, [search, onSearchChange]);

  const statusOptions = [
    { value: 'active', label: t('event_status.active') },
    { value: 'closed', label: t('event_status.closed') },
    { value: 'cancelled', label: t('event_status.cancelled') },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          placeholder={t('filters.search_placeholder')}
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t('filters.search_aria')}
        />
      </div>

      <Select
        placeholder={t('filters.all_statuses')}
        options={statusOptions}
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as EventStatus | '')}
        className="sm:w-44"
        aria-label={t('filters.status_aria')}
      />

      <Button
        variant="secondary"
        onClick={onSortToggle}
        aria-label={t(sortOrder === 'asc' ? 'filters.sort_asc_aria' : 'filters.sort_desc_aria')}
      >
        <ArrowUpDown className="h-4 w-4" />
        {t('filters.date')} {sortOrder === 'asc' ? '↑' : '↓'}
      </Button>
    </div>
  );
}
