// pages/doctor/Notifications.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
  Button,
  Avatar,
  Checkbox,
  Spinner,
  useToast,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import { useAuthStore } from "../../store/authStore";
import {
  RiNotificationLine,
  RiSettingsLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../../services/notificationService";

const Notifications = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthStore(); // ✅ Use cookie-based auth
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const toast = useToast();
  
  // State for real notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications(page, 20);
      
      if (response && response.notifications) {
        setNotifications(response.notifications);
        setTotalPages(response.totalPages || 1);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          (notification._id || notification.id) === notificationId
            ? { ...notification, unread: false, isRead: true }
            : notification
        )
      );
      
      toast({
        title: "Success",
        description: "Notification marked as read",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, unread: false }))
      );
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "red";
      case "normal":
        return "blue";
      case "low":
        return "gray";
      default:
        return "gray";
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "appointment":
        return "📅";
      case "message":
        return "💬";
      case "system":
        return "⚙️";
      case "emergency":
        return "🚨";
      case "reminder":
        return "⏰";
      default:
        return "📢";
    }
  };

  const handleNotificationSelect = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedNotifications.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select notifications first",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      if (action === 'markAsRead') {
        for (const nId of selectedNotifications) {
          await markNotificationAsRead(nId);
        }
        
        // Update local state
        setNotifications(prev =>
          prev.map(notification =>
            selectedNotifications.includes(notification._id || notification.id)
              ? { ...notification, unread: false, isRead: true }
              : notification
          )
        );
        
        setSelectedNotifications([]);
        
        toast({
          title: "Success",
          description: "Selected notifications marked as read",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast({
        title: "Error",
        description: "Failed to perform action",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const unreadCount = notifications.filter(n => n.unread === true || n.isRead === false).length;
  const getNotificationId = (n) => n._id || n.id;

  return (
    <Box minH="100vh" bg={bgColor}>
      <DoctorSidebar isOpen={isOpen} onClose={onClose} />
      <Box ml={{ base: 0, md: "250px" }}>
        <Header onToggleSidebar={onOpen} />
        <Box p={0}>
          <Container maxW="full" px={{ base: 3, md: 6 }} py={6}>
            <VStack align="stretch" spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                align={{ base: "stretch", sm: "center" }}
                spacing={4}
              >
                <Box>
                  <Heading size={{ base: "xl", md: "2xl" }} mb={2}>
                    Notifications
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")} fontSize={{ base: "sm", md: "md" }}>
                    Stay updated with important alerts and messages.
                  </Text>
                </Box>
                <Flex align="center" gap={3} flexWrap="wrap">
                  <Badge colorScheme="red" fontSize={{ base: "sm", md: "lg" }} px={3} py={1}>
                    {unreadCount} Unread
                  </Badge>
                  <Button
                    leftIcon={<RiCheckLine />}
                    colorScheme="blue"
                    variant="outline"
                    size={{ base: "sm", md: "md" }}
                    onClick={handleMarkAllAsRead}
                    isDisabled={unreadCount === 0}
                  >
                    Mark All as Read
                  </Button>
                </Flex>
              </Stack>

              {loading ? (
                <VStack spacing={4} py={12}>
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Loading notifications...
                  </Text>
                </VStack>
              ) : notifications.length === 0 ? (
                <VStack spacing={4} py={12}>
                  <RiNotificationLine size="4xl" color={useColorModeValue("gray.400", "gray.600")} />
                  <Text fontSize="xl" fontWeight="bold" color={useColorModeValue("gray.800", "gray.100")}>
                    No notifications
                  </Text>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    You're all caught up! No new notifications.
                  </Text>
                </VStack>
              ) : (
                <>
                  {/* Bulk Actions */}
                  {selectedNotifications.length > 0 && (
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      gap={3}
                      p={4}
                      bg={useColorModeValue("blue.50", "blue.900")}
                      rounded="lg"
                      align={{ base: "stretch", sm: "center" }}
                    >
                      <Text fontSize="sm" color={useColorModeValue("blue.800", "blue.200")}>
                        {selectedNotifications.length} selected
                      </Text>
                      <HStack spacing={2} flexWrap="wrap">
                        <Button
                          size="sm"
                          leftIcon={<RiCheckLine />}
                          colorScheme="blue"
                          onClick={() => handleBulkAction('markAsRead')}
                        >
                          Mark Selected as Read
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<RiCloseLine />}
                          variant="outline"
                          onClick={() => setSelectedNotifications([])}
                        >
                          Clear Selection
                        </Button>
                      </HStack>
                    </Flex>
                  )}

                  {/* Notifications List */}
                  <VStack spacing={4} align="stretch">
                    {notifications.map((notification) => {
                      const nId = getNotificationId(notification);
                      const isUnread = notification.unread === true || notification.isRead === false;
                      return (
                        <Card
                          key={nId}
                          bg={isUnread ? useColorModeValue("blue.50", "blue.900") : cardBg}
                          border={isUnread ? "2px solid" : "1px solid"}
                          borderColor={isUnread ? useColorModeValue("blue.200", "blue.700") : useColorModeValue("gray.200", "gray.700")}
                          className={isUnread ? "shadow-md" : ""}
                        >
                          <CardBody py={{ base: 3, md: 4 }} px={{ base: 3, md: 4 }}>
                            <Flex
                              direction={{ base: "column", sm: "row" }}
                              gap={3}
                              align={{ base: "stretch", sm: "flex-start" }}
                            >
                              <HStack spacing={3} flexShrink={0}>
                                <Checkbox
                                  isChecked={selectedNotifications.includes(nId)}
                                  onChange={() => handleNotificationSelect(nId)}
                                  colorScheme="blue"
                                />
                                <Avatar
                                  size={{ base: "sm", md: "md" }}
                                  bg={getPriorityColor(notification.priority) + ".100"}
                                  color={getPriorityColor(notification.priority) + ".600"}
                                  fontSize={{ base: "md", md: "lg" }}
                                >
                                  {getTypeIcon(notification.type)}
                                </Avatar>
                              </HStack>
                              <VStack align="stretch" spacing={1} flex={1} minW={0}>
                                <Flex
                                  direction={{ base: "column", sm: "row" }}
                                  align={{ base: "flex-start", sm: "center" }}
                                  justify="space-between"
                                  gap={2}
                                  wrap="wrap"
                                >
                                  <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} noOfLines={2}>
                                    {notification.title}
                                  </Text>
                                  <HStack spacing={2} flexShrink={0}>
                                    <Badge
                                      colorScheme={getPriorityColor(notification.priority)}
                                      fontSize="xs"
                                      px={2}
                                      py={1}
                                      rounded="full"
                                    >
                                      {notification.priority || "—"}
                                    </Badge>
                                    {isUnread && (
                                      <Badge colorScheme="red" variant="solid" fontSize="xs" px={2} py={1}>
                                        New
                                      </Badge>
                                    )}
                                  </HStack>
                                </Flex>
                                <Text fontSize={{ base: "xs", md: "sm" }} color={useColorModeValue("gray.600", "gray.400")} noOfLines={{ base: 2, md: 3 }}>
                                  {notification.message}
                                </Text>
                                <Flex
                                  direction={{ base: "column", sm: "row" }}
                                  align={{ base: "flex-start", sm: "center" }}
                                  gap={2}
                                  fontSize="xs"
                                  color={useColorModeValue("gray.500", "gray.500")}
                                >
                                  <Text flexShrink={0}>{notification.time || "Just now"}</Text>
                                  {isUnread && (
                                    <>
                                      <IconButton
                                        aria-label="Mark as read"
                                        size="xs"
                                        icon={<RiCheckLine />}
                                        variant="outline"
                                        colorScheme="blue"
                                        onClick={() => handleMarkAsRead(nId)}
                                        flexShrink={0}
                                        display={{ base: "inline-flex", md: "none" }}
                                      />
                                      <Button
                                        size="xs"
                                        leftIcon={<RiCheckLine />}
                                        variant="outline"
                                        colorScheme="blue"
                                        onClick={() => handleMarkAsRead(nId)}
                                        flexShrink={0}
                                        display={{ base: "none", md: "inline-flex" }}
                                      >
                                        Mark as read
                                      </Button>
                                    </>
                                  )}
                                </Flex>
                              </VStack>
                            </Flex>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </VStack>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Flex justify="center" align="center" gap={2} pt={4} flexWrap="wrap">
                      <Button
                        size={{ base: "sm", md: "md" }}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        isDisabled={page === 1}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                        Page {page} of {totalPages}
                      </Text>
                      <Button
                        size={{ base: "sm", md: "md" }}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        isDisabled={page === totalPages}
                        variant="outline"
                      >
                        Next
                      </Button>
                    </Flex>
                  )}
                </>
              )}
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Notifications;
