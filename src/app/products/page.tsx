"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import { Product, Category } from "@/lib/types";
import { ProductFilter } from "@/components/products/product-filter";
import { ProductTable } from "@/components/products/product-table";
import { ProductPagination } from "@/components/products/product-pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const PRODUCTS_PER_PAGE = 10;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: products,
    loading: loadingProducts,
    pagination,
    getAll: getProducts,
    remove: deleteProduct,
  } = useApi<Product>("products");

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

  const handleOpenAdd = () => {
    router.push("/products/create");
  };

  const handleOpenEdit = (product: Product) => {
    router.push(`/products/${product.id}/edit`);
  };

  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productId: string | null }>({  
    isOpen: false,
    productId: null,
  });

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, productId: id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.productId) return;
    
    await deleteProduct(deleteDialog.productId);
    setDeleteDialog({ isOpen: false, productId: null });

    getProducts({
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
      search: searchTerm,
      categoryId: categoryFilter,
    });
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
            onClick={handleOpenAdd}
            className="btn-primary"
          >
            + Add Product
          </button>
        </div>

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
          onDelete={handleDeleteClick}
        />

        {pagination && pagination.totalPages > 1 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            loading={loadingProducts}
            onPageChange={handlePageChange}
          />
        )}

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, productId: null })}
          onConfirm={handleConfirmDelete}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
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
