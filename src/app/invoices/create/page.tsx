"use client";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import InvoiceForm from "@/components/invoices/invoice-form";

export default function CreateInvoicePage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Invoice</h1>
          <p className="text-neutral-600">Fill in the details below to generate a new invoice</p>
        </div>

        <InvoiceForm />
      </div>
    </DashboardLayout>
  );
}