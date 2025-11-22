"use client";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ClientForm, ClientFormData } from "@/components/clients/client-form";
import { useApi } from "@/hooks/use-api";
import { Client } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { clientSchema } from "@/components/clients/client-form";
import { toast } from "sonner";

export default function CreateClientPage() {
  const router = useRouter();
  const { create: createClient, loading } = useApi<Client, ClientFormData>("clients");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentPreferences: "",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      await createClient(data);
      toast.success("Client created successfully");
      router.push("/clients");
    } catch (error) {
      // Error is handled by useApi
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Add New Client
          </h1>
          <p className="text-neutral-600">
            Fill in the details below to add a new client
          </p>
        </div>

        <ClientForm
          isEditing={false}
          loading={loading}
          onSubmit={onSubmit}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
        />
      </div>
    </DashboardLayout>
  );
}
