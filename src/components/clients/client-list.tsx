interface ClientListProps {
  clients: any[];
  loading: boolean;
  onEdit: (client: any) => void;
  onDelete: (id: string) => void;
  isEmpty: boolean;
}

export function ClientList({
  clients,
  loading,
  onEdit,
  onDelete,
  isEmpty,
}: ClientListProps) {
  if (loading && clients.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-neutral-600">Loading clients...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-neutral-600">No clients found</p>
      </div>
    );
  }

  return (
    <>
      {clients.map((client) => (
        <div key={client.id}>
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-foreground mb-2">
              {client.name}
            </h3>
            <div className="space-y-2 text-sm text-neutral-600 mb-4">
              <p>📧 {client.email}</p>
              <p>📞 {client.phone || "-"}</p>
              <p>📍 {client.address || "-"}</p>
            </div>
            <div className="py-3 border-t border-neutral-200 mb-4">
              <p className="text-sm text-neutral-600">
                <span className="font-medium text-foreground">
                  {client.invoices?.length || 0}
                </span>{" "}
                invoices
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(client)}
                className="flex-1 btn-secondary text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(client.id)}
                className="flex-1 px-4 py-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
