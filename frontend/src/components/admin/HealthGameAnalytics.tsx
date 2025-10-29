// components/admin/HealthGameAnalytics.tsx
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiGamepadLine, RiTrophyLine, RiUserStarLine } from "react-icons/ri";
import { HealthGameStats } from "../../types/admin";
import { formatNumber } from "../../utils/formatters";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface HealthGameAnalyticsProps {
  stats: HealthGameStats;
}

const HealthGameAnalytics: React.FC<HealthGameAnalyticsProps> = ({ stats }) => {
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const topBg = useColorModeValue("yellow.50", "yellow.900");
  const normalBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("yellow.400", "yellow.600");

  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        {/* Quick Stats */}
        <SimpleGrid columns={3} spacing={4}>
          <Stat>
            <StatLabel fontSize="xs" color={labelColor}>
              Active Players
            </StatLabel>
            <StatNumber fontSize="xl" fontWeight="bold">
              {stats.activePlayers}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color={labelColor}>
              Total Players
            </StatLabel>
            <StatNumber fontSize="xl" fontWeight="bold">
              {stats.totalPlayers}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color={labelColor}>
              Avg Session
            </StatLabel>
            <StatNumber fontSize="xl" fontWeight="bold">
              {stats.averageSessionTime}m
            </StatNumber>
          </Stat>
        </SimpleGrid>

        <Divider />

        {/* Popular Topics */}
        <Box>
          <HStack mb={3}>
            <RiGamepadLine size={18} />
            <Text fontWeight="semibold" fontSize="sm">
              Popular Topics
            </Text>
          </HStack>
          <VStack align="stretch" spacing={3}>
            {stats.popularTopics.map((topic, index) => (
              <MotionBox
                key={topic.topic}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm" fontWeight="medium">
                    {topic.topic}
                  </Text>
                  <Badge colorScheme="blue" fontSize="xs">
                    {topic.plays} plays
                  </Badge>
                </HStack>
                <Progress
                  value={(topic.plays / stats.popularTopics[0].plays) * 100}
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                />
              </MotionBox>
            ))}
          </VStack>
        </Box>

        <Divider />

        {/* Top Performers */}
        <Box>
          <HStack mb={3}>
            <RiTrophyLine size={18} />
            <Text fontWeight="semibold" fontSize="sm">
              Top Performers
            </Text>
          </HStack>
          <VStack align="stretch" spacing={2}>
            {stats.topPerformers.map((performer, index) => (
              <MotionBox
                key={performer.userId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <HStack
                  p={2}
                  borderRadius="md"
                  bg={index === 0 ? topBg : normalBg}
                  borderWidth={index === 0 ? 2 : 0}
                  borderColor={borderColor}
                >
                  <HStack flex="1">
                    <Avatar size="sm" name={performer.userName} />
                    <Text fontSize="sm" fontWeight="medium">
                      {performer.userName}
                    </Text>
                  </HStack>
                  <HStack>
                    <RiUserStarLine size={16} color="gold" />
                    <Text fontSize="sm" fontWeight="bold">
                      {performer.score}
                    </Text>
                  </HStack>
                </HStack>
              </MotionBox>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default HealthGameAnalytics;
