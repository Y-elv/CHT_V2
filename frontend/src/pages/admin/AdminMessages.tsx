// pages/admin/AdminMessages.tsx
import React, { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import MessagingOverview from "../../components/admin/MessagingOverview";

const AdminMessages: React.FC = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    // In the future we could load message analytics or conversations here
  }, []);

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
              Messages
            </Heading>
            <Text color={subtleText}>
              Overview of platform messaging activity between patients and
              doctors.
            </Text>
          </Box>

          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <MessagingOverview />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminMessages;

