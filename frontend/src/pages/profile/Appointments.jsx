import React, { useState, useEffect } from "react";
import { useToast, Avatar, Badge, Box, Spinner, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { RiCalendarEventLine, RiVideoChatLine, RiHospitalLine, RiTimeLine, RiCheckboxCircleLine, RiCloseCircleLine, RiLoader4Line } from "react-icons/ri";
import { getUserAppointments } from "../../services/appointmentService";
import Navbar from "../../components/navbar/navbar";
import { ChatState } from "../../components/Context/chatProvider";
import { useBadgeStore } from "../../zustandStore/store";
import { Link, useLocation } from "react-router-dom";
import {
  IoChatboxOutline,
  IoLogOut,
  IoNewspaperOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { RiGamepadLine } from "react-icons/ri";
import { FaUserMd } from "react-icons/fa";

const Appointments = () => {
  const { user, logoutHandler } = ChatState();
  const profile = useBadgeStore((state) => state.profile) || null;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(''); // '' for all, 'pending', 'approved', 'cancelled'
  const toast = useToast();
  const location = useLocation();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  const displayUser = profile || user;
  const userName = displayUser?.name || "User";

  const sidebarItems = [
    { to: "/consultation", label: "Consultation", icon: FaUserMd },
    { to: "/chats", label: "Chats", icon: IoChatboxOutline },
    { to: "/game", label: "Game", icon: RiGamepadLine },
    { to: "/news", label: "News", icon: IoNewspaperOutline },
    { to: "/profile", label: "Settings", icon: IoSettingsOutline },
    { to: "/profile/appointments", label: "Appointments", icon: RiCalendarEventLine },
    { label: "Sign Out", icon: IoLogOut, isLogout: true },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    fetchAppointments();
  }, [page, selectedStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getUserAppointments(page, 20, selectedStatus);
      
      if (response && response.appointments) {
        // Sort appointments by newest first (using createdAt or date)
        const sortedAppointments = [...response.appointments].sort((a, b) => {
          // Try createdAt first (most accurate), then date, then fallback
          const dateA = a.createdAt ? new Date(a.createdAt) : (a.date ? new Date(a.date) : new Date(0));
          const dateB = b.createdAt ? new Date(b.createdAt) : (b.date ? new Date(b.date) : new Date(0));
          return dateB - dateA; // Newest first (descending order)
        });
        
        setAppointments(sortedAppointments);
        setTotalPages(response.totalPages || 1);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch appointments",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when status filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "green";
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return RiCheckboxCircleLine;
      case "pending":
        return RiLoader4Line;
      case "cancelled":
        return RiCloseCircleLine;
      default:
        return RiCalendarEventLine;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <style>{`
        .tab-container::-webkit-scrollbar {
          display: none;
        }
        .tab-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <div className="flex h-[calc(100vh-80px)] overflow-hidden pb-0">
          {/* Sidebar - Hidden on mobile, visible on lg+ */}
          <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-800 shadow-lg border-r border-slate-200 dark:border-slate-700 flex-shrink-0 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="w-full h-full flex flex-col p-6">
              {/* Navigation Links */}
              <nav className="flex-1 space-y-2 pt-4">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActiveLink = !item.isLogout && isActive(item.to);

                  if (item.isLogout) {
                    return (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (logoutHandler) {
                            logoutHandler();
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Icon className="text-2xl" />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActiveLink
                          ? "bg-gradient-to-r from-[#F7941D] to-[#FFA84D] text-white shadow-lg"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-[#F7941D] dark:hover:text-[#F7941D]"
                      }`}
                    >
                      <Icon className="text-2xl" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-0">
            <div className="max-w-7xl mx-auto p-6 lg:p-8 pb-0">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-[#2B2F92] to-[#F7941D] bg-clip-text text-transparent">
                  My Appointments
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  View and manage your appointment requests
                </p>
              </motion.div>

              {/* Status Filter Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 tab-container">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStatus('')}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      selectedStatus === ''
                        ? 'bg-gradient-to-r from-[#F7941D] to-[#FFA84D] text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-[#F7941D] dark:hover:border-[#F7941D]'
                    }`}
                  >
                    All Appointments
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStatus('pending')}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
                      selectedStatus === 'pending'
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-yellow-400 dark:hover:border-yellow-400'
                    }`}
                  >
                    <RiLoader4Line className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">Pending</span>
                    <span className="sm:hidden">Pending</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStatus('approved')}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
                      selectedStatus === 'approved'
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-400'
                    }`}
                  >
                    <RiCheckboxCircleLine className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">Approved</span>
                    <span className="sm:hidden">Approved</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStatus('cancelled')}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
                      selectedStatus === 'cancelled'
                        ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-400'
                    }`}
                  >
                    <RiCloseCircleLine className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">Cancelled</span>
                    <span className="sm:hidden">Cancelled</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Appointments List */}
              {loading ? (
                <VStack spacing={4} py={12}>
                  <Spinner size="xl" color="#F7941D" thickness="4px" />
                  <Text color={subTextColor}>Loading appointments...</Text>
                </VStack>
              ) : appointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-12 text-center"
                >
                  <RiCalendarEventLine className="text-6xl text-slate-400 mx-auto mb-4" />
                  <Text fontSize="xl" fontWeight="bold" color={textColor} mb={2}>
                    No Appointments Found
                  </Text>
                  <Text color={subTextColor} mb={6}>
                    {selectedStatus 
                      ? `You don't have any ${selectedStatus} appointments.`
                      : "You haven't requested any appointments yet."}
                  </Text>
                  <Link
                    to="/consultation"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#F7941D] to-[#FFA84D] hover:from-[#FFA84D] hover:to-[#F7941D] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Book an Appointment
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {appointments.map((appointment, index) => {
                    const StatusIcon = getStatusIcon(appointment.status);
                    const statusColor = getStatusColor(appointment.status);

                    return (
                      <motion.div
                        key={appointment._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            {/* Left Section - Doctor Info */}
                            <div className="flex-1 flex items-start gap-4">
                              <Avatar
                                src={appointment.doctor?.pic}
                                name={appointment.doctor?.name}
                                size="lg"
                                border="3px solid"
                                borderColor="#F7941D"
                                boxShadow="0 4px 12px rgba(247, 148, 29, 0.3)"
                              />
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                                  {appointment.doctor?.name || "Dr. Unknown"}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                  {appointment.doctor?.specialty || "General Practitioner"}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                  <HStack spacing={1} color={subTextColor}>
                                    <RiCalendarEventLine />
                                    <span>{formatDate(appointment.date)}</span>
                                  </HStack>
                                  <HStack spacing={1} color={subTextColor}>
                                    <RiTimeLine />
                                    <span>{appointment.time || "N/A"}</span>
                                  </HStack>
                                  <HStack spacing={1} color={subTextColor}>
                                    {appointment.appointmentType === "video" ? (
                                      <>
                                        <RiVideoChatLine />
                                        <span>Video Consultation</span>
                                      </>
                                    ) : (
                                      <>
                                        <RiHospitalLine />
                                        <span>In-person</span>
                                      </>
                                    )}
                                  </HStack>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - Status & Actions */}
                            <div className="flex flex-col items-end gap-3">
                              <Badge
                                colorScheme={statusColor}
                                fontSize="sm"
                                px={3}
                                py={1}
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                gap={2}
                              >
                                <StatusIcon />
                                {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1) || "Unknown"}
                              </Badge>
                              
                              {appointment.status === "approved" && appointment.appointmentType === "video" && appointment.callLink && (
                                <a
                                  href={appointment.callLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-gradient-to-r from-[#2B2F92] to-[#F7941D] hover:from-[#F7941D] hover:to-[#2B2F92] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm flex items-center gap-2"
                                >
                                  <RiVideoChatLine />
                                  Join Call
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Additional Details */}
                          {(appointment.reason || appointment.notes || appointment.cancellationReason) && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                              <div className="space-y-4">
                                {appointment.reason && (
                                  <div className="bg-gradient-to-r from-[#F7941D]/20 to-[#FFA84D]/20 dark:from-[#F7941D]/30 dark:to-[#FFA84D]/30 rounded-lg p-4 border-2 border-[#F7941D]/50 shadow-md">
                                    <Text 
                                      fontSize="md" 
                                      fontWeight="bold" 
                                      mb={2}
                                      className="text-[#F7941D] dark:text-[#FFA84D]"
                                    >
                                      Reason:
                                    </Text>
                                    <Text 
                                      fontSize="md" 
                                      className="font-semibold text-slate-800 dark:text-slate-100 leading-relaxed"
                                    >
                                      {appointment.reason}
                                    </Text>
                                  </div>
                                )}
                                {appointment.notes && (
                                  <div className="bg-gradient-to-r from-[#2B2F92]/20 to-[#1e2266]/20 dark:from-[#2B2F92]/30 dark:to-[#1e2266]/30 rounded-lg p-4 border-2 border-[#2B2F92]/50 shadow-md">
                                    <Text 
                                      fontSize="md" 
                                      fontWeight="bold" 
                                      mb={2}
                                      className="text-[#2B2F92] dark:text-[#4A5FD9]"
                                    >
                                      Notes:
                                    </Text>
                                    <Text 
                                      fontSize="md" 
                                      className="font-semibold text-slate-800 dark:text-slate-100 leading-relaxed"
                                    >
                                      {appointment.notes}
                                    </Text>
                                  </div>
                                )}
                                {appointment.cancellationReason && (
                                  <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 dark:from-red-500/30 dark:to-red-600/30 rounded-lg p-4 border-2 border-red-500/50 shadow-md">
                                    <Text 
                                      fontSize="md" 
                                      fontWeight="bold" 
                                      mb={2}
                                      className="text-red-600 dark:text-red-400"
                                    >
                                      Cancellation Reason:
                                    </Text>
                                    <Text 
                                      fontSize="md" 
                                      className="font-semibold text-red-700 dark:text-red-300 leading-relaxed"
                                    >
                                      {appointment.cancellationReason}
                                    </Text>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Pagination */}
              {!loading && appointments.length > 0 && totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center items-center gap-4 mt-8"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Previous
                  </button>
                  <Text color={textColor} fontWeight="medium">
                    Page {page} of {totalPages}
                  </Text>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Appointments;

