"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import { Category } from "@/lib/types";

// --- 1. IMPORT BARU ---
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- 2. BUAT SKEMA VALIDASI ---
const categorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

function CategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: categories,
    loading,
    getAll,
    create,
    update,
    remove,
  } = useApi<Category, CategoryFormData>("categories");

  // State UI
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // --- 3. INISIALISASI REACT-HOOK-FORM ---
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // Fetch Data
  useEffect(() => {
    getAll({ search: searchTerm });
  }, [getAll, searchTerm]);

  // --- Handlers ---

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    router.push(`?${params.toString()}`);
  };

  const handleOpenAdd = () => {
    reset({ name: "" }); // Reset form
    setIsEditing(false);
    setSelectedId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (category: Category) => {
    setValue("name", category.name); // Isi form
    setIsEditing(true);
    setSelectedId(category.id);
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    reset({ name: "" });
    setIsEditing(false);
    setSelectedId(null);
  }

  // --- 4. PERBARUI SUBMIT HANDLER ---
  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && selectedId) {
        await update(selectedId, data);
      } else {
        await create(data);
      }
      handleCloseForm();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await remove(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-neutral-600">Manage product categories</p>
          </div>
          <button onClick={showForm ? handleCloseForm : handleOpenAdd} className="btn-primary">
            {showForm ? "Cancel" : "+ Add Category"}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="card p-6 bg-blue-50 border-blue-200 max-w-xl">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {isEditing ? "Edit Category" : "New Category"}
            </h2>
            {/* --- 5. HUBUNGKAN FORM --- */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="label-text">Category Name *</label>
                <input
                  type="text"
                  {...register("name")} // Gunakan register
                  className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="e.g. Services, Electronics"
                />
                {errors.name && (
                  <p className="text-danger text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary whitespace-nowrap mt-6"
                disabled={loading}
              >
                {loading ? "Saving..." : isEditing ? "Update" : "Save"}
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="card p-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="input-field w-full"
          />
        </div>

        {/* Categories List (Tidak berubah) */}
        <div className="card overflow-hidden">
          {loading && categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">
                          {category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(category)}
                            className="text-accent hover:text-accent-dark text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-danger hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">
                No categories found. Add one to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}