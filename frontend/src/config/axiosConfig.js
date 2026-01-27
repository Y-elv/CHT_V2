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
  baseURL: "https://chtv2-bn.onrender.com", // Base URL for all API requests
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
    // Use SINGLE source: localStorage.getItem("token")
    const isAbsoluteURL = config.url && !config.url.startsWith("/");
    
    // ============================================
    // [FRONTEND][AXIOS] Request Interceptor
    // ============================================
    console.log("============================================");
    console.log("[FRONTEND][AXIOS] Request interceptor triggered");
    console.log("[FRONTEND][AXIOS] Timestamp:", new Date().toISOString());
    console.log("[FRONTEND][AXIOS] Request URL:", config.url);
    console.log("[FRONTEND][AXIOS] Full URL:", config.baseURL ? `${config.baseURL}${config.url}` : config.url);
    console.log("[FRONTEND][AXIOS] Method:", config.method?.toUpperCase());
    console.log("[FRONTEND][AXIOS] isAbsoluteURL:", isAbsoluteURL);
    
    try {
      console.log("[AUTH][STORAGE] Reading token from localStorage key: 'token'");
      let token = localStorage.getItem("token");
      
      // Trim token to remove any whitespace
      if (token) {
        token = token.trim();
      }
      
      const tokenExists = !!token;
      const tokenLength = token?.length || 0;
      
      console.log("[AUTH][STORAGE] Token exists:", tokenExists);
      console.log("[AUTH][STORAGE] Token length:", tokenLength);
      console.log("[AUTH][STORAGE] Token starts with 'eyJ':", token?.startsWith('eyJ') || false);
      console.log("[AUTH][STORAGE] Token preview (first 50 chars):", token ? token.substring(0, 50) + "..." : "null");
      
      if (token) {
        // Create Authorization header exactly as curl format: "Bearer <token>"
        const authHeader = `Bearer ${token}`;
        
        // Set Authorization header - axios normalizes to lowercase 'authorization' but we set both
        config.headers.Authorization = authHeader;
        config.headers.authorization = authHeader;
        
          console.log("[FRONTEND][AXIOS] ✅ Authorization header attached: true");
        console.log("[FRONTEND][AXIOS] Token length:", tokenLength);
        console.log("[FRONTEND][AXIOS] Auth header length:", authHeader.length);
        console.log("[FRONTEND][AXIOS] Auth header format check:", authHeader.startsWith('Bearer ') ? "✅ CORRECT" : "❌ INCORRECT");
        console.log("[FRONTEND][AXIOS] Auth header preview:", authHeader.substring(0, 60) + "...");
        console.log("[FRONTEND][AXIOS] Full Authorization header:", authHeader);
        
        // Verify header was set correctly
        const verifyHeader = config.headers.Authorization || config.headers.authorization;
        console.log("[FRONTEND][AXIOS] Header verification:", verifyHeader ? "✅ SET" : "❌ NOT SET");
        if (verifyHeader) {
          console.log("[FRONTEND][AXIOS] Verified header preview:", verifyHeader.substring(0, 60) + "...");
          console.log("[FRONTEND][AXIOS] Verified header matches:", verifyHeader === authHeader);
        }
        console.log("============================================");
      } else {
        console.log("[FRONTEND][AXIOS] ❌ Authorization header attached: false");
        console.log("[FRONTEND][AXIOS] ❌ No token available - request will be unauthenticated");
        console.log("============================================");
      }
    } catch (error) {
      // If no token or error parsing, continue without auth header
      console.error("❌ [AUTH][AXIOS][REQUEST] Error retrieving token:", error);
      console.warn("⚠️ [AUTH][AXIOS][REQUEST] No auth token available - request will be unauthenticated");
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
    console.log("[FRONTEND][AXIOS] ✅ Success response received");
    console.log("[FRONTEND][AXIOS] Status:", response.status);
    console.log("[FRONTEND][AXIOS] URL:", response.config?.url);
    // Don't expose sensitive headers in client
    if (response.headers) {
      delete response.headers["authorization"];
    }
    return response;
  },
  (error) => {
    // ============================================
    // [FRONTEND][AXIOS] Response Error Interceptor
    // ============================================
    console.log("============================================");
    console.log("[FRONTEND][AXIOS] ❌ Response interceptor triggered (error)");
    console.log("[FRONTEND][AXIOS] Timestamp:", new Date().toISOString());
    
    // ============================================
    // EXPOSE FULL AXIOS ERROR - BEFORE ANY WRAPPING
    // ============================================
    console.error("🟥 RAW AXIOS ERROR:", error);
    console.error("🟥 AXIOS RESPONSE:", error.response);
    console.error("🟥 AXIOS STATUS:", error.response?.status);
    console.error("🟥 AXIOS DATA:", error.response?.data);
    
    console.log("[FRONTEND][AXIOS] Error response exists:", !!error.response);
    console.log("[FRONTEND][AXIOS] Error request exists:", !!error.request);
    console.log("[FRONTEND][AXIOS] Error isAxiosError:", error.isAxiosError);
    
    if (error.response) {
      console.log("[FRONTEND][AXIOS] Response status:", error.response.status);
      console.log("[FRONTEND][AXIOS] Response status text:", error.response.statusText);
      console.log("[FRONTEND][AXIOS] Response data:", JSON.stringify(error.response.data, null, 2));
      console.log("[FRONTEND][AXIOS] Request URL:", error.response.config?.url);
      console.log("[FRONTEND][AXIOS] Request method:", error.response.config?.method);
      console.log("[FRONTEND][AXIOS] Authorization header was sent:", !!error.response.config?.headers?.Authorization || !!error.response.config?.headers?.authorization);
      if (error.response.config?.headers?.Authorization || error.response.config?.headers?.authorization) {
        const sentHeader = error.response.config?.headers?.Authorization || error.response.config?.headers?.authorization;
        console.log("[FRONTEND][AXIOS] Sent Authorization header preview:", sentHeader.substring(0, 60) + "...");
      }
      console.log("[FRONTEND][AXIOS] This is an AXIOS RESPONSE ERROR (backend responded)");
    } else if (error.request) {
      console.log("[FRONTEND][AXIOS] No response received, request object:", error.request);
      console.log("[FRONTEND][AXIOS] This is a NETWORK ERROR (no backend response)");
    } else {
      console.log("[FRONTEND][AXIOS] Error setting up request:", error.message);
      console.log("[FRONTEND][AXIOS] This is a REQUEST SETUP ERROR (not an Axios response error)");
    }
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      const requestURL = error.response?.config?.url || error.config?.url || "unknown";
      const fullURL = error.response?.config?.baseURL 
        ? `${error.response.config.baseURL}${requestURL}` 
        : requestURL;
      const authHeaderSent = !!error.response?.config?.headers?.Authorization || 
                            !!error.response?.config?.headers?.authorization ||
                            !!error.config?.headers?.Authorization ||
                            !!error.config?.headers?.authorization;
      const currentToken = localStorage.getItem("token");
      const sentAuthHeader = error.response?.config?.headers?.Authorization || 
                            error.response?.config?.headers?.authorization ||
                            error.config?.headers?.Authorization ||
                            error.config?.headers?.authorization;
      const sentToken = sentAuthHeader?.replace(/^Bearer\s+/i, '') || null;
      
      console.log("[AUTH][RESPONSE][401] ========================================");
      console.log("[AUTH][RESPONSE][401] 401 Unauthorized detected");
      console.log("[AUTH][RESPONSE][401] Request URL:", requestURL);
      console.log("[AUTH][RESPONSE][401] Full URL:", fullURL);
      console.log("[AUTH][RESPONSE][401] Response status:", error.response?.status);
      console.log("[AUTH][RESPONSE][401] Authorization header was attached:", authHeaderSent);
      console.log("[AUTH][RESPONSE][401] Sent Authorization header:", sentAuthHeader ? sentAuthHeader.substring(0, 60) + "..." : "null");
      console.log("[AUTH][RESPONSE][401] Current token in localStorage:", !!currentToken);
      console.log("[AUTH][RESPONSE][401] Token length in localStorage:", currentToken?.length || 0);
      console.log("[AUTH][RESPONSE][401] Token preview (localStorage):", currentToken ? currentToken.substring(0, 50) + "..." : "null");
      console.log("[AUTH][RESPONSE][401] Token that was sent:", !!sentToken, sentToken ? `length: ${sentToken.length}` : "null");
      console.log("[AUTH][RESPONSE][401] Sent token preview:", sentToken ? sentToken.substring(0, 50) + "..." : "null");
      console.log("[AUTH][RESPONSE][401] Tokens match:", currentToken?.trim() === sentToken?.trim());
      console.log("[AUTH][RESPONSE][401] Token starts with 'eyJ' (sent):", sentToken?.startsWith('eyJ') || false);
      console.log("[AUTH][RESPONSE][401] Token starts with 'eyJ' (stored):", currentToken?.startsWith('eyJ') || false);
      console.log("[AUTH][RESPONSE][401] Backend error:", error.response?.data?.message || error.response?.data?.error || "No error message");
      console.log("[AUTH][RESPONSE][401] Full error response:", JSON.stringify(error.response?.data, null, 2));
      
      // Check if this is a fresh login (within last 30 seconds) - don't clear if so
      const loginTime = sessionStorage.getItem("lastLoginTime");
      const now = Date.now();
      const timeSinceLogin = loginTime ? now - parseInt(loginTime) : Infinity;
      const isFreshLogin = timeSinceLogin < 30000; // 30 seconds
      
      console.log("[AUTH][RESPONSE][401] Last login time:", loginTime ? new Date(parseInt(loginTime)).toISOString() : "Never");
      console.log("[AUTH][RESPONSE][401] Time since login (ms):", timeSinceLogin);
      console.log("[AUTH][RESPONSE][401] Is fresh login (< 30s):", isFreshLogin);
      
      // Don't clear on fresh logins - might be a backend validation issue
      if (isFreshLogin) {
        console.warn("[AUTH][RESPONSE][401] Fresh login detected - NOT clearing auth data (might be backend validation issue)");
        console.warn("[AUTH][RESPONSE][401] Token might be valid but backend is rejecting it");
        console.warn("[AUTH][RESPONSE][401] Token sent length:", sentToken?.length || 0);
        console.warn("[AUTH][RESPONSE][401] Token in localStorage length:", currentToken?.length || 0);
        
        // Preserve original Axios error structure when re-throwing
        const enhancedError = Object.assign(new Error(error.response?.data?.message || "Authentication failed. Please try logging in again."), {
          response: error.response, // Preserve full response
          request: error.request,
          config: error.config,
          isAxiosError: error.isAxiosError,
          status: 401,
          originalError: error.response?.data,
          isFreshLogin: true,
        });
        return Promise.reject(enhancedError);
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
      
      // Preserve original Axios error structure when re-throwing
      const enhancedError = Object.assign(new Error(error.response?.data?.message || "Session expired. Please login again."), {
        response: error.response, // Preserve full response
        request: error.request,
        config: error.config,
        isAxiosError: error.isAxiosError,
        status: 401,
        originalError: error.response?.data,
      });
      return Promise.reject(enhancedError);
    }

    // Handle non-401 errors - preserve Axios error structure
    if (error.response) {
      // For 400 errors, preserve more details for validation errors
      const isValidationError = error.response.status === 400;
      const errorData = error.response.data || {};
      
      // Preserve original Axios error structure while sanitizing data
      const sanitizedError = Object.assign(new Error(errorData.message || errorData.error || "An error occurred"), {
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
        request: error.request,
        config: error.config,
        isAxiosError: error.isAxiosError,
      });

      // Log full error for debugging (always log in development)
      if (process.env.NODE_ENV !== "production" || isValidationError) {
        console.error("API Error:", error.response);
      }

      return Promise.reject(sanitizedError);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.message);
      // Preserve error structure for network errors
      const networkError = Object.assign(new Error("Network error. Please check your connection."), {
        request: error.request,
        config: error.config,
        isAxiosError: error.isAxiosError,
        response: null, // Explicitly set to null
      });
      return Promise.reject(networkError);
    } else {
      // Something else happened
      console.error("Error:", error.message);
      // Preserve error structure for setup errors
      const setupError = Object.assign(new Error("An unexpected error occurred."), {
        originalError: error,
        response: null,
        request: null,
        isAxiosError: error.isAxiosError || false,
      });
      return Promise.reject(setupError);
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
