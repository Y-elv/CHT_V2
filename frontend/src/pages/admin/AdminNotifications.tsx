import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  useDisclosure,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
  Button,
  Avatar,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import {
  RiNotificationLine,
  RiCheckLine,
} from "react-icons/ri";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

const ORANGE_GRADIENT = "linear(to-br, orange.400, orange.600)";

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications(page, 20);
      if (response?.notifications) {
        setNotifications(response.notifications);
        setTotalPages(response.totalPages ?? 1);
        setTotal(response.total ?? 0);
      } else {
        setNotifications([]);
      }
    } catch (error) {
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

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          (n._id || n.id) === notificationId ? { ...n, isRead: true } : n
        )
      );
      toast({
        title: "Marked as read",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as read",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast({
        title: "All marked as read",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "Just now";
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return date.toLocaleDateString();
    } catch {
      return "Just now";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadBg = useColorModeValue("orange.50", "gray.700");
  const unreadBorder = useColorModeValue("orange.200", "orange.700");
  const defaultBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="full" p={6}>
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Box>
              <Heading size="2xl" mb={2} bgGradient={ORANGE_GRADIENT} bgClip="text">
                Notifications
              </Heading>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Admin alerts: doctor approvals, rejections, and system events.
              </Text>
            </Box>
            <HStack>
              <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
                {unreadCount} Unread
              </Badge>
              <Button
                leftIcon={<RiCheckLine />}
                colorScheme="orange"
                variant="outline"
                onClick={handleMarkAllAsRead}
                isDisabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </HStack>
          </HStack>

          {loading ? (
            <VStack spacing={4} py={12}>
              <Spinner size="xl" color="orange.500" thickness="4px" />
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Loading notifications...
              </Text>
            </VStack>
          ) : notifications.length === 0 ? (
            <VStack spacing={4} py={12}>
              <RiNotificationLine
                size={48}
                color={useColorModeValue("gray.400", "gray.600")}
              />
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={useColorModeValue("gray.800", "gray.100")}
              >
                No notifications
              </Text>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                You're all caught up.
              </Text>
            </VStack>
          ) : (
            <>
              <VStack spacing={4} align="stretch">
                {notifications.map((notification) => {
                  const id = notification._id || notification.id;
                  const isUnread = !notification.isRead;
                  const actor = notification.actorId;
                  return (
                    <Card
                      key={id}
                      bg={isUnread ? unreadBg : cardBg}
                      border={isUnread ? "2px solid" : "1px solid"}
                      borderColor={isUnread ? unreadBorder : defaultBorder}
                    >
                      <CardBody>
                        <HStack spacing={4} align="start">
                          <Avatar
                            size="md"
                            name={actor?.name}
                            src={actor?.pic}
                            bg="orange.400"
                            color="white"
                          />
                          <VStack align="start" spacing={1} flex={1}>
                            <HStack justify="space-between" width="100%">
                              <Text fontWeight="bold" fontSize="md">
                                {notification.title}
                              </Text>
                              <HStack spacing={2}>
                                <Badge
                                  colorScheme="orange"
                                  fontSize="xs"
                                  px={2}
                                  py={1}
                                  rounded="full"
                                >
                                  {notification.type || "system"}
                                </Badge>
                                {isUnread && (
                                  <Badge
                                    colorScheme="red"
                                    variant="solid"
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                  >
                                    New
                                  </Badge>
                                )}
                              </HStack>
                            </HStack>
                            <Text
                              fontSize="sm"
                              color={useColorModeValue("gray.600", "gray.400")}
                            >
                              {notification.message}
                            </Text>
                            <HStack spacing={4} fontSize="xs" color="gray.500">
                              <Text>{formatTime(notification.createdAt)}</Text>
                              {isUnread && (
                                <Button
                                  size="xs"
                                  leftIcon={<RiCheckLine />}
                                  variant="outline"
                                  colorScheme="orange"
                                  onClick={() => handleMarkAsRead(id)}
                                >
                                  Mark as read
                                </Button>
                              )}
                            </HStack>
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  );
                })}
              </VStack>

              {totalPages > 1 && (
                <HStack justify="center" spacing={4} pt={4}>
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    isDisabled={page === 1}
                    variant="outline"
                    colorScheme="orange"
                  >
                    Previous
                  </Button>
                  <Text
                    fontSize="sm"
                    color={useColorModeValue("gray.600", "gray.400")}
                  >
                    Page {page} of {totalPages} ({total} total)
                  </Text>
                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    isDisabled={page === totalPages}
                    variant="outline"
                    colorScheme="orange"
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminNotifications;
