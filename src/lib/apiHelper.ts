import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { STORAGE_KEYS, API_ENDPOINTS, API_CONFIG, ROUTES } from "./constants";

const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    const errorMsg =
      "FATAL: NEXT_PUBLIC_API_URL environment variable is not defined! API requests will fail.";

    if (typeof window !== "undefined") {
      console.error(errorMsg);
      // In development, throw to make the error obvious
      if (process.env.NODE_ENV === "development") {
        throw new Error(errorMsg);
      }
    }
    return ""; // Fallback to empty string in production to avoid crashes
  }
  return url;
};

export const API_URL = getApiUrl();

/**
 * Axios instance with authentication interceptors
 * Automatically handles 401 responses and sends cookies
 */
const apiHelper: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_CONFIG.TIMEOUT,
});

/**
 * Flag to prevent multiple simultaneous token refresh attempts
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response interceptor - handles token expiration and auto-logout
 */
apiHelper.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)) {
        // If refresh fails, logout
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiHelper(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using HttpOnly cookie
        await axios.post(
          `${API_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {}, // Empty body, refresh token is in cookie
          { withCredentials: true }
        );

        processQueue(null);
        return apiHelper(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Refresh failed - clear auth and redirect to login
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Clears auth data and redirects to login
 */
function handleLogout(): void {
  if (typeof window !== "undefined") {
    // We only need to clear user data, cookies are HttpOnly
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Backward compatibility cleaning
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    // Redirect to login only if not already there
    if (!window.location.pathname.includes(ROUTES.LOGIN)) {
      window.location.href = ROUTES.LOGIN;
    }
  }
}

export default apiHelper;
