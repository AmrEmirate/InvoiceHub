import { Category } from "@/lib/types";

interface ProductFilterProps {
  searchTerm: string;
  categoryFilter: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

export function ProductFilter({
  searchTerm,
  categoryFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onReset,
}: ProductFilterProps) {
  return (
    <div className="card p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label-text">Search</label>
          <input
            type="text"
            placeholder="Product name or SKU..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input-field"
            title="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
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
