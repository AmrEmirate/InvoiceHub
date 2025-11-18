import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { Invoice, InvoiceStatus, ChartDataPoint } from "@/lib/types";
import apiHelper from "@/lib/apiHelper";
import { toast } from "sonner";

export function useDashboard() {
  const {
    data: recentInvoices,
    getAll,
    loading: invoicesLoading,
  } = useApi<Invoice>("invoices");

  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const statsRes = await apiHelper.get("/invoices/stats");
      setStats(statsRes.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchRecentInvoices = useCallback(async () => {
    await getAll({ page: 1, limit: 5 });
  }, [getAll]);

  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    try {
      const res = await apiHelper.get<{ data: ChartDataPoint[] }>(
        "/invoices/stats/chart",
      );

      const formattedData = res.data.data.map((item) => ({
        ...item,
        month: new Date(item.month + "-02").toLocaleString("default", {
          month: "short",
        }),
      }));

      setChartData(formattedData);
    } catch (error) {
      toast.error("Failed to load chart data");
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentInvoices();
    fetchChartData();
  }, [fetchDashboardStats, fetchRecentInvoices, fetchChartData]);

  return {
    stats,
    recentInvoices,
    chartData,
    loading: statsLoading || chartLoading || invoicesLoading,
  };
}
