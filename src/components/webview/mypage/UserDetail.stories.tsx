import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import type { UserStatistics, UserDetail as UserDetailType } from "@/types/indexMypage";
import UserDetail from './UserDetail';

const meta: Meta<typeof UserDetail> = {
  title: 'Webview/UserDetail',
  component: UserDetail,
  parameters: {
    layout: 'fullscreen',

    viewport: {
      viewports: {
        galaxyS22: {
          name: 'Galaxy S22 (Android)',
          styles: { width: '360px', height: '760px' },
          type: 'mobile',
        },
      },
      defaultViewport: 'galaxyS22',
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserDetail>;

// 1. 기본 마이페이지 상태 데이터
const mockUserStats = { commentCount: 12, nestCount: 4, postcardCount: 7 };
const mockUserDetail: UserDetailType = {
  nickname: '도도새',
  email: 'dodobird@example.com',
  profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio: '산책은 즐겁다.',
  onboraded: true
};

export const Default: Story = {
  args: {
    userStats: mockUserStats,
    userDetail: mockUserDetail,
    onSave: (nickname, bio) => {
      console.log('저장 성공 흉내내기:', { nickname, bio });
      return Promise.resolve(true); 
    },
  },
};

// 모달 오픈 테스트
export const OpenEditModal: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editButton = canvas.getByRole('button', { name: /프로필 수정하기/i });

    // 버튼 클릭 후 모달 열기
    await userEvent.click(editButton);

    // 모달 타이틀로 모달이 정상적으로 떴는지 테스트
    const modalTitle = await canvas.findByText('프로필 수정');
    await expect(modalTitle).toBeInTheDocument();

    // 닉네임이 잘 들어가는지 테스트
    const nicknameInput = canvas.getByLabelText('닉네임');
    await expect(nicknameInput).toHaveValue('도도새');
  },
};