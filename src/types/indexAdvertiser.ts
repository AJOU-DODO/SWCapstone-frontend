// 광고주 계정 정보
export interface AdvertiserAccount {
  allowedAdCount: number;
  currentAdCount: number;
  pendingAdCount: number;
  remainingAdCount: number;
  expiredAt: string;
  isExpired: boolean;
}

// 신청한 광고 정보
export interface AdProposal {
  id: number;
  title: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason: string | null;
  createdAt: string;
  latitude: number;
  longitude: number;
  unlockRadius: number;
  content: string;
  imageUrls: string[];
  categoryNames: string[];
}

// 광고 게시물
export interface AdNest {
  id: number;
  title: string;
  viewCount: number;
  isAd: boolean;
}

// 광고 게시물의 통계
export interface AdStatistics {
  nestId: number;
  title: string;
  impressions: number;
  clicks: number;
  expiredAt: string;
}
