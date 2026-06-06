import { describe, it, expect, beforeEach } from "vitest";
import { useNestEditorStore } from "./nestEditorStore";

// 각 테스트 전 store 초기화
beforeEach(() => {
  useNestEditorStore.setState({
    title: "",
    latitude: null,
    longitude: null,
    accessToken: null,
    isBridgeReady: false,
    imageUrls: [],
    categoryIds: [],
    unlockRadius: 10,
    content: "",
    postcardId: null,
    postcardTitle: null,
    isSubmitting: false,
    errors: {},
    loadedDraftId: null,
    loadedNestId: null,
  });
});

// ────────────────────────────────────────────────
// 1. 초기 상태 확인
// ────────────────────────────────────────────────
describe("초기 상태", () => {
  it("초기값이 올바르게 설정되어 있어야 한다", () => {
    const state = useNestEditorStore.getState();
    expect(state.title).toBe("");
    expect(state.latitude).toBeNull();
    expect(state.longitude).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isBridgeReady).toBe(false);
    expect(state.imageUrls).toEqual([]);
    expect(state.categoryIds).toEqual([]);
    expect(state.unlockRadius).toBe(10);
    expect(state.content).toBe("");
    expect(state.postcardId).toBeNull();
    expect(state.postcardTitle).toBeNull();
    expect(state.isSubmitting).toBe(false);
    expect(state.errors).toEqual({});
    expect(state.loadedDraftId).toBeNull();
    expect(state.loadedNestId).toBeNull();
  });
});

// ────────────────────────────────────────────────
// 2. setBridgeData
// ────────────────────────────────────────────────
describe("setBridgeData", () => {
  it("브릿지 데이터를 올바르게 설정해야 한다", () => {
    const { setBridgeData } = useNestEditorStore.getState();
    setBridgeData({
      accessToken: "test-token",
      latitude: 37.2844251,
      longitude: 127.0442344,
    });
    const state = useNestEditorStore.getState();
    expect(state.accessToken).toBe("test-token");
    expect(state.latitude).toBe(37.2844251);
    expect(state.longitude).toBe(127.0442344);
    expect(state.isBridgeReady).toBe(true);
  });
});

// ────────────────────────────────────────────────
// 3. addImage / removeImage
// ────────────────────────────────────────────────
describe("addImage / removeImage", () => {
  it("이미지를 추가할 수 있어야 한다", () => {
    const { addImage } = useNestEditorStore.getState();
    addImage("data:image/png;base64,abc");
    addImage("data:image/png;base64,def");
    expect(useNestEditorStore.getState().imageUrls).toEqual([
      "data:image/png;base64,abc",
      "data:image/png;base64,def",
    ]);
  });

  it("인덱스로 이미지를 삭제할 수 있어야 한다", () => {
    useNestEditorStore.setState({
      imageUrls: ["url1", "url2", "url3"],
    });
    const { removeImage } = useNestEditorStore.getState();
    removeImage(1);
    expect(useNestEditorStore.getState().imageUrls).toEqual(["url1", "url3"]);
  });

  it("첫 번째 이미지를 삭제할 수 있어야 한다", () => {
    useNestEditorStore.setState({ imageUrls: ["url1", "url2"] });
    useNestEditorStore.getState().removeImage(0);
    expect(useNestEditorStore.getState().imageUrls).toEqual(["url2"]);
  });
});

// ────────────────────────────────────────────────
// 4. setCategoryIds / setUnlockRadius / setContent / setTitle
// ────────────────────────────────────────────────
describe("기본 액션", () => {
  it("setCategoryIds - 카테고리 ID를 설정할 수 있어야 한다", () => {
    useNestEditorStore.getState().setCategoryIds([1, 2, 3]);
    expect(useNestEditorStore.getState().categoryIds).toEqual([1, 2, 3]);
  });

  it("setUnlockRadius - 해금 반경을 설정할 수 있어야 한다", () => {
    useNestEditorStore.getState().setUnlockRadius(150);
    expect(useNestEditorStore.getState().unlockRadius).toBe(150);
  });

  it("setContent - 본문을 설정할 수 있어야 한다", () => {
    useNestEditorStore.getState().setContent("테스트 본문");
    expect(useNestEditorStore.getState().content).toBe("테스트 본문");
  });

  it("setTitle - 제목을 설정할 수 있어야 한다", () => {
    useNestEditorStore.getState().setTitle("테스트 제목");
    expect(useNestEditorStore.getState().title).toBe("테스트 제목");
  });
});

// ────────────────────────────────────────────────
// 5. setPostcard / clearPostcard
// ────────────────────────────────────────────────
describe("setPostcard / clearPostcard", () => {
  it("setPostcard - 엽서 정보를 설정할 수 있어야 한다", () => {
    useNestEditorStore.getState().setPostcard(1, "테스트 엽서");
    const state = useNestEditorStore.getState();
    expect(state.postcardId).toBe(1);
    expect(state.postcardTitle).toBe("테스트 엽서");
  });

  it("clearPostcard - 엽서 정보를 초기화할 수 있어야 한다", () => {
    useNestEditorStore.setState({
      postcardId: 1,
      postcardTitle: "테스트 엽서",
    });
    useNestEditorStore.getState().clearPostcard();
    const state = useNestEditorStore.getState();
    expect(state.postcardId).toBeNull();
    expect(state.postcardTitle).toBeNull();
  });
});

// ────────────────────────────────────────────────
// 6. loadedDraftId / loadedNestId
// ────────────────────────────────────────────────
describe("loadedDraftId / loadedNestId", () => {
  it("setLoadedDraftId - loadedDraftId를 설정할 수 있어야 한다", () => {
    useNestEditorStore.getState().setLoadedDraftId(5);
    expect(useNestEditorStore.getState().loadedDraftId).toBe(5);
  });

  it("setLoadedDraftId - loadedDraftId를 null로 초기화할 수 있어야 한다", () => {
    useNestEditorStore.setState({ loadedDraftId: 5 });
    useNestEditorStore.getState().setLoadedDraftId(null);
    expect(useNestEditorStore.getState().loadedDraftId).toBeNull();
  });

  it("setLoadedNestId - loadedNestId를 설정할 수 있어야 한다", () => {
    useNestEditorStore.getState().setLoadedNestId("123");
    expect(useNestEditorStore.getState().loadedNestId).toBe("123");
  });

  it("setLoadedNestId - loadedNestId를 null로 초기화할 수 있어야 한다", () => {
    useNestEditorStore.setState({ loadedNestId: "123" });
    useNestEditorStore.getState().setLoadedNestId(null);
    expect(useNestEditorStore.getState().loadedNestId).toBeNull();
  });
});

// ────────────────────────────────────────────────
// 7. getDraftPayload
// ────────────────────────────────────────────────
describe("getDraftPayload", () => {
  it("빈 상태에서 null 허용 필드는 null로 반환해야 한다", () => {
    const payload = useNestEditorStore.getState().getDraftPayload();
    expect(payload.content).toBeNull();
    expect(payload.categoryIds).toBeNull();
    expect(payload.imageUrls).toBeNull();
    expect(payload.postcardId).toBeNull();
  });

  it("일부만 채워진 상태에서 채워진 값만 반환해야 한다", () => {
    useNestEditorStore.setState({
      title: "테스트 제목",
      content: "테스트 본문",
      categoryIds: [1, 2],
    });
    const payload = useNestEditorStore.getState().getDraftPayload();
    expect(payload.title).toBe("테스트 제목");
    expect(payload.content).toBe("테스트 본문");
    expect(payload.categoryIds).toEqual([1, 2]);
    expect(payload.imageUrls).toBeNull();
  });

  it("모든 필드가 채워진 상태에서 올바른 payload를 반환해야 한다", () => {
    useNestEditorStore.setState({
      title: "테스트 제목",
      content: "테스트 본문",
      latitude: 37.2844251,
      longitude: 127.0442344,
      categoryIds: [1, 2],
      imageUrls: ["https://s3.amazonaws.com/image1.png"],
      unlockRadius: 150,
      postcardId: 1,
    });
    const payload = useNestEditorStore.getState().getDraftPayload();
    expect(payload.title).toBe("테스트 제목");
    expect(payload.content).toBe("테스트 본문");
    expect(payload.latitude).toBe(37.2844251);
    expect(payload.longitude).toBe(127.0442344);
    expect(payload.categoryIds).toEqual([1, 2]);
    expect(payload.imageUrls).toEqual(["https://s3.amazonaws.com/image1.png"]);
    expect(payload.unlockRadius).toBe(150);
    expect(payload.postcardId).toBe(1);
  });
});

// ────────────────────────────────────────────────
// 8. getPublishPayload
// ────────────────────────────────────────────────
describe("getPublishPayload", () => {
  it("위치 정보가 없으면 null을 반환하고 에러를 세팅해야 한다", () => {
    useNestEditorStore.setState({
      categoryIds: [1],
      content: "본문",
      title: "제목",
    });
    const payload = useNestEditorStore.getState().getPublishPayload();
    expect(payload).toBeNull();
    expect(useNestEditorStore.getState().errors.latitude).toBeDefined();
  });

  it("카테고리가 없으면 null을 반환하고 에러를 세팅해야 한다", () => {
    useNestEditorStore.setState({
      latitude: 37.2844251,
      longitude: 127.0442344,
      content: "본문",
      title: "제목",
    });
    const payload = useNestEditorStore.getState().getPublishPayload();
    expect(payload).toBeNull();
    expect(useNestEditorStore.getState().errors.categoryIds).toBeDefined();
  });

  it("본문이 없으면 null을 반환하고 에러를 세팅해야 한다", () => {
    useNestEditorStore.setState({
      latitude: 37.2844251,
      longitude: 127.0442344,
      categoryIds: [1],
      title: "제목",
    });
    const payload = useNestEditorStore.getState().getPublishPayload();
    expect(payload).toBeNull();
    expect(useNestEditorStore.getState().errors.content).toBeDefined();
  });

  it("제목이 없으면 null을 반환하고 에러를 세팅해야 한다", () => {
    useNestEditorStore.setState({
      latitude: 37.2844251,
      longitude: 127.0442344,
      categoryIds: [1],
      content: "본문",
    });
    const payload = useNestEditorStore.getState().getPublishPayload();
    expect(payload).toBeNull();
    expect(useNestEditorStore.getState().errors.title).toBeDefined();
  });

  it("모든 필수 항목이 채워지면 올바른 payload를 반환해야 한다", () => {
    useNestEditorStore.setState({
      title: "테스트 제목",
      content: "테스트 본문",
      latitude: 37.2844251,
      longitude: 127.0442344,
      categoryIds: [1, 2],
      imageUrls: ["https://s3.amazonaws.com/image1.png"],
      unlockRadius: 150,
      postcardId: null,
    });
    const payload = useNestEditorStore.getState().getPublishPayload();
    expect(payload).not.toBeNull();
    expect(payload?.title).toBe("테스트 제목");
    expect(payload?.content).toBe("테스트 본문");
    expect(payload?.latitude).toBe(37.2844251);
    expect(payload?.categoryIds).toEqual([1, 2]);
  });

  it("여러 필수 항목이 누락되면 모든 에러를 한번에 세팅해야 한다", () => {
    const payload = useNestEditorStore.getState().getPublishPayload();
    expect(payload).toBeNull();
    const errors = useNestEditorStore.getState().errors;
    expect(errors.latitude).toBeDefined();
    expect(errors.categoryIds).toBeDefined();
    expect(errors.content).toBeDefined();
    expect(errors.title).toBeDefined();
  });
});

// ────────────────────────────────────────────────
// 9. setInitialNestData
// ────────────────────────────────────────────────
describe("setInitialNestData", () => {
  it("둥지 수정 초기 데이터를 올바르게 설정해야 한다", () => {
    useNestEditorStore.getState().setInitialNestData({
      title: "수정할 제목",
      content: "수정할 본문",
      unlockRadius: 150,
      imageUrls: ["https://s3.amazonaws.com/image1.png"],
    });
    const state = useNestEditorStore.getState();
    expect(state.title).toBe("수정할 제목");
    expect(state.content).toBe("수정할 본문");
    expect(state.unlockRadius).toBe(150);
    expect(state.imageUrls).toEqual(["https://s3.amazonaws.com/image1.png"]);
  });
});
