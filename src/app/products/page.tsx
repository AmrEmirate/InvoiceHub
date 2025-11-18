"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import { Product, Category } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  ProductFormData,
  ProductForm,
} from "./product-form";
import { ProductFilter } from "./product-filter";
import { ProductTable } from "./product-table";
import { ProductPagination } from "./product-pagination";

const PRODUCTS_PER_PAGE = 10;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: products,
    loading: loadingProducts,
    pagination,
    getAll: getProducts,
    create: createProduct,
    update: updateProduct,
    remove: deleteProduct,
  } = useApi<Product, ProductFormData>("products");

  const { data: categories, getAll: getCategories } =
    useApi<Category>("categories");

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("categoryId") || "all",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      sku: "",
    },
  });

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
    };
    if (searchTerm) params.search = searchTerm;
    if (categoryFilter !== "all") params.categoryId = categoryFilter;

    getProducts(params);
  }, [getProducts, searchTerm, categoryFilter, currentPage]);

  const updateQueryParams = (params: {
    page?: number;
    search?: string;
    categoryId?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    if (params.page !== undefined) {
      if (params.page > 1) newParams.set("page", params.page.toString());
      else newParams.delete("page");
    }

    if (params.search !== undefined) {
      if (params.search) newParams.set("search", params.search);
      else newParams.delete("search");
    }

    if (params.categoryId !== undefined) {
      if (params.categoryId !== "all")
        newParams.set("categoryId", params.categoryId);
      else newParams.delete("categoryId");
    }

    router.push(`?${newParams.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateQueryParams({ page: 1, search: value });
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
    updateQueryParams({ page: 1, categoryId: value });
  };

  const handleReset = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setCurrentPage(1);
    router.push("/products");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateQueryParams({ page: newPage });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    reset({ name: "", description: "", price: 0, categoryId: "", sku: "" });
    setIsEditing(false);
    setSelectedId(null);
  };
  const handleOpenAdd = () => {
    reset({ name: "", description: "", price: 0, categoryId: "", sku: "" });
    setIsEditing(false);
    setSelectedId(null);
    setShowForm(true);
  };
  const handleOpenEdit = (product: Product) => {
    setIsEditing(true);
    setSelectedId(product.id);
    setValue("name", product.name);
    setValue("sku", product.sku);
    setValue("price", Number(product.price));
    setValue("categoryId", product.categoryId);
    setValue("description", product.description || "");
    setShowForm(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && selectedId) {
        await updateProduct(selectedId, data);
      } else {
        await createProduct(data);
      }
      handleCloseForm();

      getProducts({
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        search: searchTerm,
        categoryId: categoryFilter,
      });
    } catch (error) {}
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);

      getProducts({
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        search: searchTerm,
        categoryId: categoryFilter,
      });
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
            onClick={showForm ? handleCloseForm : handleOpenAdd}
            className="btn-primary"
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {showForm && (
          <ProductForm
            isEditing={isEditing}
            loading={loadingProducts}
            categories={categories}
            onSubmit={onSubmit}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        )}

        <ProductFilter
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          categories={categories}
          onSearchChange={handleSearch}
          onCategoryChange={handleCategoryFilter}
          onReset={handleReset}
        />

        <ProductTable
          products={products}
          loading={loadingProducts}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteProduct}
        />

        {pagination && pagination.totalPages > 1 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            loading={loadingProducts}
            onPageChange={handlePageChange}
          />
        )}

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

        <div className="card overflow-hidden">
          {loadingProducts && products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
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
                          <span className="text-neutral-600">
                            {product.sku}
                          </span>
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
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="text-accent hover:text-accent-dark text-sm font-medium"
                            >
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

              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loadingProducts}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-neutral-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage === pagination.totalPages || loadingProducts
                    }
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
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
