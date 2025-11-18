import { InvoiceStatus } from "@/lib/types";

interface InvoiceFilterProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export function InvoiceFilter({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onReset,
}: InvoiceFilterProps) {
  return (
    <div className="card p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label-text">Search</label>
          <input
            type="text"
            placeholder="Invoice number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
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
          <button onClick={onReset} className="btn-secondary w-full">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
