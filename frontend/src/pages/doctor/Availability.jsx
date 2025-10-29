// pages/doctor/Availability.jsx
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
  Button,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import { RiTimeLine, RiCalendarLine, RiSettingsLine } from "react-icons/ri";

const Availability = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const workingHours = [
    { day: "Monday", start: "09:00", end: "17:00", enabled: true },
    { day: "Tuesday", start: "09:00", end: "17:00", enabled: true },
    { day: "Wednesday", start: "09:00", end: "17:00", enabled: true },
    { day: "Thursday", start: "09:00", end: "17:00", enabled: true },
    { day: "Friday", start: "09:00", end: "15:00", enabled: true },
    { day: "Saturday", start: "10:00", end: "14:00", enabled: false },
    { day: "Sunday", start: "10:00", end: "14:00", enabled: false },
  ];

  const appointmentTypes = [
    { type: "Consultation", duration: "45", price: "$150", enabled: true },
    { type: "Follow-up", duration: "30", price: "$100", enabled: true },
    { type: "Video Call", duration: "30", price: "$120", enabled: true },
    { type: "Emergency", duration: "60", price: "$200", enabled: true },
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
                    Availability
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Manage your working hours and appointment settings.
                  </Text>
                </Box>
                <Button colorScheme="blue" leftIcon={<RiSettingsLine />}>
                  Save Changes
                </Button>
              </HStack>

              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Working Hours */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md" leftIcon={<RiTimeLine />}>
                      Working Hours
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      {workingHours.map((day, index) => (
                        <HStack key={day.day} justify="space-between">
                          <HStack>
                            <Switch
                              isChecked={day.enabled}
                              colorScheme="blue"
                            />
                            <Text fontWeight="semibold" minW="100px">
                              {day.day}
                            </Text>
                          </HStack>
                          {day.enabled && (
                            <HStack>
                              <Select
                                size="sm"
                                defaultValue={day.start}
                                w="100px"
                              >
                                <option value="08:00">08:00</option>
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                              </Select>
                              <Text>to</Text>
                              <Select
                                size="sm"
                                defaultValue={day.end}
                                w="100px"
                              >
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                                <option value="18:00">18:00</option>
                              </Select>
                            </HStack>
                          )}
                        </HStack>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Appointment Types */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md" leftIcon={<RiCalendarLine />}>
                      Appointment Types
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      {appointmentTypes.map((type, index) => (
                        <HStack key={type.type} justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold">{type.type}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {type.duration} min • {type.price}
                            </Text>
                          </VStack>
                          <Switch isChecked={type.enabled} colorScheme="blue" />
                        </HStack>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Additional Settings */}
              <Card bg={cardBg} borderRadius="xl" shadow="sm">
                <CardHeader>
                  <Heading size="md">Additional Settings</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Break Duration (minutes)</FormLabel>
                        <Select defaultValue="15">
                          <option value="10">10 minutes</option>
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Advance Booking (days)</FormLabel>
                        <Select defaultValue="7">
                          <option value="3">3 days</option>
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30">30 days</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Emergency Availability</FormLabel>
                        <Switch colorScheme="red" defaultChecked />
                      </FormControl>
                    </VStack>

                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Notification Preferences</FormLabel>
                        <CheckboxGroup defaultValue={["email", "sms"]}>
                          <Stack>
                            <Checkbox value="email">
                              Email Notifications
                            </Checkbox>
                            <Checkbox value="sms">SMS Notifications</Checkbox>
                            <Checkbox value="push">Push Notifications</Checkbox>
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Auto-confirm Appointments</FormLabel>
                        <Switch colorScheme="green" />
                      </FormControl>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Availability;
