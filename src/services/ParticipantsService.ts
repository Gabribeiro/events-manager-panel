import type { Participant } from '@/types';
import api from './api';

export default class ParticipantsService {
  static getByEventId = (eventId: string): Promise<Participant[]> =>
    api.get<Participant[]>('/participants', { params: { event_id: eventId } }).then((r) => r.data);

  static update = (id: string, patch: Partial<Participant>): Promise<Participant> =>
    api.patch<Participant>(`/participants/${id}`, patch).then((r) => r.data);
}
