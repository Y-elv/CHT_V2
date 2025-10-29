// pages/DoctorDashboard.jsx
import React, { useEffect } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  GridItem,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  useDisclosure,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import DoctorSidebar from "../components/admin/DoctorSidebar";
import Header from "../components/admin/Header";
import StatsCard from "../components/admin/StatsCard";
import {
  RiCalendarLine,
  RiUserHeartLine,
  RiMessage3Line,
  RiProfileLine,
} from "react-icons/ri";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const patientDistributionData = [
  { name: "Follow-ups", value: 45 },
  { name: "New Consultations", value: 30 },
  { name: "Recovered", value: 25 },
];

const appointmentsLast7Days = [
  { day: "Mon", appointments: 6 },
  { day: "Tue", appointments: 9 },
  { day: "Wed", appointments: 4 },
  { day: "Thu", appointments: 7 },
  { day: "Fri", appointments: 5 },
  { day: "Sat", appointments: 3 },
  { day: "Sun", appointments: 8 },
];

const COLORS = ["#3182CE", "#38A169", "#DD6B20"]; // blue, green, orange

const DoctorDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textSubtle = useColorModeValue("gray.600", "gray.400");

  // Default to dark mode
  useEffect(() => {
    if (colorMode !== "dark") {
      toggleColorMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Doctor Sidebar */}
      <DoctorSidebar isOpen={isOpen} onClose={onClose} />

      {/* Main Content Area (reused layout spacing) */}
      <Box ml={{ base: 0, md: "250px" }}>
        {/* Header (reused) */}
        <Header onToggleSidebar={onOpen} />

        {/* Page Content */}
        <Box p={0}>
          <Container maxW="full" p={6}>
            <VStack align="stretch" spacing={6}>
              {/* Title */}
              <HStack justify="space-between">
                <Box>
                  <Heading size="2xl" mb={2}>
                    Doctor Dashboard
                  </Heading>
                  <Text color={textSubtle}>
                    Overview of your patients and schedule.
                  </Text>
                </Box>
              </HStack>

              {/* Stats Cards */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <StatsCard
                  label="Upcoming Consultations"
                  value={8}
                  icon={<RiCalendarLine size={20} />}
                  gradient="linear(to-br, blue.400, blue.600)"
                  subtitle="Next 24 hours"
                />
                <StatsCard
                  label="Active Patients"
                  value={42}
                  icon={<RiUserHeartLine size={20} />}
                  gradient="linear(to-br, green.400, green.600)"
                  subtitle="Under your care"
                />
                <StatsCard
                  label="Messages"
                  value={15}
                  icon={<RiMessage3Line size={20} />}
                  gradient="linear(to-br, purple.400, purple.600)"
                  subtitle="Unread"
                />
                <StatsCard
                  label="Profile Completion"
                  value={92}
                  icon={<RiProfileLine size={20} />}
                  gradient="linear(to-br, orange.400, orange.600)"
                  subtitle="Complete your details"
                />
              </SimpleGrid>

              {/* Charts Section */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Pie Chart */}
                <GridItem>
                  <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm">
                    <Heading size="md" mb={4}>
                      Patients by Category
                    </Heading>
                    <Box w="100%" h={{ base: "260px", md: "320px" }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={patientDistributionData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={90}
                            innerRadius={40}
                            paddingAngle={4}
                            label
                          >
                            {patientDistributionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                </GridItem>

                {/* Line Chart */}
                <GridItem>
                  <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm">
                    <Heading size="md" mb={4}>
                      Appointments (Last 7 Days)
                    </Heading>
                    <Box w="100%" h={{ base: "260px", md: "320px" }}>
                      <ResponsiveContainer>
                        <LineChart
                          data={appointmentsLast7Days}
                          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                        >
                          <XAxis dataKey="day" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="appointments"
                            stroke="#63B3ED"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                </GridItem>
              </SimpleGrid>

              {/* Quick Actions */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm">
                <Heading size="md" mb={4}>
                  Quick Actions
                </Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Button colorScheme="blue" variant="solid">
                    View Appointments
                  </Button>
                  <Button colorScheme="purple" variant="solid">
                    Messages
                  </Button>
                  <Button colorScheme="green" variant="solid">
                    Patient Records
                  </Button>
                  <Button colorScheme="orange" variant="solid">
                    Manage Availability
                  </Button>
                </SimpleGrid>
              </Box>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
