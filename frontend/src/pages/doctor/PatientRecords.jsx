// pages/doctor/PatientRecords.jsx
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
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiSearchLine,
  RiFileTextLine,
  RiDownloadLine,
  RiEditLine,
} from "react-icons/ri";

const PatientRecords = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const records = [
    {
      id: 1,
      patient: "John Doe",
      recordType: "Medical History",
      date: "2024-01-15",
      status: "Complete",
      fileSize: "2.3 MB",
    },
    {
      id: 2,
      patient: "Jane Smith",
      recordType: "Lab Results",
      date: "2024-01-14",
      status: "Pending Review",
      fileSize: "1.8 MB",
    },
    {
      id: 3,
      patient: "Mike Johnson",
      recordType: "Prescription",
      date: "2024-01-13",
      status: "Complete",
      fileSize: "0.5 MB",
    },
    {
      id: 4,
      patient: "Sarah Wilson",
      recordType: "X-Ray Report",
      date: "2024-01-12",
      status: "Complete",
      fileSize: "4.2 MB",
    },
    {
      id: 5,
      patient: "David Brown",
      recordType: "Consultation Notes",
      date: "2024-01-11",
      status: "Draft",
      fileSize: "0.8 MB",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "green";
      case "Pending Review":
        return "yellow";
      case "Draft":
        return "gray";
      default:
        return "gray";
    }
  };

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
                    Patient Records
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Access and manage patient medical records.
                  </Text>
                </Box>
                <Button colorScheme="blue" leftIcon={<RiFileTextLine />}>
                  Add Record
                </Button>
              </HStack>

              <HStack>
                <InputGroup maxW="400px">
                  <InputLeftElement pointerEvents="none">
                    <RiSearchLine color="gray.300" />
                  </InputLeftElement>
                  <Input placeholder="Search records..." />
                </InputGroup>
                <Button colorScheme="green" leftIcon={<RiDownloadLine />}>
                  Export All
                </Button>
              </HStack>

              <Tabs variant="enclosed">
                <TabList>
                  <Tab>All Records</Tab>
                  <Tab>Recent</Tab>
                  <Tab>Pending Review</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <Card bg={cardBg} borderRadius="xl" shadow="sm">
                      <CardHeader>
                        <Heading size="md">Medical Records</Heading>
                      </CardHeader>
                      <CardBody>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Patient</Th>
                              <Th>Record Type</Th>
                              <Th>Date</Th>
                              <Th>Status</Th>
                              <Th>File Size</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {records.map((record) => (
                              <Tr key={record.id}>
                                <Td fontWeight="semibold">{record.patient}</Td>
                                <Td>{record.recordType}</Td>
                                <Td>{record.date}</Td>
                                <Td>
                                  <Badge
                                    colorScheme={getStatusColor(record.status)}
                                  >
                                    {record.status}
                                  </Badge>
                                </Td>
                                <Td>{record.fileSize}</Td>
                                <Td>
                                  <HStack spacing={2}>
                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      variant="outline"
                                    >
                                      View
                                    </Button>
                                    <Button
                                      size="sm"
                                      colorScheme="green"
                                      variant="outline"
                                    >
                                      <RiDownloadLine />
                                    </Button>
                                    <Button
                                      size="sm"
                                      colorScheme="purple"
                                      variant="outline"
                                    >
                                      <RiEditLine />
                                    </Button>
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </TabPanel>

                  <TabPanel px={0}>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {records.slice(0, 3).map((record) => (
                        <Card
                          key={record.id}
                          bg={cardBg}
                          borderRadius="xl"
                          shadow="sm"
                        >
                          <CardHeader>
                            <HStack justify="space-between">
                              <Text fontWeight="semibold">
                                {record.patient}
                              </Text>
                              <Badge
                                colorScheme={getStatusColor(record.status)}
                              >
                                {record.status}
                              </Badge>
                            </HStack>
                          </CardHeader>
                          <CardBody pt={0}>
                            <VStack align="stretch" spacing={2}>
                              <Text fontSize="sm" color="gray.600">
                                {record.recordType}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {record.date} • {record.fileSize}
                              </Text>
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                >
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  variant="outline"
                                >
                                  Download
                                </Button>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </TabPanel>

                  <TabPanel px={0}>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {records
                        .filter((r) => r.status === "Pending Review")
                        .map((record) => (
                          <Card
                            key={record.id}
                            bg={cardBg}
                            borderRadius="xl"
                            shadow="sm"
                          >
                            <CardHeader>
                              <HStack justify="space-between">
                                <Text fontWeight="semibold">
                                  {record.patient}
                                </Text>
                                <Badge colorScheme="yellow">
                                  Pending Review
                                </Badge>
                              </HStack>
                            </CardHeader>
                            <CardBody pt={0}>
                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  {record.recordType}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {record.date} • {record.fileSize}
                                </Text>
                                <HStack spacing={2}>
                                  <Button
                                    size="sm"
                                    colorScheme="blue"
                                    variant="outline"
                                  >
                                    Review
                                  </Button>
                                  <Button
                                    size="sm"
                                    colorScheme="green"
                                    variant="outline"
                                  >
                                    Approve
                                  </Button>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientRecords;
