import api from "../axios";

// 차트 시각화용 트래픽 트렌드 조회
export const getStatsTrends = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const { data } = await api.get("/api/v1/admin/statistics/trends", { params });
  return data;
};

// 어드민 현황판 요약 통계 조회
export const getStatsSummary = async () => {
  const { data } = await api.get("/api/v1/admin/statistics/summary");
  return data;
};

// 엽서 교환 프로세스 비율 분석 조회
export const getPostcardRatio = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const { data } = await api.get("/api/v1/admin/statistics/postcards/ratio", {
    params,
  });
  return data;
};
