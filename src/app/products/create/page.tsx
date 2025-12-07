"use client";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  ProductForm,
  ProductFormData,
} from "@/components/products/product-form";
import { useApi } from "@/hooks/use-api";
import { Category, Product } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { productSchema } from "@/components/products/product-form";
import { toast } from "sonner";

export default function CreateProductPage() {
  const router = useRouter();
  const { create: createProduct, loading: loadingProduct } = useApi<
    Product,
    ProductFormData
  >("products");
  const { data: categories, getAll: getCategories } =
    useApi<Category>("categories");

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const {
    register,
    handleSubmit,
    setError,
    control,
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

  const onSubmit = async (data: ProductFormData) => {
    try {
      await createProduct(data);
      toast.success("Product created successfully");
      router.push("/products");
    } catch (error: any) {
      const message = error.response?.data?.message || "";
      if (message.toLowerCase().includes("sku")) {
        setError("sku", {
          type: "manual",
          message: "This SKU is already in use",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Add New Product
          </h1>
          <p className="text-neutral-600">
            Fill in the details below to add a new product
          </p>
        </div>

        <ProductForm
          isEditing={false}
          loading={loadingProduct}
          categories={categories}
          onSubmit={onSubmit}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          control={control}
        />
      </div>
    </DashboardLayout>
  );
}
