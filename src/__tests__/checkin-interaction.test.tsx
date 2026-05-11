import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
  default: { register: vi.fn().mockResolvedValue({ id: 'chk-new', success: true, action: 'entry' }) },
}));
vi.mock('@/services/ParticipantsService', () => ({
  default: { update: vi.fn().mockResolvedValue({ id: 'P-VIP-01', status: 'inside' }) },
}));
vi.mock('@/services/EventsService', () => ({
  default: { update: vi.fn().mockResolvedValue({}) },
}));

import CheckinsService from '@/services/CheckinsService';
import ParticipantsService from '@/services/ParticipantsService';
import { toast } from 'sonner';

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

const vipOutside: Participant = {
  id: 'P-VIP-01',
  event_id: 'EVT-001',
  name: 'Carlos VIP',
  type: 'vip',
  status: 'outside',
  checkin_count: 2,
};

const checkins: Checkin[] = [];

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('Interação de check-in — VIP fora do evento', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exibe "Registrar Entrada" para VIP com status outside', () => {
    render(
      <CheckinButton event={activeEvent} participant={vipOutside} checkins={checkins} />,
      { wrapper }
    );
    expect(screen.getByText(/registrar entrada/i)).toBeInTheDocument();
  });

  it('chama POST /checkins com action "entry" ao clicar no botão', async () => {
    render(
      <CheckinButton event={activeEvent} participant={vipOutside} checkins={checkins} />,
      { wrapper }
    );

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(CheckinsService.register).toHaveBeenCalledWith(
        expect.objectContaining({
          event_id: 'EVT-001',
          participant_id: 'P-VIP-01',
          success: true,
          action: 'entry',
          error_reason: null,
        })
      );
    });
  });

  it('chama PATCH /participants para atualizar status para "inside"', async () => {
    render(
      <CheckinButton event={activeEvent} participant={vipOutside} checkins={checkins} />,
      { wrapper }
    );

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(ParticipantsService.update).toHaveBeenCalledWith(
        'P-VIP-01',
        expect.objectContaining({ status: 'inside' })
      );
    });
  });

  it('exibe toast de sucesso após check-in', async () => {
    render(
      <CheckinButton event={activeEvent} participant={vipOutside} checkins={checkins} />,
      { wrapper }
    );

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(getT('pt')('checkin.toast_success_entry'));
    });
  });
});
