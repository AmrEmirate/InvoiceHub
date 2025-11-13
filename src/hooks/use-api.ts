import { useState, useCallback } from "react";
import apiHelper from "@/lib/apiHelper";
import { ApiResponse } from "@/lib/types";
import { toast } from "sonner";

// T = Tipe Data (misal: Client), U = Tipe Input Create/Update
export function useApi<T, U = Partial<T>>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  // GET ALL
  const getAll = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const res = await apiHelper.get<ApiResponse<T[]>>(endpoint, { params });
      setData(res.data.data);
      return res.data.data;
    } catch (error: any) {
      toast.error(`Failed to fetch data from ${endpoint}`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // GET ONE
  const getOne = useCallback(async (id: string) => {
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
  }, [endpoint]);

  // CREATE
  const create = async (payload: U) => {
    setLoading(true);
    try {
      const res = await apiHelper.post<ApiResponse<T>>(endpoint, payload);
      toast.success("Created successfully");
      // Refresh list locally
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

  // UPDATE
  const update = async (id: string, payload: U) => {
    setLoading(true);
    try {
      const res = await apiHelper.put<ApiResponse<T>>(`${endpoint}/${id}`, payload);
      toast.success("Updated successfully");
      // Update list locally
      setData((prev) => prev.map((i: any) => (i.id === id ? res.data.data : i)));
      return res.data.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const remove = async (id: string) => {
    setLoading(true);
    try {
      await apiHelper.delete(`${endpoint}/${id}`);
      toast.success("Deleted successfully");
      // Remove from list locally
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
    getAll,
    getOne,
    create,
    update,
    remove
  };
}