// pages/admin/AdminContent.tsx
import React from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { RiFileTextLine, RiQuestionLine, RiMegaphoneLine } from "react-icons/ri";

const AdminContent: React.FC = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleText = useColorModeValue("gray.600", "gray.400");

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
              Content Management
            </Heading>
            <Text color={subtleText}>
              Manage educational content, awareness messages, and support
              materials shown to users across the platform.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <Icon as={RiQuestionLine} boxSize={6} color="orange.400" mb={3} />
              <Heading size="md" mb={2}>
                FAQs
              </Heading>
              <Text fontSize="sm" color={subtleText}>
                Curate and maintain frequently asked questions to help users
                quickly find answers. Use the FAQ section to add and edit
                entries.
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
              <Icon as={RiMegaphoneLine} boxSize={6} color="orange.400" mb={3} />
              <Heading size="md" mb={2}>
                Awareness Messages
              </Heading>
              <Text fontSize="sm" color={subtleText}>
                Plan mental health and sexual health campaigns to reach users
                with targeted messages. (API wiring can be added here later.)
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
              <Icon as={RiFileTextLine} boxSize={6} color="orange.400" mb={3} />
              <Heading size="md" mb={2}>
                Static Pages
              </Heading>
              <Text fontSize="sm" color={subtleText}>
                Coordinate updates for landing, services, and news content so
                messaging stays consistent with your programs.
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminContent;

