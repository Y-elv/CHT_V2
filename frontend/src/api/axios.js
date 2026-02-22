import axios from "axios";

// Single API base: relative so Netlify redirect /api/* → backend works; dev uses Vite proxy
const baseURL = typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL != null
  ? (import.meta.env.VITE_API_URL || "/api").trim()
  : "/api";

// List of trusted base URLs - only allow requests to these domains when absolute URLs are used
const TRUSTED_DOMAINS = ["localhost", "127.0.0.1"];

function validateUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const isTrusted = TRUSTED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
    if (!isTrusted) {
      throw new Error("Request blocked: untrusted domain");
    }
    if (process.env.NODE_ENV === "production") {
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("169.254.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.16.") ||
        hostname.startsWith("192.168.")
      ) {
        throw new Error("Request blocked: internal network access");
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
}

const api = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto attach token if needed (cookies are sent automatically via withCredentials)
api.interceptors.request.use(
  (config) => {
    // Optional: parse document.cookie or localStorage for token and set config.headers.Authorization
    try {
      if (typeof config.url === "string") {
        config.url = config.url.trim();
      }
      const isAbsoluteURL = typeof config.url === "string" && /^https?:\/\//i.test(config.url);
      if (isAbsoluteURL) {
        validateUrl(config.url);
        config.baseURL = undefined;
      }
      if (
        process.env.NODE_ENV === "production" &&
        typeof config.url === "string" &&
        config.url.startsWith("http://")
      ) {
        throw new Error("Insecure HTTP requests are not allowed in production");
      }
    } catch (e) {
      return Promise.reject(e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Public paths where 401 should not trigger redirect (stay on page, no redirect to /login)
const PUBLIC_PATHS = [
  "/",
  "/landing",
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
  "/doctor/register",
  "/auth-verification",
  "/news",
  "/our-team",
  "/hospital",
  "/pharmacy",
  "/service",
];

api.interceptors.response.use(
  (response) => {
    if (response.headers) {
      delete response.headers["authorization"];
      delete response.headers["set-cookie"];
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      const isPublicPath = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));
      if (!isPublicPath) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
    if (error.response) {
      const apiError = new Error(error.response?.data?.message || "An error occurred");
      apiError.status = error.response.status;
      apiError.response = error.response;
      apiError.isApiError = true;
      return Promise.reject(apiError);
    }
    if (error.request) {
      const networkError = new Error("Network error. Please check your connection.");
      networkError.isNetworkError = true;
      networkError.request = error.request;
      return Promise.reject(networkError);
    }
    return Promise.reject(new Error("An unexpected error occurred."));
  }
);

export default api;
