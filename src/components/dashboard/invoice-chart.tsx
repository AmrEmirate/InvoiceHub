"use client"

import dynamic from "next/dynamic"

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })

const data = [
  { month: "Jan", invoices: 4, paid: 3 },
  { month: "Feb", invoices: 6, paid: 5 },
  { month: "Mar", invoices: 5, paid: 4 },
  { month: "Apr", invoices: 8, paid: 7 },
  { month: "May", invoices: 7, paid: 6 },
  { month: "Jun", invoices: 9, paid: 8 },
]

export default function InvoiceChart() {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Invoices Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="invoices" fill="#3b82f6" name="Created" />
          <Bar dataKey="paid" fill="#10b981" name="Paid" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
