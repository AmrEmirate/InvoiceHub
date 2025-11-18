"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import apiHelper from "@/lib/apiHelper";
import { Invoice, InvoiceStatus } from "@/lib/types";
import { toast } from "sonner";

const INVOICES_PER_PAGE = 10;

function InvoicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: invoices,
    loading,
    pagination,
    getAll,
    remove,
  } = useApi<Invoice>("invoices");

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: INVOICES_PER_PAGE,
    };
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== "all") params.status = statusFilter;

    getAll(params);
  }, [getAll, searchTerm, statusFilter, currentPage]);

  const updateQueryParams = (params: {
    page?: number;
    search?: string;
    status?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    if (params.page !== undefined) {
      if (params.page > 1) newParams.set("page", params.page.toString());
      else newParams.delete("page");
    }

    if (params.search !== undefined) {
      if (params.search) newParams.set("search", params.search);
      else newParams.delete("search");
    }

    if (params.status !== undefined) {
      if (params.status !== "all") newParams.set("status", params.status);
      else newParams.delete("status");
    }

    router.push(`?${newParams.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateQueryParams({ page: 1, search: value });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    updateQueryParams({ page: 1, status: value });
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    router.push("/invoices");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateQueryParams({ page: newPage });
  };

  const refreshCurrentPage = () => {
    const params: any = {
      page: currentPage,
      limit: INVOICES_PER_PAGE,
    };
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== "all") params.status = statusFilter;
    getAll(params);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await remove(id);
      refreshCurrentPage();
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: InvoiceStatus) => {
    try {
      await apiHelper.patch(`/invoices/${id}/status`, { status: newStatus });
      toast.success(`Invoice marked as ${newStatus}`);
      refreshCurrentPage();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleSendEmail = async (id: string) => {
    setSendingEmailId(id);
    try {
      await apiHelper.post(`/invoices/${id}/send`, {});
      toast.success("Invoice sent to client via email!");
      refreshCurrentPage();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setSendingEmailId(null);
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const styles = {
      [InvoiceStatus.DRAFT]: "bg-gray-100 text-gray-700",
      [InvoiceStatus.SENT]: "bg-blue-50 text-blue-700",
      [InvoiceStatus.PENDING]: "bg-yellow-50 text-yellow-700",
      [InvoiceStatus.PAID]: "bg-green-50 text-green-700",
      [InvoiceStatus.OVERDUE]: "bg-red-50 text-red-700",
      [InvoiceStatus.CANCELLED]: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-neutral-600">Manage and track your invoices</p>
          </div>
          <button
            onClick={() => router.push("/invoices/create")}
            className="btn-primary"
          >
            + Create Invoice
          </button>
        </div>

        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Search</label>
              <input
                type="text"
                placeholder="Invoice number..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-text">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="input-field"
                title="Filter by status"
              >
                <option value="all">All Statuses</option>
                {Object.values(InvoiceStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleReset} className="btn-secondary w-full">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          {loading && invoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Loading invoices...</p>
            </div>
          ) : invoices.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 text-neutral-600">
                          {invoice.client?.name || "Unknown Client"}
                        </td>
                        <td className="px-6 py-4 text-neutral-600">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          ${Number(invoice.totalAmount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {invoice.status === InvoiceStatus.DRAFT && (
                              <button
                                onClick={() => handleSendEmail(invoice.id)}
                                disabled={sendingEmailId === invoice.id}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                              >
                                {sendingEmailId === invoice.id
                                  ? "Sending..."
                                  : "Send Email"}
                              </button>
                            )}

                            {invoice.status !== InvoiceStatus.PAID &&
                              invoice.status !== InvoiceStatus.DRAFT && (
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      invoice.id,
                                      InvoiceStatus.PAID,
                                    )
                                  }
                                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                  Mark Paid
                                </button>
                              )}

                            <button
                              onClick={() => handleDelete(invoice.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-neutral-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages || loading}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">No invoices found.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <InvoicesContent />
    </Suspense>
  );
}
