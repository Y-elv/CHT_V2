/**
 * Global Authentication Error Handler
 * 
 * Handles 401 authentication errors across the application
 * Shows professional toast notifications and redirects to login
 */

// Store toast instance to avoid circular dependencies
let toastInstance = null;

/**
 * Initialize the global error handler with toast instance
 * Must be called inside a React component
 */
export const initAuthErrorHandler = (toast) => {
  toastInstance = toast;
};

/**
 * Handle authentication errors globally
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred (optional)
 */
export const handleAuthError = (error, context = "application") => {
  if (error?.isAuthError || error?.status === 401 || error?.requiresReauth) {
    // Show professional toast notification
    if (toastInstance) {
      toastInstance({
        title: "Session Expired",
        description: "Your session has expired. Please log in again to continue.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        variant: "subtle",
      });
    } else {
      // Fallback if toast not available
      alert("Your session has expired. Please log in again to continue.");
    }
    
    // Clear authentication and redirect
    clearAuthAndRedirect();
    
    return true; // Error was handled
  }
  
  return false; // Not an auth error
};

/**
 * Clear authentication state and redirect to login
 */
const clearAuthAndRedirect = () => {
  // Remove token from localStorage
  try { localStorage.removeItem("fh_auth_token"); } catch (_) {}

  try {
    const { useAuthStore } = require("../store/authStore");
    const authStore = useAuthStore.getState();
    authStore.logout();
  } catch (_) {}

  try {
    const { useNotificationStore } = require("../zustandStore/notificationStore");
    const notificationStore = useNotificationStore.getState();
    notificationStore.clearNotifications?.();
  } catch (_) {}

  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
};

/**
 * Check if error is authentication related
 * @param {Error} error - The error object
 * @returns {boolean} - True if auth error
 */
export const isAuthError = (error) => {
  return !!(
    error?.isAuthError ||
    error?.status === 401 ||
    error?.requiresReauth ||
    (error?.response?.status === 401)
  );
};

/**
 * Wrap async functions with auth error handling
 * @param {Function} asyncFunction - The async function to wrap
 * @param {string} context - Context for error logging
 * @returns {Function} - Wrapped function with auth error handling
 */
export const withAuthErrorHandling = (asyncFunction, context = "async operation") => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      if (handleAuthError(error, context)) {
        // Auth error was handled, don't re-throw
        return;
      }
      // Re-throw non-auth errors
      throw error;
    }
  };
};
