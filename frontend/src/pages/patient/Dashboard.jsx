import React from "react";
import { Box, Heading, Text, VStack, SimpleGrid, Card, CardBody, CardHeader, Button } from "@chakra-ui/react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <Box p={8} minH="100vh" bg="gray.50">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color="blue.600">
            Patient Dashboard
          </Heading>
          <Text color="gray.600" mt={2}>
            Welcome back, {user?.name || "Patient"}!
          </Text>
        </Box>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Book Appointment</Heading>
            </CardHeader>
            <CardBody>
              <Text>Schedule a new appointment with a doctor</Text>
              <Button colorScheme="blue" mt={4} onClick={() => navigate("/book")}>
                Book Now
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">My Appointments</Heading>
            </CardHeader>
            <CardBody>
              <Text>View and manage your upcoming appointments</Text>
              <Button colorScheme="green" mt={4} onClick={() => navigate("/profile/appointments")}>
                View Appointments
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Medical Records</Heading>
            </CardHeader>
            <CardBody>
              <Text>Access your medical history and records</Text>
              <Button colorScheme="purple" mt={4} onClick={() => navigate("/profile")}>
                View Records
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Find Doctors</Heading>
            </CardHeader>
            <CardBody>
              <Text>Browse and find healthcare providers</Text>
              <Button colorScheme="orange" mt={4} onClick={() => navigate("/consultation")}>
                Find Doctors
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Messages</Heading>
            </CardHeader>
            <CardBody>
              <Text>Communicate with your healthcare providers</Text>
              <Button colorScheme="teal" mt={4} onClick={() => navigate("/chatpages")}>
                Open Messages
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Profile Settings</Heading>
            </CardHeader>
            <CardBody>
              <Text>Update your personal information and preferences</Text>
              <Button colorScheme="gray" mt={4} onClick={() => navigate("/profile")}>
                Edit Profile
              </Button>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default PatientDashboard;
