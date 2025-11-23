import { Client } from "@/lib/types";
import { ClientCard } from "./client-card";

interface ClientListProps {
  clients: Client[];
  loading: boolean;
  onEdit: (client: Client) => void;
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
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
