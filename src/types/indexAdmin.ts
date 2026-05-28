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
  remark: string | null;
}

// 카테고리 데이터
export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  createdAt: string;
  deletedAt: string;
  nestCount: number;
}

export interface CategoryApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: Category[];
}

export interface CategoryName {
  name: string;
}

export interface CategoryOrder {
  id: number;
  sortOrder: number;
}

export type ReportReasonType = "ABUSE" | "SPAM" | "ADVERTISEMENT" | "OTHER";

export type ReportTargetType = 'NEST' | 'COMMENT' | 'POSTCARD';

// 둥지 전체 조회 (리스트)
export interface NestList {
  nestId: number;
  authorNickname: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  reportCount: number;
  reasons: ReportReasonType[];
  deleted: boolean;
}

export interface NestListData {
  content: NestList[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface NestListApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: NestListData;
}

// 둥지 상세보기
export interface NestDetail {
  nestId: number;
  title: string;
  content: string;
  authorNickname: string;
  latitude: number;
  longitude: number;
  imageUrls: string[];
  categoryIds: number[];
  categoryNames: string[];
  createdAt: string;
  deleted: boolean;
}

// 둥지 댓글
export interface NestComment {
  commentId: number;
  parentId: number;
  authorNickname: string;
  content: string;
  createdAt: string;
  pendingReportCount: number;
  deleted: boolean;
}

// 신고된 댓글 리스트
export interface ReportedCommentList {
  commentId: number;
  authorNickname: string;
  commentContent: number;
  nestId: number;
  nestTitle: string;
  lastReportedAt: string;
  reportCount: number;
  commentCount: number;
  reasons: ReportReasonType[];
  status: "PENDING" | "PROCESSED";
}

export interface ReportedCommentListData {
  content: ReportedCommentList[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface ReportedCommentListApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: NestListData;
}

// 신고된 둥지 리스트
export interface ReportedNestList {
  nestId: number;
  authorNickname: string;
  content: number;
  nestTitle: string;
  firstReportedAt: string;
  lastReportedAt: string;
  reportCount: number;
  reasons: ReportReasonType[];
  status: "PENDING" | "PROCESSED";
}

export interface ReportedNestListData {
  content: ReportedNestList[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface ReportedNestListApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: NestListData;
}
