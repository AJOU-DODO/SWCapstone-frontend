import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostcardReactions } from './PostcardReactions';
import { type ReactNode } from 'react';

// API 모킹
vi.mock('@/lib/apiMypage', () => ({
  togglePostcardReaction: vi.fn(),
}));

import { togglePostcardReaction } from '@/lib/apiMypage';
const mockToggle = vi.mocked(togglePostcardReaction);

// QueryClient wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';

  return Wrapper;
};

const setup = (initialReaction: string | null = null) => {
  render(
    <PostcardReactions
      postcardId={1}
      accessToken="mock-token"
      initialReaction={initialReaction as any}
    />,
    { wrapper: createWrapper() }
  );
};

describe('PostcardReactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToggle.mockResolvedValue(undefined as any);
  });

  describe('토글 로직', () => {
    it('리액션 클릭 시 해당 리액션이 선택된다', async () => {
      setup();

      await userEvent.click(screen.getByRole('button', { name: '😊' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '😊' })).toHaveClass('bg-[#54513E]');
      });
    });

    it('선택된 리액션을 다시 클릭하면 선택이 취소된다', async () => {
      setup('HAPPY');

      const happyButton = screen.getByRole('button', { name: '😊' });
      expect(happyButton).toHaveClass('bg-[#54513E]');

      await userEvent.click(happyButton);

      await waitFor(() => {
        expect(happyButton).not.toHaveClass('bg-[#54513E]');
      });
    });

    it('다른 리액션 클릭 시 선택이 변경된다', async () => {
      setup('HAPPY');

      await userEvent.click(screen.getByRole('button', { name: '🤩' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '🤩' })).toHaveClass('bg-[#54513E]');
        expect(screen.getByRole('button', { name: '😊' })).not.toHaveClass('bg-[#54513E]');
      });
    });
  });

  describe('API 실패 시 롤백', () => {
    it('API 실패 시 initialReaction으로 복구된다', async () => {
      mockToggle.mockRejectedValue(new Error('API 실패'));
      setup('HAPPY');

      await userEvent.click(screen.getByRole('button', { name: '🤩' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '😊' })).toHaveClass('bg-[#54513E]');
        expect(screen.getByRole('button', { name: '🤩' })).not.toHaveClass('bg-[#54513E]');
      });
    });

    it('initialReaction이 없을 때 API 실패 시 선택이 null로 복구된다', async () => {
      mockToggle.mockRejectedValue(new Error('API 실패'));
      setup(null);

      await userEvent.click(screen.getByRole('button', { name: '😊' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '😊' })).not.toHaveClass('bg-[#54513E]');
      });
    });
  });

  describe('API 호출', () => {
    it('리액션 클릭 시 togglePostcardReaction이 올바른 인자로 호출된다', async () => {
      setup();

      await userEvent.click(screen.getByRole('button', { name: '🥹' }));

      await waitFor(() => {
        expect(mockToggle).toHaveBeenCalledWith(1, 'TOUCHED', 'mock-token');
      });
    });
  });
});