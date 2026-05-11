import { useQuery } from '@tanstack/react-query';
import EventsService from '@/services/EventsService';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: EventsService.getAll,
  });
}
