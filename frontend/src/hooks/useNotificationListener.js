/**
 * Notification Listener Hook
 * 
 * Listens for new notifications and shows toast alerts.
 * Also handles auto-fetching notifications on app load.
 */

import { useEffect, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import useNotificationStore from "../zustandStore/notificationStore";

/**
 * Hook to set up notification listening and auto-fetch
 * Call this in your main App component or layout
 */
export const useNotificationListener = () => {
  const toast = useToast();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    addIncomingNotification,
    refresh,
  } = useNotificationStore();

  const previousNotificationsRef = useRef([]);
  const previousUnreadCountRef = useRef(0);

  // Auto-fetch on mount
  useEffect(() => {
    // Check if token exists using SINGLE source
    const token = localStorage.getItem("token");
    if (token) {
      console.log("[AUTH][STORAGE] Token found on mount, fetching notifications");
      console.log("[AUTH][STORAGE] Token length:", token.length);
      // Fetch notifications and unread count
      refresh().catch((error) => {
        // ============================================
        // EXPOSE FULL AXIOS ERROR
        // ============================================
        console.error("🟥 RAW AXIOS ERROR:", error);
        console.error("🟥 AXIOS RESPONSE:", error.response);
        console.error("🟥 AXIOS STATUS:", error.response?.status);
        console.error("🟥 AXIOS DATA:", error.response?.data);
        console.error("[AUTH][RESPONSE][401] Failed to fetch notifications on mount:", error);
      });
    } else {
      console.log("[AUTH][STORAGE] No token found, skipping notification fetch");
    }
  }, []); // Only run once on mount

  // Listen for new notifications and show toast
  useEffect(() => {
    const previousNotifications = previousNotificationsRef.current;
    const previousUnreadCount = previousUnreadCountRef.current;

    // Find new notifications (not in previous list)
    const newNotifications = notifications.filter((notif) => {
      const notifId = notif._id || notif.id;
      return (
        !previousNotifications.some(
          (prev) => (prev._id || prev.id) === notifId
        ) && !notif.read
      );
    });

    // Show toast for each new notification
    newNotifications.forEach((notification) => {
      toast({
        title: notification.title || "New Notification",
        description: notification.message || notification.content || "",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    });

    // Update refs
    previousNotificationsRef.current = notifications;
    previousUnreadCountRef.current = unreadCount;
  }, [notifications, toast]);

  // Optional: Set up polling for notifications (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if token exists using SINGLE source
      const token = localStorage.getItem("token");
      if (token) {
        fetchUnreadCount().catch((error) => {
          // ============================================
          // EXPOSE FULL AXIOS ERROR
          // ============================================
          console.error("🟥 RAW AXIOS ERROR:", error);
          console.error("🟥 AXIOS RESPONSE:", error.response);
          console.error("🟥 AXIOS STATUS:", error.response?.status);
          console.error("🟥 AXIOS DATA:", error.response?.data);
          console.error("[AUTH][RESPONSE][401] Failed to poll unread count:", error);
        });
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    refresh,
  };
};

export default useNotificationListener;

