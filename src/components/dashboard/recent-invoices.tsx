import { Invoice, InvoiceStatus } from "@/lib/types";

interface RecentInvoicesProps {
  invoices: Invoice[];
}

export default function RecentInvoices({ invoices }: RecentInvoicesProps) {
  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return "bg-green-50 text-green-700";
      case InvoiceStatus.PENDING:
      case InvoiceStatus.SENT:
        return "bg-yellow-50 text-yellow-700";
      case InvoiceStatus.OVERDUE:
        return "bg-red-50 text-red-700";
      default:
        return "bg-neutral-50 text-neutral-700";
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">
        Recent Invoices
      </h2>
      <div className="space-y-3">
        {invoices.length === 0 ? (
          <p className="text-sm text-neutral-500">No recent invoices found.</p>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground text-sm">
                  {invoice.invoiceNumber}
                </p>
                <p className="text-xs text-neutral-600">
                  {invoice.client?.name || "Unknown Client"}
                </p>
              </div>
              <div className="text-right">
                    <p className="font-semibold text-foreground">
                      Rp {Number(invoice.totalAmount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(invoice.status)}`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
