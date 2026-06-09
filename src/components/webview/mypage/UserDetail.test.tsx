import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UserDetail from './UserDetail';

// next/image 모킹
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

// ProfileEditModal 모킹 — 열림 여부만 확인하면 되므로 간단하게
vi.mock('@/components/webview/mypage/ProfileEditModal', () => ({
  default: ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (n: string, b: string) => void }) =>
    isOpen ? (
      <div>
        <p>프로필 수정 모달</p>
        <button onClick={() => onSave('새닉네임', '새바이오')}>저장</button>
        <button onClick={onClose}>닫기</button>
      </div>
    ) : null,
}));

const mockUserStats = { commentCount: 12, nestCount: 4, postcardCount: 7 };
const mockUserDetail = {
  nickname: '도도새',
  email: 'dodobird@example.com',
  profileImageUrl: 'https://example.com/profile.png',
  bio: '산책은 즐겁다.',
  onboraded: true,
};

const setup = (onSave = vi.fn(), onCancelEdit = vi.fn()) => {
  render(
    <UserDetail
      userStats={mockUserStats}
      userDetail={mockUserDetail}
      onSave={onSave}
      onCancelEdit={onCancelEdit}
    />
  );
  return { onSave, onCancelEdit };
};

describe('UserDetail', () => {

  describe('handleSaveSubmit', () => {
    it('onSave가 true를 반환하면 모달이 닫힌다', async () => {
      const onSave = vi.fn().mockResolvedValue(true);
      setup(onSave);

      // 모달 열기
      await userEvent.click(screen.getByRole('button', { name: '프로필 수정하기' }));
      expect(screen.getByText('프로필 수정 모달')).toBeInTheDocument();

      // 저장 클릭
      await userEvent.click(screen.getByRole('button', { name: '저장' }));

      await waitFor(() => {
        expect(screen.queryByText('프로필 수정 모달')).not.toBeInTheDocument();
      });
    });

    it('onSave가 false를 반환하면 모달이 열린 채로 유지된다', async () => {
      const onSave = vi.fn().mockResolvedValue(false);
      setup(onSave);

      await userEvent.click(screen.getByRole('button', { name: '프로필 수정하기' }));
      await userEvent.click(screen.getByRole('button', { name: '저장' }));

      await waitFor(() => {
        expect(screen.getByText('프로필 수정 모달')).toBeInTheDocument();
      });
    });
  });

  describe('handleCloseModal', () => {
    it('닫기 클릭 시 모달이 닫힌다', async () => {
      setup();

      await userEvent.click(screen.getByRole('button', { name: '프로필 수정하기' }));
      expect(screen.getByText('프로필 수정 모달')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '닫기' }));

      await waitFor(() => {
        expect(screen.queryByText('프로필 수정 모달')).not.toBeInTheDocument();
      });
    });

    it('닫기 클릭 시 onCancelEdit이 호출된다', async () => {
      const { onCancelEdit } = setup();

      await userEvent.click(screen.getByRole('button', { name: '프로필 수정하기' }));
      await userEvent.click(screen.getByRole('button', { name: '닫기' }));

      await waitFor(() => {
        expect(onCancelEdit).toHaveBeenCalledTimes(1);
      });
    });
  });

});