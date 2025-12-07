"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";
import StatCard from "@/components/dashboard/stat-card";
import InvoiceChart from "@/components/dashboard/invoice-chart";
import RecentInvoices from "@/components/dashboard/recent-invoices";
import { formatCurrency } from "@/lib/utils/formatNumber";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const {
    stats,
    recentInvoices,
    chartData,
    loading: dataLoading,
    year,
    setYear,
  } = useDashboard();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-neutral-600">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Invoices"
            value={stats.totalInvoices}
            icon="📋"
            color="blue"
          />
          <StatCard
            label="Paid"
            value={stats.paidInvoices}
            icon="✓"
            color="green"
          />
          <StatCard
            label="Pending"
            value={stats.pendingInvoices}
            icon="⏳"
            color="yellow"
          />
          <StatCard
            label="Overdue"
            value={stats.overdueInvoices}
            icon="⚠"
            color="red"
          />
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Total Revenue
          </h2>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(stats.totalRevenue)}
          </p>
          <p className="text-neutral-600 text-sm mt-2">
            From {stats.paidInvoices} paid invoices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InvoiceChart data={chartData} year={year} onYearChange={setYear} />
          </div>
          <div>
            <RecentInvoices invoices={recentInvoices} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
