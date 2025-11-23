"use client";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useApi } from "@/hooks/use-api";
import { Category } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CreateCategoryPage() {
  const router = useRouter();
  const { create: createCategory, loading } = useApi<Category, CategoryFormData>("categories");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await createCategory(data);
      toast.success("Category created successfully");
      router.push("/categories");
    } catch (error: any) {
      const message = error.response?.data?.message || "";
      if (message.toLowerCase().includes("name")) {
        setError("name", {
          type: "manual",
          message: "This category name is already in use",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Add New Category
          </h1>
          <p className="text-neutral-600">
            Create a new product category
          </p>
        </div>

        <div className="card p-6 bg-white border border-neutral-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-text">Category Name *</label>
              <input
                type="text"
                {...register("name")}
                className={`input-field w-full ${errors.name ? "border-red-500" : ""}`}
                placeholder="e.g. Services, Electronics"
              />
              {errors.name && (
                <p className="text-danger text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
