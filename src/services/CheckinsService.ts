import type { Checkin, CheckinPayload } from '@/types';
import api from './api';

export default class CheckinsService {
  static getByEventId = (eventId: string): Promise<Checkin[]> =>
    api.get<Checkin[]>('/checkins', { params: { event_id: eventId } }).then((r) => r.data);

  static register = (payload: CheckinPayload): Promise<Checkin> =>
    api.post<Checkin>('/checkins', payload).then((r) => r.data);
}
