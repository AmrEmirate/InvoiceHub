"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api"; // Gunakan hook API kita
import { Client } from "@/lib/types"; // Gunakan tipe data yang sinkron dengan BE

function ClientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Ganti mock state dengan useApi
  const { data: clients, loading, getAll, create, remove } = useApi<Client>("clients");

  // State untuk pencarian dan form UI
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State untuk form tambah client baru
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentPreferences: "", // Menyesuaikan dengan schema DB
  });

  // 2. Ambil data dari API saat komponen dimuat atau pencarian berubah
  useEffect(() => {
    // Panggil API dengan parameter search jika ada
    getAll({ search: searchTerm });
  }, [getAll, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.email) {
      try {
        // Panggil API create
        await create(newClient);
        
        // Reset form
        setNewClient({ name: "", email: "", phone: "", address: "", paymentPreferences: "" });
        setShowAddForm(false);
        
        // Data akan otomatis refresh karena create() di hook memperbarui state lokal
      } catch (error) {
        // Error sudah ditangani oleh hook (toast)
      }
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      await remove(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-neutral-600">Manage your client information</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            {showAddForm ? "Cancel" : "+ Add Client"}
          </button>
        </div>

        {/* Add Client Form - Mempertahankan desain asli */}
        {showAddForm && (
          <div className="card p-6 bg-blue-50 border-blue-200">
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Name *</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewClient({ ...newClient, phone: e.target.value })
                    }
                    className="input-field"
                    placeholder="+1-555-0000"
                  />
                </div>
                <div>
                  <label className="label-text">Address</label>
                  <input
                    type="text"
                    value={newClient.address}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: e.target.value })
                    }
                    className="input-field"
                    placeholder="Client address"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Saving..." : "Save Client"}
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

        {/* Clients List - Mempertahankan desain Grid/Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && clients.length === 0 ? (
             <div className="col-span-full text-center py-12">
               <p className="text-neutral-600">Loading clients...</p>
             </div>
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <div
                key={client.id}
                className="card p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {client.name}
                </h3>
                <div className="space-y-2 text-sm text-neutral-600 mb-4">
                  <p>📧 {client.email}</p>
                  <p>📞 {client.phone || "-"}</p>
                  <p>📍 {client.address || "-"}</p>
                </div>
                <div className="py-3 border-t border-neutral-200 mb-4">
                  <p className="text-sm text-neutral-600">
                    {/* Backend kita belum mengirim count invoice, jadi kita default ke 0 atau perlu update BE */}
                    <span className="font-medium text-foreground">0</span>{" "}
                    invoices
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
  );
}

export default function ClientsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ClientsContent />
    </Suspense>
  );
}