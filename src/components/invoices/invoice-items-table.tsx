import { Product } from "@/lib/types";
import { Control, useWatch, FieldArrayWithId } from "react-hook-form";
import { InvoiceFormData } from "./invoice-form-schema";
import { useForm } from "react-hook-form";
import { formatCurrency } from "@/lib/utils/formatNumber";

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
    0
  );

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-neutral-50 border-t border-neutral-200">
      <span className="font-semibold text-lg">Total</span>
      <span className="font-bold text-xl">{formatCurrency(total)}</span>
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
  const lineTotal = (item.quantity || 0) * (item.price || 0);
  return <span className="font-medium">{formatCurrency(lineTotal)}</span>;
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
    <div className="card p-4 md:p-6 bg-white shadow-sm rounded-lg border border-neutral-200">
      <h3 className="text-lg font-bold mb-4 text-foreground">Items</h3>

      {errors.items?.root && (
        <p className="text-danger text-sm mb-4 -mt-2">
          {errors.items.root.message}
        </p>
      )}

      {/* Desktop View: Table */}
      <div className="hidden lg:block overflow-x-auto">
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
                    onChange={(e) => onProductSelect(index, e.target.value)}
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
                      errors.items?.[index]?.description ? "border-red-500" : ""
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
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className={`input-field text-sm ${
                      errors.items?.[index]?.quantity ? "border-red-500" : ""
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
                    {...register(`items.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    readOnly
                    className={`input-field text-sm bg-neutral-100 text-neutral-500 cursor-not-allowed ${
                      errors.items?.[index]?.price ? "border-red-500" : ""
                    }`}
                    placeholder="0.00"
                    aria-label="Price"
                    title="Price (Read-only)"
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

      {/* Mobile View: Cards */}
      <div className="lg:hidden space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 space-y-3"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm text-neutral-700">
                Item #{index + 1}
              </h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Product
              </label>
              <select
                {...register(`items.${index}.productId`)}
                onChange={(e) => onProductSelect(index, e.target.value)}
                className="input-field text-sm w-full"
                defaultValue={field.productId}
              >
                <option value="">Select product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Description
              </label>
              <input
                type="text"
                {...register(`items.${index}.description`)}
                className={`input-field text-sm w-full ${
                  errors.items?.[index]?.description ? "border-red-500" : ""
                }`}
                placeholder="Item description"
              />
              {errors.items?.[index]?.description && (
                <p className="text-danger text-xs mt-1">
                  {errors.items[index]?.description?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">
                  Qty
                </label>
                <input
                  type="number"
                  min="1"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className={`input-field text-sm w-full ${
                    errors.items?.[index]?.quantity ? "border-red-500" : ""
                  }`}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`items.${index}.price`, { valueAsNumber: true })}
                  readOnly
                  className={`input-field text-sm w-full bg-neutral-100 text-neutral-500 cursor-not-allowed ${
                    errors.items?.[index]?.price ? "border-red-500" : ""
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
              <span className="text-sm font-medium text-neutral-600">
                Line Total:
              </span>
              <LineTotal control={control} index={index} />
            </div>
          </div>
        ))}
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
        <div className="w-full md:w-64 space-y-2">
          <TotalCalculator control={control} />
        </div>
      </div>
    </div>
  );
}
