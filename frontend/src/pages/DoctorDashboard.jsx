// pages/DoctorDashboard.jsx
import React, { useEffect, useState } from "react";
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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import DoctorSidebar from "../components/admin/DoctorSidebar";
import Header from "../components/admin/Header";
import StatsCard from "../components/admin/StatsCard";
import { useAuthStore } from "../store/authStore";
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
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { handleAuthError } from "../utils/authErrorHandler";

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
  const { user } = useAuthStore(); // ✅ Use cookie-based auth store
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textSubtle = useColorModeValue("gray.600", "gray.400");
  
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [uniquePatientsCount, setUniquePatientsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Fetch profile completion percentage
  const fetchProfileCompletion = async () => {
    try {
      const response = await axios.get('/v2/user/profile-completion');
      const completionData = response.data;
      
      setProfileCompletion(completionData.completionPercentage || 0);
    } catch (error) {
      if (handleAuthError(error, "doctor dashboard profile completion")) {
        return; // Auth error handled globally
      }
      setProfileCompletion(0);
    }
  };

  // Fetch conversations for unread messages count
  const fetchConversations = async () => {
    try {
      const response = await axios.get('/v2/message/conversations');
      const conversations = response.data || [];
      
      // Count total unread messages from all conversations
      const totalUnread = conversations.reduce((total, conversation) => {
        return total + (conversation.unreadCount || 0);
      }, 0);
      
      setUnreadMessagesCount(totalUnread);
    } catch (error) {
      if (handleAuthError(error, "doctor dashboard conversations")) {
        return; // Auth error handled globally
      }
    }
  };

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const response = await axios.get('/appointment/doctor?page=1&limit=20');
      
      const appointmentsData = response.data.appointments || [];
      setAppointments(appointmentsData);
      
      // Count all approved appointments (not just next 24 hours)
      const approvedAppointmentsCount = appointmentsData.filter(appointment => {
        return appointment.status === 'approved';
      }).length;
      
      setUpcomingCount(approvedAppointmentsCount);
      
      // Count unique patients based on email
      const uniquePatientEmails = new Set();
      appointmentsData.forEach(appointment => {
        if (appointment.patient && appointment.patient.email) {
          uniquePatientEmails.add(appointment.patient.email);
        }
      });
      
      setUniquePatientsCount(uniquePatientEmails.size);
    } catch (error) {
      if (handleAuthError(error, "doctor dashboard appointments")) {
        return; // Auth error handled globally
      }
      toast({
        title: "Error loading appointments",
        description: "Unable to load your appointment data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Default to dark mode and fetch appointments
  useEffect(() => {
    if (colorMode !== "dark") {
      toggleColorMode();
    }
    
    // Fetch appointments data
    fetchAppointments();
    fetchConversations();
    fetchProfileCompletion();
    
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
                  value={appointmentsLoading ? <Spinner size="sm" /> : upcomingCount}
                  icon={<RiCalendarLine size={20} />}
                  gradient="linear(to-br, blue.400, blue.600)"
                  subtitle="All approved"
                />
                <StatsCard
                  label="Active Patients"
                  value={appointmentsLoading ? <Spinner size="sm" /> : uniquePatientsCount}
                  icon={<RiUserHeartLine size={20} />}
                  gradient="linear(to-br, green.400, green.600)"
                  subtitle="Under your care"
                />
                <StatsCard
                  label="Messages"
                  value={appointmentsLoading ? <Spinner size="sm" /> : unreadMessagesCount}
                  icon={<RiMessage3Line size={20} />}
                  gradient="linear(to-br, purple.400, purple.600)"
                  subtitle="Unread"
                />
                <StatsCard
                  label="Profile Completion"
                  value={appointmentsLoading ? <Spinner size="sm" /> : profileCompletion}
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
                  <Button 
                    colorScheme="blue" 
                    variant="solid"
                    onClick={() => navigate('/doctor/schedule')}
                  >
                    Start Consultation
                  </Button>
                  <Button 
                    colorScheme="purple" 
                    variant="solid"
                    onClick={() => navigate('/doctor/messages')}
                  >
                    Check Messages
                  </Button>
                  <Button 
                    colorScheme="green" 
                    variant="solid"
                    onClick={() => navigate('/doctor/patients')}
                  >
                    View Patients
                  </Button>
                  <Button 
                    colorScheme="red" 
                    variant="solid"
                    onClick={() => navigate('/doctor/notifications')}
                  >
                    Notifications
                  </Button>
                  <Button 
                    colorScheme="orange" 
                    variant="solid"
                    onClick={() => navigate('/doctor/profile')}
                  >
                    Profile
                  </Button>
                  <Button 
                    colorScheme="gray" 
                    variant="solid"
                    onClick={() => navigate('/doctor/settings')}
                  >
                    Settings
                  </Button>
                  <Button 
                    colorScheme="teal" 
                    variant="solid"
                    onClick={() => navigate('/doctor/analytics')}
                  >
                    Analytics
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
