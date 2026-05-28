import api from '../axios';
import { ReportTargetType } from '@/types/indexAdmin';

// 전체 둥지 관리 목록 조회
export const getNestsAdmin = async (params?: { includeDeleted?: string; sort?: string, page: number }) => {
  const { data } = await api.get('/api/v1/admin/nests', { params });
  return data;
};

// 신고된 둥지 목록
export const getReportedNests = async (params?: { sort?: string, page: number }) => {
  const { data } = await api.get('/api/v1/admin/reports/nests', { params });
  return data;
};

// 신고된 댓글 목록
export const getReportedComments = async (params?: { sort?: string, page: number }) => {
  const { data } = await api.get('/api/v1/admin/reports/comments', { params });
  return data;
};

// 둥지 정보 상세보기
export const getNestDetailAdmin = async (nestId: number) => {
  const { data } = await api.get(`/api/v1/admin/nests/${nestId}`);
  return data;
};

// 둥지 댓글 목록 조회
export const getCommentsAdmin = async (nestId: number) => {
  const { data } = await api.get(`/api/v1/admin/nests/${nestId}/comments`);
  return data;
};

// 관리자 권한으로 둥지 삭제
export const deleteNestAdmin = async (nestId: number) => {
  const { data } = await api.delete(`/api/v1/admin/nests/${nestId}`);
  return data;
};

// 관리자 권한으로 댓글 삭제
export const deleteCommentAdmin = async (commentId: number) => {
  const { data } = await api.delete(`/api/v1/admin/comments/${commentId}`);
  return data;
};

// 신고 상세 및 통계 조회
export const getReportDetail = async ( params: { targetType: ReportTargetType; targetId: number }) => {
  const { data } = await api.get(`/api/v1/admin/reports/details`, { params }  );
  return data;
};