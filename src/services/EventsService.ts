import type { Event } from '@/types';
import api from './api';

export default class EventsService {
  static getAll = (): Promise<Event[]> =>
    api.get<Event[]>('/events').then((r) => r.data);

  static getById = (id: string): Promise<Event> =>
    api.get<Event>(`/events/${id}`).then((r) => r.data);

  static update = (id: string, patch: Partial<Event>): Promise<Event> =>
    api.patch<Event>(`/events/${id}`, patch).then((r) => r.data);
}
