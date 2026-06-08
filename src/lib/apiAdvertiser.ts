import api from "./axios";

// 계정 상태 조회
export const getAdvertiserAccount = async () => {
  const { data } = await api.get("/api/v1/advertiser/ads/account");
  return data;
};

// 광고 신청 (신규)
export const createAdProposal = async (body: {
  latitude: number;
  longitude: number;
  title: string;
  content: string;
  unlockRadius: number;
  imageUrls: string[];
  categoryIds: number[];
}) => {
  const { data } = await api.post("/api/v1/advertiser/ads/proposals", body);
  return data;
};

// 광고 수정 (재심사 요청)
export const updateAdProposal = async (
  proposalId: number,
  body: {
    latitude: number;
    longitude: number;
    title: string;
    content: string;
    unlockRadius: number;
    imageUrls: string[];
    categoryIds: number[];
  },
) => {
  const { data } = await api.put(
    `/api/v1/advertiser/ads/proposals/${proposalId}`,
    body,
  );
  return data;
};

// 내 광고 신청 내역 조회
export const getMyProposals = async () => {
  const { data } = await api.get("/api/v1/advertiser/ads/proposals/me");
  return data;
};

// 내 게시 광고 목록 조회
export const getMyNests = async () => {
  const { data } = await api.get("/api/v1/advertiser/ads/nests/me");
  return data;
};

// 특정 광고 성과 통계 조회
export const getAdStatistics = async (nestId: number) => {
  const { data } = await api.get(
    `/api/v1/advertiser/ads/nests/${nestId}/statistics`,
  );
  return data;
};

// 카테고리 목록 조회
export const getCategories = async () => {
  const { data } = await api.get("/api/v1/categories");
  return data;
};
