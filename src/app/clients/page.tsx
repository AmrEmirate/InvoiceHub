"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  invoicesCount: number
}

function ClientsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1-555-0001",
      address: "123 Business Ave, NY",
      invoicesCount: 5,
    },
    {
      id: "2",
      name: "Tech Innovations",
      email: "hello@techino.com",
      phone: "+1-555-0002",
      address: "456 Tech Park, SF",
      invoicesCount: 3,
    },
    {
      id: "3",
      name: "Global Solutions Ltd",
      email: "info@globalsol.com",
      phone: "+44-201-555-0003",
      address: "789 Global St, London",
      invoicesCount: 8,
    },
  ])

  const [filteredClients, setFilteredClients] = useState<Client[]>(clients)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    let filtered = clients
    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    setFilteredClients(filtered)
  }, [searchTerm, clients])

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

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()
    if (newClient.name && newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        ...newClient,
        invoicesCount: 0,
      }
      setClients([...clients, client])
      setNewClient({ name: "", email: "", phone: "", address: "" })
      setShowAddForm(false)
      alert("Client added successfully!")
    }
  }

  const handleDeleteClient = (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((c) => c.id !== id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-neutral-600">Manage your client information</p>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
            {showAddForm ? "Cancel" : "+ Add Client"}
          </button>
        </div>

        {/* Add Client Form */}
        {showAddForm && (
          <div className="card p-6 bg-blue-50 border-blue-200">
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Name *</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="input-field"
                    placeholder="Client name"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Email *</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="input-field"
                    placeholder="client@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Phone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="input-field"
                    placeholder="+1-555-0000"
                  />
                </div>
                <div>
                  <label className="label-text">Address</label>
                  <input
                    type="text"
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    className="input-field"
                    placeholder="Client address"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Save Client
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="card p-6">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="input-field w-full"
          />
        </div>

        {/* Clients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div key={client.id} className="card p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-foreground mb-2">{client.name}</h3>
                <div className="space-y-2 text-sm text-neutral-600 mb-4">
                  <p>📧 {client.email}</p>
                  <p>📞 {client.phone}</p>
                  <p>📍 {client.address}</p>
                </div>
                <div className="py-3 border-t border-neutral-200 mb-4">
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium text-foreground">{client.invoicesCount}</span> invoices
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 btn-secondary text-sm">Edit</button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="flex-1 px-4 py-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-600">No clients found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientsContent />
    </Suspense>
  )
}
