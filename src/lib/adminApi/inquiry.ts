import api from '../axios';
import { InquiryDetailResponse } from '@/types/indexAdmin';

// 문의사항 목록 조회
export const getInquiries = async (params?: { status?: string, page: number }) => {
  const { data } = await api.get('/api/v1/admin/inquiries', { params });
  return data;
};

// 문의사항 상세조회
/*export const getInquiryDetail = async (inquiryId: number) => {
  const { data } = await api.get(`/api/v1/admin/inquiries/${inquiryId}`);
  return data;
};*/

// 문의사항 답변 등록
export const publishAnswer = async (inquiryId: number, answer: string) => {
  const { data } = await api.post(`/api/v1/admin/inquiries/${inquiryId}/answer`, { answer: answer });
  return data;
};

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_IP ?? "";

// 문의사항 상세 조회
export async function getInquiryDetail(
  accessToken: string,
  inquiryId: number
): Promise<InquiryDetailResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/inquiries/${inquiryId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("문의사항 세부정보를 불러오지 못했습니다.");
  return res.json();
}