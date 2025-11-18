"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import { Client } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientSchema,
  ClientFormData,
  ClientForm,
} from "@/components/clients/client-form";
import { ClientList } from "@/components/clients/client-list";
import { ClientPagination } from "@/components/clients/client-pagination";

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
          <ClientForm
            isEditing={isEditing}
            loading={loading}
            onSubmit={onSubmit}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
          />
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
          <ClientList
            clients={clients}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteClient}
            isEmpty={clients.length === 0}
          />
        </div>

        <ClientPagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages || 1}
          loading={loading}
          onPageChange={handlePageChange}
        />
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