import type { Meta, StoryObj } from '@storybook/react-vite';
import UserTable from '@/components/admin/UserTable'; // 👈 실제 UserTable 경로로 맞춰주세요!

const meta: Meta<typeof UserTable> = {
  title: 'Admin/UserTable', // 스토리북 왼쪽 메뉴에 표시될 이름
  component: UserTable,
  // 어드민 페이지처럼 여백이 필요한 경우 패딩을 줍니다.
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof UserTable>;

// 1. 데이터가 정상적으로 들어왔을 때의 화면
export const Default: Story = {
  args: {
    users: [
      { id: "1", nickname: "어드민", email: "admin@gmail.com", role: "ADMIN", status: "ACTIVE", createdAt: "2026-02-01", numNest: 27, numReply: 5 },
      { id: "2", nickname: "김도도", email: "kim@gmail.com", role: "USER", status: "ACTIVE", createdAt: "2026-02-01", numNest: 27, numReply: 5 },
      { id: "3", nickname: "양아치", email: "badguy@gmail.com", role: "ADMIN", status: "BANNED", createdAt: "2026-02-01", numNest: 27, numReply: 5 },
    ],
  },
};

// 2. 💡 우리가 원했던 예외 처리! 데이터가 0명일 때의 방어 화면
export const Empty: Story = {
  args: {
    users: [],
  },
};