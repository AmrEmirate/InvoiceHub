export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  bankAccount?: string;
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentPreferences?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number; // BE mengirim Decimal, tapi JSON menjadikannya string/number. Kita treat as number di FE
  sku: string;
  categoryId: string;
  category?: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  productId?: string;
  product?: Product;
  invoiceId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  notes?: string;
  totalAmount: number;
  isRecurring: boolean;
  recurrenceInterval?: string;
  userId: string;
  clientId: string;
  client?: Client;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

// Tipe Response Standar dari BE
export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ... (setelah interface ApiResponse)

// Tipe Paginasi
export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ChartDataPoint {
  month: string; // "2025-01"
  revenue: number;
}