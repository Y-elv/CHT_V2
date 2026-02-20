// pages/admin/AdminSettings.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  useColorModeValue,
  FormControl,
  FormLabel,
  Switch,
  Select,
} from "@chakra-ui/react";

const AdminSettings: React.FC = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="full" p={6}>
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading
              size="2xl"
              mb={2}
              bgGradient="linear(to-r, orange.400, orange.600)"
              bgClip="text"
            >
              Settings
            </Heading>
            <Text color={subtleText}>
              Configure platform-wide preferences for the Kundwa Health admin
              experience.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <Heading size="md" mb={4}>
                Platform Controls
              </Heading>
              <VStack align="stretch" spacing={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="maintenance" mb="0">
                    Maintenance mode
                  </FormLabel>
                  <Switch
                    id="maintenance"
                    isChecked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    colorScheme="orange"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="emails" mb="0">
                    Admin email notifications
                  </FormLabel>
                  <Switch
                    id="emails"
                    isChecked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    colorScheme="orange"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="session-timeout">
                    Session timeout (minutes)
                  </FormLabel>
                  <Select
                    id="session-timeout"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    maxW="200px"
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                  </Select>
                </FormControl>
              </VStack>
            </Box>

            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <Heading size="md" mb={4}>
                Appearance & Localization
              </Heading>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="sm" color={subtleText}>
                  Theme, language and region preferences can be configured here
                  in the future. Currently, theme is controlled from the admin
                  sidebar toggle.
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminSettings;

