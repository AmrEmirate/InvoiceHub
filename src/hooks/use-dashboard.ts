import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { Invoice, InvoiceStatus, ChartDataPoint } from "@/lib/types"; // Impor ChartDataPoint
import apiHelper from "@/lib/apiHelper"; // Impor apiHelper untuk request kustom
import { toast } from "sonner"; // Impor toast

export function useDashboard() {
  // Gunakan 'useApi' hanya untuk data 'recentInvoices'
  const {
    data: recentInvoices,
    getAll,
    loading: invoicesLoading,
  } = useApi<Invoice>("invoices");

  // --- PERBAIKAN: Berikan nilai default untuk 'stats' ---
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // --- State baru untuk chart ---
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // --- useCallback untuk fetch data stats (Kartu & Total) ---
  const fetchDashboardStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      // Panggil endpoint /stats yang sudah kita perbaiki di backend
      const statsRes = await apiHelper.get("/invoices/stats");
      setStats(statsRes.data.data); // Atur stats dari API
    } catch (error) {
      toast.error("Failed to load dashboard stats");
      // Jika gagal, 'stats' akan tetap 0 (dari nilai default)
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // --- useCallback untuk fetch data invoice terbaru ---
  const fetchRecentInvoices = useCallback(async () => {
    // Kita hanya butuh 5 data terbaru untuk daftar "Recent Invoices"
    await getAll({ page: 1, limit: 5 });
  }, [getAll]);

  // --- useCallback terpisah untuk chart ---
  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    try {
      // Panggil endpoint /stats/chart yang sudah kita perbaiki
      const res = await apiHelper.get<{ data: ChartDataPoint[] }>(
        "/invoices/stats/chart"
      );

      // Format 'YYYY-MM' menjadi 'Jan'
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

  // Jalankan semua fetch saat komponen dimuat
  useEffect(() => {
    fetchDashboardStats();
    fetchRecentInvoices();
    fetchChartData();
  }, [fetchDashboardStats, fetchRecentInvoices, fetchChartData]);

  return {
    stats,
    recentInvoices,
    chartData, // Kembalikan data chart
    loading: statsLoading || chartLoading || invoicesLoading, // Gabungkan semua state loading
  };
}