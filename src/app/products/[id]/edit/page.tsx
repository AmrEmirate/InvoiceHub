"use client";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ProductForm, ProductFormData } from "@/components/products/product-form";
import { useApi } from "@/hooks/use-api";
import { Category, Product } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { productSchema } from "@/components/products/product-form";
import { toast } from "sonner";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { 
    data: products, 
    item: product,
    getOne: getProduct, 
    update: updateProduct, 
    loading: loadingProduct 
  } = useApi<Product, ProductFormData>("products");
  
  const { data: categories, getAll: getCategories } = useApi<Category>("categories");



  useEffect(() => {
    getCategories();
    if (id) {
        getProduct(id);
    }
  }, [getCategories, getProduct, id]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
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
    if (product) {
      setValue("name", product.name);
      setValue("sku", product.sku);
      setValue("price", Number(product.price));
      setValue("categoryId", product.categoryId);
      setValue("description", product.description || "");
    }
  }, [product, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateProduct(id, data);
      toast.success("Product updated successfully");
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

  if (!product && loadingProduct) {
      return (
          <DashboardLayout>
              <div className="flex items-center justify-center min-h-[50vh]">
                  Loading...
              </div>
          </DashboardLayout>
      )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Edit Product
          </h1>
          <p className="text-neutral-600">
            Update product details
          </p>
        </div>

        <ProductForm
          isEditing={true}
          loading={loadingProduct}
          categories={categories}
          onSubmit={onSubmit}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
        />
      </div>
    </DashboardLayout>
  );
}
