// pages/doctor/Messages.jsx
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
  Divider,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiSearchLine,
  RiMessage3Line,
  RiReplyLine,
  RiTimeLine,
} from "react-icons/ri";

const Messages = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const messages = [
    {
      id: 1,
      patient: "John Doe",
      avatar: "JD",
      message: "I'm experiencing chest pain. Should I come in?",
      time: "2 hours ago",
      unread: true,
      priority: "High",
    },
    {
      id: 2,
      patient: "Jane Smith",
      avatar: "JS",
      message: "Thank you for the prescription. When should I follow up?",
      time: "4 hours ago",
      unread: true,
      priority: "Normal",
    },
    {
      id: 3,
      patient: "Mike Johnson",
      avatar: "MJ",
      message: "My symptoms have improved. Can I reduce the medication?",
      time: "1 day ago",
      unread: false,
      priority: "Normal",
    },
    {
      id: 4,
      patient: "Sarah Wilson",
      avatar: "SW",
      message: "I have questions about my test results.",
      time: "2 days ago",
      unread: false,
      priority: "Low",
    },
    {
      id: 5,
      patient: "David Brown",
      avatar: "DB",
      message: "The new medication is working well. Thank you!",
      time: "3 days ago",
      unread: false,
      priority: "Normal",
    },
    {
      id: 6,
      patient: "Lisa Davis",
      avatar: "LD",
      message: "I need to reschedule my appointment.",
      time: "4 days ago",
      unread: false,
      priority: "Low",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "red";
      case "Normal":
        return "blue";
      case "Low":
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
                    Messages
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Patient communications and inquiries.
                  </Text>
                </Box>
                <Badge colorScheme="red" fontSize="lg" px={3} py={1}>
                  15 Unread
                </Badge>
              </HStack>

              <HStack>
                <InputGroup maxW="400px">
                  <InputLeftElement pointerEvents="none">
                    <RiSearchLine color="gray.300" />
                  </InputLeftElement>
                  <Input placeholder="Search messages..." />
                </InputGroup>
                <Button colorScheme="blue" leftIcon={<RiMessage3Line />}>
                  New Message
                </Button>
              </HStack>

              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {messages.map((msg) => (
                  <Card key={msg.id} bg={cardBg} borderRadius="xl" shadow="sm">
                    <CardHeader>
                      <HStack justify="space-between">
                        <HStack>
                          <Avatar name={msg.avatar} size="sm" />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold">{msg.patient}</Text>
                            <HStack>
                              <Text fontSize="xs" color="gray.500">
                                <RiTimeLine /> {msg.time}
                              </Text>
                              <Badge
                                colorScheme={getPriorityColor(msg.priority)}
                                size="sm"
                              >
                                {msg.priority}
                              </Badge>
                            </HStack>
                          </VStack>
                        </HStack>
                        {msg.unread && (
                          <Badge
                            colorScheme="red"
                            borderRadius="full"
                            w={3}
                            h={3}
                          />
                        )}
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack align="stretch" spacing={3}>
                        <Text
                          fontSize="sm"
                          color={msg.unread ? "inherit" : "gray.600"}
                        >
                          {msg.message}
                        </Text>
                        <Divider />
                        <HStack justify="space-between">
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                          >
                            <RiReplyLine /> Reply
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="green"
                            variant="outline"
                          >
                            View Patient
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

export default Messages;
