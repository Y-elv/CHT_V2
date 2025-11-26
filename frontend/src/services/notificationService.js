/**
 * Notification API Service
 * 
 * Handles all notification-related API calls to the backend
 * Base URL: https://chtv2-bn.onrender.com/api/v1/notification
 */

import axios from "../config/axiosConfig";

const BASE_URL = "https://chtv2-bn.onrender.com/api/v1/notification";

/**
 * Get paginated notifications
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @returns {Promise<{notifications: Array, total: number, page: number, limit: number}>}
 */
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    console.log("🌐 API Call: GET", `${BASE_URL}?page=${page}&limit=${limit}`);
    
    // Check if user is authenticated
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    console.log("🔑 User token available:", !!userInfo?.token);
    
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
    console.error("❌ Error fetching notifications:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error data:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    throw error;
  }
};

/**
 * Get unread notification count
 * @returns {Promise<number>}
 */
export const getUnreadCount = async () => {
  try {
    console.log("🌐 API Call: GET", `${BASE_URL}/unread-count`);
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
    console.error("❌ Error fetching unread count:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error data:", error.response?.data);
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
    console.error("Error marking notification as read:", error);
    throw error;
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
    console.error("Error marking all as read:", error);
    throw error;
  }
};

