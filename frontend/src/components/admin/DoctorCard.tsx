// components/admin/DoctorCard.tsx
import React from "react";
import {
  Box,
  Card,
  CardBody,
  HStack,
  VStack,
  Avatar,
  Text,
  Badge,
  IconButton,
  Flex,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  RiStarFill,
  RiMessage3Line,
  RiVideoChatLine,
  RiCalendarLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { Doctor } from "../../types/admin";
import { getAvailabilityColor } from "../../utils/formatters";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface DoctorCardProps {
  doctor: Doctor;
  onMessage?: (doctor: Doctor) => void;
  onSchedule?: (doctor: Doctor) => void;
  onAssignConsultation?: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onMessage,
  onSchedule,
  onAssignConsultation,
}) => {
  const availabilityColor = getAvailabilityColor(doctor.availability);
  const hoverBorderColor = useColorModeValue("blue.300", "blue.500");
  const hoverBoxShadow = useColorModeValue("lg", "xl");
  const textColor = useColorModeValue("gray.500", "gray.400");

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        borderWidth="1px"
        borderRadius="xl"
        overflow="hidden"
        _hover={{ boxShadow: hoverBoxShadow, borderColor: hoverBorderColor }}
      >
        <CardBody p={4}>
          <Flex justify="space-between" align="start" mb={3}>
            <HStack spacing={3}>
              <Box position="relative">
                <Avatar size="md" name={doctor.name} src={doctor.avatar} />
                {doctor.isOnline && (
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    w="16px"
                    h="16px"
                    bg="green.500"
                    borderRadius="full"
                    border="2px solid white"
                  />
                )}
              </Box>
              <VStack align="start" spacing={0}>
                <HStack>
                  <Text fontWeight="bold" fontSize="md">
                    {doctor.name}
                  </Text>
                  {doctor.isVerified && (
                    <RiCheckboxCircleFill color="green" size={16} />
                  )}
                </HStack>
                <Text fontSize="xs" color={textColor}>
                  {doctor.credentials.join(", ")}
                </Text>
              </VStack>
            </HStack>
            <Badge
              colorScheme={availabilityColor}
              px={2}
              py={1}
              borderRadius="full"
              textTransform="capitalize"
            >
              {doctor.availability}
            </Badge>
          </Flex>

          <Divider my={3} />

          <VStack align="stretch" spacing={2} mb={3}>
            <Flex justify="space-between">
              <Text fontSize="sm" color={textColor}>
                Specialty:
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {doctor.specialty.replace("-", " ")}
              </Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <HStack>
                <RiStarFill color="gold" size={14} />
                <Text fontSize="sm" fontWeight="medium">
                  {doctor.rating}
                </Text>
                <Text fontSize="xs" color={textColor}>
                  ({doctor.reviewCount} reviews)
                </Text>
              </HStack>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color={textColor}>
                Current:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {doctor.currentConsultations} consultations
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color={textColor}>
                Total:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {doctor.totalConsultations} completed
              </Text>
            </Flex>
          </VStack>

          <Divider my={3} />

          <HStack spacing={2} flexWrap="wrap">
            <IconButton
              aria-label="Message doctor"
              icon={<RiMessage3Line />}
              size="sm"
              variant="outline"
              colorScheme="blue"
              flex="1"
              onClick={() => onMessage?.(doctor)}
            />
            <IconButton
              aria-label="Schedule"
              icon={<RiCalendarLine />}
              size="sm"
              variant="outline"
              colorScheme="green"
              flex="1"
              onClick={() => onSchedule?.(doctor)}
            />
            <IconButton
              aria-label="Assign consultation"
              icon={<RiVideoChatLine />}
              size="sm"
              variant="solid"
              colorScheme="purple"
              onClick={() => onAssignConsultation?.(doctor)}
            />
          </HStack>
        </CardBody>
      </Card>
    </MotionBox>
  );
};

export default DoctorCard;
