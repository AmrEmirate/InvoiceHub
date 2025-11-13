import { useState, useEffect } from "react";
import { useApi } from "@/hooks/use-api";
import { Invoice, InvoiceStatus } from "@/lib/types";

export function useDashboard() {
  const { getAll, loading: apiLoading } = useApi<Invoice>("invoices");
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoices = await getAll();
        if (invoices) {
          // Hitung Statistik
          const total = invoices.length;
          const paid = invoices.filter((inv) => inv.status === InvoiceStatus.PAID).length;
          const pending = invoices.filter((inv) => inv.status === InvoiceStatus.PENDING || inv.status === InvoiceStatus.SENT).length;
          const overdue = invoices.filter((inv) => inv.status === InvoiceStatus.OVERDUE).length;
          
          // Hitung Revenue (Hanya dari yang PAID)
          const revenue = invoices
            .filter((inv) => inv.status === InvoiceStatus.PAID)
            .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

          setStats({
            totalInvoices: total,
            paidInvoices: paid,
            pendingInvoices: pending,
            overdueInvoices: overdue,
            totalRevenue: revenue,
          });

          // Ambil 5 invoice terbaru
          setRecentInvoices(invoices.slice(0, 5));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAll]);

  return { stats, recentInvoices, loading: loading || apiLoading };
}