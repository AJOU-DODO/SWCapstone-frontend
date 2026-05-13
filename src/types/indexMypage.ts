//마이페이지를 위한 index
//추후 index.ts에 합쳐질 예정

//유저 활동 정보
export interface UserStatistics {
  nestCount: number;
  commentCount: number;
  postcardCount: number;
}

export interface UserStatisticsApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: UserStatistics;
}

//유저 정보
export interface UserDetail {
  email: string;
  nickname: string;
  profileImageUrl: string;
  bio: string;
  onboraded: boolean;
}

export interface UserDetailApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: UserDetail;
}

//내가 쓴 글 
export interface MyNestDetail {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  unlocked: boolean;
}

export interface MyNestData {
  content: MyNestDetail[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface MyNestApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: MyNestData;
}

//보유 엽서
export interface MyPostcard {
  id: number;
  imageUrl: string;
  content: string;
  authorNickname: string;
  reactionType: string;
  createdAt: string;
  mine: boolean;
}

export interface MyPostcardData {
  content: MyPostcard[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface MyPostcardApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: MyPostcardData;
}

// 프로필 업데이트
export interface ProfileEditPayload {
  nickname: string,
  profileImageUrl: string,
  bio: string
}

// 내 댓글
export interface MyComment {
  id: number,
  nestId: number,
  nestTitle: string,
  content: string,
  authorNickname: string,
  createdAt: string
}

export interface MyCommentsData {
  content: MyComment[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface MyCommentsApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: MyCommentsData;
}

// S3에 이미지 업로드. presignedUrl, fileUrl
export interface imageUrl{
  presignedUrl: string;
  fileUrl: string;
}
export interface ImageUrlApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: imageUrl;
}