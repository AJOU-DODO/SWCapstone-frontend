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
