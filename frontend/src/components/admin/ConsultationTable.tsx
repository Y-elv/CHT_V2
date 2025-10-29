// components/admin/ConsultationTable.tsx
import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  IconButton,
  HStack,
  Text,
  Select,
  Input,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiEyeLine, RiVideoChatLine, RiAlertFill } from "react-icons/ri";
import { Consultation } from "../../types/admin";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "../../utils/formatters";
import { motion } from "framer-motion";

const MotionTr = motion(Tr);

interface ConsultationTableProps {
  consultations: Consultation[];
  onViewDetails?: (consultation: Consultation) => void;
  onJoinCall?: (consultation: Consultation) => void;
}

const ConsultationTable: React.FC<ConsultationTableProps> = ({
  consultations,
  onViewDetails,
  onJoinCall,
}) => {
  const textColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box>
      {/* Filters */}
      <Flex gap={4} mb={4}>
        <Select placeholder="Filter by Status" size="sm" maxW="200px">
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <Select placeholder="Filter by Type" size="sm" maxW="200px">
          <option value="video">Video Call</option>
          <option value="chat">Chat</option>
          <option value="urgent">Urgent</option>
        </Select>
        <Select placeholder="Filter by Priority" size="sm" maxW="200px">
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
      </Flex>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Time</Th>
              <Th>User</Th>
              <Th>Doctor</Th>
              <Th>Type</Th>
              <Th>Topic</Th>
              <Th>Status</Th>
              <Th>Priority</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {consultations.map((consultation) => (
              <MotionTr
                key={consultation.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Td>
                  <Text fontSize="xs">
                    {formatDate(consultation.scheduledAt)}
                  </Text>
                </Td>
                <Td>
                  <HStack>
                    <Avatar
                      size="xs"
                      name={consultation.userName}
                      src={consultation.userAvatar}
                    />
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">
                        {consultation.userName}
                      </Text>
                      <Text fontSize="xs" color={textColor}>
                        Age: {consultation.userAge}
                      </Text>
                    </Box>
                  </HStack>
                </Td>
                <Td>
                  <Text fontSize="sm">{consultation.doctorName}</Text>
                  <Text fontSize="xs" color={textColor}>
                    {consultation.doctorSpecialty}
                  </Text>
                </Td>
                <Td>
                  <HStack>
                    {consultation.type === "video" && (
                      <RiVideoChatLine size={16} />
                    )}
                    {consultation.priority === "urgent" && (
                      <RiAlertFill size={16} color="red" />
                    )}
                    <Text fontSize="sm" textTransform="capitalize">
                      {consultation.type}
                    </Text>
                  </HStack>
                </Td>
                <Td>
                  <Text fontSize="sm" textTransform="capitalize">
                    {consultation.topic.replace("-", " ")}
                  </Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getStatusColor(consultation.status)}
                    px={2}
                    py={1}
                    borderRadius="full"
                    textTransform="uppercase"
                    fontSize="10px"
                  >
                    {consultation.status.replace("-", " ")}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getPriorityColor(consultation.priority)}
                    px={2}
                    py={1}
                    borderRadius="full"
                    textTransform="uppercase"
                    fontSize="10px"
                  >
                    {consultation.priority}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="View details"
                      icon={<RiEyeLine />}
                      size="xs"
                      variant="ghost"
                      onClick={() => onViewDetails?.(consultation)}
                    />
                    {consultation.status === "in-progress" && (
                      <IconButton
                        aria-label="Join call"
                        icon={<RiVideoChatLine />}
                        size="xs"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => onJoinCall?.(consultation)}
                      />
                    )}
                  </HStack>
                </Td>
              </MotionTr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default ConsultationTable;
