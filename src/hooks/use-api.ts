import { useState, useCallback } from "react";
import apiHelper from "@/lib/apiHelper";

import { ApiResponse, PaginatedResponse } from "@/lib/types";
import { toast } from "sonner";

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export function useApi<T, U = Partial<T>>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const getAll = useCallback(
    async (params?: any) => {
      setLoading(true);
      try {
        const res = await apiHelper.get<ApiResponse<any>>(
          endpoint,
          { params },
        );

        // Check if response has meta (pagination enabled)
        if (res.data.meta) {
          // Paginated response: data is array, meta contains pagination info
          setData(res.data.data);
          setPagination({
            totalItems: res.data.meta.total,
            totalPages: res.data.meta.totalPages,
            currentPage: res.data.meta.page,
          });
          return res.data.data; // Return the array, not the full response
        } else {
          // Non-paginated response: data is directly an array
          setData(res.data.data as any);
          setPagination(null);
          return res.data.data;
        }
      } catch (error: any) {
        toast.error(`Failed to fetch data from ${endpoint}`);
        setData([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  const getOne = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await apiHelper.get<ApiResponse<T>>(`${endpoint}/${id}`);
        setItem(res.data.data);
        return res.data.data;
      } catch (error: any) {
        toast.error("Failed to fetch item details");
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  const create = async (payload: U) => {
    setLoading(true);
    try {
      const res = await apiHelper.post<ApiResponse<T>>(endpoint, payload);
      toast.success("Created successfully");

      setData((prev) => [res.data.data, ...prev]);
      return res.data.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Creation failed";
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, payload: U) => {
    setLoading(true);
    try {
      const res = await apiHelper.put<ApiResponse<T>>(
        `${endpoint}/${id}`,
        payload,
      );
      toast.success("Updated successfully");

      setData((prev) =>
        prev.map((i: any) => (i.id === id ? res.data.data : i)),
      );
      return res.data.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await apiHelper.delete(`${endpoint}/${id}`);
      toast.success("Deleted successfully");

      setData((prev) => prev.filter((i: any) => i.id !== id));
    } catch (error: any) {
      const msg = error.response?.data?.message || "Delete failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
