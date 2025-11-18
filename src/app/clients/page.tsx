"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import { Client } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const clientSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Must be a valid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  paymentPreferences: z.string().optional(),
});
type ClientFormData = z.infer<typeof clientSchema>;

const CLIENTS_PER_PAGE = 6;

function ClientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: clients,
    loading,
    pagination,
    getAll,
    create,
    update,
    remove,
  } = useApi<Client, ClientFormData>("clients");

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentPreferences: "",
    },
  });

  useEffect(() => {
    getAll({
      search: searchTerm,
      page: currentPage,
      limit: CLIENTS_PER_PAGE,
    });
  }, [getAll, searchTerm, currentPage]);

  const updateQueryParams = (page: number, search: string) => {
    const params = new URLSearchParams(searchParams);

    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateQueryParams(1, value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateQueryParams(newPage, searchTerm);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentPreferences: "",
    });
    setIsEditing(false);
    setSelectedId(null);
  };
  const handleOpenAdd = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentPreferences: "",
    });
    setIsEditing(false);
    setSelectedId(null);
    setShowAddForm(true);
  };
  const handleOpenEdit = (client: Client) => {
    setIsEditing(true);
    setSelectedId(client.id);
    setValue("name", client.name);
    setValue("email", client.email);
    setValue("phone", client.phone || "");
    setValue("address", client.address || "");
    setValue("paymentPreferences", client.paymentPreferences || "");
    setShowAddForm(true);
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEditing && selectedId) {
        await update(selectedId, data);
      } else {
        await create(data);
      }
      handleCloseForm();

      handlePageChange(1);
    } catch (error) {}
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      await remove(id);

      getAll({
        search: searchTerm,
        page: currentPage,
        limit: CLIENTS_PER_PAGE,
      });
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
            onClick={showAddForm ? handleCloseForm : handleOpenAdd}
            className="btn-primary"
          >
            {showAddForm ? "Cancel" : "+ Add Client"}
          </button>
        </div>

        {showAddForm && (
          <div className="card p-6 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {isEditing ? "Edit Client" : "Add New Client"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Name *</label>
                  <input
                    type="text"
                    {...register("name")}
                    className={`input-field ${errors.name ? "border-red-500" : ""}`}
                    placeholder="Client name"
                  />
                  {errors.name && (
                    <p className="text-danger text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label-text">Email *</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`input-field ${errors.email ? "border-red-500" : ""}`}
                    placeholder="client@example.com"
                  />
                  {errors.email && (
                    <p className="text-danger text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label-text">Phone</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="input-field"
                    placeholder="+1-555-0000"
                  />
                </div>
                <div>
                  <label className="label-text">Address</label>
                  <input
                    type="text"
                    {...register("address")}
                    className="input-field"
                    placeholder="Client address"
                  />
                </div>
              </div>
              <div>
                <label className="label-text">Payment Preferences</label>
                <input
                  type="text"
                  {...register("paymentPreferences")}
                  className="input-field"
                  placeholder="e.g. Bank Transfer, Net 30"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Client"
                    : "Save Client"}
              </button>
            </form>
          </div>
        )}

        <div className="card p-6">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="input-field w-full"
          />
        </div>

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
                    <span className="font-medium text-foreground">
                      {client.invoices?.length || 0}
                    </span>{" "}
                    invoices
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(client)}
                    className="flex-1 btn-secondary text-sm"
                  >
                    Edit
                  </button>
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

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-neutral-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages || loading}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
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
