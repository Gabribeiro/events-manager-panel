'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Event, Participant } from '@/types';
import CheckinsService from '@/services/CheckinsService';
import ParticipantsService from '@/services/ParticipantsService';
import EventsService from '@/services/EventsService';

interface CheckinArgs {
  event: Event;
  participant: Participant;
  allCheckins: { success: boolean }[];
}

interface CheckinMessages {
  successEntry: string;
  successExit: string;
  errorClosed: string;
  errorDuplicate: string;
}

export function useCheckin(eventId: string, messages: CheckinMessages) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ event, participant, allCheckins }: CheckinArgs) => {
      const timestamp = new Date().toISOString();

      if (event.status === 'closed') {
        throw new Error(messages.errorClosed);
      }

      const isNormalDuplicate =
        participant.type === 'normal' && participant.checkin_count >= 1;

      if (isNormalDuplicate) {
        await CheckinsService.register({
          event_id: event.id,
          participant_id: participant.id,
          timestamp,
          success: false,
          action: 'entry',
          error_reason: 'already_checked_in',
        });

        await EventsService.update(event.id, {
          error_count: event.error_count + 1,
          entry_rate:
            event.expected_count > 0
              ? event.checkin_count / event.expected_count
              : 0,
        });

        queryClient.invalidateQueries({ queryKey: ['checkins', eventId] });
        queryClient.invalidateQueries({ queryKey: ['events', eventId] });

        throw new Error(messages.errorDuplicate);
      }

      const action =
        participant.type === 'vip'
          ? participant.status === 'inside'
            ? 'exit'
            : 'entry'
          : 'entry';

      const newStatus = action === 'entry' ? 'inside' : 'outside';

      await CheckinsService.register({
        event_id: event.id,
        participant_id: participant.id,
        timestamp,
        success: true,
        action,
        error_reason: null,
      });

      await ParticipantsService.update(participant.id, {
        status: newStatus,
        checkin_count: participant.checkin_count + 1,
      });

      const newCheckinCount =
        action === 'entry' ? event.checkin_count + 1 : event.checkin_count;

      await EventsService.update(event.id, {
        checkin_count: newCheckinCount,
        entry_rate:
          event.expected_count > 0
            ? newCheckinCount / event.expected_count
            : 0,
      });

      return { action, newStatus };
    },

    onSuccess: ({ action }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['participants', eventId] });
      queryClient.invalidateQueries({ queryKey: ['checkins', eventId] });

      toast.success(action === 'entry' ? messages.successEntry : messages.successExit);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
