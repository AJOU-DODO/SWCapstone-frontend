// 공지사항
export interface Notice {
  id: number;
  category: "UPDATE" | "EVENT" | "POLICY";
  categoryDescription: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NoticeData {
  content: Notice[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface NoticeApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: NoticeData;
}

// 공지사항 발행 데이터
export interface NoticePayload {
  category: "UPDATE" | "EVENT" | "POLICY";
  title: string;
  content: string;
}
