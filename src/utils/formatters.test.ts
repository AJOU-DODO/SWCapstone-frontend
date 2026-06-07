import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatCoord,
  formatDateToISO,
  getDefaultDateRange,
} from "./formatters";

describe("formatDate", () => {
  it("ISO 문자열을 YYYY.MM.DD 형식으로 변환해야 한다", () => {
    expect(formatDate("2026-04-24T16:36:50.906456")).toBe("2026.04.24");
  });

  it("월과 일이 한 자리일 때 0을 붙여야 한다", () => {
    expect(formatDate("2026-01-05T00:00:00")).toBe("2026.01.05");
  });

  it("12월 31일을 올바르게 변환해야 한다", () => {
    expect(formatDate("2026-12-31T23:59:59")).toBe("2026.12.31");
  });
});

describe("formatCoord", () => {
  it("위도/경도를 소수점 4자리로 포맷해야 한다", () => {
    expect(formatCoord(37.2844251, 127.0442344)).toBe("37.2844, 127.0442");
  });

  it("소수점이 없는 정수 좌표도 올바르게 처리해야 한다", () => {
    expect(formatCoord(37, 127)).toBe("37.0000, 127.0000");
  });

  it("음수 좌표도 올바르게 처리해야 한다", () => {
    expect(formatCoord(-33.8688, 151.2093)).toBe("-33.8688, 151.2093");
  });
});

describe("formatDateToISO", () => {
  it("Date 객체를 YYYY-MM-DD 형식으로 변환해야 한다", () => {
    const date = new Date(2026, 3, 24);
    expect(formatDateToISO(date)).toBe("2026-04-24");
  });

  it("월과 일이 한 자리일 때 0을 붙여야 한다", () => {
    const date = new Date(2026, 0, 5);
    expect(formatDateToISO(date)).toBe("2026-01-05");
  });
});

describe("getDefaultDateRange", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("오늘 날짜가 endDate로 반환되어야 한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-07T00:00:00.000Z"));

    const { end } = getDefaultDateRange();
    expect(end).toBe("2026-06-07");
  });

  it("6일 전 날짜가 startDate로 반환되어야 한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-07T00:00:00.000Z"));

    const { start } = getDefaultDateRange();
    expect(start).toBe("2026-06-01");
  });

  it("startDate가 endDate보다 6일 이전이어야 한다", () => {
    const { start, end } = getDefaultDateRange();
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBe(6);
  });
});
