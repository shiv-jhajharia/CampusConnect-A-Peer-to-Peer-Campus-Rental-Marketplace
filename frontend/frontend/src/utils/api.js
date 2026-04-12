import axios from "axios";
import { API_URL } from "../config";

const apiClient = axios.create({
  baseURL: API_URL,
});

// ── Request interceptor: attach JWT token ──
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle expired / invalid token ──
apiClient.interceptors.response.use(
  (response) => response, // pass through success
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      // Use replace so the user can't navigate "back" to an auth-required page
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);

export const apiFetch = async (url, options = {}) => {
  try {
    const isFullUrl = url.startsWith("http");
    const endpoint = isFullUrl ? url : `${API_URL}${url}`;

    const isFormData = options.body instanceof FormData;

    const config = {
      url: endpoint,
      method: options.method || "GET",
      headers: {},
    };

    if (isFormData) {
      // Pass FormData directly — Axios auto-sets multipart/form-data + boundary
      config.data = options.body;
    } else if (options.body !== undefined) {
      // Send as JSON object — Axios sets Content-Type: application/json automatically
      config.data =
        typeof options.body === "string"
          ? JSON.parse(options.body)
          : options.body;
      config.headers["Content-Type"] = "application/json";
    }

    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    // 401 is already handled by the response interceptor (redirect to login)
    // For other errors, extract the detail message from FastAPI's response
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message || "Something went wrong");
  }
};