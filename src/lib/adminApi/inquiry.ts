import api from '../axios';

// 문의사항 목록 조회
export const getInquiries = async (params?: { statuses?: string; sort?: string, page: number }) => {
  const { data } = await api.get('/api/v1/admin/inquiries', { params });
  return data;
};

// 문의사항 상세조회
export const getInquiryDetail = async (inquiryId: number) => {
  const { data } = await api.get(`/api/v1/admin/inquiries/${inquiryId}`);
  return data;
};

// 문의사항 답변 등록
export const publishAnswer = async (inquiryId: number) => {
  const { data } = await api.post(`/api/v1/admin/inquiries/${inquiryId}/answer`);
  return data;
};