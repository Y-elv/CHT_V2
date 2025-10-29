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
    const socket: Socket = io("https://chtv2-bn.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    // Listen for new consultations
    socket.on("consultation:new", (consultation) => {
      console.log("New consultation:", consultation);
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

    // Listen for consultation status updates
    socket.on("consultation:updated", (consultation) => {
      console.log("Consultation updated:", consultation);
      fetchConsultations();
    });

    // Listen for urgent mental health alerts
    socket.on("alert:mental-health", (alert) => {
      console.log("Mental health alert:", alert);
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

    // Listen for new user registrations
    socket.on("user:registered", (user) => {
      console.log("New user registered:", user);
      fetchDashboardStats();
    });

    // Listen for doctor availability changes
    socket.on("doctor:availability", (doctor) => {
      console.log("Doctor availability changed:", doctor);
      fetchDoctors();
    });

    // Listen for new messages
    socket.on("message:new", (message) => {
      console.log("New message:", message);

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

    // Listen for game achievements
    socket.on("game:achievement", (achievement) => {
      console.log("Game achievement:", achievement);
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
