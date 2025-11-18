interface InvoicePaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function InvoicePagination({
  currentPage,
  totalPages,
  loading,
  onPageChange,
}: InvoicePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center p-4 border-t">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="btn-secondary disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-neutral-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="btn-secondary disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
