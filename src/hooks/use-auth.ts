import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiHelper from "@/lib/apiHelper";
import { ApiResponse, AuthResponse, User } from "@/lib/types";
import { toast } from "sonner";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Load user dari localStorage saat mount
  useEffect(() => {
    const initAuth = () => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        if (storedUser && token) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse user from local storage");
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Gunakan useCallback untuk menstabilkan fungsi

  const register = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const res = await apiHelper.post<ApiResponse<null>>("/auth/register", data);
      toast.success("Registration successful!", {
        description: res.data.message,
      });
      router.push("/login");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error("Error", { description: msg });
    } finally {
      setLoading(false);
    }
  }, [router]);

  const login = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const res = await apiHelper.post<ApiResponse<AuthResponse>>("/auth/login", data);
      
      localStorage.setItem("authToken", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      
      setUser(res.data.data.user);
      
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error("Error", { description: msg });
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    toast.info("Logged out");
  }, [router]);

  const getProfile = useCallback(async () => {
    try {
      const res = await apiHelper.get<ApiResponse<User>>("/auth/me");
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUser(res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setLoading(true);
    try {
      const res = await apiHelper.put<ApiResponse<User>>("/auth/me", data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUser(res.data.data);
      toast.success("Profile updated");
      return res.data.data;
    } catch (error: any) {
      toast.error("Failed to update profile");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    register,
    login,
    logout,
    getProfile,
    updateProfile
  };
}