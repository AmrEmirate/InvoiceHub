"use client"

import type React from "react"

import { useState } from "react"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

interface InvoiceFormProps {
  onSubmit: (data: any) => void
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "USD",
    notes: "",
  })

  const [items, setItems] = useState<InvoiceItem[]>([{ id: "1", description: "", quantity: 1, price: 0 }])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required"
    if (!formData.clientEmail.trim()) newErrors.clientEmail = "Client email is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"

    if (items.some((item) => !item.description.trim())) {
      newErrors.items = "All items must have a description"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now().toString(), description: "", quantity: 1, price: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({
        ...formData,
        items,
        total,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Information */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Client Name *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter client name"
            />
            {errors.clientName && <p className="text-danger text-sm mt-1">{errors.clientName}</p>}
          </div>
          <div>
            <label className="label-text">Client Email *</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleInputChange}
              className="input-field"
              placeholder="client@example.com"
            />
            {errors.clientEmail && <p className="text-danger text-sm mt-1">{errors.clientEmail}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="label-text">Client Address</label>
            <input
              type="text"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter client address"
            />
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label-text">Invoice Date</label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleInputChange}
              className="input-field"
              disabled
            />
          </div>
          <div>
            <label className="label-text">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="input-field"
            />
            {errors.dueDate && <p className="text-danger text-sm mt-1">{errors.dueDate}</p>}
          </div>
          <div>
            <label className="label-text">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
              className="input-field"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Items</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="label-text text-xs">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  className="input-field"
                  placeholder="Item description"
                />
              </div>
              <div className="w-24">
                <label className="label-text text-xs">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", Number.parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
              <div className="w-32">
                <label className="label-text text-xs">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(item.id, "price", Number.parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>
              <div className="w-24 text-right">
                <label className="label-text text-xs">Total</label>
                <p className="text-lg font-semibold text-foreground">${(item.quantity * item.price).toFixed(2)}</p>
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-danger hover:text-red-700 font-bold pb-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {errors.items && <p className="text-danger text-sm">{errors.items}</p>}
        </div>

        <button type="button" onClick={addItem} className="mt-4 btn-secondary">
          + Add Item
        </button>
      </div>

      {/* Summary */}
      <div className="card p-6 bg-neutral-50">
        <div className="flex justify-end mb-4">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Tax (0%):</span>
              <span>$0.00</span>
            </div>
            <div className="border-t border-neutral-300 pt-2 flex justify-between text-lg font-bold text-foreground">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card p-6">
        <label className="label-text">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="input-field h-24 resize-none"
          placeholder="Add any additional notes for the invoice..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3">
        <button type="submit" className="btn-primary flex-1">
          Create Invoice
        </button>
        <button type="button" className="btn-secondary flex-1">
          Save as Draft
        </button>
      </div>
    </form>
  )
}
