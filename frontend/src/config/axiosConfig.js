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
    // Try "token" first (primary), then cht_token, then userInfo
    console.log("🔴 [Axios Interceptor] Request interceptor triggered");
    console.log("🔴 [Axios Interceptor] Request URL:", config.url);
    console.log("🔴 [Axios Interceptor] Request method:", config.method);
    
    try {
      console.log("🔴 [Axios Interceptor] Attempting to retrieve token from localStorage...");
      let token = localStorage.getItem("token");
      console.log("🔴 [Axios Interceptor] Token from 'token' key:", !!token, token ? `${token.substring(0, 20)}...` : "null");
      
      if (!token) {
        token = localStorage.getItem("cht_token");
        console.log("🔴 [Axios Interceptor] Token from 'cht_token' key:", !!token, token ? `${token.substring(0, 20)}...` : "null");
      }
      
      if (!token) {
        // Fallback to old format
        console.log("🔴 [Axios Interceptor] Trying 'userInfo' format...");
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
        console.log("🔴 [Axios Interceptor] userInfo exists:", !!userInfo);
        if (userInfo && userInfo.token) {
          token = userInfo.token;
          console.log("🔴 [Axios Interceptor] Token from 'userInfo.token':", !!token, token ? `${token.substring(0, 20)}...` : "null");
        }
      }
      
      if (token) {
        // Check token expiration
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const exp = payload.exp;
            const iat = payload.iat;
            const now = Math.floor(Date.now() / 1000);
            const isExpired = exp && now > exp;
            const timeUntilExpiry = exp ? exp - now : null;
            
            console.log("🔴 [Axios Interceptor] Token expiration check:");
            console.log("🔴 [Axios Interceptor] - Token issued at (iat):", iat, new Date(iat * 1000).toISOString());
            console.log("🔴 [Axios Interceptor] - Token expires at (exp):", exp, new Date(exp * 1000).toISOString());
            console.log("🔴 [Axios Interceptor] - Current time:", now, new Date(now * 1000).toISOString());
            console.log("🔴 [Axios Interceptor] - Is expired:", isExpired);
            console.log("🔴 [Axios Interceptor] - Time until expiry (seconds):", timeUntilExpiry);
            console.log("🔴 [Axios Interceptor] - Time until expiry (minutes):", timeUntilExpiry ? Math.floor(timeUntilExpiry / 60) : null);
            
            if (isExpired) {
              console.warn("⚠️ [Axios Interceptor] TOKEN IS EXPIRED! Backend will reject this token.");
            }
          }
        } catch (e) {
          console.warn("⚠️ [Axios Interceptor] Could not decode token for expiration check:", e);
        }
        
        const authHeader = `Bearer ${token}`;
        config.headers.Authorization = authHeader;
        console.log("🔴 [Axios Interceptor] Authorization header set");
        console.log("🔴 [Axios Interceptor] Full token (for debugging):", token);
        console.log("🔴 [Axios Interceptor] Authorization header preview:", authHeader.substring(0, 50) + "...");
        console.log("🔴 [Axios Interceptor] Full Authorization header length:", authHeader.length);
        console.log("🔴 [Axios Interceptor] Token length:", token.length);
        console.log("🔴 [Axios Interceptor] Token starts with 'eyJ':", token.startsWith('eyJ'));
        console.log("🔴 [Axios Interceptor] Token has 3 parts (JWT format):", token.split('.').length === 3);
        console.log("🔴 [Axios Interceptor] Full Authorization header value:", authHeader);
      } else {
        console.warn("⚠️ [Axios Interceptor] No auth token available - request will be unauthenticated");
      }
    } catch (error) {
      // If no token or error parsing, continue without auth header
      console.error("❌ [Axios Interceptor] Error retrieving token:", error);
      console.warn("⚠️ [Axios Interceptor] No auth token available - request will be unauthenticated");
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
    console.log("✅ [Axios Response] Success response received");
    console.log("✅ [Axios Response] Status:", response.status);
    console.log("✅ [Axios Response] URL:", response.config?.url);
    // Don't expose sensitive headers in client
    if (response.headers) {
      delete response.headers["authorization"];
    }
    return response;
  },
  (error) => {
    console.log("🔴 [Axios Response] Response interceptor triggered");
    console.log("🔴 [Axios Response] Error object:", error);
    console.log("🔴 [Axios Response] Error response exists:", !!error.response);
    
    if (error.response) {
      console.log("🔴 [Axios Response] Response status:", error.response.status);
      console.log("🔴 [Axios Response] Response status text:", error.response.statusText);
      console.log("🔴 [Axios Response] Response headers:", error.response.headers);
      console.log("🔴 [Axios Response] Response data:", error.response.data);
      console.log("🔴 [Axios Response] Response config URL:", error.response.config?.url);
      console.log("🔴 [Axios Response] Response config method:", error.response.config?.method);
      console.log("🔴 [Axios Response] Response config headers:", error.response.config?.headers);
      console.log("🔴 [Axios Response] Authorization header sent:", error.response.config?.headers?.Authorization?.substring(0, 50) + "...");
    } else if (error.request) {
      console.log("🔴 [Axios Response] No response received, request object:", error.request);
    } else {
      console.log("🔴 [Axios Response] Error setting up request:", error.message);
    }
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.log("⚠️ [Axios Response] 401 Unauthorized detected");
      console.log("⚠️ [Axios Response] Backend error message:", error.response?.data?.message || error.response?.data?.error || "No error message");
      console.log("⚠️ [Axios Response] Backend error data:", JSON.stringify(error.response?.data, null, 2));
      
      // Log current token state
      const currentToken = localStorage.getItem("token") || localStorage.getItem("cht_token");
      const sentToken = error.response?.config?.headers?.Authorization?.replace('Bearer ', '') || null;
      console.log("⚠️ [Axios Response] Current token in localStorage:", !!currentToken);
      console.log("⚠️ [Axios Response] Current token preview:", currentToken ? currentToken.substring(0, 50) + "..." : "null");
      console.log("⚠️ [Axios Response] Token that was sent:", sentToken ? sentToken.substring(0, 50) + "..." : "null");
      console.log("⚠️ [Axios Response] Tokens match:", currentToken === sentToken);
      
      // Check if this is a fresh login (within last 30 seconds) - don't clear if so
      const loginTime = sessionStorage.getItem("lastLoginTime");
      const now = Date.now();
      const timeSinceLogin = loginTime ? now - parseInt(loginTime) : Infinity;
      const isFreshLogin = timeSinceLogin < 30000; // 30 seconds
      
      console.log("⚠️ [Axios Response] Last login time:", loginTime ? new Date(parseInt(loginTime)).toISOString() : "Never");
      console.log("⚠️ [Axios Response] Time since login (ms):", timeSinceLogin);
      console.log("⚠️ [Axios Response] Is fresh login (< 30s):", isFreshLogin);
      
      // Don't clear on fresh logins - might be a backend validation issue
      if (isFreshLogin) {
        console.warn("⚠️ [Axios Response] Fresh login detected - NOT clearing auth data (might be backend validation issue)");
        console.warn("⚠️ [Axios Response] Token might be valid but backend is rejecting it");
        console.warn("⚠️ [Axios Response] Full token sent:", sentToken);
        console.warn("⚠️ [Axios Response] Full token in localStorage:", currentToken);
        
        // Return error without clearing - let the app handle it
        return Promise.reject({
          message: error.response?.data?.message || "Authentication failed. Please try logging in again.",
          status: 401,
          originalError: error.response?.data,
          isFreshLogin: true,
        });
      }
      
      // Clear auth data and redirect to login (only for non-fresh logins)
      console.log("⚠️ [Axios Response] Clearing auth data and redirecting to login...");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("cht_user");
      localStorage.removeItem("cht_token");
      localStorage.removeItem("token");
      sessionStorage.removeItem("lastLoginTime");
      
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        console.log("⚠️ [Axios Response] Redirecting to /login");
        window.location.href = "/login";
      }
      
      return Promise.reject({
        message: error.response?.data?.message || "Session expired. Please login again.",
        status: 401,
        originalError: error.response?.data,
      });
    }

    // Sanitize error messages to prevent information leakage
    if (error.response) {
      // For 400 errors, preserve more details for validation errors
      const isValidationError = error.response.status === 400;
      const errorData = error.response.data || {};
      
      // Server responded with error status
      const sanitizedError = {
        ...error,
        response: {
          ...error.response,
          // Keep more details for validation errors, sanitize others
          data: isValidationError ? {
            message: errorData.message || errorData.error || "Validation error occurred",
            status: error.response.status,
            errors: errorData.errors, // Preserve validation errors array if present
            details: errorData.details, // Preserve additional details if present
          } : {
            message: errorData.message || errorData.error || "An error occurred",
            status: error.response.status,
          },
        },
      };

      // Log full error for debugging (always log in development)
      if (process.env.NODE_ENV !== "production" || isValidationError) {
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
