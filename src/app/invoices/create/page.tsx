"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import InvoiceForm from "@/components/invoices/invoice-form"

export default function CreateInvoicePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)

  const handleSubmit = (data: any) => {
    setInvoiceData(data)
    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    try {
      // Here you would call your API to save the invoice
      // const response = await apiClient.post('/invoices', invoiceData)

      // Demo: Show success and redirect
      alert("Invoice created successfully!")
      router.push("/invoices")
    } catch (error) {
      alert("Failed to create invoice")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Invoice</h1>
          <p className="text-neutral-600">Create a new invoice for your client</p>
        </div>

        <InvoiceForm onSubmit={handleSubmit} />

        {/* Confirmation Modal */}
        {showConfirmation && invoiceData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Confirm Invoice</h2>
              <p className="text-neutral-600 mb-6">
                Are you sure you want to create this invoice? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmation(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleConfirm} className="btn-primary flex-1">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
