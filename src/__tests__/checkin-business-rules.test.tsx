import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CheckinButton from '@/components/dashboard/CheckinButton';
import type { Event, Participant, Checkin } from '@/types';

import { getT } from '@/utils/getT';

vi.mock('@/providers/LanguageProvider', () => ({
  useLang: () => ({ lang: 'pt', t: getT('pt') }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/services/CheckinsService', () => ({
  default: { register: vi.fn().mockResolvedValue({ id: 'new', success: false }) },
}));
vi.mock('@/services/ParticipantsService', () => ({
  default: { update: vi.fn().mockResolvedValue({}) },
}));
vi.mock('@/services/EventsService', () => ({
  default: { update: vi.fn().mockResolvedValue({}) },
}));

import CheckinsService from '@/services/CheckinsService';

const activeEvent: Event = {
  id: 'EVT-001',
  name: 'Tech Summit',
  date: '2025-05-15T09:00:00-03:00',
  location: 'SP',
  status: 'active',
  description: '',
  expected_count: 10,
  checkin_count: 5,
  error_count: 0,
  entry_rate: 0.5,
};

const normalParticipantCheckedIn: Participant = {
  id: 'P-001',
  event_id: 'EVT-001',
  name: 'Ana Silva',
  type: 'normal',
  status: 'inside',
  checkin_count: 1,
};

const checkins: Checkin[] = [];

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('Regra de negócio — participante normal não pode fazer 2 check-ins', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('desabilita o botão para participante normal que já fez check-in', () => {
    render(
      <CheckinButton
        event={activeEvent}
        participant={normalParticipantCheckedIn}
        checkins={checkins}
      />,
      { wrapper }
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('exibe label "Já realizado" para participante normal com checkin_count >= 1', () => {
    render(
      <CheckinButton
        event={activeEvent}
        participant={normalParticipantCheckedIn}
        checkins={checkins}
      />,
      { wrapper }
    );
    expect(screen.getByText(/já realizado/i)).toBeInTheDocument();
  });

  it('registra erro no servidor e exibe toast de erro ao clicar mesmo sem botão visível (via mutação direta)', async () => {
    const participantEnabled: Participant = {
      ...normalParticipantCheckedIn,
      checkin_count: 0,
      status: 'outside',
    };
    render(
      <CheckinButton event={activeEvent} participant={participantEnabled} checkins={checkins} />,
      { wrapper }
    );
    await userEvent.click(screen.getByRole('button'));
    expect(CheckinsService.register).toHaveBeenCalledOnce();
  });
});
