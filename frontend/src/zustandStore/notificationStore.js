/**
 * Notification Store (Zustand)
 * 
 * Global state management for notifications across the application.
 * 
 * Architecture Summary:
 * - Uses Zustand for lightweight state management
 * - Integrates with backend notification APIs
 * - Supports optimistic UI updates
 * - Handles real-time notification additions
 * - Manages unread count and notification list
 */

import { create } from "zustand";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
} from "../services/notificationService";

/**
 * Notification object structure:
 * {
 *   _id: string,
 *   title: string,
 *   message: string,
 *   type: string (e.g., 'system', 'message', 'consultation'),
 *   read: boolean,
 *   createdAt: string (ISO date),
 *   link?: string (optional redirect URL),
 *   ...other fields
 * }
 */

const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetched: null,

  // Actions

  /**
   * Fetch notifications from API
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  fetchNotifications: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      console.log("📡 Fetching notifications from API...");
      const result = await getNotifications(page, limit);
      console.log("📥 API Response:", result);
      console.log("📋 Notifications array:", result.notifications);
      console.log("📊 Total notifications:", result.notifications?.length || 0);
      
      set({
        notifications: result.notifications || [],
        loading: false,
        lastFetched: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      // ============================================
      // EXPOSE FULL AXIOS ERROR
      // ============================================
      console.error("🟥 RAW AXIOS ERROR:", error);
      console.error("🟥 AXIOS RESPONSE:", error.response);
      console.error("🟥 AXIOS STATUS:", error.response?.status);
      console.error("🟥 AXIOS DATA:", error.response?.data);
      console.error("❌ Failed to fetch notifications:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      set({
        loading: false,
        error: error.message || "Failed to fetch notifications",
        notifications: [], // Set empty array on error
      });
      
      // Preserve original Axios error structure when re-throwing
      if (error.response) {
        throw error; // Re-throw original Axios error with response
      } else {
        const enhancedError = Object.assign(new Error(error.message || "Failed to fetch notifications"), {
          originalError: error,
          request: error.request,
          response: null,
          isAxiosError: error.isAxiosError || false,
        });
        throw enhancedError;
      }
    }
  },

  /**
   * Fetch unread count from API
   */
  fetchUnreadCount: async () => {
    try {
      console.log("🔴 Fetching unread count from API...");
      const count = await getUnreadCount();
      console.log("🔴 Unread count received:", count);
      set({ unreadCount: count || 0 });
      return count || 0;
    } catch (error) {
      // ============================================
      // EXPOSE FULL AXIOS ERROR
      // ============================================
      console.error("🟥 RAW AXIOS ERROR:", error);
      console.error("🟥 AXIOS RESPONSE:", error.response);
      console.error("🟥 AXIOS STATUS:", error.response?.status);
      console.error("🟥 AXIOS DATA:", error.response?.data);
      console.error("❌ Failed to fetch unread count:", error);
      console.error("Error response:", error.response?.data);
      // Don't throw, just log - we'll use the current state
      const currentCount = get().unreadCount;
      console.log("Using current unread count:", currentCount);
      return currentCount;
    }
  },

  /**
   * Mark a notification as read (optimistic update)
   * @param {string} notificationId - The notification ID
   */
  markAsRead: async (notificationId) => {
    const { notifications, unreadCount } = get();

    // Optimistic update: immediately update UI
    const updatedNotifications = notifications.map((notif) => {
      const matches = notif._id === notificationId || notif.id === notificationId;
      if (matches) {
        // Normalize: set both read and isRead for consistency
        return { ...notif, read: true, isRead: true };
      }
      return notif;
    });

    // Check if notification was unread (support both read and isRead properties)
    const wasUnread = notifications.find((n) => {
      const matches = (n._id === notificationId || n.id === notificationId);
      const isUnread = n.read === false || n.isRead === false || (!n.read && !n.isRead);
      return matches && isUnread;
    });

    set({
      notifications: updatedNotifications,
      unreadCount: wasUnread ? Math.max(0, unreadCount - 1) : unreadCount,
    });

    // Then call API
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      // ============================================
      // EXPOSE FULL AXIOS ERROR
      // ============================================
      console.error("🟥 RAW AXIOS ERROR:", error);
      console.error("🟥 AXIOS RESPONSE:", error.response);
      console.error("🟥 AXIOS STATUS:", error.response?.status);
      console.error("🟥 AXIOS DATA:", error.response?.data);
      console.error("Failed to mark notification as read:", error);
      // Revert optimistic update on error
      set({
        notifications,
        unreadCount,
      });
      
      // Preserve original Axios error structure when re-throwing
      if (error.response) {
        throw error; // Re-throw original Axios error with response
      } else {
        const enhancedError = Object.assign(new Error(error.message || "Failed to mark notification as read"), {
          originalError: error,
          request: error.request,
          response: null,
          isAxiosError: error.isAxiosError || false,
        });
        throw enhancedError;
      }
    }
  },

  /**
   * Add a new incoming notification (for real-time updates)
   * @param {Object} newNotification - The new notification object
   */
  addIncomingNotification: (newNotification) => {
    const { notifications, unreadCount } = get();

    // Check if notification already exists (prevent duplicates)
    const exists = notifications.some(
      (n) => n._id === newNotification._id || n.id === newNotification.id
    );

    if (!exists) {
      // Normalize: ensure read property exists (convert isRead if needed)
      const normalized = newNotification.isRead !== undefined && newNotification.read === undefined
        ? { ...newNotification, read: !newNotification.isRead }
        : newNotification;
      
      const isUnread = normalized.read === false || normalized.isRead === false || (!normalized.read && !normalized.isRead);
      
      set({
        notifications: [normalized, ...notifications],
        unreadCount: isUnread ? unreadCount + 1 : unreadCount,
      });
    }
  },

  /**
   * Refresh both notifications and unread count
   */
  refresh: async () => {
    await Promise.all([
      get().fetchNotifications(),
      get().fetchUnreadCount(),
    ]);
  },

  /**
   * Clear all notifications (useful for logout)
   */
  clear: () => {
    set({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
      lastFetched: null,
    });
  },
}));

export default useNotificationStore;

