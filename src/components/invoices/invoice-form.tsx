"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/use-api";
import { Client, Product, InvoiceStatus } from "@/lib/types";
import { toast } from "sonner";

import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const invoiceItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(1, "Qty must be at least 1"),
  ),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Price cannot be negative"),
  ),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.nativeEnum(InvoiceStatus),
  notes: z.string().optional(),
  isRecurring: z.boolean(),
  recurrenceInterval: z.string(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

const defaultItem = { productId: "", description: "", quantity: 1, price: 0 };

function TotalCalculator({ control }: { control: Control<InvoiceFormData> }) {
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

function LineTotal({
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

export default function InvoiceForm() {
  const router = useRouter();

  const { data: clients, getAll: getClients } = useApi<Client>("clients");
  const { data: products, getAll: getProducts } = useApi<Product>("products");
  const { create: createInvoice, loading } = useApi<any, InvoiceFormData>(
    "invoices",
  );

  useEffect(() => {
    getClients();
    getProducts();
  }, [getClients, getProducts]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, "0")}`,
      dueDate: "",
      status: InvoiceStatus.DRAFT,
      notes: "",
      isRecurring: false,
      recurrenceInterval: "monthly",
      items: [defaultItem],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const isRecurring = watch("isRecurring");

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      setValue(`items.${index}.description`, selectedProduct.name);
      setValue(`items.${index}.price`, Number(selectedProduct.price));
    }
  };

  const addItem = () => {
    append(defaultItem);
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    const cleanData = {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        productId: item.productId || undefined,
      })),
    };

    try {
      await createInvoice(cleanData);
      toast.success("Invoice created successfully!");
      router.push("/invoices");
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="card p-6 bg-white shadow-sm rounded-lg border border-neutral-200">
        <h3 className="text-lg font-bold mb-4 text-foreground">
          Invoice Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="clientId" className="label-text">
              Client *
            </label>
            <select
              id="clientId"
              {...register("clientId")}
              className={`input-field ${errors.clientId ? "border-red-500" : ""}`}
              title="Select Client"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-danger text-sm mt-1">
                {errors.clientId.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="invoiceNumber" className="label-text">
              Invoice Number *
            </label>
            <input
              id="invoiceNumber"
              type="text"
              {...register("invoiceNumber")}
              className={`input-field ${errors.invoiceNumber ? "border-red-500" : ""}`}
              placeholder="INV-001"
              title="Invoice Number"
            />
            {errors.invoiceNumber && (
              <p className="text-danger text-sm mt-1">
                {errors.invoiceNumber.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="dueDate" className="label-text">
              Due Date *
            </label>
            <input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              className={`input-field ${errors.dueDate ? "border-red-500" : ""}`}
              title="Due Date"
            />
            {errors.dueDate && (
              <p className="text-danger text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label htmlFor="status" className="label-text">
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="input-field"
              title="Invoice Status"
            >
              {Object.values(InvoiceStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center h-full pt-6">
            <label
              htmlFor="isRecurring"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                id="isRecurring"
                type="checkbox"
                {...register("isRecurring")}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                title="Recurring Invoice Checkbox"
              />
              <span className="text-sm font-medium text-gray-700">
                Recurring Invoice?
              </span>
            </label>
          </div>

          {isRecurring && (
            <div>
              <label htmlFor="recurrenceInterval" className="label-text">
                Interval
              </label>
              <select
                id="recurrenceInterval"
                {...register("recurrenceInterval")}
                className="input-field"
                title="Recurrence Interval"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>
      </div>

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
                        handleProductSelect(index, e.target.value)
                      }
                      className="input-field text-sm"
                      aria-label="Select Product"
                      title="Select Product"
                      defaultValue={field.productId}
                    >
                      <option value="">Select Product...</option>
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
                      className={`input-field text-sm ${errors.items?.[index]?.description ? "border-red-500" : ""}`}
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
                      className={`input-field text-sm ${errors.items?.[index]?.quantity ? "border-red-500" : ""}`}
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
                      className={`input-field text-sm ${errors.items?.[index]?.price ? "border-red-500" : ""}`}
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
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove Item"
                        aria-label="Remove Item"
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
            onClick={addItem}
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

      <div className="card p-6 bg-white shadow-sm rounded-lg border border-neutral-200">
        <label htmlFor="notes" className="label-text mb-2 block">
          Notes
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          className="input-field w-full h-24 resize-none"
          placeholder="Additional notes for the client..."
          title="Notes"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating Invoice..." : "Create Invoice"}
        </button>
      </div>
    </form>
  );
}
