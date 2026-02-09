/**
 * Notification API Service
 * 
 * Handles all notification-related API calls to the backend
 * Uses axios instance with baseURL configured
 */

import axios from "../config/axiosConfig";

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
    // ============================================
    // [FRONTEND][NOTIFICATION] Pre-Request Token Check
    // ============================================
    console.log("============================================");
    console.log("[FRONTEND][NOTIFICATION] getNotifications() called");
    console.log("[FRONTEND][NOTIFICATION] Timestamp:", new Date().toISOString());
    
    // Check if token exists before making request
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.trim() : null;
    
    console.log("[FRONTEND][NOTIFICATION] Raw token from storage:", !!rawToken);
    console.log("[FRONTEND][NOTIFICATION] Token exists (after trim):", !!token);
    console.log("[FRONTEND][NOTIFICATION] Token length:", token?.length || 0);
    console.log("[FRONTEND][NOTIFICATION] Token first 20 chars:", token ? token.substring(0, 20) : "null");
    console.log("[FRONTEND][NOTIFICATION] Token starts with 'eyJ':", token?.startsWith('eyJ') || false);
    console.log("[FRONTEND][NOTIFICATION] Token format check:", token && token.split('.').length === 3 ? "VALID JWT" : "INVALID");
    
    if (!token) {
      console.warn("[FRONTEND][NOTIFICATION] ❌ No token found - skipping notification fetch");
      throw new Error("Not authenticated - token missing");
    }
    
    // Check if token is Google OAuth id_token (should NOT be)
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const isGoogleToken = decoded.iss && decoded.iss.includes('google');
      console.log("[FRONTEND][NOTIFICATION] Token issuer:", decoded.iss || "unknown");
      console.log("[FRONTEND][NOTIFICATION] Is Google OAuth token:", isGoogleToken);
      if (isGoogleToken) {
        console.error("[FRONTEND][NOTIFICATION] ⚠️ WARNING: Token appears to be Google OAuth id_token, not backend JWT!");
      }
    } catch (e) {
      console.warn("[FRONTEND][NOTIFICATION] Could not decode token for issuer check:", e.message);
    }
    
    console.log("[FRONTEND][NOTIFICATION] Making request to:", `${BASE_URL}?page=${page}&limit=${limit}`);
    console.log("============================================");
    
    const response = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`);
    console.log("📦 Full API Response:", response);
    console.log("📦 Response Data:", response.data);
    console.log("📦 Response Status:", response.status);
    
    // Normalize notification property: isRead -> read
    const normalizeNotification = (notif) => {
      if (notif && typeof notif === 'object') {
        // Convert isRead to read for consistency
        if ('isRead' in notif && !('read' in notif)) {
          return { ...notif, read: !notif.isRead }; // isRead: false means read: false (unread)
        }
        // If both exist, prefer read, but ensure it's boolean
        if ('read' in notif) {
          return { ...notif, read: Boolean(notif.read === false || notif.read === 0) };
        }
        return notif;
      }
      return notif;
    };
    
    let notificationsArray = [];
    
    // Handle different response structures (check in order of likelihood)
    if (response.data?.notifications && Array.isArray(response.data.notifications)) {
      // Structure: { notifications: [...], total, page, limit }
      notificationsArray = response.data.notifications;
      console.log("✅ Using response.data.notifications structure");
      console.log("📋 Found", notificationsArray.length, "notifications");
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      // Structure: { data: [...], total, page, limit }
      notificationsArray = response.data.data;
      console.log("✅ Using response.data.data structure");
      console.log("📋 Found", notificationsArray.length, "notifications");
    } else if (Array.isArray(response.data)) {
      // Structure: [...] (direct array)
      notificationsArray = response.data;
      console.log("✅ Using direct array structure");
      console.log("📋 Found", notificationsArray.length, "notifications");
    } else {
      console.warn("⚠️ Unknown response structure");
      console.warn("⚠️ Response.data type:", typeof response.data);
      console.warn("⚠️ Response.data:", JSON.stringify(response.data, null, 2));
      console.warn("⚠️ Response keys:", Object.keys(response.data || {}));
      notificationsArray = [];
    }
    
    // Normalize all notifications (isRead -> read)
    const normalizedNotifications = notificationsArray.map(normalizeNotification);
    
    console.log("📋 Raw notifications count:", notificationsArray.length);
    console.log("📋 Normalized notifications count:", normalizedNotifications.length);
    console.log("📋 Sample notification:", normalizedNotifications[0]);
    
    return {
      notifications: normalizedNotifications,
      total: response.data?.total || normalizedNotifications.length || 0,
      page: response.data?.page || page,
      limit: response.data?.limit || limit,
    };
  } catch (error) {
    // ============================================
    // [FRONTEND][NOTIFICATION] Error Handling
    // ============================================
    console.error("============================================");
    console.error("[FRONTEND][NOTIFICATION] ❌ Error fetching notifications");
    
    // ============================================
    // EXPOSE FULL AXIOS ERROR - BEFORE ANY WRAPPING
    // ============================================
    console.error("🟥 RAW AXIOS ERROR:", error);
    console.error("🟥 AXIOS RESPONSE:", error.response);
    console.error("🟥 AXIOS STATUS:", error.response?.status);
    console.error("🟥 AXIOS DATA:", error.response?.data);
    
    console.error("[FRONTEND][NOTIFICATION] Error type:", error.constructor.name);
    console.error("[FRONTEND][NOTIFICATION] Error message:", error.message);
    console.error("[FRONTEND][NOTIFICATION] Error has response:", !!error.response);
    console.error("[FRONTEND][NOTIFICATION] Error has request:", !!error.request);
    
    if (error.response) {
      console.error("[FRONTEND][NOTIFICATION] Response status:", error.response.status);
      console.error("[FRONTEND][NOTIFICATION] Response status text:", error.response.statusText);
      console.error("[FRONTEND][NOTIFICATION] Response data:", JSON.stringify(error.response.data, null, 2));
      console.error("[FRONTEND][NOTIFICATION] Response headers:", error.response.headers);
      console.error("[FRONTEND][NOTIFICATION] Request URL:", error.response.config?.url);
      console.error("[FRONTEND][NOTIFICATION] Request method:", error.response.config?.method);
      console.error("[FRONTEND][NOTIFICATION] Authorization header sent:", !!error.response.config?.headers?.Authorization || !!error.response.config?.headers?.authorization);
      if (error.response.config?.headers?.Authorization || error.response.config?.headers?.authorization) {
        const sentHeader = error.response.config?.headers?.Authorization || error.response.config?.headers?.authorization;
        console.error("[FRONTEND][NOTIFICATION] Sent header preview:", sentHeader.substring(0, 60) + "...");
      }
    } else if (error.request) {
      console.error("[FRONTEND][NOTIFICATION] No response received - network error");
      console.error("[FRONTEND][NOTIFICATION] Request object:", error.request);
      console.error("[FRONTEND][NOTIFICATION] This is a NETWORK ERROR (no backend response)");
    } else {
      console.error("[FRONTEND][NOTIFICATION] Request setup error:", error.message);
      console.error("[FRONTEND][NOTIFICATION] This is a REQUEST SETUP ERROR (not an Axios response error)");
    }
    console.error("============================================");
    
    // Re-throw with original Axios error structure preserved
    // Ensure error.response, error.response.data, and error.response.status are attached
    if (error.response) {
      // Preserve full Axios error structure
      throw error;
    } else {
      // For non-response errors, create error object that preserves structure
      const enhancedError = new Error(error.message || "Request failed");
      enhancedError.originalError = error;
      enhancedError.request = error.request;
      enhancedError.response = null; // Explicitly set to null to indicate no response
      enhancedError.isAxiosError = error.isAxiosError || false;
      throw enhancedError;
    }
  }
};

/**
 * Get unread notification count
 * @returns {Promise<number>}
 */
export const getUnreadCount = async () => {
  try {
    // ============================================
    // [FRONTEND][NOTIFICATION] Pre-Request Token Check
    // ============================================
    console.log("============================================");
    console.log("[FRONTEND][NOTIFICATION] getUnreadCount() called");
    console.log("[FRONTEND][NOTIFICATION] Timestamp:", new Date().toISOString());
    
    // Check if token exists before making request
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.trim() : null;
    
    console.log("[FRONTEND][NOTIFICATION] Raw token from storage:", !!rawToken);
    console.log("[FRONTEND][NOTIFICATION] Token exists (after trim):", !!token);
    console.log("[FRONTEND][NOTIFICATION] Token length:", token?.length || 0);
    console.log("[FRONTEND][NOTIFICATION] Token first 20 chars:", token ? token.substring(0, 20) : "null");
    console.log("[FRONTEND][NOTIFICATION] Token starts with 'eyJ':", token?.startsWith('eyJ') || false);
    
    if (!token) {
      console.warn("[FRONTEND][NOTIFICATION] ❌ No token found - skipping unread count fetch");
      return 0; // Return 0 instead of throwing to prevent UI breaking
    }
    
    console.log("[FRONTEND][NOTIFICATION] Making request to:", `${BASE_URL}/unread-count`);
    console.log("============================================");
    
    const response = await axios.get(`${BASE_URL}/unread-count`);
    console.log("📦 Unread Count Response:", response.data);
    
    // Handle different response structures
    if (typeof response.data === "number") {
      console.log("✅ Direct number response:", response.data);
      return response.data;
    }
    if (response.data?.count !== undefined) {
      console.log("✅ Using response.data.count:", response.data.count);
      return response.data.count;
    }
    if (response.data?.unreadCount !== undefined) {
      console.log("✅ Using response.data.unreadCount:", response.data.unreadCount);
      return response.data.unreadCount;
    }
    console.warn("⚠️ Unknown unread count structure, returning 0");
    return 0;
  } catch (error) {
    // ============================================
    // [FRONTEND][NOTIFICATION] Error Handling
    // ============================================
    console.error("============================================");
    console.error("[FRONTEND][NOTIFICATION] ❌ Error fetching unread count");
    
    // ============================================
    // EXPOSE FULL AXIOS ERROR - BEFORE ANY WRAPPING
    // ============================================
    console.error("🟥 RAW AXIOS ERROR:", error);
    console.error("🟥 AXIOS RESPONSE:", error.response);
    console.error("🟥 AXIOS STATUS:", error.response?.status);
    console.error("🟥 AXIOS DATA:", error.response?.data);
    
    console.error("[FRONTEND][NOTIFICATION] Error type:", error.constructor.name);
    console.error("[FRONTEND][NOTIFICATION] Error message:", error.message);
    console.error("[FRONTEND][NOTIFICATION] Error has response:", !!error.response);
    console.error("[FRONTEND][NOTIFICATION] Error has request:", !!error.request);
    
    if (error.response) {
      console.error("[FRONTEND][NOTIFICATION] Response status:", error.response.status);
      console.error("[FRONTEND][NOTIFICATION] Response data:", JSON.stringify(error.response.data, null, 2));
      console.error("[FRONTEND][NOTIFICATION] Request URL:", error.response.config?.url);
      console.error("[FRONTEND][NOTIFICATION] Authorization header sent:", !!error.response.config?.headers?.Authorization || !!error.response.config?.headers?.authorization);
      console.error("[FRONTEND][NOTIFICATION] This is an AXIOS RESPONSE ERROR (backend responded)");
    } else if (error.request) {
      console.error("[FRONTEND][NOTIFICATION] This is a NETWORK ERROR (no backend response)");
    } else {
      console.error("[FRONTEND][NOTIFICATION] This is a REQUEST SETUP ERROR (not an Axios response error)");
    }
    console.error("============================================");
    // Return 0 on error to prevent UI breaking
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
    const response = await axios.patch(`${BASE_URL}/${notificationId}/read`);
    return {
      success: true,
      notification: response.data?.data || response.data || {},
    };
  } catch (error) {
    // ============================================
    // EXPOSE FULL AXIOS ERROR
    // ============================================
    console.error("🟥 RAW AXIOS ERROR:", error);
    console.error("🟥 AXIOS RESPONSE:", error.response);
    console.error("🟥 AXIOS STATUS:", error.response?.status);
    console.error("🟥 AXIOS DATA:", error.response?.data);
    console.error("Error marking notification as read:", error);
    
    // Preserve original Axios error structure
    if (error.response) {
      throw error; // Re-throw original Axios error with response
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
export const markAllAsRead = async () => {
  try {
    // If backend supports this endpoint, use it
    // Otherwise, mark each notification individually
    const { notifications } = await getNotifications(1, 100);
    const unreadNotifications = notifications.filter((n) => !n.read);
    
    await Promise.all(
      unreadNotifications.map((n) => markNotificationAsRead(n._id || n.id))
    );
    
    return { success: true };
  } catch (error) {
    // ============================================
    // EXPOSE FULL AXIOS ERROR
    // ============================================
    console.error("🟥 RAW AXIOS ERROR:", error);
    console.error("🟥 AXIOS RESPONSE:", error.response);
    console.error("🟥 AXIOS STATUS:", error.response?.status);
    console.error("🟥 AXIOS DATA:", error.response?.data);
    console.error("Error marking all as read:", error);
    
    // Preserve original Axios error structure
    if (error.response) {
      throw error; // Re-throw original Axios error with response
    } else {
      const enhancedError = new Error(error.message || "Request failed");
      enhancedError.originalError = error;
      enhancedError.request = error.request;
      enhancedError.response = null;
      throw enhancedError;
    }
  }
};

