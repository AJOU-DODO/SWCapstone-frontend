"use client";

import { useNestEditorStore } from "@/lib/store/nestEditorStore";

export function UnlockRadiusSelector() {
  const { unlockRadius, setUnlockRadius } = useNestEditorStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#8B8070] font-medium">해금 범위 설정</span>
      <div className="flex items-center gap-3 ml-1">
        {([150, 10] as const).map((val) => (
          <label key={val} className="flex items-center gap-1.5 cursor-pointer">
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                unlockRadius === val
                  ? "border-[#5C5346] bg-[#5C5346]"
                  : "border-[#C8C4B0]"
              }`}
            >
              {unlockRadius === val && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setUnlockRadius(val)}
              className="text-xs text-[#5C5346]"
            >
              {val === 150 ? "넓게" : "좁게"}
            </button>
          </label>
        ))}
      </div>
    </div>
  );
}
