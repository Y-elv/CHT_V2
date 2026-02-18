// pages/admin/Dashboard.tsx
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
  Spinner,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  RiUserLine,
  RiVideoChatLine,
  RiAlertLine,
  RiQuestionLine,
} from "react-icons/ri";
import { useAdminStore } from "../../store/adminStore";
import { useRealTimeUpdates } from "../../hooks/useRealTimeUpdates";
import StatsCard from "../../components/admin/StatsCard";
import ConsultationTable from "../../components/admin/ConsultationTable";
import DoctorCard from "../../components/admin/DoctorCard";
import RecentActivity from "../../components/admin/RecentActivity";
import MessagingOverview from "../../components/admin/MessagingOverview";

const Dashboard: React.FC = () => {
  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  // State from store
  const {
    totalUsers,
    activeConsultations,
    mentalHealthAlerts,
    faqCount,
    consultations,
    doctors,
    recentActivity,
    isLoading,
    fetchDashboardStats,
    fetchConsultations,
    fetchDoctors,
    fetchRecentActivity,
  } = useAdminStore();

  // Enable real-time updates
  useRealTimeUpdates();

  // Fetch initial data
  useEffect(() => {
    fetchDashboardStats();
    fetchConsultations();
    fetchDoctors();
    fetchRecentActivity();
  }, [
    fetchDashboardStats,
    fetchConsultations,
    fetchDoctors,
    fetchRecentActivity,
  ]);

  if (isLoading && !consultations.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="full" p={6}>
        <VStack align="stretch" spacing={6}>
          {/* Header */}
          <HStack justify="space-between">
            <Box>
              <Heading size="2xl" mb={2}>
                Dashboard Overview
              </Heading>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Welcome back! Here's what's happening today.
              </Text>
            </Box>
          </HStack>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatsCard
              label="Total Active Users"
              value={totalUsers}
              icon={<RiUserLine size={20} />}
              gradient="linear(to-br, #F7941D, orange.600)"
              subtitle="Registered users"
              onClick={() =>
                toast({ title: "Viewing all users", status: "info" })
              }
            />
            <StatsCard
              label="Active Consultations"
              value={activeConsultations}
              icon={<RiVideoChatLine size={20} />}
              gradient="linear(to-br, orange.400, orange.600)"
              subtitle="Total consultations"
            />
            <StatsCard
              label="Mental Health Alerts"
              value={mentalHealthAlerts}
              icon={<RiAlertLine size={20} />}
              gradient="linear(to-br, orange.400, red.600)"
              subtitle="Requiring attention"
              onClick={() =>
                toast({
                  title: "Review Mental Health Alerts",
                  status: "warning",
                })
              }
            />
            <StatsCard
              label="FAQs"
              value={faqCount}
              icon={<RiQuestionLine size={20} />}
              gradient="linear(to-br, orange.300, orange.600)"
              subtitle="Published FAQs"
            />
          </SimpleGrid>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Recent Consultations */}
            <GridItem>
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm">
                <Heading size="md" mb={4}>
                  Recent Consultations
                </Heading>
                <ConsultationTable
                  consultations={consultations}
                  onViewDetails={(consultation) => {
                    toast({
                      title: "Consultation Details",
                      description: `Viewing consultation with ${consultation.userName}`,
                      status: "info",
                    });
                  }}
                  onJoinCall={(consultation) => {
                    toast({
                      title: "Joining Call",
                      description: `Connecting to consultation with ${consultation.userName}`,
                      status: "success",
                    });
                  }}
                />
              </Box>
            </GridItem>

            {/* Doctors/Therapists Overview */}
            <GridItem>
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm">
                <Heading size="md" mb={4}>
                  Doctors & Therapists
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onMessage={(doc) => {
                        toast({
                          title: "Messaging Doctor",
                          description: `Opening chat with ${doc.name}`,
                          status: "info",
                        });
                      }}
                      onSchedule={(doc) => {
                        toast({
                          title: "Schedule Consultation",
                          description: `Scheduling with ${doc.name}`,
                          status: "info",
                        });
                      }}
                      onAssignConsultation={(doc) => {
                        toast({
                          title: "Assign Consultation",
                          description: `Assigning consultation to ${doc.name}`,
                          status: "info",
                        });
                      }}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </GridItem>
          </SimpleGrid>

          {/* Bottom Grid */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {/* Recent Activity */}
            <GridItem>
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm">
                <Heading size="md" mb={4}>
                  Recent Activity
                </Heading>
                <RecentActivity activities={recentActivity} />
              </Box>
            </GridItem>

            {/* FAQ summary (completion-style card) */}
            <GridItem>
              <Box
                bg={cardBg}
                p={6}
                borderRadius="xl"
                shadow="sm"
                bgGradient="linear(to-br, white, orange.50)"
                borderWidth="1px"
                borderColor="orange.100"
              >
                <Heading size="md" mb={4} color="gray.700">
                  FAQs
                </Heading>
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                    {faqCount}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Published FAQs. Manage from FAQ section.
                  </Text>
                </Box>
              </Box>
            </GridItem>

            {/* Messaging Overview */}
            <GridItem>
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm">
                <Heading size="md" mb={4}>
                  Messaging Overview
                </Heading>
                <MessagingOverview />
              </Box>
            </GridItem>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
