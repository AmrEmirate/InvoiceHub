"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/use-api";
import { Client, Product, InvoiceStatus } from "@/lib/types";
import { toast } from "sonner";
import {
  invoiceSchema,
  InvoiceFormData,
  defaultItem,
} from "./invoice-form-schema";
import { InvoiceDetails } from "./invoice-details";
import { InvoiceItemsTable } from "./invoice-items-table";

export default function InvoiceForm() {
  const router = useRouter();

  const { data: clients, getAll: getClients } = useApi<Client>("clients");
  const { data: products, getAll: getProducts } = useApi<Product>("products");
  const { create: createInvoice, loading } = useApi<any, InvoiceFormData>(
    "invoices",
  );

  useEffect(() => {
    getClients();
    getProducts();
  }, [getClients, getProducts]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, "0")}`,
      dueDate: "",
      status: InvoiceStatus.DRAFT,
      notes: "",
      isRecurring: false,
      recurrenceInterval: "monthly",
      items: [defaultItem],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const isRecurring = watch("isRecurring");

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      setValue(`items.${index}.description`, selectedProduct.name);
      setValue(`items.${index}.price`, Number(selectedProduct.price));
    }
  };

  const addItem = () => {
    append(defaultItem);
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    const cleanData = {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        productId: item.productId || undefined,
      })),
    };

    try {
      await createInvoice(cleanData);
      toast.success("Invoice created successfully!");
      router.push("/invoices");
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <InvoiceDetails
        clients={clients}
        isRecurring={isRecurring}
        register={register}
        errors={errors}
      />

      <InvoiceItemsTable
        fields={fields}
        products={products}
        control={control}
        register={register}
        errors={errors}
        onProductSelect={handleProductSelect}
        onAddItem={addItem}
        onRemoveItem={removeItem}
      />

      <div className="card p-6 bg-white shadow-sm rounded-lg border border-neutral-200">
        <label htmlFor="notes" className="label-text mb-2 block">
          Notes
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          className="input-field w-full h-24 resize-none"
          placeholder="Additional notes for the client..."
          title="Notes"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating Invoice..." : "Create Invoice"}
        </button>
      </div>
    </form>
  );
}
