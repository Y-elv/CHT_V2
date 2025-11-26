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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Avatar,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiCalendarLine,
  RiTimeLine,
  RiUserLine,
  RiVideoChatLine,
} from "react-icons/ri";
import {
  getDoctorAppointments,
  approveAppointment,
  cancelAppointment,
} from "../../services/appointmentService";

const Schedule = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const approveModal = useDisclosure();
  const cancelModal = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const [appointments, setAppointments] = useState({
    pending: [],
    approved: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState({
    pending: false,
    approved: false,
    cancelled: false,
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [callLink, setCallLink] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch appointments on component mount and when tab changes
  useEffect(() => {
    fetchAppointments("pending");
    fetchAppointments("approved");
    fetchAppointments("cancelled");
  }, []);

  const fetchAppointments = async (status) => {
    try {
      setLoading((prev) => ({ ...prev, [status]: true }));
      const data = await getDoctorAppointments(1, 20, status);
      setAppointments((prev) => ({
        ...prev,
        [status]: data.appointments || [],
      }));
    } catch (error) {
      console.error(`Error fetching ${status} appointments:`, error);
      toast({
        title: "Error",
        description: `Failed to fetch ${status} appointments. Please try again.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading((prev) => ({ ...prev, [status]: false }));
    }
  };

  const handleApprove = async () => {
    if (!selectedAppointment) return;

    // Validate callLink for video appointments
    if (
      selectedAppointment.appointmentType === "video" &&
      !callLink.trim()
    ) {
      toast({
        title: "Call Link Required",
        description: "Please provide a call link for video appointments.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setActionLoading(true);
      await approveAppointment(selectedAppointment._id, callLink || null);
      
      toast({
        title: "Success",
        description: "Appointment approved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      approveModal.onClose();
      setCallLink("");
      setSelectedAppointment(null);
      
      // Refresh appointments
      await fetchAppointments("pending");
      await fetchAppointments("approved");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to approve appointment";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment) return;

    if (!cancellationReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for cancellation.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setActionLoading(true);
      await cancelAppointment(
        selectedAppointment._id,
        cancellationReason
      );
      
      toast({
        title: "Success",
        description: "Appointment cancelled successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      cancelModal.onClose();
      setCancellationReason("");
      setSelectedAppointment(null);
      
      // Refresh appointments
      await fetchAppointments("pending");
      await fetchAppointments("approved");
      await fetchAppointments("cancelled");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to cancel appointment";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openApproveModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCallLink(appointment.callLink || "");
    approveModal.onOpen();
  };

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancellationReason("");
    cancelModal.onOpen();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch (error) {
      return dateString;
    }
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

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return RiVideoChatLine;
      case "consultation":
        return RiUserLine;
      default:
        return RiCalendarLine;
    }
  };

  const renderAppointmentCard = (appointment) => {
    const TypeIcon = getTypeIcon(appointment.appointmentType);
    const isPending = appointment.status?.toLowerCase() === "pending";
    const isApproved = appointment.status?.toLowerCase() === "approved";
    const isCancelled = appointment.status?.toLowerCase() === "cancelled";

    return (
      <Card key={appointment._id} bg={cardBg} borderRadius="xl" shadow="sm">
        <CardHeader>
          <HStack justify="space-between">
            <HStack>
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">
                  {appointment.time || "N/A"}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {formatDate(appointment.date)}
                </Text>
              </VStack>
              <Badge colorScheme={getStatusColor(appointment.status)}>
                {appointment.status?.toUpperCase() || "UNKNOWN"}
              </Badge>
            </HStack>
            <HStack>
              <TypeIcon size={20} />
              <Text fontSize="sm" color="gray.500">
                {appointment.appointmentType || "N/A"}
              </Text>
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack align="stretch" spacing={3}>
            <HStack>
              <Avatar
                size="sm"
                src={appointment.patient?.pic}
                name={appointment.patient?.name}
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">
                  {appointment.patient?.name || "Unknown Patient"}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {appointment.patient?.email || ""}
                </Text>
              </VStack>
            </HStack>

            {appointment.reason && (
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Reason:
                </Text>
                <Text fontSize="sm">{appointment.reason}</Text>
              </Box>
            )}

            {appointment.notes && (
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Notes:
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {appointment.notes}
                </Text>
              </Box>
            )}

            {isApproved && appointment.callLink && (
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Call Link:
                </Text>
                <Button
                  size="xs"
                  colorScheme="blue"
                  variant="link"
                  onClick={() => window.open(appointment.callLink, "_blank")}
                >
                  Join Call
                </Button>
              </Box>
            )}

            {isCancelled && appointment.cancellationReason && (
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Cancellation Reason:
                </Text>
                <Text fontSize="sm" color="red.500">
                  {appointment.cancellationReason}
                </Text>
              </Box>
            )}

            <HStack spacing={2} flexWrap="wrap">
              {isPending && (
                <>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => openApproveModal(appointment)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => openCancelModal(appointment)}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {isApproved && appointment.callLink && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => window.open(appointment.callLink, "_blank")}
                >
                  Start Call
                </Button>
              )}
              {isCancelled && (
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  This appointment has been cancelled
                </Text>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  const renderAppointments = (appointmentList, status) => {
    if (loading[status]) {
      return (
        <Box textAlign="center" py={10}>
          <Spinner size="xl" color="blue.500" />
          <Text mt={4} color="gray.500">
            Loading {status} appointments...
          </Text>
        </Box>
      );
    }

    if (!appointmentList || appointmentList.length === 0) {
      return (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          No {status} appointments found.
        </Alert>
      );
    }

    return (
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {appointmentList.map(renderAppointmentCard)}
      </SimpleGrid>
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
              <HStack justify="space-between">
                <Box>
                  <Heading size="2xl" mb={2}>
                    Schedule
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Manage your appointments and availability.
                  </Text>
                </Box>
                <Button
                  colorScheme="blue"
                  leftIcon={<RiCalendarLine />}
                  onClick={() => {
                    fetchAppointments("pending");
                    fetchAppointments("approved");
                    fetchAppointments("cancelled");
                  }}
                >
                  Refresh
                </Button>
              </HStack>

              <Tabs
                variant="enclosed"
                onChange={(index) => setActiveTab(index)}
                defaultIndex={0}
              >
                <TabList>
                  <Tab>Pending</Tab>
                  <Tab>Approved</Tab>
                  <Tab>Cancelled</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    {renderAppointments(appointments.pending, "pending")}
                  </TabPanel>

                  <TabPanel px={0}>
                    {renderAppointments(appointments.approved, "approved")}
                  </TabPanel>

                  <TabPanel px={0}>
                    {renderAppointments(appointments.cancelled, "cancelled")}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
      </Box>

      {/* Approve Appointment Modal */}
      <Modal
        isOpen={approveModal.isOpen}
        onClose={approveModal.onClose}
        isCentered
        size="lg"
        motionPreset="scale"
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="2xl"
          boxShadow="2xl"
          bg={useColorModeValue("white", "gray.800")}
          mx={4}
        >
          <Box
            position="relative"
            bgGradient="linear(to-r, green.400, green.600)"
            borderTopRadius="2xl"
            p={6}
            color="white"
          >
            <HStack spacing={4} mb={2}>
              <Box
                p={3}
                bg="whiteAlpha.200"
                borderRadius="full"
                backdropFilter="blur(10px)"
              >
                <RiVideoChatLine size={28} />
              </Box>
              <VStack align="start" spacing={0}>
                <ModalHeader
                  color="white"
                  fontSize="2xl"
                  fontWeight="bold"
                  p={0}
                >
                  Approve Appointment
                </ModalHeader>
                <Text fontSize="sm" color="whiteAlpha.800">
                  Confirm and schedule this appointment
                </Text>
              </VStack>
            </HStack>
            <ModalCloseButton
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              size="lg"
            />
          </Box>

          <ModalBody p={6}>
            {selectedAppointment && (
              <VStack spacing={6} align="stretch">
                {/* Patient Info Card */}
                <Box
                  p={4}
                  borderRadius="xl"
                  bg={useColorModeValue("green.50", "green.900")}
                  border="2px solid"
                  borderColor={useColorModeValue("green.200", "green.700")}
                >
                  <HStack spacing={4}>
                    <Avatar
                      size="lg"
                      src={selectedAppointment.patient?.pic}
                      name={selectedAppointment.patient?.name}
                      border="3px solid"
                      borderColor="green.400"
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="bold" fontSize="lg">
                        {selectedAppointment.patient?.name || "Unknown Patient"}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedAppointment.patient?.email || ""}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Appointment Details */}
                <SimpleGrid columns={2} spacing={4}>
                  <Box
                    p={3}
                    borderRadius="lg"
                    bg={useColorModeValue("gray.50", "gray.700")}
                  >
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      Date
                    </Text>
                    <Text fontWeight="semibold">
                      {formatDate(selectedAppointment.date)}
                    </Text>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="lg"
                    bg={useColorModeValue("gray.50", "gray.700")}
                  >
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      Time
                    </Text>
                    <Text fontWeight="semibold">
                      {selectedAppointment.time || "N/A"}
                    </Text>
                  </Box>
                </SimpleGrid>

                <Box
                  p={3}
                  borderRadius="lg"
                  bg={useColorModeValue("blue.50", "blue.900")}
                  border="2px solid"
                  borderColor={useColorModeValue("blue.200", "blue.700")}
                >
                  <HStack>
                    <RiVideoChatLine size={20} color="blue.500" />
                    <Text fontWeight="semibold" color="blue.700">
                      {selectedAppointment.appointmentType?.toUpperCase() ||
                        "N/A"}
                    </Text>
                  </HStack>
                </Box>

                {selectedAppointment.reason && (
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      Reason for Visit
                    </Text>
                    <Text
                      p={3}
                      borderRadius="lg"
                      bg={useColorModeValue("gray.50", "gray.700")}
                    >
                      {selectedAppointment.reason}
                    </Text>
                  </Box>
                )}

                {/* Call Link Input */}
                {selectedAppointment?.appointmentType === "video" && (
                  <FormControl isRequired>
                    <FormLabel
                      fontWeight="semibold"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <RiVideoChatLine />
                      Video Call Link
                    </FormLabel>
                    <Input
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={callLink}
                      onChange={(e) => setCallLink(e.target.value)}
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="green.500"
                    />
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      Required for video appointments. Provide a meeting link
                      (Google Meet, Zoom, etc.)
                    </Text>
                  </FormControl>
                )}

                {selectedAppointment?.appointmentType !== "video" && (
                  <FormControl>
                    <FormLabel
                      fontWeight="semibold"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <RiVideoChatLine />
                      Call Link (Optional)
                    </FormLabel>
                    <Input
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={callLink}
                      onChange={(e) => setCallLink(e.target.value)}
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="green.500"
                    />
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      Optional: Add a meeting link for remote consultations
                    </Text>
                  </FormControl>
                )}
              </VStack>
            )}
          </ModalBody>

          <ModalFooter
            p={6}
            borderTop="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            gap={3}
          >
            <Button
              variant="outline"
              onClick={approveModal.onClose}
              isDisabled={actionLoading}
              size="lg"
              flex={1}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleApprove}
              isLoading={actionLoading}
              size="lg"
              flex={1}
              leftIcon={<RiVideoChatLine />}
              bgGradient="linear(to-r, green.400, green.600)"
              _hover={{
                bgGradient: "linear(to-r, green.500, green.700)",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
            >
              Approve Appointment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Appointment Modal */}
      <Modal isOpen={cancelModal.isOpen} onClose={cancelModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {selectedAppointment && (
                <>
                  <Box w="full">
                    <Text fontWeight="semibold">Patient:</Text>
                    <Text>{selectedAppointment.patient?.name || "N/A"}</Text>
                  </Box>
                  <Box w="full">
                    <Text fontWeight="semibold">Date & Time:</Text>
                    <Text>
                      {formatDate(selectedAppointment.date)} at{" "}
                      {selectedAppointment.time}
                    </Text>
                  </Box>
                </>
              )}

              <FormControl isRequired>
                <FormLabel>Cancellation Reason</FormLabel>
                <Textarea
                  placeholder="Please provide a reason for cancellation..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={cancelModal.onClose}
              isDisabled={actionLoading}
            >
              Close
            </Button>
            <Button
              colorScheme="red"
              onClick={handleCancel}
              isLoading={actionLoading}
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
