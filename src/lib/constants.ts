/**
 * Application Constants
 * Centralized location for all magic strings and configuration values
 */

// =============================================================================
// STORAGE KEYS
// =============================================================================

/**
 * LocalStorage keys for authentication
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  THEME: "theme",
  SIDEBAR_STATE: "sidebarState",
} as const;

// =============================================================================
// API ENDPOINTS
// =============================================================================

/**
 * API endpoint paths (relative to base URL)
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    ME: "/auth/me",
    SET_PASSWORD: "/auth/set-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE: "/auth/google",
    GOOGLE_SIGNUP: "/auth/google-signup",
  },
  // Clients
  CLIENTS: "/clients",
  // Invoices
  INVOICES: "/invoices",
  // Products
  PRODUCTS: "/products",
  // Categories
  CATEGORIES: "/categories",
  // Upload
  UPLOADS: "/uploads",
  // Dashboard
  DASHBOARD: {
    STATS: "/invoices/dashboard",
    CHART: "/invoices/chart",
  },
  // Health
  HEALTH: "/health",
} as const;

// =============================================================================
// ROUTES
// =============================================================================

/**
 * Frontend route paths
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  INVOICES: "/invoices",
  CLIENTS: "/clients",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  PROFILE: "/profile",
  AUTH_CALLBACK: "/auth/callback",
  SET_PASSWORD: "/auth/set-password",
} as const;

// =============================================================================
// API CONFIGURATION
// =============================================================================

/**
 * API configuration values
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// =============================================================================
// PAGINATION
// =============================================================================

/**
 * Default pagination values
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 20, 50, 100] as const,
} as const;

// =============================================================================
// DATE FORMATS
// =============================================================================

/**
 * Date format strings
 */
export const DATE_FORMATS = {
  DISPLAY: "dd MMM yyyy",
  DISPLAY_WITH_TIME: "dd MMM yyyy HH:mm",
  API: "yyyy-MM-dd",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

// =============================================================================
// CURRENCY
// =============================================================================

/**
 * Currency configuration
 */
export const CURRENCY = {
  DEFAULT: "IDR",
  LOCALE: "id-ID",
} as const;

// =============================================================================
// INVOICE STATUS
// =============================================================================

/**
 * Invoice status values
 */
export const INVOICE_STATUS = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
} as const;

export type InvoiceStatus =
  (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

/**
 * Invoice status colors for UI
 */
export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: "gray",
  SENT: "blue",
  PENDING: "yellow",
  PAID: "green",
  OVERDUE: "red",
  CANCELLED: "gray",
} as const;

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validation constraints
 */
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  COMPANY: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 200,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
} as const;

// =============================================================================
// ERROR MESSAGES
// =============================================================================

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================

/**
 * Common success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful!",
  LOGOUT: "Logged out successfully.",
  REGISTER: "Registration successful! Please check your email.",
  PASSWORD_RESET: "Password reset email sent.",
  PASSWORD_CHANGED: "Password changed successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
  CREATED: "Created successfully.",
  UPDATED: "Updated successfully.",
  DELETED: "Deleted successfully.",
} as const;
