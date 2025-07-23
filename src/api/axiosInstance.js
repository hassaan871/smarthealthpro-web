// axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5000/", // Base URL for your backend API
  withCredentials: true, // Automatically include cookies (like JWT tokens)
});

let refreshPromise = null;

// Request interceptor: Block all requests except /refresh while refreshing
api.interceptors.request.use(
  async (config) => {
    // You can add headers or other modifications here before the request
    // Get CSRF token from a meta tag or elsewhere
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfMeta) {
      config.headers["X-CSRF-Token"] = csrfMeta.content;
    }

    // If a refresh is in progress, wait for it to finish before sending the request
    if (refreshPromise && !config.url.includes("/refresh")) {
      await refreshPromise;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh on 401 Unauthorized errors
let hasRedirected = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;

      // Prevent refreshing if already on login page or already redirected
      if (window.location.pathname === "/login" || hasRedirected) {
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            console.log("Refreshing token...");
            await api.post("/refresh");
          } catch (err) {
            hasRedirected = true;
            window.location.href = "/login";
            throw err;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        await refreshPromise;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
