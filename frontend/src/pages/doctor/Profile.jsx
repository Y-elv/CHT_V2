// pages/doctor/Profile.jsx
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
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Divider,
  Badge,
  Switch,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiEditLine,
  RiSaveLine,
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
} from "react-icons/ri";

const Profile = () => {
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
                    Profile
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Manage your professional profile and settings.
                  </Text>
                </Box>
                <Button colorScheme="blue" leftIcon={<RiSaveLine />}>
                  Save Changes
                </Button>
              </HStack>

              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                {/* Profile Picture & Basic Info */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <VStack spacing={4}>
                      <Avatar size="2xl" name="Dr. Smith" />
                      <VStack spacing={1}>
                        <Heading size="md">Dr. John Smith</Heading>
                        <Text color="gray.500">General Practitioner</Text>
                        <Badge colorScheme="green">Verified</Badge>
                      </VStack>
                      <Button
                        leftIcon={<RiEditLine />}
                        size="sm"
                        variant="outline"
                      >
                        Change Photo
                      </Button>
                    </VStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack>
                        <RiMailLine />
                        <Text fontSize="sm">john.smith@hospital.com</Text>
                      </HStack>
                      <HStack>
                        <RiPhoneLine />
                        <Text fontSize="sm">+1 (555) 123-4567</Text>
                      </HStack>
                      <HStack>
                        <RiMapPinLine />
                        <Text fontSize="sm">New York, NY</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Personal Information */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md">Personal Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input defaultValue="John" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input defaultValue="Smith" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input defaultValue="john.smith@hospital.com" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input defaultValue="+1 (555) 123-4567" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Date of Birth</FormLabel>
                        <Input type="date" defaultValue="1985-03-15" />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Professional Information */}
                <Card bg={cardBg} borderRadius="xl" shadow="sm">
                  <CardHeader>
                    <Heading size="md">Professional Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Specialization</FormLabel>
                        <Select defaultValue="general">
                          <option value="general">General Practice</option>
                          <option value="cardiology">Cardiology</option>
                          <option value="neurology">Neurology</option>
                          <option value="pediatrics">Pediatrics</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>License Number</FormLabel>
                        <Input defaultValue="MD123456789" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Years of Experience</FormLabel>
                        <Input defaultValue="12" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Hospital Affiliation</FormLabel>
                        <Input defaultValue="City General Hospital" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Education</FormLabel>
                        <Textarea defaultValue="MD from Harvard Medical School (2010)" />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Additional Information */}
              <Card bg={cardBg} borderRadius="xl" shadow="sm">
                <CardHeader>
                  <Heading size="md">Additional Information</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Textarea
                          defaultValue="Experienced general practitioner with 12 years of practice. Specialized in preventive care and chronic disease management."
                          rows={4}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Languages</FormLabel>
                        <Input defaultValue="English, Spanish, French" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Certifications</FormLabel>
                        <Textarea
                          defaultValue="Board Certified in Internal Medicine\nAdvanced Cardiac Life Support (ACLS)\nBasic Life Support (BLS)"
                          rows={3}
                        />
                      </FormControl>
                    </VStack>

                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Office Address</FormLabel>
                        <Textarea
                          defaultValue="123 Medical Center Dr\nSuite 200\nNew York, NY 10001"
                          rows={3}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Emergency Contact</FormLabel>
                        <Input defaultValue="Jane Smith - +1 (555) 987-6543" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Profile Visibility</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" defaultChecked />
                          <Text fontSize="sm">
                            Make profile visible to patients
                          </Text>
                        </HStack>
                      </FormControl>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Security Settings */}
              <Card bg={cardBg} borderRadius="xl" shadow="sm">
                <CardHeader>
                  <Heading size="md">Security Settings</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Current Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>New Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Confirm New Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </FormControl>
                    </VStack>

                    <VStack align="stretch" spacing={4}>
                      <FormControl>
                        <FormLabel>Two-Factor Authentication</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" />
                          <Text fontSize="sm">
                            Enable 2FA for enhanced security
                          </Text>
                        </HStack>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Login Notifications</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" defaultChecked />
                          <Text fontSize="sm">Get notified of new logins</Text>
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

export default Profile;
