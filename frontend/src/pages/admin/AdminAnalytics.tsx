// pages/admin/AdminAnalytics.tsx
import React, { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiUserLine, RiVideoChatLine, RiAlertLine } from "react-icons/ri";
import { useAdminStore } from "../../store/adminStore";
import StatsCard from "../../components/admin/StatsCard";
import HealthGameAnalytics from "../../components/admin/HealthGameAnalytics";

const AdminAnalytics: React.FC = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  const {
    dashboardStats,
    healthGameStats,
    isLoading,
    fetchDashboardStats,
    fetchHealthGameStats,
  } = useAdminStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchHealthGameStats();
  }, [fetchDashboardStats, fetchHealthGameStats]);

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="full" p={6}>
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading
              size="2xl"
              mb={2}
              bgGradient="linear(to-r, orange.400, orange.600)"
              bgClip="text"
            >
              Analytics
            </Heading>
            <Text color={subtleText}>
              High-level overview of user engagement, consultations and health
              game activity.
            </Text>
          </Box>

          {/* Top stats from dashboard */}
          {dashboardStats && (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <StatsCard
                label="Total Users"
                value={dashboardStats.totalUsers}
                icon={<RiUserLine size={20} />}
                gradient="linear(to-br, #F7941D, orange.600)"
                subtitle="All registered users"
              />
              <StatsCard
                label="Consultations"
                value={dashboardStats.activeConsultations}
                icon={<RiVideoChatLine size={20} />}
                gradient="linear(to-br, orange.400, orange.600)"
                subtitle="Total consultations"
              />
              <StatsCard
                label="Mental Health Alerts"
                value={dashboardStats.mentalHealthAlerts}
                icon={<RiAlertLine size={20} />}
                gradient="linear(to-br, orange.400, red.600)"
                subtitle="Requiring attention"
              />
            </SimpleGrid>
          )}

          {/* Health Game Analytics */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Heading size="md" mb={4}>
              Health Game Engagement
            </Heading>
            {healthGameStats ? (
              <HealthGameAnalytics stats={healthGameStats} />
            ) : (
              <Text fontSize="sm" color={subtleText}>
                No health game analytics data available yet. This will populate
                once the backend exposes stats for game usage.
              </Text>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminAnalytics;

