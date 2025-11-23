import { Invoice, InvoiceStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatNumber";

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  onStatusUpdate: (id: string, status: InvoiceStatus) => Promise<void>;
  onSendEmail: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  sendingEmailId: string | null;
}

function getStatusBadge(status: InvoiceStatus) {
  const styles = {
    [InvoiceStatus.DRAFT]: "bg-gray-100 text-gray-700",
    [InvoiceStatus.SENT]: "bg-blue-50 text-blue-700",
    [InvoiceStatus.PENDING]: "bg-yellow-50 text-yellow-700",
    [InvoiceStatus.PAID]: "bg-green-50 text-green-700",
    [InvoiceStatus.OVERDUE]: "bg-red-50 text-red-700",
    [InvoiceStatus.CANCELLED]: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
}

export function InvoiceTable({
  invoices,
  loading,
  onStatusUpdate,
  onSendEmail,
  onDelete,
  sendingEmailId,
}: InvoiceTableProps) {

  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  if (loading && safeInvoices.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (!loading && safeInvoices.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-neutral-600">No invoices found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoice #</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Client</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {safeInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 font-medium">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 text-neutral-600">{invoice.client?.name || "Unknown Client"}</td>
                <td className="px-6 py-4 text-neutral-600">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-semibold">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {invoice.status === InvoiceStatus.DRAFT && (
                      <button
                        onClick={() => onSendEmail(invoice.id)}
                        disabled={sendingEmailId === invoice.id}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                      >
                        {sendingEmailId === invoice.id ? "Sending..." : "Send Email"}
                      </button>
                    )}
                    {invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.DRAFT && (
                      <button
                        onClick={() => onStatusUpdate(invoice.id, InvoiceStatus.PAID)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(invoice.id)}
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
    </div>
  );
}
