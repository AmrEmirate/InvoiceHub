import { Client, InvoiceStatus, Product } from "@/lib/types";
import { useForm } from "react-hook-form";
import { InvoiceFormData } from "./invoice-form-schema";

interface InvoiceDetailsProps {
  clients: Client[];
  isRecurring: boolean;
  register: ReturnType<typeof useForm<InvoiceFormData>>["register"];
  errors: ReturnType<typeof useForm<InvoiceFormData>>["formState"]["errors"];
}

export function InvoiceDetails({
  clients,
  isRecurring,
  register,
  errors,
}: InvoiceDetailsProps) {
  return (
    <div className="card p-6 bg-white shadow-sm rounded-lg border border-neutral-200">
      <h3 className="text-lg font-bold mb-4 text-foreground">
        Invoice Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label htmlFor="clientId" className="label-text">
            Client *
          </label>
          <select
            id="clientId"
            {...register("clientId")}
            className={`input-field ${errors.clientId ? "border-red-500" : ""}`}
            title="Select Client"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-danger text-sm mt-1">
              {errors.clientId.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="invoiceNumber" className="label-text">
            Invoice Number *
          </label>
          <input
            id="invoiceNumber"
            type="text"
            {...register("invoiceNumber")}
            className={`input-field bg-gray-100 cursor-not-allowed ${
              errors.invoiceNumber ? "border-red-500" : ""
            }`}
            placeholder="Auto-generated"
            readOnly
            disabled
            title="Invoice Number (Auto-generated)"
          />
          {errors.invoiceNumber && (
            <p className="text-danger text-sm mt-1">
              {errors.invoiceNumber.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dueDate" className="label-text">
            Due Date {!isRecurring && "*"}
          </label>
          <input
            id="dueDate"
            type="date"
            {...register("dueDate")}
            className={`input-field ${errors.dueDate ? "border-red-500" : ""} ${
              isRecurring ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
            }`}
            title="Due Date"
            disabled={isRecurring}
          />
          {isRecurring ? (
            <p className="text-gray-500 text-xs mt-1">
              Due date otomatis dihitung dari Batas Pembayaran
            </p>
          ) : (
            errors.dueDate && (
              <p className="text-danger text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <div>
          <label htmlFor="status" className="label-text">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="input-field"
            title="Invoice Status"
          >
            {Object.values(InvoiceStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center h-full pt-6">
          <label
            htmlFor="isRecurring"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              id="isRecurring"
              type="checkbox"
              {...register("isRecurring")}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              title="Recurring Invoice Checkbox"
            />
            <span className="text-sm font-medium text-gray-700">
              Recurring Invoice?
            </span>
          </label>
        </div>

        {isRecurring && (
          <div>
            <label htmlFor="recurrenceInterval" className="label-text">
              Interval
            </label>
            <select
              id="recurrenceInterval"
              {...register("recurrenceInterval")}
              className="input-field"
              title="Recurrence Interval"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
      </div>

      {isRecurring && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label htmlFor="recurrenceDay" className="label-text">
              Tanggal Recurring (1-31) *
            </label>
            <select
              id="recurrenceDay"
              {...register("recurrenceDay")}
              className={`input-field ${
                errors.recurrenceDay ? "border-red-500" : ""
              }`}
              title="Tanggal invoice di-generate setiap bulan"
            >
              <option value="">-- Pilih Tanggal --</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  Tanggal {day}
                </option>
              ))}
            </select>
            {errors.recurrenceDay && (
              <p className="text-danger text-sm mt-1">
                {errors.recurrenceDay.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="paymentTermDays" className="label-text">
              Batas Pembayaran (Hari) *
            </label>
            <select
              id="paymentTermDays"
              {...register("paymentTermDays")}
              className={`input-field ${
                errors.paymentTermDays ? "border-red-500" : ""
              }`}
              title="Berapa hari setelah invoice dibuat untuk jatuh tempo"
            >
              <option value="">-- Pilih Batas --</option>
              <option value="7">7 Hari</option>
              <option value="14">14 Hari</option>
              <option value="21">21 Hari</option>
              <option value="30">30 Hari</option>
              <option value="45">45 Hari</option>
              <option value="60">60 Hari</option>
              <option value="90">90 Hari</option>
            </select>
            {errors.paymentTermDays && (
              <p className="text-danger text-sm mt-1">
                {errors.paymentTermDays.message}
              </p>
            )}
          </div>

          <div className="flex items-center h-full pt-6">
            <label
              htmlFor="autoSendEmail"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                id="autoSendEmail"
                type="checkbox"
                {...register("autoSendEmail")}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                title="Auto Send Email"
              />
              <span className="text-sm font-medium text-gray-700">
                Auto Send Email
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
