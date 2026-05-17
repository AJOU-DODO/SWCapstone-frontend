//마이페이지를 위한 api
//추후 api.ts에 합쳐질 예정

import type {
  UserStatisticsApiResponse,
  UserDetailApiResponse,
  MyNestApiResponse,
  MyPostcardApiResponse,
  ProfileEditPayload,
  MyCommentsApiResponse,
  ImageUrlApiResponse,
} from "@/types/indexMypage";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

// 유저 활동 정보를 불러오는 함수
export async function fetchUserStatistics(
  accessToken: string,
): Promise<UserStatisticsApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/mypage/statistics`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("유저 활동 정보를 불러오지 못했습니다.");
  return res.json();
}

// 유저 정보를 불러오는 함수
export async function fetchUserDetail(
  accessToken: string,
): Promise<UserDetailApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("유저 정보를 불러오지 못했습니다.");
  return res.json();
}

// 유저가 작성한 둥지를 불러오는 함수
export async function fetchUserNests(
  accessToken: string,
): Promise<MyNestApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/mypage/nests`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("유저 둥지 정보를 불러오지 못했습니다.");
  return res.json();
}

// 유저가 좋아요 누른 둥지를 불러오는 함수
export async function fetchLikesNests(
  accessToken: string,
): Promise<MyNestApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/mypage/likes`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("좋아요 둥지 정보를 불러오지 못했습니다.");
  return res.json();
}

// 유저가 해금한 둥지를 불러오는 함수
export async function fetchUnlockNests(
  accessToken: string,
): Promise<MyNestApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/mypage/unlocks`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("해금한 둥지 정보를 불러오지 못했습니다.");
  return res.json();
}

// 유저의 엽서를 불러오는 함수
export async function fetchUserPostcards(
  accessToken: string,
  filter: string,
  page: number,
): Promise<MyPostcardApiResponse> {
  const res = await fetch(
    `${BASE_URL}/api/v1/mypage/postcards?filter=${filter}&page=${page}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("유저 엽서 정보를 불러오지 못했습니다.");
  return res.json();
}

//유저 프로필 정보를 업데이트 하는 함수
export async function patchUpdatdProfile(
  payload: ProfileEditPayload,
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("프로필 수정에 실패했습니다.");
}

// 유저가 작성한 댓글을 불러오는 함수
export async function fetchMyComments(
  accessToken: string,
): Promise<MyCommentsApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/mypage/comments`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("작성 댓글 정보를 불러오지 못했습니다.");
  return res.json();
}

//프로필 이미지를 S3에 업로드 (presignedUrl 받아오기)
export async function fetchPresignedUrl(
  fileName: string,
  accessToken: string,
): Promise<ImageUrlApiResponse> {
  const res = await fetch(
    `${BASE_URL}/api/v1/files/presigned-url/profile?fileName=${encodeURIComponent(fileName)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("이미지 업로드 실패");
  return res.json();
}
