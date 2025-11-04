"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  amount: number
  status: "Draft" | "Sent" | "Paid" | "Overdue"
  dueDate: string
  createdAt: string
}

function InvoicesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      clientName: "Acme Corporation",
      amount: 5000,
      status: "Paid",
      dueDate: "2024-12-15",
      createdAt: "2024-11-15",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      clientName: "Tech Innovations",
      amount: 3500,
      status: "Pending",
      dueDate: "2024-12-20",
      createdAt: "2024-11-20",
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      clientName: "Global Solutions Ltd",
      amount: 8200,
      status: "Sent",
      dueDate: "2024-12-10",
      createdAt: "2024-11-10",
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      clientName: "Creative Agency",
      amount: 4500,
      status: "Overdue",
      dueDate: "2024-10-30",
      createdAt: "2024-10-01",
    },
  ])

  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    let filtered = invoices

    if (searchTerm) {
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((inv) => inv.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [searchTerm, statusFilter, invoices])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    const params = new URLSearchParams(searchParams)
    if (value !== "all") {
      params.set("status", value)
    } else {
      params.delete("status")
    }
    router.push(`?${params.toString()}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700"
      case "Pending":
        return "bg-blue-50 text-blue-700"
      case "Sent":
        return "bg-yellow-50 text-yellow-700"
      case "Overdue":
        return "bg-red-50 text-red-700"
      default:
        return "bg-neutral-50 text-neutral-700"
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setStatusFilter("all")
    router.push("/invoices")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-neutral-600">Manage and track all your invoices</p>
          </div>
          <Link href="/invoices/create">
            <button className="btn-primary">Create Invoice</button>
          </Link>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Search</label>
              <input
                type="text"
                placeholder="Invoice number or client..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-text">Status</label>
              <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} className="input-field">
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleReset} className="btn-secondary w-full">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="card overflow-hidden">
          {filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoice #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Due Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-600">{invoice.clientName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">${invoice.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-600">{invoice.dueDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-accent hover:text-accent-dark font-medium text-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">No invoices found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <InvoicesContent />
    </Suspense>
  )
}
