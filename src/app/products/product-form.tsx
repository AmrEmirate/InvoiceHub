import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from "@/lib/types";

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  sku: z.string().min(1, "SKU is required"),
  price: z.preprocess(
    (a) => parseFloat(a as string),
    z.number().min(0.01, "Price must be greater than 0"),
  ),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  isEditing: boolean;
  loading: boolean;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  register: ReturnType<typeof useForm<ProductFormData>>["register"];
  handleSubmit: ReturnType<typeof useForm<ProductFormData>>["handleSubmit"];
  errors: ReturnType<typeof useForm<ProductFormData>>["formState"]["errors"];
}

export function ProductForm({
  isEditing,
  loading,
  categories,
  onSubmit,
  register,
  handleSubmit,
  errors,
}: ProductFormProps) {
  return (
    <div className="card p-6 bg-green-50 border-green-200">
      <h2 className="text-xl font-bold text-foreground mb-4">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Name *</label>
            <input
              type="text"
              {...register("name")}
              className={`input-field ${errors.name ? "border-red-500" : ""}`}
              placeholder="Product name"
            />
            {errors.name && (
              <p className="text-danger text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="label-text">SKU *</label>
            <input
              type="text"
              {...register("sku")}
              className={`input-field ${errors.sku ? "border-red-500" : ""}`}
              placeholder="Product SKU"
            />
            {errors.sku && (
              <p className="text-danger text-sm mt-1">{errors.sku.message}</p>
            )}
          </div>
          <div>
            <label className="label-text">Price *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              {...register("price")}
              className={`input-field ${errors.price ? "border-red-500" : ""}`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-danger text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label className="label-text">Category *</label>
            <select
              {...register("categoryId")}
              title="Select product category"
              className={`input-field ${
                errors.categoryId ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? (
              <p className="text-danger text-sm mt-1">
                {errors.categoryId.message}
              </p>
            ) : (
              categories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No categories found.
                </p>
              )
            )}
          </div>
          <div className="md:col-span-2">
            <label className="label-text">Description</label>
            <textarea
              {...register("description")}
              className="input-field h-20 resize-none"
              placeholder="Product description"
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
        </button>
      </form>
    </div>
  );
}
