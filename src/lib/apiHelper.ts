import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2020/api";

const apiHelper: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Sisipkan Token
apiHelper.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Error Global (Opsional)
apiHelper.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Jika token expired (401), bisa redirect ke login di sini
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Opsional: Hapus token dan redirect
        // localStorage.removeItem("authToken");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiHelper;