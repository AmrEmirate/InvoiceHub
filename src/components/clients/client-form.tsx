import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const clientSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Must be a valid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  paymentPreferences: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  isEditing: boolean;
  loading: boolean;
  onSubmit: (data: ClientFormData) => Promise<void>;
  register: ReturnType<typeof useForm<ClientFormData>>["register"];
  handleSubmit: ReturnType<typeof useForm<ClientFormData>>["handleSubmit"];
  errors: ReturnType<typeof useForm<ClientFormData>>["formState"]["errors"];
}

export function ClientForm({
  isEditing,
  loading,
  onSubmit,
  register,
  handleSubmit,
  errors,
}: ClientFormProps) {
  return (
    <div className="card p-6 bg-blue-50 border-blue-200">
      <h2 className="text-xl font-bold text-foreground mb-4">
        {isEditing ? "Edit Client" : "Add New Client"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Name *</label>
            <input
              type="text"
              {...register("name")}
              className={`input-field ${errors.name ? "border-red-500" : ""}`}
              placeholder="Client name"
            />
            {errors.name && (
              <p className="text-danger text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="label-text">Email *</label>
            <input
              type="email"
              {...register("email")}
              className={`input-field ${errors.email ? "border-red-500" : ""}`}
              placeholder="client@example.com"
            />
            {errors.email && (
              <p className="text-danger text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="label-text">Phone</label>
            <input
              type="tel"
              {...register("phone")}
              className="input-field"
              placeholder="+1-555-0000"
            />
          </div>
          <div>
            <label className="label-text">Address</label>
            <input
              type="text"
              {...register("address")}
              className="input-field"
              placeholder="Client address"
            />
          </div>
        </div>
        <div>
          <label className="label-text">Payment Preferences</label>
          <input
            type="text"
            {...register("paymentPreferences")}
            className="input-field"
            placeholder="e.g. Bank Transfer, Net 30"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : isEditing ? "Update Client" : "Save Client"}
        </button>
      </form>
    </div>
  );
}
