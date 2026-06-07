import type { AdNest, AdStatistics } from "@/types/indexAdvertiser";

interface Props {
  nest: AdNest;
  stats: AdStatistics | undefined;
}

export default function AdStatisticsCard({ nest, stats }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-gray-800">{nest.title}</p>
        <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
          게시 중
        </span>
      </div>
      {stats ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500 mb-1">👀 노출수</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.impressions.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500 mb-1">🖱️ 클릭수</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.clicks.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 text-sm py-2">
          통계 로딩 중...
        </div>
      )}
    </div>
  );
}
