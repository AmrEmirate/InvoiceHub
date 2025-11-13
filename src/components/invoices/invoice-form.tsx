"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/use-api";
import { Client, Product, InvoiceStatus } from "@/lib/types";
import { toast } from "sonner";

export default function InvoiceForm() {
  const router = useRouter();

  // 1. Fetch Data Pendukung (Clients & Products)
  const { data: clients, getAll: getClients } = useApi<Client>("clients");
  const { data: products, getAll: getProducts } = useApi<Product>("products");
  const { create: createInvoice, loading } = useApi("invoices");

  useEffect(() => {
    getClients();
    getProducts();
  }, [getClients, getProducts]);

  // 2. State Form Utama
  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, "0")}`,
    dueDate: "",
    status: InvoiceStatus.DRAFT,
    notes: "",
    isRecurring: false,
    recurrenceInterval: "monthly",
  });

  // 3. State Items (Array Dinamis)
  const [items, setItems] = useState([
    { productId: "", description: "", quantity: 1, price: 0 },
  ]);

  // --- Handlers Form Utama ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // --- Handlers Item ---
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };

    // Logika Auto-fill Produk
    if (field === "productId") {
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        item.description = selectedProduct.name;
        item.price = Number(selectedProduct.price);
      }
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", description: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Hitung Total
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const cleanItems = items.map((item) => ({
      ...item,
      productId: item.productId || undefined,
    }));

    const payload = {
      ...formData,
      items: cleanItems,
    };

    try {
      await createInvoice(payload);
      toast.success("Invoice created successfully!");
      router.push("/invoices");
    } catch (error) {
      // Error ditangani hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informasi Dasar */}
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
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              className="input-field"
              required
              title="Select Client"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="invoiceNumber" className="label-text">
              Invoice Number *
            </label>
            <input
              id="invoiceNumber"
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleInputChange}
              className="input-field"
              placeholder="INV-001"
              required
              title="Invoice Number"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="label-text">
              Due Date *
            </label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="input-field"
              required
              title="Due Date"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label htmlFor="status" className="label-text">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
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
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                title="Recurring Invoice Checkbox"
              />
              <span className="text-sm font-medium text-gray-700">
                Recurring Invoice?
              </span>
            </label>
          </div>

          {formData.isRecurring && (
            <div>
              <label htmlFor="recurrenceInterval" className="label-text">
                Interval
              </label>
              <select
                id="recurrenceInterval"
                name="recurrenceInterval"
                value={formData.recurrenceInterval}
                onChange={handleInputChange}
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

      {/* Item Invoice */}
      <div className="card p-6 bg-white shadow-sm rounded-lg border border-neutral-200">
        <h3 className="text-lg font-bold mb-4 text-foreground">Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-left text-sm font-medium text-neutral-600">
              <tr>
                <th className="p-3 w-1/4">Product (Auto-fill)</th>
                <th className="p-3 w-1/3">Description *</th>
                <th className="p-3 w-24">Qty</th>
                <th className="p-3 w-32">Price</th>
                <th className="p-3 w-32">Total</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="p-3">
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
                      className="input-field text-sm"
                      aria-label="Select Product"
                      title="Select Product"
                    >
                      <option value="">Select Product...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      className="input-field text-sm"
                      placeholder="Item description"
                      aria-label="Item Description"
                      title="Item Description"
                      required
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="input-field text-sm"
                      placeholder="1"
                      aria-label="Quantity"
                      title="Quantity"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="input-field text-sm"
                      placeholder="0.00"
                      aria-label="Price"
                      title="Price"
                    />
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    {items.length > 1 && (
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

        {/* Total Section */}
        <div className="mt-8 border-t pt-4 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Grand Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card p-6 bg-white shadow-sm rounded-lg border border-neutral-200">
        <label htmlFor="notes" className="label-text mb-2 block">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="input-field w-full h-24 resize-none"
          placeholder="Additional notes for the client..."
          title="Notes"
        />
      </div>

      {/* Action Buttons */}
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