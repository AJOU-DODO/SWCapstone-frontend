import { PostcardList, ReasonType } from "@/types/indexAdmin"; // 실제 파일 경로에 맞게 수정하세요!

export const MOCK_REPORTED_POSTCARDS: PostcardList[] = [
  {
    postcardId: 101,
    authorNickname: "한강방랑자",
    content: "오늘 저녁 한강 윤슬이 너무 예뻐서 한 컷 공유합니다. 다들 행복한 주말 보내세요!",
    imageUrl: "https://loremflickr.com/400/600/river,night", // 픽스엄 고유 ID 10번 사진
    createdAt: "2026-05-25T14:30:00Z",
    firstReportedAt: "2026-05-26T09:15:00Z",
    lastReportedAt: "2026-05-30T18:22:00Z",
    reportCount: 3,
    reasons: ["SPAM", "ADVERTISEMENT"] as ReasonType[], // 프로젝트에 정의된 실제 ReasonType에 맞게 세팅하세요
    deleted: false,
  },
  {
    postcardId: 102,
    authorNickname: "초코아빠",
    content: "우리 집 귀염둥이 초코 산책하다가 한 컷! 간식 달라고 쳐다보는 눈빛이 너무 심쿵이지 않나요?",
    imageUrl: "https://loremflickr.com/400/600/dog,puppy", // 멍청이 리트리버 사진 🐶
    createdAt: "2026-05-28T08:12:00Z",
    firstReportedAt: "2026-05-29T11:00:00Z",
    lastReportedAt: "2026-05-29T11:00:00Z",
    reportCount: 1,
    reasons: ["ADVERTISEMENT"] as ReasonType[],
    deleted: false,
  },
  {
    postcardId: 103,
    authorNickname: "머니로더_99",
    content: "[광고] 💰하루 30분 투자로 월 500만 원 보장! 선착순 10명만 마감합니다. 프로필 링크 확인!!💰",
    imageUrl: "https://loremflickr.com/400/600/money,gold",
    createdAt: "2026-05-30T21:00:00Z",
    firstReportedAt: "2026-05-30T21:05:00Z",
    lastReportedAt: "2026-05-31T15:40:00Z",
    reportCount: 14, // 신고 대폭발 🔥
    reasons: ["ADVERTISEMENT", "SPAM"] as ReasonType[],
    deleted: false,
  },
  {
    postcardId: 104,
    authorNickname: "새벽감성족",
    content: "이 또한 지나가리라... 아무도 내 마음을 몰라주는 서글픈 밤이네요. 소주 한 잔이 생각납니다.",
    imageUrl: "https://loremflickr.com/400/600/sad,mood", // 퍼그 강아지 담요 쓴 사진
    createdAt: "2026-05-24T23:45:00Z",
    firstReportedAt: "2026-05-25T02:10:00Z",
    lastReportedAt: "2026-05-27T10:15:00Z",
    reportCount: 2,
    reasons: ["OTHER"] as ReasonType[],
    deleted: true, // 🚫 이미 블라인드(삭제) 처리된 데이터 테스트용!
  },
  {
    postcardId: 105,
    authorNickname: "익명회원A",
    content: "니들이 뭔데 나를 판단해? 진짜 어이없네 ㅋㅋ 다 고소할 줄 알아라 손가락 조심해라",
    imageUrl: "https://loremflickr.com/400/600/angry,dark",
    createdAt: "2026-05-29T17:20:00Z",
    firstReportedAt: "2026-05-29T18:00:00Z",
    lastReportedAt: "2026-05-30T22:11:00Z",
    reportCount: 5,
    reasons: ["BAD_LANGUAGE", "ABUSE"] as ReasonType[],
    deleted: true, // 🚫 이미 블라인드(삭제) 처리된 데이터 테스트용 2!
  },
  {
    postcardId: 106,
    authorNickname: "익명회원A",
    content: "니들이 뭔데 나를 판단해? 진짜 어이없네 ㅋㅋ 다 고소할 줄 알아라 손가락 조심해라",
    imageUrl: "https://loremflickr.com/400/600/angry,dark",
    createdAt: "2026-05-29T17:20:00Z",
    firstReportedAt: "2026-05-29T18:00:00Z",
    lastReportedAt: "2026-05-30T22:11:00Z",
    reportCount: 5,
    reasons: ["ABUSE"] as ReasonType[],
    deleted: true, // 🚫 이미 블라인드(삭제) 처리된 데이터 테스트용 2!
  },
];