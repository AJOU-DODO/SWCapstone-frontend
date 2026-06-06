import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBridge } from "./useBridge";
import { useNestEditorStore } from "../store/nestEditorStore";

const mockAndroidBridge = {
  getAccessToken: vi.fn().mockReturnValue("mock-token"),
  getLocation: vi
    .fn()
    .mockReturnValue(
      JSON.stringify({ latitude: 37.2844251, longitude: 127.0442344 }),
    ),
  getNestIds: vi.fn().mockReturnValue("[]"),
  requestImageUpload: vi.fn(),
  sendNestIdSelected: vi.fn(),
  getNestDetailId: vi.fn().mockReturnValue("1"),
  requestPostcardMake: vi.fn(),
  onCategorySelected: vi.fn(),
};

beforeEach(() => {
  window.AndroidBridge = mockAndroidBridge;
  useNestEditorStore.setState({
    accessToken: null,
    isBridgeReady: false,
    loadedDraftId: null,
    loadedNestId: null,
    latitude: null,
    longitude: null,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  window.onInitialData = undefined;
  window.onImageUploaded = undefined;
  window.onImageReceived = undefined;
});

describe("useBridge", () => {
  // ────────────────────────────────────────────────
  // 1. AndroidBridge 있을 때
  // ────────────────────────────────────────────────
  it("AndroidBridge가 있을 때 accessToken과 위치 정보를 store에 설정해야 한다", () => {
    renderHook(() => useBridge());

    const state = useNestEditorStore.getState();
    expect(state.accessToken).toBe("mock-token");
    expect(state.latitude).toBe(37.2844251);
    expect(state.longitude).toBe(127.0442344);
    expect(state.isBridgeReady).toBe(true);
  });

  // ────────────────────────────────────────────────
  // 2. loadedDraftId / loadedNestId 있을 때 getLocation 미호출
  // ────────────────────────────────────────────────
  it("loadedDraftId가 있을 때 getLocation을 호출하지 않아야 한다", () => {
    useNestEditorStore.setState({ loadedDraftId: 1 });
    const getLocationMock = vi
      .fn()
      .mockReturnValue(
        JSON.stringify({ latitude: 37.2844251, longitude: 127.0442344 }),
      );
    window.AndroidBridge = {
      ...mockAndroidBridge,
      getLocation: getLocationMock,
    };

    renderHook(() => useBridge());

    expect(getLocationMock).not.toHaveBeenCalled();
  });

  it("loadedNestId가 있을 때 getLocation을 호출하지 않아야 한다", () => {
    useNestEditorStore.setState({ loadedNestId: "123" });
    const getLocationMock = vi
      .fn()
      .mockReturnValue(
        JSON.stringify({ latitude: 37.2844251, longitude: 127.0442344 }),
      );
    window.AndroidBridge = {
      ...mockAndroidBridge,
      getLocation: getLocationMock,
    };

    renderHook(() => useBridge());

    expect(getLocationMock).not.toHaveBeenCalled();
  });

  it("loadedDraftId가 있을 때 accessToken만 store에 설정되어야 한다", () => {
    useNestEditorStore.setState({ loadedDraftId: 1 });

    renderHook(() => useBridge());

    const state = useNestEditorStore.getState();
    expect(state.accessToken).toBe("mock-token");
    expect(state.isBridgeReady).toBe(true);
    expect(state.latitude).toBeNull();
    expect(state.longitude).toBeNull();
  });

  // ────────────────────────────────────────────────
  // 3. 콜백 등록
  // ────────────────────────────────────────────────
  it("onImageReceived 콜백이 등록되어야 한다", () => {
    renderHook(() => useBridge());
    expect(window.onImageReceived).toBeDefined();
  });

  it("onImageUploaded 콜백이 등록되어야 한다", () => {
    renderHook(() => useBridge());
    expect(window.onImageUploaded).toBeDefined();
  });

  it("onInitialData 콜백이 등록되어야 한다", () => {
    renderHook(() => useBridge());
    expect(window.onInitialData).toBeDefined();
  });

  it("onImageReceived 콜백 호출 시 store에 이미지가 추가되어야 한다", () => {
    renderHook(() => useBridge());

    act(() => {
      window.onImageReceived?.("data:image/png;base64,abc");
    });

    expect(useNestEditorStore.getState().imageUrls).toContain(
      "data:image/png;base64,abc",
    );
  });

  it("onInitialData 콜백 호출 시 store에 브릿지 데이터가 설정되어야 한다", () => {
    renderHook(() => useBridge());

    act(() => {
      window.onInitialData?.(
        JSON.stringify({
          accessToken: "callback-token",
          latitude: 37.1234,
          longitude: 127.5678,
        }),
      );
    });

    const state = useNestEditorStore.getState();
    expect(state.accessToken).toBe("callback-token");
    expect(state.latitude).toBe(37.1234);
    expect(state.longitude).toBe(127.5678);
  });

  it("onInitialData에 잘못된 JSON이 전달될 때 에러 없이 처리되어야 한다", () => {
    renderHook(() => useBridge());

    expect(() => {
      act(() => {
        window.onInitialData?.("invalid-json");
      });
    }).not.toThrow();
  });

  // ────────────────────────────────────────────────
  // 4. 언마운트 시 콜백 정리
  // ────────────────────────────────────────────────
  it("언마운트 시 콜백이 정리되어야 한다", () => {
    const { unmount } = renderHook(() => useBridge());
    unmount();
    expect(window.onInitialData).toBeUndefined();
    expect(window.onImageUploaded).toBeUndefined();
    expect(window.onImageReceived).toBeUndefined();
  });
});
