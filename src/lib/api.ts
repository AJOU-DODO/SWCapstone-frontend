import type {
  CategoryApiResponse,
  DraftListApiResponse,
  NestDetailApiResponse,
  NestPayload,
  ReactionType,
  PresignedUrlItem,
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
    body: JSON.stringify({ type }),
  });
  if (!res.ok) throw new Error("반응 처리에 실패했습니다.");
}

// 이미지 업로드시 업로드용 url과, 이미지를 확인하는 url을 받아오는 함수
export async function fetchPresignedUrls(
  fileNames: string[],
  accessToken: string,
): Promise<PresignedUrlItem[]> {
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
  const byteString = atob(base64.split(",")[1] ?? base64);
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
