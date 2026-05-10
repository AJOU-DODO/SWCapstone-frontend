//마이페이지를 위한 api
//추후 api.ts에 합쳐질 예정

import type {
  UserStatisticsApiResponse,
  UserDetailApiResponse,
  MyNestApiResponse,
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