// pages/admin/Doctors.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  useToast,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Spinner,
  Flex,
  Avatar,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import { RiStethoscopeLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import axios from "../../config/axiosConfig";

interface ApiDoctor {
  _id: string;
  name: string;
  email: string;
  specialty?: string;
  bio?: string;
  yearsOfExperience?: number;
  hospital?: string;
  consultationFee?: number;
  status?: string; // approved / rejected / pending
  doctorStatus?: string;
}

const DoctorsPage: React.FC = () => {
  const [allDoctors, setAllDoctors] = useState<ApiDoctor[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<ApiDoctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const [allRes, pendingRes] = await Promise.all([
        axios.get(
          "https://chtv2-bn.onrender.com/api/admin/all-doctors?page=1&limit=20"
        ),
        axios.get(
          "https://chtv2-bn.onrender.com/api/admin/pending-doctors?page=1&limit=20"
        ),
      ]);

      const rawAll = allRes.data;
      const rawPending = pendingRes.data;

      const allData = Array.isArray(rawAll?.data)
        ? rawAll.data
        : Array.isArray(rawAll?.doctors)
        ? rawAll.doctors
        : Array.isArray(rawAll)
        ? rawAll
        : [];

      const pendingData = Array.isArray(rawPending?.data)
        ? rawPending.data
        : Array.isArray(rawPending?.doctors)
        ? rawPending.doctors
        : Array.isArray(rawPending)
        ? rawPending
        : [];

      setAllDoctors(allData as ApiDoctor[]);
      setPendingDoctors(pendingData as ApiDoctor[]);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load doctors";
      toast({
        description: msg,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const approvedOrRejected = useMemo(
    () =>
      Array.isArray(allDoctors)
        ? allDoctors.filter((doc) =>
            ["approved", "rejected"].includes(
              (doc.status || doc.doctorStatus || "").toLowerCase()
            )
          )
        : [],
    [allDoctors]
  );

  const getStatusInfo = (doctor: ApiDoctor) => {
    const raw = (doctor.status || doctor.doctorStatus || "pending").toLowerCase();
    if (raw === "approved") {
      return { label: "Approved", color: "green" as const };
    }
    if (raw === "rejected") {
      return { label: "Rejected", color: "red" as const };
    }
    return { label: "Pending", color: "yellow" as const };
  };

  const handleApprove = async (doctorId: string) => {
    setApprovingId(doctorId);
    try {
      await axios.post(
        `https://chtv2-bn.onrender.com/api/admin/approve-doctor/${doctorId}`
      );
      toast({
        description: "Doctor approved successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      await fetchDoctors();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to approve doctor";
      toast({
        description: msg,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (doctorId: string) => {
    setRejectingId(doctorId);
    try {
      await axios.post(
        `https://chtv2-bn.onrender.com/api/admin/reject-doctor/${doctorId}`
      );
      toast({
        description: "Doctor rejected successfully",
        status: "info",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      await fetchDoctors();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to reject doctor";
      toast({
        description: msg,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setRejectingId(null);
    }
  };

  const renderTable = (doctors: ApiDoctor[], withActions: boolean) => (
    <Box overflowX="auto" borderWidth="1px" borderRadius="xl" borderColor={borderColor}>
      <Table size="sm">
        <Thead bg={useColorModeValue("gray.100", "gray.700")}>
          <Tr>
            <Th>Doctor</Th>
            <Th>Email</Th>
            <Th>Specialty</Th>
            <Th>Bio</Th>
            <Th>Experience</Th>
            <Th>Hospital</Th>
            <Th>Consultation Fee</Th>
            <Th>Status</Th>
            {withActions && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {doctors.map((doctor) => {
            const statusInfo = getStatusInfo(doctor);
            return (
              <Tr key={doctor._id}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar
                      size="sm"
                      name={doctor.name}
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" fontSize="sm">
                        {doctor.name}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <Text fontSize="sm">{doctor.email}</Text>
                </Td>
                <Td>
                  <Text fontSize="sm" textTransform="capitalize">
                    {doctor.specialty || "-"}
                  </Text>
                </Td>
                <Td maxW="260px">
                  <Text fontSize="xs" color={subtleText} noOfLines={2}>
                    {doctor.bio || "-"}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm">
                    {doctor.yearsOfExperience != null
                      ? `${doctor.yearsOfExperience} yrs`
                      : "-"}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm">{doctor.hospital || "-"}</Text>
                </Td>
                <Td>
                  <Text fontSize="sm">
                    {doctor.consultationFee != null
                      ? `$${doctor.consultationFee}`
                      : "-"}
                  </Text>
                </Td>
                <Td>
                  <Tag
                    size="sm"
                    borderRadius="full"
                    variant="subtle"
                    colorScheme={statusInfo.color}
                  >
                    <TagLeftIcon
                      as={
                        statusInfo.color === "green"
                          ? RiCheckLine
                          : statusInfo.color === "red"
                          ? RiCloseLine
                          : RiStethoscopeLine
                      }
                    />
                    <TagLabel>{statusInfo.label}</TagLabel>
                  </Tag>
                </Td>
                {withActions && (
                  <Td>
                    <VStack
                      spacing={2}
                      align="stretch"
                      minW={{ base: "140px", md: "auto" }}
                    >
                      <Button
                        size="xs"
                        colorScheme="green"
                        variant="solid"
                        w="full"
                        isLoading={approvingId === doctor._id}
                        onClick={() => handleApprove(doctor._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="outline"
                        w="full"
                        isLoading={rejectingId === doctor._id}
                        onClick={() => handleReject(doctor._id)}
                      >
                        Reject
                      </Button>
                    </VStack>
                  </Td>
                )}
              </Tr>
            );
          })}
          {doctors.length === 0 && (
            <Tr>
              <Td colSpan={withActions ? 9 : 8}>
                <Flex justify="center" py={8}>
                  <Text fontSize="sm" color={subtleText}>
                    No doctors found.
                  </Text>
                </Flex>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="full" p={6}>
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between">
            <Box>
              <Heading size="2xl" mb={2}>
                Doctors Management
              </Heading>
              <Text color={subtleText}>
                Review, approve, and manage doctors on the platform.
              </Text>
            </Box>
          </HStack>

          {loading ? (
            <Flex justify="center" align="center" py={16}>
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : (
            <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <Tabs colorScheme="blue" variant="soft-rounded">
                <TabList mb={4}>
                  <Tab>All Doctors</Tab>
                  <Tab>Pending Doctors</Tab>
                  <Tab>Approved / Rejected</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    {renderTable(allDoctors, false)}
                  </TabPanel>
                  <TabPanel px={0}>
                    {renderTable(pendingDoctors, true)}
                  </TabPanel>
                  <TabPanel px={0}>
                    {renderTable(approvedOrRejected, false)}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default DoctorsPage;


