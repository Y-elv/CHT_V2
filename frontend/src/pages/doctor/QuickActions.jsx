// pages/doctor/QuickActions.jsx
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
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiVideoChatLine,
  RiUserHeartLine,
  RiMessage3Line,
  RiCalendarLine,
  RiFileTextLine,
  RiTimeLine,
  RiNotificationLine,
} from "react-icons/ri";

const QuickActions = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const quickActions = [
    {
      title: "Start Consultation",
      description: "Begin a new video consultation",
      icon: RiVideoChatLine,
      color: "blue",
      count: 3,
    },
    {
      title: "View Patients",
      description: "Check patient records and history",
      icon: RiUserHeartLine,
      color: "green",
      count: 42,
    },
    {
      title: "Check Messages",
      description: "Review patient messages",
      icon: RiMessage3Line,
      color: "purple",
      count: 15,
    },
    {
      title: "Schedule Appointment",
      description: "Book new appointments",
      icon: RiCalendarLine,
      color: "orange",
      count: 8,
    },
    {
      title: "Patient Records",
      description: "Access medical records",
      icon: RiFileTextLine,
      color: "teal",
      count: 156,
    },
    {
      title: "Set Availability",
      description: "Manage your schedule",
      icon: RiTimeLine,
      color: "pink",
      count: 0,
    },
    {
      title: "Notifications",
      description: "View alerts and updates",
      icon: RiNotificationLine,
      color: "red",
      count: 3,
    },
  ];

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
                    Quick Actions
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Common tasks and shortcuts for efficient workflow.
                  </Text>
                </Box>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {quickActions.map((action, index) => (
                  <Card key={index} bg={cardBg} borderRadius="xl" shadow="sm">
                    <CardHeader>
                      <HStack>
                        <Icon
                          as={action.icon}
                          boxSize={8}
                          color={`${action.color}.500`}
                        />
                        <VStack align="start" spacing={1}>
                          <Heading size="md">{action.title}</Heading>
                          <Text fontSize="sm" color="gray.500">
                            {action.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">
                          {action.count} items
                        </Text>
                        <Button
                          colorScheme={action.color}
                          size="sm"
                          variant="solid"
                        >
                          Open
                        </Button>
                      </HStack>
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

export default QuickActions;
