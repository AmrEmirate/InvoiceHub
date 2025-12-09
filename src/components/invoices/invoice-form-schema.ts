import { InvoiceStatus } from "@/lib/types";
import * as z from "zod";

const invoiceItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(1, "Qty must be at least 1")
  ),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Price cannot be negative")
  ),
});

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.nativeEnum(InvoiceStatus),
  notes: z.string().optional(),
  isRecurring: z.boolean(),
  recurrenceInterval: z.string(),
  recurrenceDay: z.preprocess(
    (val) =>
      val === "" || val === undefined ? undefined : parseInt(val as string),
    z.number().min(1).max(31).optional()
  ),
  paymentTermDays: z.preprocess(
    (val) =>
      val === "" || val === undefined ? undefined : parseInt(val as string),
    z.number().min(1).optional()
  ),
  autoSendEmail: z.boolean(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceItemData = z.infer<typeof invoiceItemSchema>;

export const defaultItem: InvoiceItemData = {
  productId: "",
  description: "",
  quantity: 1,
  price: 0,
};
