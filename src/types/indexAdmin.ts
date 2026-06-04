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

export type ReportReasonType = "pendingAbuseCount" | "pendingAdvertisementCount" | "pendingOtherCount" | "pendingSpamCount";

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
  authorId: number;
  profileImageUrl: string;
  nestId: number;
  title: string;
  content: string;
  authorNickname: string;
  latitude: number;
  longitude: number;
  imageUrls: string[];
  categoryIds: number[];
  categoryNames: string[];
  firstReportedAt: string;
  lastReportedAt: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  deleted: boolean;
}

// 둥지 상세보기 헤더
export interface NestDetailHeader {
  authorId: number;
  profileImageUrl: string;
  nestId: number;
  authorNickname: string;
  createdAt: string;
  firstReportedAt: string;
  lastReportedAt: string;
  deleted: boolean;
}

// 둥지 상세보기 바디
export interface NestDetailBody {
  imageUrls: string[];
  categoryNames: string[];
  title: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
}

// 둥지 댓글
export interface NestComment {
  authorId: number;
  profileImageUrl: string;
  commentId: number;
  parentId: number;
  authorNickname: string;
  content: string;
  createdAt: string;
  pendingReportCount: number;
  likeCount: number;
  children: NestComment[];
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

// 신고 상세
export interface ReportDetail {
  targetType: ReportTargetType;
  targetId: number;
  stats: {
    [key in ReportReasonType]?: number;
  }
  otherReportContents: string[];
}

export interface ReportDetailRequest {
  targetType:ReportTargetType;
  targetId: number;
}

export type ReasonType = "ABUSE" | "ADVERTISEMENT" | "OTHER" | "SPAM";

// 신고된 엽서
export interface PostcardList {
  authorId: number;
  postcardId: number;
  authorNickname: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  firstReportedAt: string;
  lastReportedAt: string;
  reportCount: number;
  reasons: ReasonType[];
  deleted: boolean;
}

export interface PostcardListData {
  content: PostcardList[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}


export type InquiryType = "ACCOUNT" | "BUG" | "SUGGESTION" | "BUSINESS";
export type InquiryStatus = "PENDING" | "COMPLETED";

// 문의사항 리스트 
export interface Inquiry {
  id: number;
  userId: number;
  userNickname: string;
  type: InquiryType;
  typeDescription: string;
  title: string;
  status: InquiryStatus;
  statusDescription: string;
  createdAt: string;
  answeredAt: string;
}

export interface InquiryData {
  content: Inquiry[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

// 문의사항 상세보기
export interface InquiryDetail {
  id: number;
  userId: number;
  userNickname: string;
  type: InquiryType;
  typeDescription: string;
  title: string;
  content: string;
  answer: string;
  status: InquiryStatus;
  statusDescription: string;
  createdAt: string;
  answeredAt: string;
}

export interface InquiryDetailResponse {
  status: string;
  code: string;
  message: string | null;
  data: InquiryDetail;
}

// 광고주 권한 부여시 필요한 정보 (광고 개수, 기간)
export interface AdvertiserAuthorityPayload {
  allowedAdCount: number;
  expiredAt: string; //datetime
}

// 광고주 정보
export interface AdvertiserList{
  userId: number;
  email: string;
  nickname: string;
  allowedAdCount: number;
  expiredAt: string;
  createdAt: string;
}

export type AdvertiseStatus = "PENDING" | "APPROVED" | "REJECTED";

export type GetAdvertisementStatus = "ALL" | "ACTIVE" | "DELETED";

// 승인 대기중인 광고
export interface PendingAdvertisement {
  id: number;
  advertiserId: number;
  advertiserNickname: string;
  title: string;
  content: string;
  latitude: number;
  longitude: number;
  unlockRadius: number;
  imageUrls: string[];
  categoryIds: number[];
  categoryNames: string[];
  status: AdvertiseStatus;
  rejectReason: string | null;
  createdAt: string;
}

// 광고 승인시 필요한 정보
export interface AdvertisementPayload {
  expiredAt: string; //datetime
  priorityScore: number;
}

// 게시중인 광고
export interface Advertisement {
  id: number;
  title: string;
  advertiserNickname: string;
  expiredAt: string;
  priorityScore: number;
  impressions: number; //누적 노출수
  clicks: number; //누적 클릭수
  createdAt: string;
  deletedAt: string;
}