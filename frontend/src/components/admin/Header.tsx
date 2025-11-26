// components/admin/Header.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Button,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Divider,
} from "@chakra-ui/react";
import {
  RiSearchLine,
  RiBellLine,
  RiAddCircleLine,
  RiLogoutBoxLine,
  RiUserLine,
  RiSettingsLine,
  RiVideoChatLine,
  RiUserAddLine,
  RiMegaphoneLine,
  RiMenuLine,
  RiUserHeartLine,
  RiStethoscopeLine,
} from "react-icons/ri";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../../zustandStore/notificationStore";
import { useAuth } from "../../contexts/AuthContext";

const MotionBox = motion(Box);

// Dummy notification data
const notificationData = [
  {
    id: "n1",
    title: "New consultation request",
    message: "Alice Johnson requested a consultation with Dr. Sarah Williams",
    time: "2 minutes ago",
    type: "consultation",
    unread: true,
  },
  {
    id: "n2",
    title: "System update",
    message: "Health game analytics have been updated",
    time: "1 hour ago",
    type: "system",
    unread: true,
  },
  {
    id: "n3",
    title: "New user registration",
    message: "Bob Smith has joined the platform",
    time: "3 hours ago",
    type: "user",
    unread: false,
  },
  {
    id: "n4",
    title: "Consultation completed",
    message: "Dr. Michael Chen completed consultation with Charlie Brown",
    time: "5 hours ago",
    type: "consultation",
    unread: false,
  },
  {
    id: "n5",
    title: "Maintenance scheduled",
    message: "System maintenance scheduled for tomorrow 2 AM",
    time: "1 day ago",
    type: "system",
    unread: false,
  },
];

// Dummy search data
const searchData = {
  users: [
    {
      id: "u1",
      name: "Alice Johnson",
      age: 19,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "u2",
      name: "Bob Smith",
      age: 20,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "u3",
      name: "Charlie Brown",
      age: 18,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "u4",
      name: "Diana Prince",
      age: 21,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: "u5",
      name: "Emma Wilson",
      age: 19,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ],
  doctors: [
    {
      id: "d1",
      name: "Dr. Sarah Williams",
      specialty: "Mental Health",
      type: "doctor",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: "d2",
      name: "Dr. Michael Chen",
      specialty: "Sexual Health",
      type: "doctor",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    {
      id: "d3",
      name: "Dr. Emma Davis",
      specialty: "Mental Health",
      type: "doctor",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  ],
  consultations: [
    {
      id: "c1",
      userName: "Alice Johnson",
      doctorName: "Dr. Sarah Williams",
      type: "consultation",
      status: "in-progress",
    },
    {
      id: "c2",
      userName: "Bob Smith",
      doctorName: "Dr. Michael Chen",
      type: "consultation",
      status: "scheduled",
    },
    {
      id: "c3",
      userName: "Charlie Brown",
      doctorName: "Dr. Emma Davis",
      type: "consultation",
      status: "completed",
    },
  ],
};

interface HeaderProps {
  onScheduleConsultation?: () => void;
  onAddDoctor?: () => void;
  onSendMessage?: () => void;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onScheduleConsultation,
  onAddDoctor,
  onSendMessage,
  onToggleSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Notification Store
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    refresh,
  } = useNotificationStore();

  // Get auth user (with error handling)
  let user, logout;
  try {
    const auth = useAuth();
    user = auth.user;
    logout = auth.logout;
  } catch (error) {
    console.warn("AuthContext not available:", error);
    // Fallback to localStorage
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
      user = userInfo;
    } catch (e) {
      console.error("Failed to get user from localStorage:", e);
    }
  }

  // Log notifications state changes
  useEffect(() => {
    console.log("📊 Notification State Update:");
    console.log("  - Notifications:", notifications);
    console.log("  - Notifications Count:", notifications?.length || 0);
    console.log("  - Unread Count:", unreadCount);
    console.log("  - Loading:", notificationsLoading);
  }, [notifications, unreadCount, notificationsLoading]);

  // Auto-fetch notifications on mount
  useEffect(() => {
    console.log("🔔 Header: Auto-fetching notifications...");
    console.log("👤 Authenticated User:", user);
    console.log("👤 User Token:", user?.token ? "✅ Present" : "❌ Missing");

    if (user && user.token) {
      refresh()
        .then(() => {
          console.log("✅ Notifications fetched successfully");
        })
        .catch((error) => {
          console.error("❌ Failed to fetch notifications:", error);
          console.error(
            "Error details:",
            error.response?.data || error.message
          );
        });
    } else {
      console.warn(
        "⚠️ No authenticated user found, skipping notification fetch"
      );
    }
  }, [refresh, user]);

  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "Just now";
    }
  };

  // Handle notification click
  const handleNotificationItemClick = async (notification: any) => {
    const notificationId = notification._id || notification.id;
    // Support both read and isRead properties
    const isUnread =
      notification.read === false ||
      notification.isRead === false ||
      (!notification.read && notification.isRead === undefined);

    // Mark as read if unread
    if (isUnread && notificationId) {
      try {
        await markAsRead(notificationId);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    // Navigate if link is provided
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    } else {
      setShowNotifications(false);
    }
  };
  // Get user initials (first two letters of name)
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      // Fallback logout
      localStorage.removeItem("userInfo");
    }
    navigate("/login");
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const dropdownBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim())
      return { users: [], doctors: [], consultations: [] };

    const query = searchQuery.toLowerCase();

    return {
      users: searchData.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.age.toString().includes(query)
      ),
      doctors: searchData.doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query)
      ),
      consultations: searchData.consultations.filter(
        (consultation) =>
          consultation.userName.toLowerCase().includes(query) ||
          consultation.doctorName.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery]);

  const totalResults =
    searchResults.users.length +
    searchResults.doctors.length +
    searchResults.consultations.length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleResultClick = (result: any) => {
    setSearchQuery("");
    setShowSuggestions(false);

    if (result.type === "user") {
      navigate("/admin/users");
    } else if (result.type === "doctor") {
      navigate("/admin/doctors");
    } else if (result.type === "consultation") {
      navigate("/admin/consultations");
    }
  };

  const handleQuickAction = (action: string, handler?: () => void) => {
    if (handler) {
      handler();
    } else {
      // Handler will be implemented in the parent component
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowSuggestions(false); // Close search suggestions when opening notifications
  };

  return (
    <Box
      h="70px"
      w="full"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex={1000}
      px={6}
      py={3}
    >
      <Flex align="center" justify="space-between" h="full" minW={0}>
        {/* Mobile Menu Button */}
        <IconButton
          aria-label="Menu"
          icon={<RiMenuLine />}
          variant="ghost"
          size="md"
          display={{ base: "flex", md: "none" }}
          onClick={onToggleSidebar}
        />

        {/* Search */}
        <Box
          position="relative"
          w={{ base: "100%", md: "400px" }}
          maxW="100%"
          px={{ base: 1, md: 0 }}
          flex={1}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <RiSearchLine size={20} />
            </InputLeftElement>
            <Input
              placeholder="Search users, doctors, consultations..."
              size="md"
              borderRadius="full"
              bg={inputBg}
              border="none"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
            />
          </InputGroup>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchQuery && (
            <Box
              position="absolute"
              top="100%"
              left={{ base: -4, md: 0 }}
              right={{ base: -4, md: 0 }}
              mt={2}
              bg={dropdownBg}
              border="1px"
              borderColor={borderColor}
              borderRadius="lg"
              boxShadow="xl"
              zIndex={9999}
              maxH={{ base: "60vh", md: "400px" }}
              overflowX="hidden"
              overflowY="auto"
              width={{ base: "calc(100% + 32px)", md: "auto" }}
              maxWidth="100%"
            >
              {totalResults > 0 ? (
                <VStack align="stretch" spacing={2} p={2}>
                  {searchResults.users.length > 0 && (
                    <>
                      <Text
                        fontSize={{ base: "sm", md: "sm" }}
                        fontWeight="semibold"
                        px={2}
                        color="gray.500"
                      >
                        Users
                      </Text>
                      {searchResults.users.map((user) => (
                        <MotionBox
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ bg: hoverBg }}
                          p={{ base: 2, md: 2 }}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleResultClick(user)}
                        >
                          <HStack spacing={3} minW={0}>
                            <Avatar
                              size="sm"
                              name={user.name}
                              src={user.avatar}
                              flexShrink={0}
                            />
                            <Box flex={1} minW={0}>
                              <HStack minW={0}>
                                <RiUserLine size={16} />
                                <Text
                                  fontSize={{ base: "sm", md: "sm" }}
                                  fontWeight="medium"
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                  whiteSpace="nowrap"
                                >
                                  {user.name}
                                </Text>
                              </HStack>
                              <Text
                                fontSize={{ base: "sm", md: "sm" }}
                                color="gray.500"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                Age: {user.age}
                              </Text>
                            </Box>
                          </HStack>
                        </MotionBox>
                      ))}
                    </>
                  )}

                  {searchResults.doctors.length > 0 && (
                    <>
                      {searchResults.users.length > 0 && <Divider />}
                      <Text
                        fontSize={{ base: "sm", md: "sm" }}
                        fontWeight="semibold"
                        px={2}
                        color="gray.500"
                      >
                        Doctors
                      </Text>
                      {searchResults.doctors.map((doctor) => (
                        <MotionBox
                          key={doctor.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ bg: hoverBg }}
                          p={{ base: 2, md: 2 }}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleResultClick(doctor)}
                        >
                          <HStack spacing={3} minW={0}>
                            <Avatar
                              size="sm"
                              name={doctor.name}
                              src={doctor.avatar}
                              flexShrink={0}
                            />
                            <Box flex={1} minW={0}>
                              <HStack minW={0}>
                                <RiUserHeartLine size={16} />
                                <Text
                                  fontSize={{ base: "sm", md: "sm" }}
                                  fontWeight="medium"
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                  whiteSpace="nowrap"
                                >
                                  {doctor.name}
                                </Text>
                              </HStack>
                              <Text
                                fontSize={{ base: "sm", md: "sm" }}
                                color="gray.500"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {doctor.specialty}
                              </Text>
                            </Box>
                          </HStack>
                        </MotionBox>
                      ))}
                    </>
                  )}

                  {searchResults.consultations.length > 0 && (
                    <>
                      {(searchResults.users.length > 0 ||
                        searchResults.doctors.length > 0) && <Divider />}
                      <Text
                        fontSize={{ base: "sm", md: "sm" }}
                        fontWeight="semibold"
                        px={2}
                        color="gray.500"
                      >
                        Consultations
                      </Text>
                      {searchResults.consultations.map((consultation) => (
                        <MotionBox
                          key={consultation.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ bg: hoverBg }}
                          p={{ base: 2, md: 2 }}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleResultClick(consultation)}
                        >
                          <HStack spacing={3} minW={0}>
                            <RiStethoscopeLine size={16} />
                            <Box flex={1} minW={0}>
                              <Text
                                fontSize={{ base: "sm", md: "sm" }}
                                fontWeight="medium"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {consultation.userName} →{" "}
                                {consultation.doctorName}
                              </Text>
                              <Text
                                fontSize={{ base: "sm", md: "sm" }}
                                color="gray.500"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                Status: {consultation.status}
                              </Text>
                            </Box>
                          </HStack>
                        </MotionBox>
                      ))}
                    </>
                  )}
                </VStack>
              ) : (
                <Box p={4} textAlign="center">
                  <Text fontSize="sm" color="gray.500">
                    No results found for "{searchQuery}"
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Right Side */}
        <HStack spacing={4}>
          {/* Quick Actions - Hide on mobile when search is focused */}
          <HStack
            spacing={2}
            display={{ base: showSuggestions ? "none" : "flex", md: "flex" }}
          >
            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<RiAddCircleLine />}
                colorScheme="blue"
                variant="ghost"
                size="sm"
              >
                Quick Actions
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<RiVideoChatLine />}
                  onClick={() =>
                    handleQuickAction(
                      "Schedule Consultation",
                      onScheduleConsultation
                    )
                  }
                >
                  Schedule Consultation
                </MenuItem>
                <MenuItem
                  icon={<RiUserAddLine />}
                  onClick={() => handleQuickAction("Add Doctor", onAddDoctor)}
                >
                  Add New Doctor
                </MenuItem>
                <MenuItem
                  icon={<RiMegaphoneLine />}
                  onClick={() =>
                    handleQuickAction("Send Awareness Message", onSendMessage)
                  }
                >
                  Send Awareness Message
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* Notifications */}
          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              icon={
                <Box position="relative">
                  <RiBellLine size={22} />
                  {unreadCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      borderRadius="full"
                      bg="red.500"
                      color="white"
                      fontSize="10px"
                      minW="18px"
                      h="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Box>
              }
              variant="ghost"
              size="md"
              onClick={handleNotificationClick}
            />

            {/* Notifications Dropdown */}
            {showNotifications && (
              <Box
                position="absolute"
                top="100%"
                right="0"
                mt={2}
                w={{ base: "300px", md: "350px" }}
                maxW="90vw"
                bg={dropdownBg}
                border="1px"
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="xl"
                zIndex={9999}
                maxH="360px"
                overflowY="auto"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#CBD5E0",
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#A0AEC0",
                  },
                }}
              >
                <VStack align="stretch" spacing={0}>
                  <Box p={3} borderBottom="1px" borderColor={borderColor}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Notifications ({unreadCount} unread)
                    </Text>
                  </Box>

                  {(() => {
                    console.log("🎨 Rendering notification dropdown:");
                    console.log("  - Loading:", notificationsLoading);
                    console.log("  - Notifications array:", notifications);
                    console.log(
                      "  - Notifications type:",
                      Array.isArray(notifications)
                        ? "Array"
                        : typeof notifications
                    );
                    console.log(
                      "  - Notifications length:",
                      notifications?.length || 0
                    );
                    if (notifications && notifications.length > 0) {
                      console.log("  - First notification:", notifications[0]);
                      console.log(
                        "  - First notification keys:",
                        Object.keys(notifications[0] || {})
                      );
                      console.log(
                        "  - First notification.isRead:",
                        notifications[0]?.isRead
                      );
                      console.log(
                        "  - First notification.read:",
                        notifications[0]?.read
                      );
                    }
                    return null;
                  })()}
                  {notificationsLoading && notifications.length === 0 ? (
                    <Box p={4} textAlign="center">
                      <Text fontSize="sm" color="gray.500">
                        Loading notifications...
                      </Text>
                    </Box>
                  ) : notifications &&
                    Array.isArray(notifications) &&
                    notifications.length > 0 ? (
                    notifications.map((notification) => {
                      // Support both read and isRead properties
                      const isUnread =
                        notification.read === false ||
                        notification.isRead === false ||
                        (!notification.read &&
                          notification.isRead === undefined);
                      return (
                        <MotionBox
                          key={notification._id || notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ bg: hoverBg }}
                          p={3}
                          cursor="pointer"
                          onClick={() =>
                            handleNotificationItemClick(notification)
                          }
                          borderBottom="1px"
                          borderColor={borderColor}
                          bg={isUnread ? "blue.50" : "transparent"}
                          borderLeft={isUnread ? "4px solid" : "none"}
                          borderLeftColor={
                            isUnread ? "blue.500" : "transparent"
                          }
                        >
                          <VStack align="start" spacing={1}>
                            <HStack justify="space-between" w="full">
                              <Text
                                fontSize="sm"
                                fontWeight={isUnread ? "semibold" : "medium"}
                                color={isUnread ? "blue.600" : "gray.700"}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                maxW="80%"
                              >
                                {notification.title || "Notification"}
                              </Text>
                              {isUnread && (
                                <Box
                                  w="8px"
                                  h="8px"
                                  borderRadius="full"
                                  bg="blue.500"
                                />
                              )}
                            </HStack>
                            <Text
                              fontSize="xs"
                              color="gray.600"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              w="full"
                            >
                              {notification.message ||
                                notification.content ||
                                ""}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {formatNotificationTime(
                                notification.createdAt ||
                                  notification.created_at ||
                                  notification.time
                              )}
                            </Text>
                          </VStack>
                        </MotionBox>
                      );
                    })
                  ) : (
                    <Box p={4} textAlign="center">
                      <Text fontSize="sm" color="gray.500">
                        No notifications
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>
            )}
          </Box>

          {/* Profile Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rounded="full"
              p={0}
              minW={0}
              h="auto"
            >
              <Avatar
                size="sm"
                name={user?.name || "User"}
                src={user?.pic || undefined}
                bg="blue.500"
                getInitials={getUserInitials}
              />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<RiUserLine />}>
                <Text>{user?.name || "User"}</Text>
              </MenuItem>
              <MenuItem icon={<RiSettingsLine />}>Settings</MenuItem>
              <MenuItem
                icon={<RiLogoutBoxLine />}
                color="red.500"
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Click outside to close suggestions and notifications */}
      {(showSuggestions || showNotifications) && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={9998}
          onClick={() => {
            setShowSuggestions(false);
            setShowNotifications(false);
          }}
        />
      )}
    </Box>
  );
};

export default Header;
