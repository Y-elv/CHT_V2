// pages/doctor/Notifications.jsx
import React from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  useDisclosure,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Avatar,
  Divider,
  Switch,
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiNotificationLine,
  RiSettingsLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

const Notifications = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const notifications = [
    {
      id: 1,
      type: "Appointment",
      title: "New appointment scheduled",
      message: "John Doe has scheduled an appointment for tomorrow at 10:00 AM",
      time: "2 hours ago",
      unread: true,
      priority: "High",
    },
    {
      id: 2,
      type: "Message",
      title: "Patient message received",
      message: "Jane Smith sent you a message about her medication",
      time: "4 hours ago",
      unread: true,
      priority: "Normal",
    },
    {
      id: 3,
      type: "System",
      title: "System maintenance",
      message:
        "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM",
      time: "1 day ago",
      unread: false,
      priority: "Low",
    },
    {
      id: 4,
      type: "Emergency",
      title: "Emergency consultation request",
      message: "Urgent consultation request from Sarah Wilson",
      time: "2 days ago",
      unread: false,
      priority: "High",
    },
    {
      id: 5,
      type: "Reminder",
      title: "Follow-up reminder",
      message: "Follow-up appointment with Mike Johnson is due",
      time: "3 days ago",
      unread: false,
      priority: "Normal",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "red";
      case "Normal":
        return "blue";
      case "Low":
        return "gray";
      default:
        return "gray";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Appointment":
        return "📅";
      case "Message":
        return "💬";
      case "System":
        return "⚙️";
      case "Emergency":
        return "🚨";
      case "Reminder":
        return "⏰";
      default:
        return "📢";
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <DoctorSidebar isOpen={isOpen} onClose={onClose} />
      <Box ml={{ base: 0, md: "250px" }}>
        <Header onToggleSidebar={onOpen} />
        <Box p={0}>
          <Container maxW="full" p={6}>
            <VStack align="stretch" spacing={6}>
              <HStack justify="space-between">
                <Box>
                  <Heading size="2xl" mb={2}>
                    Notifications
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Stay updated with important alerts and messages.
                  </Text>
                </Box>
                <HStack>
                  <Badge colorScheme="red" fontSize="lg" px={3} py={1}>
                    3 Unread
                  </Badge>
                  <Button colorScheme="blue" leftIcon={<RiSettingsLine />}>
                    Settings
                  </Button>
                </HStack>
              </HStack>

              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Notifications List */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md">Recent Notifications</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      {notifications.map((notification) => (
                        <Box
                          key={notification.id}
                          p={4}
                          borderRadius="lg"
                          bg={notification.unread ? "blue.50" : "transparent"}
                          border={notification.unread ? "1px solid" : "none"}
                          borderColor="blue.200"
                        >
                          <HStack align="start" spacing={3}>
                            <Text fontSize="xl">
                              {getTypeIcon(notification.type)}
                            </Text>
                            <VStack align="start" spacing={1} flex="1">
                              <HStack justify="space-between" w="full">
                                <Text fontWeight="semibold" fontSize="sm">
                                  {notification.title}
                                </Text>
                                <HStack spacing={2}>
                                  <Badge
                                    colorScheme={getPriorityColor(
                                      notification.priority
                                    )}
                                    size="sm"
                                  >
                                    {notification.priority}
                                  </Badge>
                                  {notification.unread && (
                                    <Badge
                                      colorScheme="red"
                                      borderRadius="full"
                                      w={2}
                                      h={2}
                                    />
                                  )}
                                </HStack>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {notification.message}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {notification.time}
                              </Text>
                              {notification.unread && (
                                <HStack spacing={2} pt={2}>
                                  <Button size="xs" colorScheme="green">
                                    <RiCheckLine /> Mark Read
                                  </Button>
                                  <Button
                                    size="xs"
                                    colorScheme="red"
                                    variant="outline"
                                  >
                                    <RiCloseLine /> Dismiss
                                  </Button>
                                </HStack>
                              )}
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Notification Settings */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md">Notification Settings</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={6}>
                      <FormControl>
                        <FormLabel>Notification Types</FormLabel>
                        <CheckboxGroup
                          defaultValue={[
                            "appointments",
                            "messages",
                            "emergencies",
                          ]}
                        >
                          <Stack>
                            <Checkbox value="appointments">
                              Appointments
                            </Checkbox>
                            <Checkbox value="messages">
                              Patient Messages
                            </Checkbox>
                            <Checkbox value="emergencies">
                              Emergency Alerts
                            </Checkbox>
                            <Checkbox value="reminders">Reminders</Checkbox>
                            <Checkbox value="system">System Updates</Checkbox>
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>

                      <Divider />

                      <FormControl>
                        <FormLabel>Delivery Methods</FormLabel>
                        <CheckboxGroup defaultValue={["email", "push"]}>
                          <Stack>
                            <Checkbox value="email">Email</Checkbox>
                            <Checkbox value="push">Push Notifications</Checkbox>
                            <Checkbox value="sms">SMS</Checkbox>
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>

                      <Divider />

                      <FormControl>
                        <FormLabel>Quiet Hours</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" />
                          <Text fontSize="sm">
                            Enable quiet hours (10 PM - 7 AM)
                          </Text>
                        </HStack>
                      </FormControl>

                      <Button colorScheme="blue" size="sm">
                        Save Settings
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Notifications;
