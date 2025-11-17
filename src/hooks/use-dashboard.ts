import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { Invoice, InvoiceStatus, ChartDataPoint } from "@/lib/types"; // Impor ChartDataPoint
import apiHelper from "@/lib/apiHelper"; // Impor apiHelper untuk request kustom
import { toast } from "sonner"; // Impor toast

export function useDashboard() {
  const { getAll, loading: statsLoading } = useApi<Invoice>("invoices");
  
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  
  // --- STATE BARU UNTUK CHART ---
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // --- Gunakan useCallback untuk fetch ---
  const fetchDashboardData = useCallback(async () => {
    try {
      // 1. Fetch data stats (dari hook useApi)
      // Kita set limit 5 karena kita hanya butuh 5 data terbaru
      const invoiceData = await getAll({ page: 1, limit: 5 }); 
      
      if (invoiceData) {
        // Ambil total dari metadata paginasi (ini lebih akurat)
        const total = invoiceData.totalItems;
        
        // Ambil 5 invoice terbaru
        setRecentInvoices(invoiceData.data);
        
        // (CATATAN: Stats ini hanya dari 5 invoice, 
        // idealnya endpoint /stats BE harus menghitung semua)
        // Mari kita asumsikan /stats dari BE Anda (seperti di invoice.service.ts)
        // melakukan perhitungan yang benar. Kita panggil itu secara terpisah.
        
        // Mari kita panggil endpoint /stats yang sebenarnya
        const statsRes = await apiHelper.get("/invoices/stats");
        setStats(statsRes.data.data.stats);

      }
    } catch (error) {
       toast.error("Failed to load dashboard stats");
    }
  }, [getAll]);


  // --- useEffect terpisah untuk chart ---
  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    try {
      // 2. Fetch data chart (panggilan API kustom)
      const res = await apiHelper.get<{ data: ChartDataPoint[] }>("/invoices/stats/chart");
      
      // Format 'YYYY-MM' menjadi 'Jan'
      const formattedData = res.data.data.map(item => ({
        ...item,
        month: new Date(item.month + '-02').toLocaleString('default', { month: 'short' })
      }));
      
      setChartData(formattedData);
    } catch (error) {
      toast.error("Failed to load chart data");
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchChartData();
  }, [fetchDashboardData, fetchChartData]);

  return { 
    stats, 
    recentInvoices, 
    chartData, // Kembalikan data chart
    loading: statsLoading || chartLoading // Gabungkan state loading
  };
}