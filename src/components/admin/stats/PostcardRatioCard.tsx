"use client";

import type { PostcardRatio } from "@/types/indexAdmin";
import DateRangePicker from "./DateRangePicker";

interface Props {
  ratio: PostcardRatio | null;
  startDate: string;
  endDate: string;
  isLoading: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
}

export default function PostcardRatioCard({
  ratio,
  startDate,
  endDate,
  isLoading,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}: Props) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">엽서 교환 비율</h2>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onSearch={onSearch}
          isLoading={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="h-32 flex items-center justify-center text-gray-400">
          로딩 중...
        </div>
      ) : ratio ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">총 생성된 엽서</p>
              <p className="text-2xl font-bold text-gray-800">
                {ratio.totalGenerated.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">교환 완료된 엽서</p>
              <p className="text-2xl font-bold text-gray-800">
                {ratio.totalDelivered.toLocaleString()}
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
              <p className="text-sm text-amber-600 mb-1">교환 비율</p>
              <p className="text-2xl font-bold text-amber-600">
                {ratio.deliveryRatio.toFixed(1)}%
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${Math.min(ratio.deliveryRatio, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-400">
          데이터가 없습니다.
        </div>
      )}
    </section>
  );
}
