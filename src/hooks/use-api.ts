import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import apiHelper from "@/lib/apiHelper";
import { ApiResponse } from "@/lib/types";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/lib/constants";

/**
 * Pagination metadata from API response
 */
export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

/**
 * API response with pagination
 */
interface PaginatedApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
  };
}

/**
 * Base entity with ID
 */
interface BaseEntity {
  id: string;
}

/**
 * Query parameters for API requests
 */
interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Axios error response type
 */
interface ApiErrorResponse {
  message?: string;
  code?: string;
}

/**
 * Extract error message from Axios error
 */
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

/**
 * Generic API hook for CRUD operations
 *
 * @template T - The entity type
 * @template U - The create/update payload type (defaults to Partial<T>)
 *
 * @example
 * ```tsx
 * const { data, loading, getAll, create } = useApi<Product>('/products');
 * ```
 */
export function useApi<T extends BaseEntity, U = Partial<T>>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  /**
   * Fetch all items with optional pagination and filters
   */
  const getAll = useCallback(
    async (params?: QueryParams): Promise<T[] | undefined> => {
      setLoading(true);
      try {
        const res = await apiHelper.get<
          ApiResponse<T[] | PaginatedApiResponse<T>>
        >(endpoint, { params });

        const responseData = res.data.data;

        // Handle paginated response (nested data structure)
        if (
          responseData &&
          typeof responseData === "object" &&
          "meta" in responseData &&
          "data" in responseData
        ) {
          const paginatedData = responseData as PaginatedApiResponse<T>;
          setData(paginatedData.data);
          setPagination({
            totalItems: paginatedData.meta.total,
            totalPages: paginatedData.meta.totalPages,
            currentPage: paginatedData.meta.page,
          });
          return paginatedData.data;
        }

        // Handle paginated response (flat structure with meta in response)
        if (res.data.meta) {
          setData(responseData as T[]);
          setPagination({
            totalItems: res.data.meta.total,
            totalPages: res.data.meta.totalPages,
            currentPage: res.data.meta.page,
          });
          return responseData as T[];
        }

        // Handle non-paginated response
        setData(responseData as T[]);
        setPagination(null);
        return responseData as T[];
      } catch (error: unknown) {
        toast.error(`Failed to fetch data from ${endpoint}`);
        setData([]);
        setPagination(null);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  /**
   * Fetch a single item by ID
   */
  const getOne = useCallback(
    async (id: string): Promise<T | undefined> => {
      setLoading(true);
      try {
        const res = await apiHelper.get<ApiResponse<T>>(`${endpoint}/${id}`);
        setItem(res.data.data);
        return res.data.data;
      } catch (error: unknown) {
        toast.error("Failed to fetch item details");
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  /**
   * Create a new item
   */
  const create = useCallback(
    async (payload: U): Promise<T> => {
      setLoading(true);
      try {
        const res = await apiHelper.post<ApiResponse<T>>(endpoint, payload);
        toast.success(SUCCESS_MESSAGES.CREATED);
        setData((prev) => [res.data.data, ...prev]);
        return res.data.data;
      } catch (error: unknown) {
        const msg = getErrorMessage(error, "Creation failed");
        toast.error(msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  /**
   * Update an existing item
   */
  const update = useCallback(
    async (id: string, payload: U): Promise<T> => {
      setLoading(true);
      try {
        const res = await apiHelper.put<ApiResponse<T>>(
          `${endpoint}/${id}`,
          payload
        );
        toast.success(SUCCESS_MESSAGES.UPDATED);
        setData((prev) =>
          prev.map((item) => (item.id === id ? res.data.data : item))
        );
        return res.data.data;
      } catch (error: unknown) {
        const msg = getErrorMessage(error, "Update failed");
        toast.error(msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  /**
   * Delete an item
   */
  const remove = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      try {
        await apiHelper.delete(`${endpoint}/${id}`);
        toast.success(SUCCESS_MESSAGES.DELETED);
        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (error: unknown) {
        const msg = getErrorMessage(error, "Delete failed");
        toast.error(msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return {
    data,
    item,
    loading,
    pagination,
    getAll,
    getOne,
    create,
    update,
    remove,
  };
}
