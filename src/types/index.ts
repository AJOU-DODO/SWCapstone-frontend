export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface CategoryApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: Category[];
}

export interface NestPayload {
  title: string | null;
  content: string | null;
  latitude: number | null;
  longitude: number | null;
  unlockRadius: 10 | 150;
  categoryIds: number[] | null;
  imageUrls: string[] | null;
  postcardId: number | null;
}

export interface BridgeInitialData {
  latitude: number;
  longitude: number;
  accessToken: string;
}

export interface DraftItem {
  id: number;
  latitude: number;
  longitude: number;
  title: string | null;
  content: string | null;
  unlockRadius: 10 | 150;
  categoryIds: number[] | null;
  imageUrls: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface DraftListApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: DraftItem[];
}

export interface NestDetail {
  id: number;
  title: string;
  content: string;
  unlockRadius: number;
  viewCount: number;
  createdAt: string;
  creatorNickname: string;
  creatorProfileImageUrl: string;
  categoryNames: string[];
  imageUrls: string[];
  likeCount: number;
  dislikeCount: number;
  myReaction: ReactionType | null;
  hasPostcard: boolean;
  postcardId: number | null;
  ad: boolean;
  unlocked: boolean;
  mine: boolean;
}

export interface NestDetailApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: NestDetail;
}

export interface PresignedUrlItem {
  presignedUrl: string;
  fileUrl: string;
}

export interface PresignedUrlItemApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: PresignedUrlItem[];
}

export type ReactionType = "LIKE" | "DISLIKE";

export interface ExchangeCheck {
  canExchange: boolean;
  remainingCount: number;
  reason: string | null;
}

export interface ExchangeCheckApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: ExchangeCheck;
}

export interface ExchangedPostcard {
  id: number;
  originalAuthorId: number;
  originalAuthorNickname: string;
  imageUrl: string;
  content: string;
  createdAt: string;
  reactionType: string | null;
  shared: boolean;
  exchanged: boolean;
  mine: boolean;
}

export interface ExchangeApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: ExchangedPostcard;
}

export interface NestComment {
  id: number;
  content: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  likeCount: number;
  children: NestComment[];
  liked: boolean;
}

export type CommentSortType = "LIKE" | "LATEST" | "DEFAULT";

export type ReportType = "NEST" | "COMMENT" | "POSTCARD";
export type ReportReason = "ABUSE" | "SPAM" | "ADVERTISEMENT" | "OTHER";

export interface ReportPayload {
  reportType: ReportType;
  targetId: number;
  reason: ReportReason;
  content?: string;
}
