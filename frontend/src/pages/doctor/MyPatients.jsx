// pages/doctor/MyPatients.jsx
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
  Avatar,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiSearchLine,
  RiUserHeartLine,
  RiMessage3Line,
  RiCalendarLine,
} from "react-icons/ri";

const MyPatients = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 35,
      condition: "Hypertension",
      lastVisit: "2024-01-15",
      status: "Active",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 28,
      condition: "Diabetes Type 2",
      lastVisit: "2024-01-14",
      status: "Follow-up",
      avatar: "JS",
    },
    {
      id: 3,
      name: "Mike Johnson",
      age: 42,
      condition: "Asthma",
      lastVisit: "2024-01-13",
      status: "Recovered",
      avatar: "MJ",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      age: 31,
      condition: "Migraine",
      lastVisit: "2024-01-12",
      status: "Active",
      avatar: "SW",
    },
    {
      id: 5,
      name: "David Brown",
      age: 55,
      condition: "Arthritis",
      lastVisit: "2024-01-11",
      status: "Chronic",
      avatar: "DB",
    },
    {
      id: 6,
      name: "Lisa Davis",
      age: 29,
      condition: "Anxiety",
      lastVisit: "2024-01-10",
      status: "Active",
      avatar: "LD",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Follow-up":
        return "blue";
      case "Recovered":
        return "purple";
      case "Chronic":
        return "orange";
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
                    My Patients
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Manage your patient records and appointments.
                  </Text>
                </Box>
              </HStack>

              <HStack>
                <InputGroup maxW="400px">
                  <InputLeftElement pointerEvents="none">
                    <RiSearchLine color="gray.300" />
                  </InputLeftElement>
                  <Input placeholder="Search patients..." />
                </InputGroup>
                <Button colorScheme="blue" leftIcon={<RiUserHeartLine />}>
                  Add Patient
                </Button>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {patients.map((patient) => (
                  <Card
                    key={patient.id}
                    bg={cardBg}
                    borderRadius="xl"
                    shadow="sm"
                  >
                    <CardHeader>
                      <HStack>
                        <Avatar name={patient.avatar} size="md" />
                        <VStack align="start" spacing={1}>
                          <Heading size="md">{patient.name}</Heading>
                          <Text fontSize="sm" color="gray.500">
                            Age: {patient.age}
                          </Text>
                          <Badge colorScheme={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </VStack>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack align="stretch" spacing={3}>
                        <Text fontSize="sm">
                          <strong>Condition:</strong> {patient.condition}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          <strong>Last Visit:</strong> {patient.lastVisit}
                        </Text>
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                          >
                            <RiMessage3Line />
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="green"
                            variant="outline"
                          >
                            <RiCalendarLine />
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="purple"
                            variant="outline"
                          >
                            View Records
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MyPatients;
