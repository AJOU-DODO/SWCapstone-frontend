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
  ad: boolean;
  unlocked: boolean;
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

export type ReactionType = "LIKE" | "DISLIKE";
