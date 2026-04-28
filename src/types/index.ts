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
  latitude: number | null;
  longitude: number | null;
  content: string | null;
  unlockRadius: 10 | 150;
  categoryIds: number[] | null;
  imageUrls: string[] | null;
}

export interface BridgeInitialData {
  latitude: number;
  longitude: number;
  accessToken: string;
}
