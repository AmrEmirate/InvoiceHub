"use client";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ClientForm, ClientFormData } from "@/components/clients/client-form";
import { useApi } from "@/hooks/use-api";
import { Client } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { clientSchema } from "@/components/clients/client-form";
import { toast } from "sonner";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { 
    data: clients, 
    item: client,
    getOne: getClient, 
    update: updateClient, 
    loading 
  } = useApi<Client, ClientFormData>("clients");

  useEffect(() => {
    if (id) {
        getClient(id);
    }
  }, [getClient, id]);

  const {
    register,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    if (client) {
      setValue("name", client.name);
      setValue("email", client.email);
      setValue("phone", client.phone || "");
      setValue("address", client.address || "");
      setValue("paymentPreferences", client.paymentPreferences || "");
    }
  }, [client, setValue]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      await updateClient(id, data);
      toast.success("Client updated successfully");
      router.push("/clients");
    } catch (error) {
      // Error is handled by useApi
    }
  };

  if (!client && loading) {
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
            Edit Client
          </h1>
          <p className="text-neutral-600">
            Update client details
          </p>
        </div>

        <ClientForm
          isEditing={true}
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
