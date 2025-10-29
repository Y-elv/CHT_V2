// components/admin/MessagingOverview.tsx
import React from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Badge,
  Text,
  Avatar,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  RiMessage3Line,
  RiMegaphoneLine,
  RiChat3Line,
  RiReplyLine,
} from "react-icons/ri";

const MessagingOverview: React.FC = () => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const urgentBg = useColorModeValue("red.50", "red.900");
  const urgentBorderColor = useColorModeValue("red.200", "red.600");

  return (
    <Box>
      <Tabs colorScheme="blue" isLazy>
        <TabList
          flexWrap="wrap"
          gap={2}
          borderBottom="2px"
          borderColor={borderColor}
        >
          <Tab
            fontSize={{ base: "xs", md: "sm" }}
            px={{ base: 2, md: 4 }}
            py={3}
            _selected={{ color: "blue.500", borderColor: "blue.500" }}
          >
            <HStack spacing={1}>
              <RiMessage3Line size={16} />
              <Text display={{ base: "none", sm: "block" }}>
                Urgent Messages
              </Text>
              <Text display={{ base: "block", sm: "none" }}>Urgent</Text>
              <Badge colorScheme="red" borderRadius="full" px={1.5}>
                8
              </Badge>
            </HStack>
          </Tab>
          <Tab
            fontSize={{ base: "xs", md: "sm" }}
            px={{ base: 2, md: 4 }}
            py={3}
            _selected={{ color: "blue.500", borderColor: "blue.500" }}
          >
            <HStack spacing={1}>
              <RiMegaphoneLine size={16} />
              <Text display={{ base: "none", md: "block" }}>
                Awareness Queue
              </Text>
              <Text display={{ base: "block", md: "none" }}>Queue</Text>
            </HStack>
          </Tab>
          <Tab
            fontSize={{ base: "xs", md: "sm" }}
            px={{ base: 2, md: 4 }}
            py={3}
            _selected={{ color: "blue.500", borderColor: "blue.500" }}
          >
            <HStack spacing={1}>
              <RiChat3Line size={16} />
              <Text display={{ base: "none", md: "block" }}>Conversations</Text>
              <Text display={{ base: "block", md: "none" }}>Chats</Text>
              <Badge colorScheme="blue" borderRadius="full" px={1.5}>
                156
              </Badge>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels px={{ base: 0, md: 4 }}>
          {/* Urgent Messages Tab */}
          <TabPanel px={{ base: 0, md: 2 }} py={4}>
            <VStack align="stretch" spacing={3}>
              {[1, 2, 3].map((item) => (
                <Box
                  key={item}
                  p={{ base: 2, md: 3 }}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={urgentBorderColor}
                  bg={urgentBg}
                  _hover={{ shadow: "sm" }}
                >
                  <HStack
                    justify="space-between"
                    mb={2}
                    flexWrap={{ base: "wrap", sm: "nowrap" }}
                    spacing={2}
                  >
                    <HStack flex="1" minW="0">
                      <Avatar size={{ base: "xs", md: "sm" }} name="User" />
                      <Box flex="1" minW="0">
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="bold"
                          isTruncated
                        >
                          Mental Health Crisis Alert
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          5 minutes ago
                        </Text>
                      </Box>
                    </HStack>
                    <Badge colorScheme="red" fontSize="xs">
                      URGENT
                    </Badge>
                  </HStack>
                  <Text
                    fontSize="xs"
                    color="gray.700"
                    noOfLines={{ base: 2, md: 3 }}
                  >
                    User reported high anxiety and depression symptoms.
                    Immediate attention required.
                  </Text>
                  <HStack mt={2} justify="flex-end">
                    <IconButton
                      aria-label="Reply"
                      icon={<RiReplyLine />}
                      size={{ base: "xs", md: "sm" }}
                      colorScheme="blue"
                    />
                  </HStack>
                </Box>
              ))}
            </VStack>
          </TabPanel>

          {/* Awareness Queue Tab */}
          <TabPanel px={{ base: 0, md: 2 }} py={4}>
            <VStack align="stretch" spacing={3}>
              {[
                {
                  title: "Mental Health Awareness Week",
                  status: "scheduled",
                  scheduledAt: "2 hours from now",
                },
                {
                  title: "Sexual Health Education Tips",
                  status: "draft",
                },
                {
                  title: "Build Your Confidence Challenge",
                  status: "sent",
                  sentAt: "1 day ago",
                  reached: 1247,
                },
              ].map((msg, index) => (
                <Box
                  key={index}
                  p={{ base: 2, md: 3 }}
                  borderRadius="lg"
                  borderWidth="1px"
                  _hover={{ shadow: "sm", borderColor: "gray.300" }}
                  transition="all 0.2s"
                >
                  <HStack
                    justify="space-between"
                    flexWrap={{ base: "wrap", sm: "nowrap" }}
                    spacing={2}
                  >
                    <Box flex="1" minW="0">
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="semibold"
                        isTruncated
                      >
                        {msg.title}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {msg.scheduledAt || msg.sentAt}
                      </Text>
                    </Box>
                    <Badge
                      colorScheme={
                        msg.status === "sent"
                          ? "green"
                          : msg.status === "scheduled"
                          ? "blue"
                          : "gray"
                      }
                      fontSize="xs"
                      textTransform="capitalize"
                    >
                      {msg.status}
                    </Badge>
                  </HStack>
                  {msg.reached && (
                    <Text fontSize="xs" color="gray.600" mt={2}>
                      Reached: {msg.reached} users
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </TabPanel>

          {/* Conversations Tab */}
          <TabPanel px={{ base: 0, md: 2 }} py={4}>
            <VStack align="stretch" spacing={3}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Box
                  key={item}
                  p={{ base: 2, md: 3 }}
                  borderRadius="lg"
                  borderWidth="1px"
                  _hover={{ bg: "gray.50", cursor: "pointer", shadow: "sm" }}
                  transition="all 0.2s"
                >
                  <HStack spacing={3}>
                    <Avatar size={{ base: "xs", md: "sm" }} name="User" />
                    <Box flex="1" minW="0">
                      <HStack mb={1}>
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="bold"
                          isTruncated
                        >
                          User {item}
                        </Text>
                        {item <= 2 && (
                          <Badge colorScheme="blue" fontSize="10px">
                            New
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="xs" color="gray.600">
                        Last message: 5 minutes ago
                      </Text>
                    </Box>
                    <IconButton
                      aria-label="Reply"
                      icon={<RiReplyLine />}
                      size={{ base: "xs", md: "sm" }}
                      variant="ghost"
                    />
                  </HStack>
                </Box>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MessagingOverview;
