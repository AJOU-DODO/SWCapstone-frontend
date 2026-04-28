import type { CategoryApiResponse, NestPayload } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

export async function fetchCategories(
  accessToken: string,
): Promise<CategoryApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/categories`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("카테고리 목록을 불러오지 못했습니다.");
  return res.json();
}

export async function saveDraft(
  payload: NestPayload,
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/nests/drafts`, {
    method: "POST",
    headers: {
      //"Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok) throw new Error("임시 저장에 실패했습니다.");
}

export async function publishNest(
  payload: NestPayload,
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/nests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok) throw new Error("게시물 발행에 실패했습니다.");
}
