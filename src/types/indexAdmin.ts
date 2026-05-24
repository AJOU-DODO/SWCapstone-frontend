// 공지사항
export interface Notice {
  id: number;
  category: "UPDATE" | "EVENT" | "POLICY";
  categoryDescription: string;
  title: string;
  content: string;
  published: boolean;
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

// 공지사항 세부정보
export interface NoticeDetail {
  id: number;
  category: "UPDATE" | "EVENT" | "POLICY";
  categoryDescription: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  published: boolean;
}

export interface NoticeDetailApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: NoticeDetail;
}

// 유저 
export interface User {
  id: number;
  nickname: string;
  email: string;
  role: "USER" | "ADMIN" | "ADVERTISER";
  createdAt: string;
  nestCount: number;
  commentCount: number;
  sanctionedUntil: string | null;
  isSanctioned: boolean;
}

export interface UserData {
  content: User[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface UserApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: UserData;
}

// 유저 제재 데이터
export interface UserSanctionedPayload {
  sanctionType: "SEVEN_DAYS" | "THIRTY_DAYS" | "PERMANENT";
  reason: string;
}

// 화이트리스트 데이터
export interface Whitelists {
  id: number;
  email: string;
  remark: string;
  createdAt: string;
}

// 화이트리스트 추가 데이터
export interface AddWhitelistPayload {
  email: string;
  remark: string;
}