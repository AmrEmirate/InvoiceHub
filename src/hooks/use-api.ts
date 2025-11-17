import { useState, useCallback } from "react";
import apiHelper from "@/lib/apiHelper";
// Impor tipe baru yang kita buat
import { ApiResponse, PaginatedResponse } from "@/lib/types";
import { toast } from "sonner";

// Definisikan tipe untuk metadata paginasi
export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// T = Tipe Data (misal: Client), U = Tipe Input Create/Update
export function useApi<T, U = Partial<T>>(endpoint: string) {
  // --- PERBAIKAN: Inisialisasi state sebagai array kosong ---
  const [data, setData] = useState<T[]>([]);
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  // --- STATE BARU UNTUK PAGINASI ---
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  // GET ALL
  const getAll = useCallback(
    async (params?: any) => {
      setLoading(true);
      try {
        // --- PERBARUI TIPE RESPON YANG DIHARAPKAN ---
        // Kita mengharapkan data dibungkus dalam PaginatedResponse
        const res = await apiHelper.get<ApiResponse<PaginatedResponse<T>>>(
          endpoint,
          { params }
        );

        const responseData = res.data.data;

        // --- ISI KEDUA STATE ---
        if (responseData && responseData.data) {
          setData(responseData.data); // Ini adalah array-nya
          setPagination({
            // Ini adalah metadata-nya
            totalItems: responseData.totalItems,
            totalPages: responseData.totalPages,
            currentPage: responseData.currentPage,
          });
          return responseData; // Kembalikan seluruh objek paginasi
        } else {
          // Fallback jika API tidak mengembalikan format paginasi
          // (misalnya untuk endpoint /categories)
          setData(res.data.data as any); // Asumsikan res.data.data adalah array
          setPagination(null); // Tidak ada paginasi
          return res.data.data;
        }
        
      } catch (error: any) {
        toast.error(`Failed to fetch data from ${endpoint}`);
        setData([]); // Set ke array kosong jika terjadi error
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  // GET ONE (Tidak berubah)
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
    [endpoint]
  );

  // CREATE (Tidak berubah)
  const create = async (payload: U) => {
    setLoading(true);
    try {
      const res = await apiHelper.post<ApiResponse<T>>(endpoint, payload);
      toast.success("Created successfully");
      // Update list (perilaku ini mungkin perlu disesuaikan nanti,
      // tapi untuk sekarang kita biarkan)
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

  // UPDATE (Tidak berubah)
  const update = async (id: string, payload: U) => {
    setLoading(true);
    try {
      const res = await apiHelper.put<ApiResponse<T>>(
        `${endpoint}/${id}`,
        payload
      );
      toast.success("Updated successfully");
      // Update list locally
      setData((prev) =>
        prev.map((i: any) => (i.id === id ? res.data.data : i))
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

  // DELETE (Tidak berubah)
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
    pagination, // --- KEMBALIKAN STATE PAGINASI ---
    getAll,
    getOne,
    create,
    update,
    remove,
  };
}