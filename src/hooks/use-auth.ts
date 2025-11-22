import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiHelper from "@/lib/apiHelper";
import { ApiResponse, AuthResponse, User } from "@/lib/types";
import { toast } from "sonner";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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

  const register = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const res = await apiHelper.post<ApiResponse<null>>(
        "/auth/register",
        data,
      );
      toast.success("Check your email!", {
        description: res.data.message,
      });
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error("Error", { description: msg });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (data: any) => {
      setLoading(true);
      try {
        const res = await apiHelper.post<ApiResponse<AuthResponse>>(
          "/auth/login",
          data,
        );

        localStorage.setItem("authToken", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));

        setUser(res.data.data.user);

        toast.success("Login successful");
        router.push("/dashboard");
      } catch (error: any) {
        const msg = error.response?.data?.message || "Login failed";
        toast.error("Error", { description: msg });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

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

  const setPassword = useCallback(
    async (token: string, password: string) => {
      setLoading(true);
      try {
        const res = await apiHelper.post<ApiResponse<null>>(
          "/auth/set-password",
          {
            token,
            password,
          },
        );

        toast.success("Password set!", {
          description: res.data.message,
        });

        router.push("/login");
      } catch (error: any) {
        const msg = error.response?.data?.message || "Failed to set password";
        toast.error("Error", { description: msg });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const googleSignup = useCallback(
    async (data: { email: string; name: string; company: string }) => {
      setLoading(true);
      try {
        const res = await apiHelper.post<ApiResponse<AuthResponse>>(
          "/auth/google-signup",
          data
        );

        localStorage.setItem("authToken", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));

        setUser(res.data.data.user);

        toast.success("Registration successful!");
        router.push("/dashboard");
      } catch (error: any) {
        const msg =
          error.response?.data?.message || "Google signup failed";
        toast.error("Error", { description: msg });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return {
    user,
    loading,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    setPassword,
    googleSignup,
  };
}
