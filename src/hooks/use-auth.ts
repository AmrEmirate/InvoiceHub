import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiHelper from "@/lib/apiHelper";
import { ApiResponse, AuthResponse, User } from "@/lib/types";
import { toast } from "sonner";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); // <-- 1. TAMBAHKAN STATE USER
  const router = useRouter();

  // 2. Load user dari localStorage saat mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from local storage");
        }
      }
    }
  }, []);

  const register = async (data: any) => {
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
  };

  const login = async (data: any) => {
    setLoading(true);
    try {
      const res = await apiHelper.post<ApiResponse<AuthResponse>>("/auth/login", data);
      
      localStorage.setItem("authToken", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      
      setUser(res.data.data.user); // <-- 3. UPDATE STATE SAAT LOGIN
      
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error("Error", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null); // <-- 4. RESET STATE SAAT LOGOUT
    router.push("/login");
    toast.info("Logged out");
  };

  const getProfile = async () => {
    try {
      const res = await apiHelper.get<ApiResponse<User>>("/auth/me");
      // Update local storage jika data profile berubah
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUser(res.data.data); // <-- 5. UPDATE STATE SAAT FETCH PROFILE
      return res.data.data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      return null;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    try {
      const res = await apiHelper.put<ApiResponse<User>>("/auth/me", data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUser(res.data.data); // <-- 6. UPDATE STATE SAAT UPDATE PROFILE
      toast.success("Profile updated");
      return res.data.data;
    } catch (error: any) {
      toast.error("Failed to update profile");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 7. KEMBALIKAN 'user'
  return {
    user, // <-- INI YANG HILANG
    loading,
    register,
    login,
    logout,
    getProfile,
    updateProfile
  };
}