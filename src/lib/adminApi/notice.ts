import api from '../axios'; 
import { NoticeDetailApiResponse, NoticePayload } from '@/types/indexAdmin';

export type NoticeCategory = 'UPDATE' | 'EVENT' | 'POLICY';

// 공지사항 초안 등록
export const createNotice = async (body: NoticePayload ) => {
  const { data } = await api.post('/api/v1/admin/notices', body);
  return data;
};

// 공지사항 수정
export const updateNotice = async (
  noticeId: number,
  body: NoticeCategory
) => {
  const { data } = await api.put(`/api/v1/admin/notices/${noticeId}`, body);
  return data;
};

// 공지사항 삭제
export const deleteNotice = async (noticeId: number) => {
  const { data } = await api.delete(`/api/v1/admin/notices/${noticeId}`);
  return data;
};

// 공지사항 발행
export const publishNotice = async (noticeId: number) => {
  const { data } = await api.post(`/api/v1/admin/notices/${noticeId}/publish`);
  return data;
};

// 공지사항 전체 목록 조회
export const getNotices = async () => {
  const { data } = await api.get('/api/v1/admin/notices');
  return data;
};

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_IP ?? "";

// 공지사항 세부 정보를 불러오는 함수
export async function getNoticeDetail(
  accessToken: string,
  noticeId: number
): Promise<NoticeDetailApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/notices/${noticeId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("공지사항을 불러오지 못했습니다.");
  return res.json();
}