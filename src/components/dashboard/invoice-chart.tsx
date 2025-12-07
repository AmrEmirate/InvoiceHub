"use client";

import dynamic from "next/dynamic";
import { ChartDataPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatNumber";

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

export default function InvoiceChart({
  data,
  year,
  onYearChange,
}: {
  data: ChartDataPoint[];
  year?: number;
  onYearChange?: (year: number | undefined) => void;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 h-[364px] flex items-center justify-center">
        <p className="text-neutral-500">Loading chart data...</p>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">
          Revenue {year ? `(${year})` : "(Last 12 Months)"}
        </h2>
        <select
          className="border border-input bg-background rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={year || ""}
          onChange={(e) => {
            const val = e.target.value;
            onYearChange?.(val ? Number(val) : undefined);
          }}
        >
          <option value="">Last 12 Months</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => {
              if (value >= 1000000000)
                return `Rp ${(value / 1000000000).toFixed(1)}M`;
              if (value >= 1000000)
                return `Rp ${(value / 1000000).toFixed(1)}jt`;
              if (value >= 1000) return `Rp ${(value / 1000).toFixed(1)}rb`;
              return `Rp ${value}`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
            formatter={(value: any) => [formatCurrency(value), "Revenue"]}
          />

          <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
