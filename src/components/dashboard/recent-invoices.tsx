export default function RecentInvoices() {
  const recentInvoices = [
    { id: "INV-001", client: "Acme Corp", amount: 5000, status: "Paid" },
    { id: "INV-002", client: "Tech Start", amount: 3500, status: "Pending" },
    { id: "INV-003", client: "Global Ltd", amount: 8200, status: "Pending" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700"
      case "Pending":
        return "bg-yellow-50 text-yellow-700"
      case "Overdue":
        return "bg-red-50 text-red-700"
      default:
        return "bg-neutral-50 text-neutral-700"
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Recent Invoices</h2>
      <div className="space-y-3">
        {recentInvoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground text-sm">{invoice.id}</p>
              <p className="text-xs text-neutral-600">{invoice.client}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground text-sm">${invoice.amount}</p>
              <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
