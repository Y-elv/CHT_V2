// pages/doctor/Analytics.jsx
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
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import { RiBarChartLine } from "react-icons/ri";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const weeklyData = [
    { day: "Mon", consultations: 8, patients: 12, revenue: 1200 },
    { day: "Tue", consultations: 12, patients: 15, revenue: 1800 },
    { day: "Wed", consultations: 6, patients: 9, revenue: 900 },
    { day: "Thu", consultations: 10, patients: 13, revenue: 1500 },
    { day: "Fri", consultations: 14, patients: 18, revenue: 2100 },
    { day: "Sat", consultations: 4, patients: 6, revenue: 600 },
    { day: "Sun", consultations: 2, patients: 3, revenue: 300 },
  ];

  const monthlyData = [
    { month: "Jan", consultations: 120, patients: 180, revenue: 18000 },
    { month: "Feb", consultations: 135, patients: 200, revenue: 20250 },
    { month: "Mar", consultations: 150, patients: 225, revenue: 22500 },
    { month: "Apr", consultations: 140, patients: 210, revenue: 21000 },
    { month: "May", consultations: 165, patients: 250, revenue: 24750 },
    { month: "Jun", consultations: 180, patients: 270, revenue: 27000 },
  ];

  const patientAgeData = [
    { age: "18-25", count: 45, percentage: 25 },
    { age: "26-35", count: 72, percentage: 40 },
    { age: "36-45", count: 36, percentage: 20 },
    { age: "46-55", count: 18, percentage: 10 },
    { age: "55+", count: 9, percentage: 5 },
  ];

  const consultationTypes = [
    { name: "General Consultation", value: 45, color: "#3182CE" },
    { name: "Follow-up", value: 30, color: "#38A169" },
    { name: "Video Call", value: 20, color: "#DD6B20" },
    { name: "Emergency", value: 5, color: "#E53E3E" },
  ];

  const COLORS = ["#3182CE", "#38A169", "#DD6B20", "#E53E3E"];

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
                    Analytics
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Track your performance and patient insights.
                  </Text>
                </Box>
                <Select maxW="200px" defaultValue="week">
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </Select>
              </HStack>

              {/* Key Metrics */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel>Total Consultations</StatLabel>
                      <StatNumber>42</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        12% from last week
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel>Active Patients</StatLabel>
                      <StatNumber>156</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        8% from last week
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel>Revenue</StatLabel>
                      <StatNumber>$8,400</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        15% from last week
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel>Avg. Rating</StatLabel>
                      <StatNumber>4.8</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        0.2 from last week
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Charts */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Weekly Performance */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md">Weekly Performance</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="consultations"
                            stackId="1"
                            stroke="#3182CE"
                            fill="#3182CE"
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="patients"
                            stackId="2"
                            stroke="#38A169"
                            fill="#38A169"
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Monthly Revenue */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md">Monthly Revenue</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="revenue" fill="#DD6B20" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Patient Demographics */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Patient Age Distribution */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md">Patient Age Distribution</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={patientAgeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="age" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#38A169" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Consultation Types */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md">Consultation Types</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={consultationTypes}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {consultationTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
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

export default Analytics;
