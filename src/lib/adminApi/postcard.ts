import api from '../axios';
import { ReportTargetType } from '@/types/indexAdmin';

// 신고된 엽서 목록 조회
export const getReportPostcard = async (params?: { statuses?: string; sort?: string, page: number }) => {
  const { data } = await api.get('/api/v1/admin/postcards/reported', { params });
  return data;
};

// 관리자 권한으로 엽서 삭제
export const deleteReportPostcard = async (postcardId: number, reason?: string ) => {
  const { data } = await api.delete(`/api/v1/admin/postcards/${postcardId}`, { data: {reason} });
  return data;
};