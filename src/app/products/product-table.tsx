import { Product } from "@/lib/types";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (loading && products.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-neutral-600">
            No products found. Try adding one!
          </p>
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Category
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-foreground">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-neutral-600">{product.sku}</td>
                <td className="px-6 py-4 text-neutral-600">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  {product.category?.name || "Uncategorized"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
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
