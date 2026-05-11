import { useQuery } from '@tanstack/react-query';
import EventsService from '@/services/EventsService';
import ParticipantsService from '@/services/ParticipantsService';
import CheckinsService from '@/services/CheckinsService';

export function useEventDetail(id: string) {
  const event = useQuery({
    queryKey: ['events', id],
    queryFn: () => EventsService.getById(id),
    enabled: !!id,
  });

  const participants = useQuery({
    queryKey: ['participants', id],
    queryFn: () => ParticipantsService.getByEventId(id),
    enabled: !!id,
  });

  const checkins = useQuery({
    queryKey: ['checkins', id],
    queryFn: () => CheckinsService.getByEventId(id),
    enabled: !!id,
  });

  return { event, participants, checkins };
}
