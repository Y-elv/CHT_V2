// pages/doctor/Schedule.jsx
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
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Spinner,
  Center,
  Icon,
  Avatar,
  Flex,
  Divider,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import axios from "../../config/axiosConfig";
import {
  RiCalendarLine,
  RiTimeLine,
  RiUserLine,
  RiVideoChatLine,
  RiChat3Line,
  RiMapPinLine,
  RiCheckLine,
  RiCloseLine,
  RiRefreshLine,
  RiExternalLinkLine,
} from "react-icons/ri";

const Schedule = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onClose: onApproveClose,
  } = useDisclosure();
  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();

  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // State management
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [callLink, setCallLink] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Get token from localStorage
  const getToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = localStorage.getItem("cht_token");
    }
    if (!token) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
      if (userInfo && userInfo.token) {
        token = userInfo.token;
      }
    }
    return token;
  };

  // Fetch appointments for logged-in doctor
  const fetchAppointments = async () => {
    console.log("🔄 [Schedule] Fetching appointments...");
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await axios.get(
        "https://chtv2-bn.onrender.com/api/appointment/doctor",
        {
          params: {
            page: 1,
            limit: 100,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ [Schedule] Appointments fetched:", response.data);
      
      if (response.data && response.data.appointments) {
        setAppointments(response.data.appointments);
      } else if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
      }

      toast({
        title: "Appointments Loaded",
        description: `Found ${Array.isArray(response.data?.appointments) ? response.data.appointments.length : (Array.isArray(response.data) ? response.data.length : 0)} appointments`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("❌ [Schedule] Error fetching appointments:", error);
      toast({
        title: "Error Loading Appointments",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to load appointments. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments by status
  const getAppointmentsByStatus = (status) => {
    return appointments.filter((apt) => apt.status === status);
  };

  // Get today's appointments
  const getTodayAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    });
  };

  // Get upcoming appointments (future dates)
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() > today.getTime();
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const aptDate = new Date(date);
    aptDate.setHours(0, 0, 0, 0);

    if (aptDate.getTime() === today.getTime()) {
      return "Today";
    } else if (aptDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Get status color
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

  // Get appointment type icon
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return RiVideoChatLine;
      case "chat":
        return RiChat3Line;
      case "in-person":
        return RiMapPinLine;
      default:
        return RiCalendarLine;
    }
  };

  // Handle approve appointment
  const handleApproveClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCallLink("");
    onApproveOpen();
  };

  const handleApproveSubmit = async () => {
    if (!callLink.trim()) {
      toast({
        title: "Call Link Required",
        description: "Please provide a Google Meet link or call URL.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setProcessing(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found.");
      }

      console.log("📤 [Schedule] Approving appointment:", selectedAppointment._id);
      console.log("   Call Link:", callLink);

      const response = await axios.post(
        `https://chtv2-bn.onrender.com/api/appointment/approve/${selectedAppointment._id}`,
        {
          callLink: callLink.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ [Schedule] Appointment approved:", response.data);

      toast({
        title: "Appointment Approved",
        description: "The appointment has been approved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      onApproveClose();
      setCallLink("");
      setSelectedAppointment(null);
      fetchAppointments(); // Refresh appointments
    } catch (error) {
      console.error("❌ [Schedule] Error approving appointment:", error);
      toast({
        title: "Approval Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to approve appointment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Handle cancel appointment
  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancellationReason("");
    onCancelOpen();
  };

  const handleCancelSubmit = async () => {
    if (!cancellationReason.trim()) {
      toast({
        title: "Cancellation Reason Required",
        description: "Please provide a reason for cancellation.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setProcessing(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found.");
      }

      console.log("📤 [Schedule] Cancelling appointment:", selectedAppointment._id);
      console.log("   Reason:", cancellationReason);

      const response = await axios.post(
        `https://chtv2-bn.onrender.com/api/appointment/cancel/${selectedAppointment._id}`,
        {
          cancellationReason: cancellationReason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ [Schedule] Appointment cancelled:", response.data);

      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      onCancelClose();
      setCancellationReason("");
      setSelectedAppointment(null);
      fetchAppointments(); // Refresh appointments
    } catch (error) {
      console.error("❌ [Schedule] Error cancelling appointment:", error);
      toast({
        title: "Cancellation Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel appointment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Render appointment card
  const renderAppointmentCard = (appointment) => {
    const StatusIcon = getTypeIcon(appointment.appointmentType);
    const statusColor = getStatusColor(appointment.status);

    return (
      <Card
        key={appointment._id || appointment.id}
        bg={cardBg}
        borderRadius="xl"
        shadow="sm"
        border="1px solid"
        borderColor={borderColor}
        _hover={{
          shadow: "md",
          transform: "translateY(-2px)",
          transition: "all 0.2s",
        }}
      >
        <CardHeader pb={3}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <HStack spacing={3}>
              <Icon as={StatusIcon} boxSize={5} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">
                  {formatDate(appointment.date)}
                </Text>
                <HStack spacing={2}>
                  <Icon as={RiTimeLine} boxSize={4} color="gray.500" />
                  <Text fontSize="sm" color="gray.600">
                    {appointment.time}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <Badge colorScheme={statusColor} fontSize="sm" px={2} py={1}>
              {appointment.status?.toUpperCase() || "UNKNOWN"}
            </Badge>
          </Flex>
        </CardHeader>
        <CardBody pt={0}>
          <VStack align="stretch" spacing={3}>
            {/* Patient Info */}
            <HStack spacing={3}>
              <Avatar
                size="sm"
                src={appointment.patient?.pic}
                name={appointment.patient?.name || "Patient"}
              />
              <VStack align="start" spacing={0} flex={1}>
                <Text fontWeight="semibold" fontSize="md">
                  {appointment.patient?.name || "Unknown Patient"}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {appointment.patient?.email || ""}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            {/* Appointment Details */}
            <VStack align="stretch" spacing={2}>
              <HStack>
                <Badge colorScheme="blue" variant="outline" fontSize="xs">
                  {appointment.appointmentType?.toUpperCase() || "CONSULTATION"}
                </Badge>
                {appointment.reason && (
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {appointment.reason}
                  </Text>
                )}
              </HStack>
              {appointment.notes && (
                <Text fontSize="xs" color="gray.500" noOfLines={2}>
                  {appointment.notes}
                </Text>
              )}
            </VStack>

            {/* Call Link (if approved) */}
            {appointment.status?.toLowerCase() === "approved" &&
              appointment.callLink && (
                <Box
                  p={2}
                  bg="green.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="green.200"
                >
                  <HStack spacing={2}>
                    <Icon as={RiExternalLinkLine} color="green.600" />
                    <Text fontSize="xs" color="green.700" fontWeight="medium">
                      Call Link:
                    </Text>
                    <Text
                      fontSize="xs"
                      color="green.600"
                      as="a"
                      href={appointment.callLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      _hover={{ textDecoration: "underline" }}
                    >
                      {appointment.callLink.length > 40
                        ? `${appointment.callLink.substring(0, 40)}...`
                        : appointment.callLink}
                    </Text>
                  </HStack>
                </Box>
              )}

            {/* Cancellation Reason (if cancelled) */}
            {appointment.status?.toLowerCase() === "cancelled" &&
              appointment.cancellationReason && (
                <Box
                  p={2}
                  bg="red.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="red.200"
                >
                  <HStack spacing={2} align="start">
                    <Icon as={RiCloseLine} color="red.600" mt={0.5} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="red.700" fontWeight="medium">
                        Cancellation Reason:
                      </Text>
                      <Text fontSize="xs" color="red.600">
                        {appointment.cancellationReason}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}

            {/* Action Buttons */}
            {appointment.status?.toLowerCase() === "pending" && (
              <HStack spacing={2} mt={2}>
                <Button
                  size="sm"
                  colorScheme="green"
                  leftIcon={<RiCheckLine />}
                  onClick={() => handleApproveClick(appointment)}
                  flex={1}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<RiCloseLine />}
                  onClick={() => handleCancelClick(appointment)}
                  flex={1}
                >
                  Cancel
                </Button>
              </HStack>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <DoctorSidebar isOpen={isOpen} onClose={onClose} />
      <Box ml={{ base: 0, md: "250px" }}>
        <Header onToggleSidebar={onOpen} />
        <Box p={0}>
          <Container maxW="full" p={6}>
            <VStack align="stretch" spacing={6}>
              {/* Header */}
              <Flex
                justify="space-between"
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={4}
              >
                <Box>
                  <Heading size="2xl" mb={2}>
                    Schedule
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Manage your appointments and availability.
                  </Text>
                </Box>
                <HStack spacing={3}>
                  <Button
                    leftIcon={<RiRefreshLine />}
                    onClick={fetchAppointments}
                    isLoading={loading}
                    loadingText="Refreshing"
                    variant="outline"
                    colorScheme="blue"
                  >
                    Refresh
                  </Button>
                </HStack>
              </Flex>

              {/* Tabs */}
              <Tabs
                variant="enclosed"
                index={activeTab}
                onChange={setActiveTab}
                colorScheme="blue"
              >
                <Box
                  overflowX="auto"
                  overflowY="hidden"
                  pb={2}
                  css={{
                    "&::-webkit-scrollbar": {
                      height: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#F7941D",
                      borderRadius: "2px",
                    },
                  }}
                >
                  <TabList
                    minW="max-content"
                    flexWrap="nowrap"
                    borderBottom="2px solid"
                    borderColor={useColorModeValue("gray.200", "gray.700")}
                  >
                    <Tab
                      whiteSpace="nowrap"
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                      px={{ base: 3, sm: 4, md: 6 }}
                      py={{ base: 2, sm: 3 }}
                    >
                      All Appointments
                    </Tab>
                    <Tab
                      whiteSpace="nowrap"
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                      px={{ base: 3, sm: 4, md: 6 }}
                      py={{ base: 2, sm: 3 }}
                    >
                      Today
                    </Tab>
                    <Tab
                      whiteSpace="nowrap"
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                      px={{ base: 3, sm: 4, md: 6 }}
                      py={{ base: 2, sm: 3 }}
                    >
                      Upcoming
                    </Tab>
                    <Tab
                      whiteSpace="nowrap"
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                      px={{ base: 3, sm: 4, md: 6 }}
                      py={{ base: 2, sm: 3 }}
                    >
                      Pending
                    </Tab>
                    <Tab
                      whiteSpace="nowrap"
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                      px={{ base: 3, sm: 4, md: 6 }}
                      py={{ base: 2, sm: 3 }}
                    >
                      Approved
                    </Tab>
                  </TabList>
                </Box>

                <TabPanels>
                  {/* All Appointments */}
                  <TabPanel px={0} pt={6}>
                    {loading ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Spinner size="xl" color="blue.500" />
                          <Text color="gray.600">Loading appointments...</Text>
                        </VStack>
                      </Center>
                    ) : appointments.length === 0 ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Icon as={RiCalendarLine} boxSize={12} color="gray.400" />
                          <Text fontSize="lg" color="gray.600" fontWeight="medium">
                            No Appointments Found
                          </Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            You don't have any appointments yet.
                          </Text>
                        </VStack>
                      </Center>
                    ) : (
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {appointments.map((appointment) =>
                          renderAppointmentCard(appointment)
                        )}
                      </SimpleGrid>
                    )}
                  </TabPanel>

                  {/* Today's Appointments */}
                  <TabPanel px={0} pt={6}>
                    {loading ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Spinner size="xl" color="blue.500" />
                          <Text color="gray.600">Loading appointments...</Text>
                        </VStack>
                      </Center>
                    ) : getTodayAppointments().length === 0 ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Icon as={RiCalendarLine} boxSize={12} color="gray.400" />
                          <Text fontSize="lg" color="gray.600" fontWeight="medium">
                            No Appointments Today
                          </Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            You don't have any appointments scheduled for today.
                          </Text>
                        </VStack>
                      </Center>
                    ) : (
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {getTodayAppointments().map((appointment) =>
                          renderAppointmentCard(appointment)
                        )}
                      </SimpleGrid>
                    )}
                  </TabPanel>

                  {/* Upcoming Appointments */}
                  <TabPanel px={0} pt={6}>
                    {loading ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Spinner size="xl" color="blue.500" />
                          <Text color="gray.600">Loading appointments...</Text>
                        </VStack>
                      </Center>
                    ) : getUpcomingAppointments().length === 0 ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Icon as={RiCalendarLine} boxSize={12} color="gray.400" />
                          <Text fontSize="lg" color="gray.600" fontWeight="medium">
                            No Upcoming Appointments
                          </Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            You don't have any upcoming appointments.
                          </Text>
                        </VStack>
                      </Center>
                    ) : (
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {getUpcomingAppointments().map((appointment) =>
                          renderAppointmentCard(appointment)
                        )}
                      </SimpleGrid>
                    )}
                  </TabPanel>

                  {/* Pending Appointments */}
                  <TabPanel px={0} pt={6}>
                    {loading ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Spinner size="xl" color="blue.500" />
                          <Text color="gray.600">Loading appointments...</Text>
                        </VStack>
                      </Center>
                    ) : getAppointmentsByStatus("pending").length === 0 ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Icon as={RiCalendarLine} boxSize={12} color="gray.400" />
                          <Text fontSize="lg" color="gray.600" fontWeight="medium">
                            No Pending Appointments
                          </Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            You don't have any pending appointments.
                          </Text>
                        </VStack>
                      </Center>
                    ) : (
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {getAppointmentsByStatus("pending").map((appointment) =>
                          renderAppointmentCard(appointment)
                        )}
                      </SimpleGrid>
                    )}
                  </TabPanel>

                  {/* Approved Appointments */}
                  <TabPanel px={0} pt={6}>
                    {loading ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Spinner size="xl" color="blue.500" />
                          <Text color="gray.600">Loading appointments...</Text>
                        </VStack>
                      </Center>
                    ) : getAppointmentsByStatus("approved").length === 0 ? (
                      <Center py={12}>
                        <VStack spacing={4}>
                          <Icon as={RiCalendarLine} boxSize={12} color="gray.400" />
                          <Text fontSize="lg" color="gray.600" fontWeight="medium">
                            No Approved Appointments
                          </Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            You don't have any approved appointments.
                          </Text>
                        </VStack>
                      </Center>
                    ) : (
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {getAppointmentsByStatus("approved").map((appointment) =>
                          renderAppointmentCard(appointment)
                        )}
                      </SimpleGrid>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
      </Box>

      {/* Approve Appointment Modal */}
      <Modal isOpen={isApproveOpen} onClose={onApproveClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Approve Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {selectedAppointment && (
                <Box
                  p={4}
                  bg="blue.50"
                  borderRadius="md"
                  w="100%"
                  border="1px solid"
                  borderColor="blue.200"
                >
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Appointment Details:
                  </Text>
                  <Text fontSize="sm">
                    <strong>Patient:</strong> {selectedAppointment.patient?.name}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Date:</strong> {formatDate(selectedAppointment.date)}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Time:</strong> {selectedAppointment.time}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Type:</strong> {selectedAppointment.appointmentType}
                  </Text>
                </Box>
              )}
              <FormControl isRequired>
                <FormLabel>Google Meet Link / Call URL</FormLabel>
                <Input
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  value={callLink}
                  onChange={(e) => setCallLink(e.target.value)}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Paste the Google Meet link or any video call URL for this appointment.
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onApproveClose}
              isDisabled={processing}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleApproveSubmit}
              isLoading={processing}
              loadingText="Approving..."
              leftIcon={<RiCheckLine />}
            >
              Approve Appointment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Appointment Modal */}
      <Modal isOpen={isCancelOpen} onClose={onCancelClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Cancel Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {selectedAppointment && (
                <Box
                  p={4}
                  bg="red.50"
                  borderRadius="md"
                  w="100%"
                  border="1px solid"
                  borderColor="red.200"
                >
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Appointment Details:
                  </Text>
                  <Text fontSize="sm">
                    <strong>Patient:</strong> {selectedAppointment.patient?.name}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Date:</strong> {formatDate(selectedAppointment.date)}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Time:</strong> {selectedAppointment.time}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Type:</strong> {selectedAppointment.appointmentType}
                  </Text>
                </Box>
              )}
              <FormControl isRequired>
                <FormLabel>Cancellation Reason</FormLabel>
                <Textarea
                  placeholder="Please provide a reason for cancelling this appointment..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={4}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  This reason will be shared with the patient.
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onCancelClose}
              isDisabled={processing}
            >
              Close
            </Button>
            <Button
              colorScheme="red"
              onClick={handleCancelSubmit}
              isLoading={processing}
              loadingText="Cancelling..."
              leftIcon={<RiCloseLine />}
            >
              Cancel Appointment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Schedule;
