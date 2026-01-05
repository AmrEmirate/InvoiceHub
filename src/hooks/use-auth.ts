import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import apiHelper from "@/lib/apiHelper";
import { ApiResponse, AuthResponse, User } from "@/lib/types";
import { toast } from "sonner";
import {
  STORAGE_KEYS,
  API_ENDPOINTS,
  ROUTES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "@/lib/constants";

/**
 * Registration data type
 */
interface RegisterData {
  name: string;
  email: string;
  company: string;
}

/**
 * Login credentials type
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Axios error response type
 */
interface ApiErrorResponse {
  message?: string;
  code?: string;
  details?: unknown;
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
 * Authentication hook for managing user authentication state
 *
 * @example
 * ```tsx
 * const { user, login, logout, loading } = useAuth();
 * ```
 */
export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const initAuth = (): void => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (storedUser && token) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            console.error("Failed to parse user from local storage");
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setLoading(true);
    try {
      const res = await apiHelper.post<ApiResponse<null>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      toast.success("Check your email!", {
        description: res.data.message,
      });
    } catch (error: unknown) {
      const msg = getErrorMessage(error, "Registration failed");
      toast.error("Error", { description: msg });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setLoading(true);
      try {
        const res = await apiHelper.post<ApiResponse<AuthResponse>>(
          API_ENDPOINTS.AUTH.LOGIN,
          credentials
        );

        // Store both tokens
        const authData = res.data.data;
        localStorage.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          authData.accessToken || authData.token
        );
        if (authData.refreshToken) {
          localStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            authData.refreshToken
          );
        }
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));

        setUser(authData.user);

        toast.success(SUCCESS_MESSAGES.LOGIN);
        router.push(ROUTES.DASHBOARD);
      } catch (error: unknown) {
        const msg = getErrorMessage(error, "Login failed");
        toast.error("Error", { description: msg });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * Logout and clear authentication state
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call server logout to revoke refresh token
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await apiHelper.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch {
      // Ignore errors - we're logging out anyway
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      router.push(ROUTES.LOGIN);
      toast.info(SUCCESS_MESSAGES.LOGOUT);
    }
  }, [router]);

  /**
   * Fetch current user profile
   */
  const getProfile = useCallback(async (): Promise<User | null> => {
    try {
      const res = await apiHelper.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.data));
      setUser(res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      return null;
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (data: Partial<User>): Promise<User> => {
      setLoading(true);
      try {
        const res = await apiHelper.put<ApiResponse<User>>(
          API_ENDPOINTS.AUTH.ME,
          data
        );
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.data));
        setUser(res.data.data);
        toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
        return res.data.data;
      } catch (error: unknown) {
        toast.error("Failed to update profile");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Set password for new user
   */
  const setPassword = useCallback(
    async (token: string, password: string): Promise<void> => {
      setLoading(true);
      try {
        const res = await apiHelper.post<ApiResponse<null>>(
          API_ENDPOINTS.AUTH.SET_PASSWORD,
          { token, password }
        );

        toast.success("Password set!", {
          description: res.data.message,
        });

        router.push(ROUTES.LOGIN);
      } catch (error: unknown) {
        const msg = getErrorMessage(error, "Failed to set password");
        toast.error("Error", { description: msg });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * Complete Google signup with additional info
   */
  const googleSignup = useCallback(
    async (data: RegisterData): Promise<void> => {
      setLoading(true);
      try {
        const res = await apiHelper.post<ApiResponse<AuthResponse>>(
          API_ENDPOINTS.AUTH.GOOGLE_SIGNUP,
          data
        );

        const authData = res.data.data;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));

        setUser(authData.user);

        toast.success("Registration successful!");
        router.push(ROUTES.DASHBOARD);
      } catch (error: unknown) {
        const msg = getErrorMessage(error, "Google signup failed");
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
