// components/admin/RecentActivity.tsx
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  RiUserAddLine,
  RiVideoChatLine,
  RiMessage3Line,
  RiTrophyLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { Activity } from "../../types/admin";
import { formatRelativeTime } from "../../utils/formatters";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const iconBg = useColorModeValue("blue.50", "blue.900");
  const iconColor = useColorModeValue("blue.600", "blue.400");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const lightTextColor = useColorModeValue("gray.400", "gray.600");

  const getActivityIcon = (type: Activity["type"]) => {
    const iconMap = {
      "user-registered": RiUserAddLine,
      "consultation-booked": RiVideoChatLine,
      "message-sent": RiMessage3Line,
      "game-achievement": RiTrophyLine,
      "doctor-availability": RiCheckboxCircleFill,
    };
    const Icon = iconMap[type] || RiUserAddLine;
    return <Icon size={20} />;
  };

  const getPriorityColor = (priority?: string) => {
    const colors: Record<string, string> = {
      low: "gray",
      medium: "blue",
      high: "orange",
      urgent: "red",
    };
    return colors[priority || "low"] || "gray";
  };

  return (
    <Box>
      <VStack align="stretch" spacing={0}>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              p={3}
              borderRadius="lg"
              _hover={{ bg: hoverBg }}
            >
              <HStack spacing={3} align="start">
                <Box
                  p={2}
                  borderRadius="full"
                  bg={iconBg}
                  color={iconColor}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {getActivityIcon(activity.type)}
                </Box>
                <Box flex="1">
                  <HStack mb={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {activity.userName || activity.doctorName}
                    </Text>
                    {activity.priority && (
                      <Badge
                        size="sm"
                        colorScheme={getPriorityColor(activity.priority)}
                      >
                        {activity.priority}
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="xs" color={textColor}>
                    {activity.description}
                  </Text>
                  <Text fontSize="xs" color={lightTextColor} mt={1}>
                    {formatRelativeTime(activity.timestamp)}
                  </Text>
                </Box>
                {(activity.userAvatar || activity.doctorName) && (
                  <Avatar
                    size="sm"
                    name={activity.userName || activity.doctorName}
                    src={activity.userAvatar}
                  />
                )}
              </HStack>
            </MotionBox>
            {index < activities.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default RecentActivity;
