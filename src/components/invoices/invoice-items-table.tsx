import { Product } from "@/lib/types";
import { Control, useWatch, FieldArrayWithId } from "react-hook-form";
import { InvoiceFormData } from "./invoice-form-schema";
import { useForm } from "react-hook-form";

export function TotalCalculator({
  control,
}: {
  control: Control<InvoiceFormData>;
}) {
  const items = useWatch({
    control,
    name: "items",
  });

  const total = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0,
  );

  return (
    <div className="flex justify-between text-lg font-bold text-foreground">
      <span>Grand Total</span>
      <span>${total.toFixed(2)}</span>
    </div>
  );
}

export function LineTotal({
  control,
  index,
}: {
  control: Control<InvoiceFormData>;
  index: number;
}) {
  const item = useWatch({
    control,
    name: `items.${index}`,
  });
  const total = (item.quantity || 0) * (item.price || 0);
  return <>${total.toFixed(2)}</>;
}

interface InvoiceItemsTableProps {
  fields: FieldArrayWithId<InvoiceFormData, "items", "id">[];
  products: Product[];
  control: Control<InvoiceFormData>;
  register: ReturnType<typeof useForm<InvoiceFormData>>["register"];
  errors: ReturnType<typeof useForm<InvoiceFormData>>["formState"]["errors"];
  onProductSelect: (index: number, productId: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export function InvoiceItemsTable({
  fields,
  products,
  control,
  register,
  errors,
  onProductSelect,
  onAddItem,
  onRemoveItem,
}: InvoiceItemsTableProps) {
  return (
    <div className="card p-6 bg-white shadow-sm rounded-lg border border-neutral-200">
      <h3 className="text-lg font-bold mb-4 text-foreground">Items</h3>

      {errors.items?.root && (
        <p className="text-danger text-sm mb-4 -mt-2">
          {errors.items.root.message}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-left text-sm font-medium text-neutral-600">
            <tr>
              <th className="p-3 w-1/4">Product (Auto-fill)</th>
              <th className="p-3 w-1/3">Description *</th>
              <th className="p-3 w-24">Qty *</th>
              <th className="p-3 w-32">Price *</th>
              <th className="p-3 w-32">Total</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td className="p-3 align-top">
                  <select
                    {...register(`items.${index}.productId`)}
                    onChange={(e) =>
                      onProductSelect(index, e.target.value)
                    }
                    className="input-field text-sm"
                    aria-label="Select Product"
                    title="Select Product"
                    defaultValue={field.productId}
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 align-top">
                  <input
                    type="text"
                    {...register(`items.${index}.description`)}
                    className={`input-field text-sm ${
                      errors.items?.[index]?.description
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Item description"
                    aria-label="Item Description"
                    title="Item Description"
                  />
                  {errors.items?.[index]?.description && (
                    <p className="text-danger text-xs mt-1">
                      {errors.items[index]?.description?.message}
                    </p>
                  )}
                </td>
                <td className="p-3 align-top">
                  <input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`)}
                    className={`input-field text-sm ${
                      errors.items?.[index]?.quantity
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="1"
                    aria-label="Quantity"
                    title="Quantity"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-danger text-xs mt-1">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </td>
                <td className="p-3 align-top">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register(`items.${index}.price`)}
                    className={`input-field text-sm ${
                      errors.items?.[index]?.price
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="0.00"
                    aria-label="Price"
                    title="Price"
                  />
                  {errors.items?.[index]?.price && (
                    <p className="text-danger text-xs mt-1">
                      {errors.items[index]?.price?.message}
                    </p>
                  )}
                </td>
                <td className="p-3 align-top font-medium text-foreground">
                  <LineTotal control={control} index={index} />
                </td>
                <td className="p-3 align-top text-center">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onAddItem}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          + Add Line Item
        </button>
      </div>

      <div className="mt-8 border-t pt-4 flex justify-end">
        <div className="w-64 space-y-2">
          <TotalCalculator control={control} />
        </div>
      </div>
    </div>
  );
}
