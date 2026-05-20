import type {
  CategoryApiResponse,
  DraftListApiResponse,
  NestDetailApiResponse,
  ExchangeApiResponse,
  ExchangeCheckApiResponse,
  NestPayload,
  ReactionType,
  PresignedUrlItemApiResponse,
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
): Promise<{ id: number }> {
  const res = await fetch(`${BASE_URL}/api/v1/nests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("게시물 발행에 실패했습니다.");
  const data = await res.json();
  return data.data;
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
  const res = await fetch(
    `${BASE_URL}/api/v1/nests/${id}/reaction?type=${type}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!res.ok) throw new Error("반응 처리에 실패했습니다.");
}

// 이미지 업로드시 업로드용 url과, 이미지를 확인하는 url을 받아오는 함수
export async function fetchPresignedUrls(
  fileNames: string[],
  accessToken: string,
): Promise<PresignedUrlItemApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/files/presigned-url/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(fileNames),
  });
  if (!res.ok) throw new Error("Presigned URL 발급에 실패했습니다.");
  return res.json();
}

// 이미지를 s3에 업로드하는 함수
export async function uploadImageToS3(
  presignedUrl: string,
  base64: string,
): Promise<void> {
  // base64 → binary 변환
  const byteString = atob(base64.split(",")[1]);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([byteArray], { type: "image/png" });

  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: blob,
  });
  if (!res.ok) throw new Error("S3 이미지 업로드에 실패했습니다.");
}

// 유저의 관심 카테고리를 가져오는 함수
export async function fetchUserInterests(
  accessToken: string,
): Promise<CategoryApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/users/interests`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("관심 카테고리를 불러오지 못했습니다.");
  return res.json();
}

// 유저가 선택한 관심 카테고리를 일괄적으로 업데이트하는 함수.
export async function updateUserInterests(
  categoryIds: number[],
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/users/interests`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ categoryIds }),
  });
  if (!res.ok) throw new Error("관심 카테고리 설정에 실패했습니다.");
}

// 엽서 교환 가능 횟수를 불러오는 함수
export async function fetchExchangeCheck(
  accessToken: string,
): Promise<ExchangeCheckApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/postcards/exchange-check`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("교환 가능 여부를 불러오지 못했습니다.");
  return res.json();
}

// 엽서를 교환하는 함수
export async function exchangePostcard(
  nestId: string,
  myPostcardId: number,
  accessToken: string,
): Promise<ExchangeApiResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/nests/${nestId}/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ myPostcardId }),
  });
  if (!res.ok) throw new Error("엽서 교환에 실패했습니다.");
  return res.json();
}

// 임시저장 글을 수정하는 함수
export async function updateDraft(
  id: number,
  payload: NestPayload,
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/nests/drafts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("임시저장 수정에 실패했습니다.");
}

// 임시저장 글을 발행하는 함수(임시저장 글은 해당 함수를 활용해야 정식 발행 성공시, 임시저장 내용 삭제됨)
export async function publishDraft(
  id: number,
  postcardId: number | null,
  accessToken: string,
): Promise<{ id: number }> {
  const res = await fetch(`${BASE_URL}/api/v1/nests/drafts/${id}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(postcardId ? { postcardId } : {}),
  });
  if (!res.ok) throw new Error("임시저장 발행에 실패했습니다.");
  const data = await res.json();
  return data.data.id; // 발행된 둥지 id 반환
}
