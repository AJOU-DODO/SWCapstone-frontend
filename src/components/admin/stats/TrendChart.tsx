"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { StatsTrend } from "@/types/indexAdmin";
import DateRangePicker from "./DateRangePicker";

interface Props {
  trends: StatsTrend[];
  startDate: string;
  endDate: string;
  isLoading: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
}

const LABELS: Record<string, string> = {
  nestCount: "둥지",
  commentCount: "댓글",
  postcardCount: "엽서",
};

export default function TrendChart({
  trends,
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
        <h2 className="text-lg font-semibold text-gray-700">
          일별 생성 트렌드
        </h2>
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
        <div className="h-64 flex items-center justify-center text-gray-400">
          로딩 중...
        </div>
      ) : trends.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          데이터가 없습니다.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => v.slice(5)}
            />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              labelFormatter={(label) => `날짜: ${label}`}
              formatter={(value, name) => [
                value,
                LABELS[name as string] ?? name,
              ]}
            />
            <Legend formatter={(value) => LABELS[value] ?? value} />
            <Line
              type="monotone"
              dataKey="nestCount"
              stroke="#538752"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="commentCount"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="postcardCount"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
