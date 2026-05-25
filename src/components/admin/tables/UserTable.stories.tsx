import type { Meta, StoryObj } from '@storybook/react';
import UserTable from './UserTable';
import { User } from '@/types/indexAdmin';

const meta: Meta<typeof UserTable> = {
  title: 'Admin/UserTable',
  component: UserTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserTable>;

const mockUsers: User[] = [
  {
    id: 1,
    nickname: '김철수',
    email: 'chulsoo@example.com',
    role: 'ADMIN',
    isSanctioned: false,
    sanctionedUntil: null, // 💡 필수 필드 채워넣기!
    createdAt: '2026-01-15T08:30:00Z',
    nestCount: 15,
    commentCount: 42,
  },
  {
    id: 2,
    nickname: '이영희',
    email: 'younghee@example.com',
    role: 'USER',
    isSanctioned: true, 
    sanctionedUntil: '2026-06-25T14:15:00Z', // 💡 제재 기한 추가
    createdAt: '2026-03-22T14:15:00Z',
    nestCount: 0,
    commentCount: 5,
  },
  {
    id: 3,
    nickname: '박민수',
    email: 'minsoo@example.com',
    role: 'USER',
    isSanctioned: false,
    sanctionedUntil: null, // 💡 필수 필드 채워넣기!
    createdAt: '2026-05-10T11:00:00Z',
    nestCount: 124, 
    commentCount: 589,
  },
];

// 1. 기본 정상 데이터가 뿌려질 때의 스토리
export const Default: Story = {
  args: {
    users: mockUsers,
  },
};

// 2. 관리자 페이지 특성상 데이터가 단 한 개도 없을 때의 UI 예외 처리 테스트용 스토리
export const Empty: Story = {
  args: {
    users: [],
  },
};

// 3. 스크롤이나 대량의 데이터를 담았을 때 깨짐이 없는지 확인하는 스토리
export const LongList: Story = {
  args: {
    users: Array.from({ length: 20 }, (_, index): User => ({
      id: index + 1,
      nickname: `테스트유저_${index + 1}`,
      email: `test_${index + 1}@example.com`,
      role: index % 5 === 0 ? 'ADMIN' : 'USER', 
      isSanctioned: index % 4 === 0,
      sanctionedUntil: index % 4 === 0 ? '2026-12-31T23:59:59Z' : null, 
      createdAt: new Date(2026, 0, index + 1).toISOString(),
      nestCount: Math.floor(Math.random() * 50),
      commentCount: Math.floor(Math.random() * 200),
    })),
  },
};