// hooks/useRealTimeUpdates.ts
import { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { useAdminStore } from "../store/adminStore";
import { useToast } from "@chakra-ui/react";

export const useRealTimeUpdates = () => {
  const socketRef = useRef<Socket | null>(null);
  const fetchDashboardStats = useAdminStore(
    (state) => state.fetchDashboardStats
  );
  const fetchConsultations = useAdminStore((state) => state.fetchConsultations);
  const fetchDoctors = useAdminStore((state) => state.fetchDoctors);
  const fetchRecentActivity = useAdminStore(
    (state) => state.fetchRecentActivity
  );
  const toast = useToast();

  useEffect(() => {
    // Initialize Socket.io connection
    const socket: Socket = io("", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {});

    socket.on("disconnect", () => {});

    socket.on("consultation:new", (consultation) => {
      fetchConsultations();
      fetchDashboardStats();

      toast({
        title: "New Consultation",
        description: `New consultation from ${consultation.userName}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    });

    socket.on("consultation:updated", () => {
      fetchConsultations();
    });

    socket.on("alert:mental-health", (alert) => {
      fetchDashboardStats();

      toast({
        title: "Mental Health Alert",
        description:
          alert.description || "New mental health alert requiring attention",
        status: "warning",
        duration: 7000,
        isClosable: true,
        position: "top-right",
      });
    });

    socket.on("user:registered", () => {
      fetchDashboardStats();
    });

    socket.on("doctor:availability", () => {
      fetchDoctors();
    });

    socket.on("message:new", (message) => {
      if (message.priority === "urgent") {
        toast({
          title: "Urgent Message",
          description: `Urgent message from ${message.userName}`,
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      }
    });

    socket.on("game:achievement", () => {
      fetchRecentActivity();
      fetchDashboardStats();
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [
    fetchDashboardStats,
    fetchConsultations,
    fetchDoctors,
    fetchRecentActivity,
    toast,
  ]);

  return socketRef.current;
};
