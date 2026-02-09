/**
 * Notification API Service
 * 
 * Handles all notification-related API calls to the backend
 * Uses axios instance with baseURL configured for cookie-based authentication
 */

import axios from "../api/axios";

// Use relative URLs since axios instance has baseURL configured
const BASE_URL = "/api/v1/notification";

/**
 * Get paginated notifications
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @returns {Promise<{notifications: Array, total: number, page: number, limit: number}>}
 */
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    console.log("🍪 [NOTIFICATION] getNotifications() called");
    console.log("🍪 [NOTIFICATION] Timestamp:", new Date().toISOString());
    console.log("🍪 [NOTIFICATION] Using cookie-based authentication");
    
    const response = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`);
    
    console.log("📦 [NOTIFICATION] Response:", response.status, response.data);
    
    return response.data;
  } catch (error) {
    console.error("❌ [NOTIFICATION] Error fetching notifications:", error);
    
    // Handle 401 Unauthorized - session expired
    if (error.response?.status === 401) {
      console.log("🔒 [NOTIFICATION] 401 Unauthorized - session expired");
      
      const authError = new Error("Session expired. Please login again.");
      authError.status = 401;
      authError.isAuthError = true;
      authError.response = error.response;
      authError.requiresReauth = true; // ✅ Add flag for reauth handling
      
      throw authError;
    }

    // Handle other errors
    if (error.response) {
      const apiError = new Error(error.response?.data?.message || "An error occurred");
      apiError.status = error.response.status;
      apiError.response = error.response;
      apiError.isApiError = true;
      
      throw apiError;
    }

    // Network errors
    if (error.request) {
      const networkError = new Error("Network error. Please check your connection.");
      networkError.isNetworkError = true;
      networkError.request = error.request;
      
      throw networkError;
    }

    // Setup errors
    const setupError = new Error("An unexpected error occurred.");
    setupError.isSetupError = true;
    
    throw setupError;
  }
};

/**
 * Get unread notification count
 * @returns {Promise<number>}
 */
export const getUnreadCount = async () => {
  try {
    console.log("🍪 [NOTIFICATION] getUnreadCount() called");
    
    const response = await axios.get(`${BASE_URL}/unread-count`);
    console.log("📦 [NOTIFICATION] Unread Count Response:", response.data);
    
    // Handle different response structures
    if (typeof response.data === "number") {
      return response.data;
    }
    if (response.data?.count !== undefined) {
      return response.data.count;
    }
    if (response.data?.unreadCount !== undefined) {
      return response.data.unreadCount;
    }
    
    return 0;
  } catch (error) {
    console.error("❌ [NOTIFICATION] Error fetching unread count:", error);
    return 0;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The notification ID
 * @returns {Promise<{success: boolean, notification: Object}>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    console.log("🍪 [NOTIFICATION] Marking notification as read:", notificationId);
    
    const response = await axios.patch(`${BASE_URL}/${notificationId}/read`);
    
    return {
      success: true,
      notification: response.data?.data || response.data || {},
    };
  } catch (error) {
    console.error("❌ [NOTIFICATION] Error marking notification as read:", error);
    
    // Preserve original Axios error structure
    if (error.response) {
      throw error;
    } else {
      const enhancedError = new Error(error.message || "Request failed");
      enhancedError.originalError = error;
      enhancedError.request = error.request;
      enhancedError.response = null;
      throw enhancedError;
    }
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<{success: boolean}>}
 */
export const markAllNotificationsAsRead = async () => {
  try {
    console.log("🍪 [NOTIFICATION] Marking all notifications as read");
    
    // Try bulk endpoint first
    try {
      const response = await axios.patch(`${BASE_URL}/mark-all-read`);
      console.log("📦 [NOTIFICATION] Bulk mark as read response:", response.data);
      return { success: true };
    } catch (bulkError) {
      console.log("🔄 [NOTIFICATION] Bulk endpoint not available, marking individually");
      
      // Fallback: mark each notification individually
      const { notifications } = await getNotifications(1, 100);
      const unreadNotifications = notifications.filter((n) => n.unread);
      
      await Promise.all(
        unreadNotifications.map((n) => markNotificationAsRead(n._id || n.id))
      );
      
      return { success: true };
    }
  } catch (error) {
    console.error("❌ [NOTIFICATION] Error marking all as read:", error);
    
    // Preserve original Axios error structure
    if (error.response) {
      throw error;
    } else {
      const enhancedError = new Error(error.message || "Request failed");
      enhancedError.originalError = error;
      enhancedError.request = error.request;
      enhancedError.response = null;
      throw enhancedError;
    }
  }
};

// Export the function with the correct name for backward compatibility
export const markAllAsRead = markAllNotificationsAsRead;
