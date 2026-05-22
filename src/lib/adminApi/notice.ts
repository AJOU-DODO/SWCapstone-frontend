import api from '../axios'; 
import { Notice, NoticePayload } from '@/types/indexAdmin';

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