"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import { Category } from "@/lib/types";

function CategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Gunakan hook useApi untuk endpoint "categories"
  const {
    data: categories,
    loading,
    getAll,
    create,
    update,
    remove,
  } = useApi<Category>("categories");

  // State UI
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // State Form
  const [formData, setFormData] = useState({
    name: "",
  });

  // 2. Fetch Data
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
    setFormData({ name: "" });
    setIsEditing(false);
    setSelectedId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (category: Category) => {
    setFormData({ name: category.name });
    setIsEditing(true);
    setSelectedId(category.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (isEditing && selectedId) {
        await update(selectedId, formData);
      } else {
        await create(formData);
      }
      setShowForm(false);
      setFormData({ name: "" });
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
          <button onClick={handleOpenAdd} className="btn-primary">
            {showForm ? "Cancel" : "+ Add Category"}
          </button>
        </div>

        {/* Form Section (Muncul saat Add/Edit diklik) */}
        {showForm && (
          <div className="card p-6 bg-blue-50 border-blue-200 max-w-xl">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {isEditing ? "Edit Category" : "New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="label-text">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field w-full"
                  placeholder="e.g. Services, Electronics"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary whitespace-nowrap"
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

        {/* Categories List */}
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