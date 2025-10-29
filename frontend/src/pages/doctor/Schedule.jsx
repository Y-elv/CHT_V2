// pages/doctor/Schedule.jsx
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiCalendarLine,
  RiTimeLine,
  RiUserLine,
  RiVideoChatLine,
} from "react-icons/ri";

const Schedule = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const todayAppointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "John Doe",
      type: "Follow-up",
      duration: "30 min",
      status: "Confirmed",
    },
    {
      id: 2,
      time: "10:30 AM",
      patient: "Jane Smith",
      type: "Consultation",
      duration: "45 min",
      status: "Confirmed",
    },
    {
      id: 3,
      time: "02:00 PM",
      patient: "Mike Johnson",
      type: "Video Call",
      duration: "30 min",
      status: "Pending",
    },
    {
      id: 4,
      time: "03:30 PM",
      patient: "Sarah Wilson",
      type: "Follow-up",
      duration: "30 min",
      status: "Confirmed",
    },
  ];

  const upcomingAppointments = [
    {
      id: 5,
      date: "Tomorrow",
      time: "09:00 AM",
      patient: "David Brown",
      type: "Consultation",
      duration: "45 min",
    },
    {
      id: 6,
      date: "Jan 18",
      time: "11:00 AM",
      patient: "Lisa Davis",
      type: "Follow-up",
      duration: "30 min",
    },
    {
      id: 7,
      date: "Jan 19",
      time: "02:30 PM",
      patient: "Robert Wilson",
      type: "Video Call",
      duration: "30 min",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "green";
      case "Pending":
        return "yellow";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video Call":
        return RiVideoChatLine;
      case "Consultation":
        return RiUserLine;
      case "Follow-up":
        return RiTimeLine;
      default:
        return RiCalendarLine;
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
                    Schedule
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Manage your appointments and availability.
                  </Text>
                </Box>
                <Button colorScheme="blue" leftIcon={<RiCalendarLine />}>
                  New Appointment
                </Button>
              </HStack>

              <Tabs variant="enclosed">
                <TabList>
                  <Tab>Today's Appointments</Tab>
                  <Tab>Upcoming</Tab>
                  <Tab>Availability</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                      {todayAppointments.map((appointment) => (
                        <Card
                          key={appointment.id}
                          bg={cardBg}
                          borderRadius="xl"
                          shadow="sm"
                        >
                          <CardHeader>
                            <HStack justify="space-between">
                              <HStack>
                                <Text fontSize="lg" fontWeight="bold">
                                  {appointment.time}
                                </Text>
                                <Badge
                                  colorScheme={getStatusColor(
                                    appointment.status
                                  )}
                                >
                                  {appointment.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.500">
                                {appointment.duration}
                              </Text>
                            </HStack>
                          </CardHeader>
                          <CardBody pt={0}>
                            <VStack align="stretch" spacing={3}>
                              <HStack>
                                <Text fontWeight="semibold">
                                  {appointment.patient}
                                </Text>
                                <Badge colorScheme="blue" variant="outline">
                                  {appointment.type}
                                </Badge>
                              </HStack>
                              <HStack spacing={2}>
                                <Button size="sm" colorScheme="green">
                                  Start Call
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                >
                                  Reschedule
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                >
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </TabPanel>

                  <TabPanel px={0}>
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                      {upcomingAppointments.map((appointment) => (
                        <Card
                          key={appointment.id}
                          bg={cardBg}
                          borderRadius="xl"
                          shadow="sm"
                        >
                          <CardHeader>
                            <HStack justify="space-between">
                              <Text fontSize="lg" fontWeight="bold">
                                {appointment.date}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {appointment.duration}
                              </Text>
                            </HStack>
                          </CardHeader>
                          <CardBody pt={0}>
                            <VStack align="stretch" spacing={3}>
                              <HStack>
                                <Text fontWeight="semibold">
                                  {appointment.patient}
                                </Text>
                                <Badge colorScheme="blue" variant="outline">
                                  {appointment.type}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {appointment.time}
                              </Text>
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                >
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                >
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </TabPanel>

                  <TabPanel px={0}>
                    <Card bg={cardBg} borderRadius="xl" shadow="sm">
                      <CardHeader>
                        <Heading size="md">Availability Settings</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          Configure your working hours and availability
                          preferences.
                        </Text>
                        <Button mt={4} colorScheme="blue">
                          Manage Availability
                        </Button>
                      </CardBody>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Schedule;
