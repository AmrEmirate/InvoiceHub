"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import { Product, Category } from "@/lib/types";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Fetch Data dari API
  const {
    data: products,
    loading: loadingProducts,
    getAll: getProducts,
    create: createProduct,
    remove: deleteProduct,
  } = useApi<Product>("products");

  const { data: categories, getAll: getCategories } = useApi<Category>("categories");

  // State Filter & Form
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("categoryId") || "all");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "", // ID Kategori, bukan nama
    sku: "",
  });

  // 2. Fetch Kategori & Produk Awal
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (categoryFilter !== "all") params.categoryId = categoryFilter;
    getProducts(params);
  }, [getProducts, searchTerm, categoryFilter]);

  // --- Handler ---

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    if (categoryFilter !== "all") params.set("categoryId", categoryFilter);
    router.push(`?${params.toString()}`);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    const params = new URLSearchParams(searchParams);
    if (value !== "all") params.set("categoryId", value);
    else params.delete("categoryId");
    if (searchTerm) params.set("search", searchTerm);
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    router.push("/products");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.sku && newProduct.price > 0 && newProduct.categoryId) {
      try {
        await createProduct(newProduct);
        setNewProduct({ name: "", description: "", price: 0, categoryId: "", sku: "" });
        setShowAddForm(false);
      } catch (error) {
        // Error handled by hook
      }
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Products & Services
            </h1>
            <p className="text-neutral-600">
              Manage your products and services
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            {showAddForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="card p-6 bg-green-50 border-green-200">
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="input-field"
                    placeholder="Product name"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">SKU *</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sku: e.target.value })
                    }
                    className="input-field"
                    placeholder="Product SKU"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: Number.parseFloat(e.target.value),
                      })
                    }
                    className="input-field"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Category *</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        categoryId: e.target.value,
                      })
                    }
                    title="Select product category"
                    className="input-field"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      No categories found.
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="label-text">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="input-field h-20 resize-none"
                    placeholder="Product description"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={loadingProducts}
              >
                {loadingProducts ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Search</label>
              <input
                type="text"
                placeholder="Product name or SKU..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-text">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="input-field"
                title="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleReset} className="btn-secondary w-full">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="card overflow-hidden">
          {loadingProducts && products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {product.description || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-600">{product.sku}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {product.category?.name || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-accent hover:text-accent-dark text-sm font-medium">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
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
                No products found. Try adding one!
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}