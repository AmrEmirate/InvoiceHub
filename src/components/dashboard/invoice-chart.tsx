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
  { ssr: false },
);
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);

export default function InvoiceChart({ data }: { data: ChartDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 h-[364px] flex items-center justify-center">
        <p className="text-neutral-500">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">
        Revenue (Last 12 Months)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => {
              if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `Rp ${(value / 1000).toFixed(1)}K`;
              return `Rp ${value}`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
            formatter={(value: any) => [
              formatCurrency(value),
              "Revenue",
            ]}
          />

          <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
