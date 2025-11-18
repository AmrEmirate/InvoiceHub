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
} from "@/components/products/product-form";
import { ProductFilter } from "@/components/products/product-filter";
import { ProductTable } from "@/components/products/product-table";
import { ProductPagination } from "@/components/products/product-pagination";

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
