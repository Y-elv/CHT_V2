import React, { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Flex,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { useAdminStore } from "../../store/adminStore";
import { getStatusColor } from "../../utils/formatters";

const ORANGE_GRADIENT = "linear(to-br, orange.400, orange.600)";

const AdminConsultations: React.FC = () => {
  const {
    apiConsultations,
    consultationsTotal,
    consultationsPage,
    totalPagesConsultations,
    isLoading,
    fetchConsultations,
  } = useAdminStore();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    fetchConsultations(1, 20);
  }, [fetchConsultations]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="full" p={6}>
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between">
            <Box>
              <Heading size="2xl" mb={2} bgGradient={ORANGE_GRADIENT} bgClip="text">
                Consultations
              </Heading>
              <Text color={subtleText}>
                All consultations: patient, doctor, date, status, and type.
              </Text>
            </Box>
          </HStack>

          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            {isLoading && !apiConsultations.length ? (
              <Flex justify="center" py={12}>
                <Spinner size="xl" color="orange.500" />
              </Flex>
            ) : (
              <Box overflowX="auto">
                <Table size="sm">
                  <Thead bg={useColorModeValue("orange.50", "gray.700")}>
                    <Tr>
                      <Th>Patient</Th>
                      <Th>Doctor</Th>
                      <Th>Date</Th>
                      <Th>Time</Th>
                      <Th>Type</Th>
                      <Th>Reason</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {apiConsultations.map((c) => (
                      <Tr key={c._id}>
                        <Td>
                          <HStack spacing={2}>
                            <Avatar
                              size="xs"
                              name={c.patient?.name}
                              src={c.patient?.pic}
                              bg="orange.400"
                              color="white"
                            />
                            <Text fontSize="sm">
                              {c.patient?.name ?? "—"}
                            </Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Avatar
                              size="xs"
                              name={c.doctor?.name}
                              src={c.doctor?.pic}
                              bg="blue.400"
                              color="white"
                            />
                            <Box>
                              <Text fontSize="sm">{c.doctor?.name ?? "—"}</Text>
                              {c.doctor?.specialty && (
                                <Text fontSize="xs" color={subtleText}>
                                  {c.doctor.specialty}
                                </Text>
                              )}
                            </Box>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm">{formatDate(c.date)}</Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm">{c.time || "—"}</Text>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme="purple"
                            textTransform="capitalize"
                            fontSize="10px"
                          >
                            {c.appointmentType || "—"}
                          </Badge>
                        </Td>
                        <Td maxW="160px">
                          <Text fontSize="xs" noOfLines={2} color={subtleText}>
                            {c.reason || "—"}
                          </Text>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(c.status)}
                            px={2}
                            py={1}
                            borderRadius="full"
                            textTransform="capitalize"
                            fontSize="10px"
                          >
                            {c.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
            {consultationsTotal > 0 && (
              <HStack mt={4} justify="space-between">
                <Text fontSize="sm" color={subtleText}>
                  Total: {consultationsTotal} consultations
                </Text>
                {totalPagesConsultations > 1 && (
                  <HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="orange"
                      isDisabled={consultationsPage <= 1}
                      onClick={() => fetchConsultations(consultationsPage - 1, 20)}
                    >
                      Previous
                    </Button>
                    <Text fontSize="sm">
                      Page {consultationsPage} of {totalPagesConsultations}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="orange"
                      isDisabled={
                        consultationsPage >= totalPagesConsultations
                      }
                      onClick={() => fetchConsultations(consultationsPage + 1, 20)}
                    >
                      Next
                    </Button>
                  </HStack>
                )}
              </HStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminConsultations;
