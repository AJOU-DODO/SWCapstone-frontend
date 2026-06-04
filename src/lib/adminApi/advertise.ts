import api from '../axios';
import { AdvertiserAuthorityPayload, AdvertisementPayload, GetAdvertisementStatus } from '@/types/indexAdmin';

// 광고주 권한 부여 및 수정
export const addAdvertiserAuthority = async ({ userId, body }: { userId: number; body: AdvertiserAuthorityPayload } ) => {
  const { data } = await api.post(`/api/v1/admin/ads/advertisers/${userId}`, body);
  return data;
};

// 광고주 목록 조회
export const getAdvertisers = async (params?: { page: number }) => {
  const { data } = await api.get('/api/v1/admin/ads/advertisers', { params });
  return data;
};

// 광고 신청 목록 조회
export const getAdvertisementList = async () => {
  const { data } = await api.get('/api/v1/admin/ads/proposals');
  return data;
};

// 광고 신청 승인
export const approveAdvertisement = async ({ proposalId, body }: { proposalId: number; body: AdvertisementPayload } ) => {
  const { data } = await api.post(`/api/v1/admin/ads/proposals/${proposalId}/approve`, body);
  return data;
};

// 광고 신청 반려
export const rejectAdvertisement = async ({ proposalId, rejectReason }: { proposalId: number; rejectReason: string } ) => {
  const { data } = await api.post(`/api/v1/admin/ads/proposals/${proposalId}/reject`, { rejectReason });
  return data;
};

// 게시중인 광고 목록 조회
export const getAdvertisements = async (params?: { status: GetAdvertisementStatus; page: number }) => {
  const { data } = await api.get('/api/v1/admin/ads/nests', { params });
  return data;
};

// 광고 강제 삭제
export const deleteAdvertisements = async (nestId: number) => {
  const { data } = await api.delete(`/api/v1/admin/ads/nests/${nestId}`);
  return data;
};