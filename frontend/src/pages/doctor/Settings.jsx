// pages/doctor/Settings.jsx
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
  Input,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiSettingsLine,
  RiSaveLine,
  RiNotificationLine,
  RiShieldLine,
  RiPaletteLine,
} from "react-icons/ri";

const Settings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

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
                    Settings
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Configure your account preferences and system settings.
                  </Text>
                </Box>
                <Button colorScheme="blue" leftIcon={<RiSaveLine />}>
                  Save All Changes
                </Button>
              </HStack>

              <Alert status="info">
                <AlertIcon />
                <AlertTitle>Settings Updated!</AlertTitle>
                <AlertDescription>
                  Your preferences have been saved successfully.
                </AlertDescription>
              </Alert>

              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* General Settings */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md" leftIcon={<RiSettingsLine />}>
                      General Settings
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Language</FormLabel>
                        <Select defaultValue="en">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Time Zone</FormLabel>
                        <Select defaultValue="est">
                          <option value="est">Eastern Time (EST)</option>
                          <option value="cst">Central Time (CST)</option>
                          <option value="mst">Mountain Time (MST)</option>
                          <option value="pst">Pacific Time (PST)</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Date Format</FormLabel>
                        <Select defaultValue="mm/dd/yyyy">
                          <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                          <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                          <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Auto-save</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" defaultChecked />
                          <Text fontSize="sm">Automatically save changes</Text>
                        </HStack>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Notification Settings */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md" leftIcon={<RiNotificationLine />}>
                      Notifications
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Email Notifications</FormLabel>
                        <CheckboxGroup
                          defaultValue={["appointments", "messages"]}
                        >
                          <Stack>
                            <Checkbox value="appointments">
                              New Appointments
                            </Checkbox>
                            <Checkbox value="messages">
                              Patient Messages
                            </Checkbox>
                            <Checkbox value="reminders">
                              Appointment Reminders
                            </Checkbox>
                            <Checkbox value="system">System Updates</Checkbox>
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Push Notifications</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" defaultChecked />
                          <Text fontSize="sm">Enable push notifications</Text>
                        </HStack>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Quiet Hours</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" />
                          <Text fontSize="sm">
                            Enable quiet hours (10 PM - 7 AM)
                          </Text>
                        </HStack>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Privacy & Security */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md" leftIcon={<RiShieldLine />}>
                      Privacy & Security
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Profile Visibility</FormLabel>
                        <Select defaultValue="public">
                          <option value="public">Public</option>
                          <option value="patients">Patients Only</option>
                          <option value="private">Private</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Data Sharing</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" />
                          <Text fontSize="sm">
                            Allow data sharing for research
                          </Text>
                        </HStack>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Session Timeout</FormLabel>
                        <Select defaultValue="30">
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Two-Factor Authentication</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" />
                          <Text fontSize="sm">Enable 2FA</Text>
                        </HStack>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Appearance */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md" leftIcon={<RiPaletteLine />}>
                      Appearance
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Theme</FormLabel>
                        <Select defaultValue="dark">
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Accent Color</FormLabel>
                        <Select defaultValue="blue">
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="purple">Purple</option>
                          <option value="orange">Orange</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Font Size</FormLabel>
                        <Select defaultValue="medium">
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Compact Mode</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" />
                          <Text fontSize="sm">Use compact layout</Text>
                        </HStack>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Advanced Settings */}
              <Card bg={cardBg} borderRadius="xl" shadow="sm">
                <CardHeader>
                  <Heading size="md">Advanced Settings</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>API Rate Limit</FormLabel>
                        <Select defaultValue="standard">
                          <option value="low">Low (100 requests/hour)</option>
                          <option value="standard">
                            Standard (500 requests/hour)
                          </option>
                          <option value="high">
                            High (1000 requests/hour)
                          </option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Cache Duration</FormLabel>
                        <Select defaultValue="30">
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Debug Mode</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" />
                          <Text fontSize="sm">Enable debug logging</Text>
                        </HStack>
                      </FormControl>
                    </VStack>

                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Backup Frequency</FormLabel>
                        <Select defaultValue="daily">
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Data Retention</FormLabel>
                        <Select defaultValue="1year">
                          <option value="6months">6 months</option>
                          <option value="1year">1 year</option>
                          <option value="2years">2 years</option>
                          <option value="indefinite">Indefinite</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Export Format</FormLabel>
                        <Select defaultValue="json">
                          <option value="json">JSON</option>
                          <option value="csv">CSV</option>
                          <option value="xml">XML</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Danger Zone */}
              <Card
                bg="red.50"
                borderColor="red.200"
                borderWidth="1px"
                borderRadius="xl"
              >
                <CardHeader>
                  <Heading size="md" color="red.600">
                    Danger Zone
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Text color="red.600" fontSize="sm">
                      These actions are irreversible. Please proceed with
                      caution.
                    </Text>
                    <HStack spacing={4}>
                      <Button colorScheme="red" variant="outline" size="sm">
                        Clear All Data
                      </Button>
                      <Button colorScheme="red" variant="outline" size="sm">
                        Deactivate Account
                      </Button>
                      <Button colorScheme="red" variant="outline" size="sm">
                        Delete Account
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
