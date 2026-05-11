import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EventList from '@/components/events/EventList';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('EventList — estados de renderização', () => {
  it('exibe skeletons de carregamento quando isLoading é true', () => {
    render(<EventList events={undefined} isLoading={true} isError={false} lang="pt" />);
    expect(screen.getByRole('status', { name: /carregando eventos/i })).toBeInTheDocument();
  });

  it('exibe mensagem de erro quando isError é true', () => {
    render(<EventList events={undefined} isLoading={false} isError={true} lang="pt" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/erro ao carregar eventos/i)).toBeInTheDocument();
  });

  it('exibe mensagem de lista vazia quando não há eventos', () => {
    render(<EventList events={[]} isLoading={false} isError={false} lang="pt" />);
    expect(screen.getByText(/nenhum evento encontrado/i)).toBeInTheDocument();
  });
});
