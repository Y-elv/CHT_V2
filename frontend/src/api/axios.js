import axios from "axios";

// Set global defaults for cookie-based auth
axios.defaults.withCredentials = true;

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
    throw error;
  }
}

// Create axios instance with secure defaults for cookie-based auth
const axiosInstance = axios.create({
  baseURL: "https://chtv2-bn.onrender.com",
  timeout: 30000,
  withCredentials: true, // IMPORTANT: Send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - validate URLs and add security headers
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // Normalize and trim config.url
      if (typeof config.url === "string") {
        const rawUrl = config.url;
        const trimmedUrl = rawUrl.trim();
        
        config.url = trimmedUrl;
      }

      // Determine if URL is absolute
      const isAbsoluteURL = typeof config.url === "string" && /^https?:\/\//i.test(config.url);

      if (isAbsoluteURL) {
        validateUrl(config.url);
        config.baseURL = undefined;
      }

      // Ensure HTTPS in production
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

// Response interceptor - handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Don't expose sensitive headers
    if (response.headers) {
      delete response.headers["authorization"];
      delete response.headers["set-cookie"];
    }
    
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Create enhanced error for proper handling
      const authError = new Error("Session expired. Please login again.");
      authError.status = 401;
      authError.isAuthError = true;
      authError.response = error.response;
      
      return Promise.reject(authError);
    }

    // Handle other errors
    if (error.response) {
      const apiError = new Error(error.response?.data?.message || "An error occurred");
      apiError.status = error.response.status;
      apiError.response = error.response;
      apiError.isApiError = true;
      
      return Promise.reject(apiError);
    }

    // Network errors
    if (error.request) {
      const networkError = new Error("Network error. Please check your connection.");
      networkError.isNetworkError = true;
      networkError.request = error.request;
      
      return Promise.reject(networkError);
    }

    // Setup errors
    const setupError = new Error("An unexpected error occurred.");
    setupError.isSetupError = true;
    
    return Promise.reject(setupError);
  }
);

export default axiosInstance;
