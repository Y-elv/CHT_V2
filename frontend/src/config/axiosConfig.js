import axios from "axios";

// List of trusted base URLs - only allow requests to these domains
const TRUSTED_DOMAINS = ["chtv2-bn.onrender.com", "localhost", "127.0.0.1"];

// Validate URL to prevent SSRF attacks
function validateUrl(url) {
  try {
    // Parse the URL
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // Check if the hostname is in trusted domains
    const isTrusted = TRUSTED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (!isTrusted) {
      console.error(`Blocked request to untrusted domain: ${hostname}`);
      throw new Error("Request blocked: untrusted domain");
    }

    // Block internal/localhost access from production (SSRF protection)
    if (process.env.NODE_ENV === "production") {
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("169.254.") || // Link-local
        hostname.startsWith("10.") || // Private
        hostname.startsWith("172.16.") || // Private
        hostname.startsWith("192.168.") // Private
      ) {
        throw new Error("Request blocked: internal network access");
      }
    }

    return true;
  } catch (error) {
    console.error("URL validation failed:", error);
    throw error;
  }
}

// Create axios instance with secure defaults
const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - validate URLs, add security headers, and inject auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Validate URL if it's a full URL
    if (config.url && !config.url.startsWith("/")) {
      validateUrl(config.url);
    }

    // Ensure HTTPS in production
    if (
      process.env.NODE_ENV === "production" &&
      config.url &&
      config.url.startsWith("http://")
    ) {
      console.warn("Blocked insecure HTTP request in production");
      throw new Error("Insecure HTTP requests are not allowed in production");
    }

    // Add Authorization header if token exists
    // Try new format first (cht_token), then fallback to old format (userInfo)
    try {
      let token = localStorage.getItem("cht_token");
      
      if (!token) {
        // Fallback to old format
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.token) {
          token = userInfo.token;
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // If no token or error parsing, continue without auth header
      console.warn("No auth token available");
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector(
      'meta[name="csrf-token"]'
    )?.content;
    if (csrfToken && !config.headers["X-CSRF-Token"]) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Add Authorization token from localStorage if available (duplicate check removed - handled above)

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors securely and token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    // Don't expose sensitive headers in client
    if (response.headers) {
      delete response.headers["authorization"];
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("userInfo");
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject({
        message: "Session expired. Please login again.",
        status: 401,
      });
    }

    // Sanitize error messages to prevent information leakage
    if (error.response) {
      // Server responded with error status
      const sanitizedError = {
        ...error,
        response: {
          ...error.response,
          // Only keep necessary data, don't leak stack traces
          data: {
            message: error.response.data?.message || "An error occurred",
            status: error.response.status,
          },
        },
      };

      // Log full error only on client side (not in production)
      if (process.env.NODE_ENV !== "production") {
        console.error("API Error:", error.response);
      }

      return Promise.reject(sanitizedError);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.message);
      return Promise.reject({
        message: "Network error. Please check your connection.",
      });
    } else {
      // Something else happened
      console.error("Error:", error.message);
      return Promise.reject({
        message: "An unexpected error occurred.",
      });
    }
  }
);

// Helper function to get axios instance
export const getSecureAxios = () => axiosInstance;

// Helper function to make secure API calls
export const secureApiCall = async (method, url, data, config = {}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    // Error is already sanitized by interceptor
    throw error;
  }
};

export default axiosInstance;
