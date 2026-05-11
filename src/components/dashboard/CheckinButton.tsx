'use client';

import type { Event, Participant, Checkin } from '@/types';
import { useCheckin } from '@/hooks/useCheckin';
import { useLang } from '@/providers/LanguageProvider';
import Button from '@/components/ui/Button';

interface CheckinButtonProps {
  event: Event;
  participant: Participant;
  checkins: Checkin[];
}

export default function CheckinButton({ event, participant, checkins }: CheckinButtonProps) {
  const { t } = useLang();
  const { mutate, isPending } = useCheckin(event.id, {
    successEntry: t('checkin.toast_success_entry'),
    successExit: t('checkin.toast_success_exit'),
    errorClosed: t('checkin.toast_error_closed'),
    errorDuplicate: t('checkin.toast_error_duplicate'),
  });

  const isEventBlocked = event.status === 'closed' || event.status === 'cancelled';

  const label = (() => {
    if (isEventBlocked) return t('checkin.blocked');
    if (participant.type === 'normal' && participant.checkin_count >= 1) return t('checkin.already_done');
    if (participant.type === 'vip') {
      return participant.status === 'inside' ? t('checkin.register_exit') : t('checkin.register_entry');
    }
    return t('checkin.btn_checkin');
  })();

  const variant = (() => {
    if (isEventBlocked) return 'ghost' as const;
    if (participant.type === 'normal' && participant.checkin_count >= 1) return 'secondary' as const;
    if (participant.type === 'vip' && participant.status === 'inside') return 'secondary' as const;
    return 'primary' as const;
  })();

  const tooltipTitle =
    event.status === 'closed'
      ? t('checkin.event_closed_tooltip')
      : event.status === 'cancelled'
      ? t('checkin.event_cancelled_tooltip')
      : undefined;

  return (
    <Button
      size="sm"
      variant={variant}
      loading={isPending}
      disabled={isEventBlocked || (participant.type === 'normal' && participant.checkin_count >= 1)}
      onClick={() => mutate({ event, participant, allCheckins: checkins })}
      aria-label={`${label} — ${participant.name}`}
      title={tooltipTitle}
    >
      {label}
    </Button>
  );
}
