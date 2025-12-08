"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import apiHelper from "@/lib/apiHelper";
import { Invoice, InvoiceStatus } from "@/lib/types";
import { toast } from "sonner";
import { InvoiceFilter } from "@/components/invoices/invoice-filter";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { InvoicePagination } from "@/components/invoices/invoice-pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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
    searchParams.get("search") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  // Ref to track pending timers for auto-change to PENDING status
  const pendingTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingTimers.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, []);

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

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    invoiceId: string | null;
  }>({
    isOpen: false,
    invoiceId: null,
  });

  const [sendEmailDialog, setSendEmailDialog] = useState<{
    isOpen: boolean;
    invoiceId: string | null;
    invoiceNumber: string;
  }>({
    isOpen: false,
    invoiceId: null,
    invoiceNumber: "",
  });

  const [markPaidDialog, setMarkPaidDialog] = useState<{
    isOpen: boolean;
    invoiceId: string | null;
    invoiceNumber: string;
  }>({
    isOpen: false,
    invoiceId: null,
    invoiceNumber: "",
  });

  const [cancelDialog, setCancelDialog] = useState<{
    isOpen: boolean;
    invoiceId: string | null;
    invoiceNumber: string;
  }>({
    isOpen: false,
    invoiceId: null,
    invoiceNumber: "",
  });

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, invoiceId: id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.invoiceId) return;

    await remove(deleteDialog.invoiceId);
    setDeleteDialog({ isOpen: false, invoiceId: null });
    refreshCurrentPage();
  };

  // Status update handler (for Mark Paid)
  const handleStatusUpdate = (id: string, newStatus: InvoiceStatus) => {
    const invoice = invoices.find((inv) => inv.id === id);
    if (newStatus === InvoiceStatus.PAID) {
      // Clear any pending timer for this invoice
      if (pendingTimers.current[id]) {
        clearTimeout(pendingTimers.current[id]);
        delete pendingTimers.current[id];
      }
      setMarkPaidDialog({
        isOpen: true,
        invoiceId: id,
        invoiceNumber: invoice?.invoiceNumber || "",
      });
    }
  };

  const handleConfirmMarkPaid = async () => {
    if (!markPaidDialog.invoiceId) return;

    // Clear any pending timer for this invoice
    if (pendingTimers.current[markPaidDialog.invoiceId]) {
      clearTimeout(pendingTimers.current[markPaidDialog.invoiceId]);
      delete pendingTimers.current[markPaidDialog.invoiceId];
    }

    try {
      await apiHelper.patch(`/invoices/${markPaidDialog.invoiceId}/status`, {
        status: InvoiceStatus.PAID,
      });
      toast.success(`Invoice marked as PAID`);
      refreshCurrentPage();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setMarkPaidDialog({ isOpen: false, invoiceId: null, invoiceNumber: "" });
    }
  };

  // Send Email handlers
  const handleSendEmailClick = (id: string) => {
    const invoice = invoices.find((inv) => inv.id === id);
    setSendEmailDialog({
      isOpen: true,
      invoiceId: id,
      invoiceNumber: invoice?.invoiceNumber || "",
    });
  };

  const handleConfirmSendEmail = async () => {
    if (!sendEmailDialog.invoiceId) return;

    const invoiceId = sendEmailDialog.invoiceId;
    setSendingEmailId(invoiceId);
    setSendEmailDialog({ isOpen: false, invoiceId: null, invoiceNumber: "" });

    try {
      await apiHelper.post(`/invoices/${invoiceId}/send`, {});
      toast.success("Invoice sent to client via email!");
      refreshCurrentPage();

      // Start 10 second timer to auto-change status to PENDING
      if (pendingTimers.current[invoiceId]) {
        clearTimeout(pendingTimers.current[invoiceId]);
      }

      pendingTimers.current[invoiceId] = setTimeout(async () => {
        try {
          await apiHelper.patch(`/invoices/${invoiceId}/status`, {
            status: InvoiceStatus.PENDING,
          });
          toast.info("Invoice status changed to PENDING");
          refreshCurrentPage();
        } catch (error) {
          // Silently fail if status already changed
        }
        delete pendingTimers.current[invoiceId];
      }, 10000); // 10 seconds
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setSendingEmailId(null);
    }
  };

  // Cancel handlers
  const handleCancelClick = (id: string) => {
    const invoice = invoices.find((inv) => inv.id === id);
    setCancelDialog({
      isOpen: true,
      invoiceId: id,
      invoiceNumber: invoice?.invoiceNumber || "",
    });
  };

  const handleConfirmCancel = async () => {
    if (!cancelDialog.invoiceId) return;

    // Clear any pending timer for this invoice
    if (pendingTimers.current[cancelDialog.invoiceId]) {
      clearTimeout(pendingTimers.current[cancelDialog.invoiceId]);
      delete pendingTimers.current[cancelDialog.invoiceId];
    }

    try {
      await apiHelper.patch(`/invoices/${cancelDialog.invoiceId}/status`, {
        status: InvoiceStatus.CANCELLED,
      });
      toast.success("Invoice has been cancelled");
      refreshCurrentPage();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel invoice");
    } finally {
      setCancelDialog({ isOpen: false, invoiceId: null, invoiceNumber: "" });
    }
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

        <InvoiceFilter
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={handleSearch}
          onStatusChange={handleStatusFilter}
          onReset={handleReset}
        />

        <InvoiceTable
          invoices={invoices}
          loading={loading}
          onStatusUpdate={handleStatusUpdate}
          onSendEmail={handleSendEmailClick}
          onDelete={handleDeleteClick}
          onCancel={handleCancelClick}
          sendingEmailId={sendingEmailId}
        />

        {pagination && pagination.totalPages > 1 && (
          <InvoicePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            loading={loading}
            onPageChange={handlePageChange}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, invoiceId: null })}
          onConfirm={handleConfirmDelete}
          title="Delete Invoice"
          message="Are you sure you want to delete this invoice? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />

        {/* Send Email Confirmation Dialog */}
        <ConfirmDialog
          isOpen={sendEmailDialog.isOpen}
          onClose={() =>
            setSendEmailDialog({
              isOpen: false,
              invoiceId: null,
              invoiceNumber: "",
            })
          }
          onConfirm={handleConfirmSendEmail}
          title="Send Invoice Email"
          message={`Are you sure you want to send invoice ${sendEmailDialog.invoiceNumber} to the client via email?`}
          confirmText="Send Email"
          variant="info"
        />

        {/* Mark as Paid Confirmation Dialog */}
        <ConfirmDialog
          isOpen={markPaidDialog.isOpen}
          onClose={() =>
            setMarkPaidDialog({
              isOpen: false,
              invoiceId: null,
              invoiceNumber: "",
            })
          }
          onConfirm={handleConfirmMarkPaid}
          title="Mark as Paid"
          message={`Are you sure you want to mark invoice ${markPaidDialog.invoiceNumber} as PAID? This will update the invoice status.`}
          confirmText="Mark as Paid"
          variant="success"
        />

        {/* Cancel Invoice Confirmation Dialog */}
        <ConfirmDialog
          isOpen={cancelDialog.isOpen}
          onClose={() =>
            setCancelDialog({
              isOpen: false,
              invoiceId: null,
              invoiceNumber: "",
            })
          }
          onConfirm={handleConfirmCancel}
          title="Cancel Invoice"
          message={`Are you sure you want to cancel invoice ${cancelDialog.invoiceNumber}? This will change the status to CANCELLED.`}
          confirmText="Cancel Invoice"
          variant="danger"
        />
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
