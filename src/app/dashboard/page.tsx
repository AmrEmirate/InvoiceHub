"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard"; // Hook baru
import StatCard from "@/components/dashboard/stat-card";
import InvoiceChart from "@/components/dashboard/invoice-chart";
import RecentInvoices from "@/components/dashboard/recent-invoices";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Gunakan hook dashboard untuk data real
  const { stats, recentInvoices, loading: dataLoading } = useDashboard();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Gabungkan loading state
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-neutral-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Grid - Menggunakan data real dari stats */}
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

        {/* Revenue Card - Menggunakan data real */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Total Revenue</h2>
          {/* Format mata uang sesuai desain asli (K notation jika besar) atau locale string */}
          <p className="text-4xl font-bold text-accent">
            ${(stats.totalRevenue / 1000).toFixed(1)}K
          </p>
          <p className="text-neutral-600 text-sm mt-2">
            From {stats.paidInvoices} paid invoices
          </p>
        </div>

        {/* Charts & Recent Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Chart masih statis sesuai permintaan desain asli (bisa di-update nanti) */}
            <InvoiceChart />
          </div>
          <div>
            {/* Recent Invoices menerima props data real */}
            <RecentInvoices invoices={recentInvoices} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}