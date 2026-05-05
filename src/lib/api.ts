import type {
  CategoryApiResponse,
  DraftListApiResponse,
  NestDetailApiResponse,
  NestPayload,
  ReactionType,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

// 현재 사용 가능한 카테고리를 불러오는 함수
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

// 임시저장 게시물을 불러오는 함수
export async function fetchDrafts(
  accessToken: string,
): Promise<DraftListApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/nests/drafts`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("임시저장 목록을 불러오지 못했습니다.");
  return res.json();
}

// 게시물을 임시저장하는 함수
export async function saveDraft(
  payload: NestPayload,
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/nests/drafts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("임시 저장에 실패했습니다.");
}

// 게시물을 정식 발행하는 함수
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
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("게시물 발행에 실패했습니다.");
}

// 특정 id의 둥지의 상세정보를 가져오는 함수
export async function fetchNestDetail(
  id: string,
  accessToken: string,
): Promise<NestDetailApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/nests/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("둥지 정보를 불러오지 못했습니다.");
  return res.json();
}

// 특정 게시물에 좋아요, 싫어요 반응을 남기는 함수
export async function postReaction(
  id: string,
  type: ReactionType,
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/nests/${id}/reaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ type: type }),
  });
  if (!res.ok) throw new Error("반응 처리에 실패했습니다.");
}
