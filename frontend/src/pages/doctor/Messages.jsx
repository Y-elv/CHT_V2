// pages/doctor/Messages.jsx
import React, { useState, useEffect, useRef } from "react";
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
  Flex,
  Spacer,
  useToast,
  Spinner,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import DoctorSidebar from "../../components/admin/DoctorSidebar";
import Header from "../../components/admin/Header";
import {
  RiSearchLine,
  RiMessage3Line,
  RiReplyLine,
  RiTimeLine,
  RiSendPlaneFill,
  RiUser3Fill,
  RiArrowLeftLine,
  RiCheckDoubleLine,
  RiCheckLine,
} from "react-icons/ri";
import axios from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const Messages = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthStore(); // ✅ Use cookie-based auth store
  const toast = useToast();
  const messagesEndRef = useRef(null);
  
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const chatBg = useColorModeValue("gray.50", "gray.900");
  const messageBg = useColorModeValue("blue.50", "gray.700");
  const ownMessageBg = useColorModeValue("blue.500", "blue.600");
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Deduplicate conversations by user email (one chat per user)
  const deduplicateByEmail = (list) => {
    if (!Array.isArray(list) || list.length === 0) return list;
    const byKey = new Map();
    list.forEach((conv) => {
      const email = (conv.email || "").toLowerCase().trim();
      const key = email || conv._id || conv.id || "";
      if (!key) return;
      const existing = byKey.get(key);
      const convUpdated = new Date(conv.updatedAt || 0).getTime();
      const existingUpdated = existing ? new Date(existing.updatedAt || 0).getTime() : 0;
      if (!existing || convUpdated >= existingUpdated) {
        byKey.set(key, conv);
      }
    });
    return Array.from(byKey.values());
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v2/message/conversations');
      const list = response.data || [];
      setConversations(deduplicateByEmail(list));
    } catch (error) {
      toast({
        title: "Error loading conversations",
        description: "Unable to load your conversations. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (patientId) => {
    try {
      setMessagesLoading(true);
      const response = await axios.get(`/api/v2/message/direct/${patientId}`);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      toast({
        title: "Error loading messages",
        description: "Unable to load conversation. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setMessagesLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      setSendingMessage(true);
      const messageData = {
        recipientId: selectedConversation._id,
        content: newMessage.trim(),
      };
      
      const response = await axios.post('/api/v2/message/direct', messageData);
      
      // Add the new message to the messages list
      setMessages(prev => [...prev, response.data]);
      setNewMessage("");
      scrollToBottom();
      
      toast({
        title: "Message sent",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Unable to send message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  // Handle back to conversations list
  const handleBackToList = () => {
    setSelectedConversation(null);
    setMessages([]);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count unread messages
  const unreadCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box minH="100vh" bg={bgColor}>
      <DoctorSidebar isOpen={isOpen} onClose={onClose} />
      <Box ml={{ base: 0, md: "250px" }}>
        <Header onToggleSidebar={onOpen} />
        <Box p={0}>
          <Container maxW="full" px={{ base: 3, md: 6 }} py={6}>
            <VStack align="stretch" spacing={6}>
              <Flex direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "stretch", sm: "center" }} gap={4}>
                <Box>
                  <Heading size={{ base: "xl", md: "2xl" }} mb={2}>
                    Messages
                  </Heading>
                  <Text color={useColorModeValue("gray.600", "gray.400")} fontSize={{ base: "sm", md: "md" }}>
                    Patient communications and inquiries.
                  </Text>
                </Box>
                {unreadCount > 0 && (
                  <Badge colorScheme="red" fontSize={{ base: "sm", md: "lg" }} px={3} py={1} borderRadius="full" alignSelf={{ base: "flex-start", sm: "center" }}>
                    {unreadCount} Unread
                  </Badge>
                )}
              </Flex>

              {!selectedConversation ? (
                <>
                  <Flex direction={{ base: "column", sm: "row" }} gap={3} flexWrap="wrap">
                    <InputGroup maxW={{ base: "100%", sm: "400px" }}>
                      <InputLeftElement pointerEvents="none">
                        <RiSearchLine color="gray.300" />
                      </InputLeftElement>
                      <Input 
                        placeholder="Search conversations..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                    <Button colorScheme="blue" leftIcon={<RiMessage3Line />} size={{ base: "sm", md: "md" }}>
                      New Message
                    </Button>
                  </Flex>

                  {loading ? (
                    <Flex justify="center" py={12}>
                      <VStack spacing={4}>
                        <Spinner size="xl" color="blue.500" />
                        <Text>Loading conversations...</Text>
                      </VStack>
                    </Flex>
                  ) : filteredConversations.length === 0 ? (
                    <Flex justify="center" py={12}>
                      <VStack spacing={4}>
                        <RiMessage3Line size={48} color="gray.400" />
                        <Text color="gray.500" fontSize="lg">
                          {searchQuery ? "No conversations found" : "No conversations yet"}
                        </Text>
                      </VStack>
                    </Flex>
                  ) : (
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                      {filteredConversations.map((conversation) => (
                        <motion.div
                          key={conversation._id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            bg={cardBg} 
                            borderRadius="xl" 
                            shadow="sm"
                            cursor="pointer"
                            onClick={() => handleSelectConversation(conversation)}
                            _hover={{ shadow: "md", borderColor: "blue.200" }}
                            borderWidth="1px"
                            borderColor="transparent"
                          >
                            <CardHeader>
                              <HStack justify="space-between">
                                <HStack>
                                  <Avatar 
                                    src={conversation.pic} 
                                    name={conversation.name} 
                                    size="md" 
                                  />
                                  <VStack align="start" spacing={1} flex={1}>
                                    <HStack>
                                      <Text fontWeight="semibold" fontSize="md">
                                        {conversation.name}
                                      </Text>
                                      <Badge colorScheme="green" size="sm">
                                        {conversation.role}
                                      </Badge>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                      {conversation.email}
                                    </Text>
                                    <HStack>
                                      <Text fontSize="xs" color="gray.500">
                                        <RiTimeLine /> {formatTime(conversation.updatedAt)}
                                      </Text>
                                    </HStack>
                                  </VStack>
                                </HStack>
                                {conversation.unreadCount > 0 && (
                                  <Badge 
                                    colorScheme="red" 
                                    borderRadius="full" 
                                    px={2} 
                                    py={1}
                                    fontSize="xs"
                                  >
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </HStack>
                            </CardHeader>
                            <CardBody pt={0}>
                              <VStack align="stretch" spacing={3}>
                                <Text 
                                  fontSize="sm" 
                                  color={conversation.unreadCount > 0 ? "inherit" : "gray.600"}
                                  noOfLines={2}
                                  fontWeight={conversation.unreadCount > 0 ? "semibold" : "normal"}
                                >
                                  {conversation.lastMessage?.content || "No messages yet"}
                                </Text>
                                <Divider />
                                <HStack justify="space-between">
                                  <Button
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    leftIcon={<RiReplyLine />}
                                  >
                                    Reply
                                  </Button>
                                  <Button
                                    size="sm"
                                    colorScheme="green"
                                    variant="ghost"
                                    leftIcon={<RiUser3Fill />}
                                  >
                                    View Patient
                                  </Button>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                    </SimpleGrid>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card bg={cardBg} borderRadius="xl" shadow="md" h="600px">
                    <CardHeader borderBottom="1px" borderColor="gray.200">
                      <HStack justify="space-between">
                        <HStack>
                          <IconButton
                            icon={<RiArrowLeftLine />}
                            variant="ghost"
                            onClick={handleBackToList}
                            mr={2}
                          />
                          <Avatar 
                            src={selectedConversation.pic} 
                            name={selectedConversation.name} 
                            size="md" 
                          />
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold" fontSize="md">
                              {selectedConversation.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {selectedConversation.email}
                            </Text>
                          </VStack>
                        </HStack>
                        <Badge colorScheme="green" size="sm">
                          {selectedConversation.role}
                        </Badge>
                      </HStack>
                    </CardHeader>
                    
                    <CardBody p={0} h="450px" display="flex" flexDirection="column">
                      {/* Messages Area */}
                      <Flex 
                        flex={1} 
                        flexDirection="column" 
                        p={4} 
                        overflowY="auto"
                        bg={chatBg}
                        css={{
                          '&::-webkit-scrollbar': {
                            width: '6px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: useColorModeValue('#cbd5e0', '#4a5568'),
                            borderRadius: '3px',
                          },
                        }}
                      >
                        {messagesLoading ? (
                          <Flex justify="center" py={8}>
                            <Spinner color="blue.500" />
                          </Flex>
                        ) : messages.length === 0 ? (
                          <Flex justify="center" py={8}>
                            <Text color="gray.500">No messages yet. Start the conversation!</Text>
                          </Flex>
                        ) : (
                          <VStack spacing={3} align="stretch">
                            {messages.map((message, index) => {
                              const isOwn = message.sender._id === user?.id || message.sender._id === user?._id;
                              return (
                                <motion.div
                                  key={message._id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <Flex 
                                    justify={isOwn ? "flex-end" : "flex-start"}
                                    align="flex-end"
                                    gap={2}
                                  >
                                    {!isOwn && (
                                      <Avatar 
                                        src={message.sender.pic} 
                                        name={message.sender.name} 
                                        size="xs" 
                                        mb={1}
                                      />
                                    )}
                                    <VStack 
                                      align={isOwn ? "end" : "start"} 
                                      spacing={1} 
                                      maxW="70%"
                                    >
                                      <Box
                                        bg={isOwn ? ownMessageBg : messageBg}
                                        color={isOwn ? "white" : "inherit"}
                                        px={4}
                                        py={2}
                                        borderRadius="lg"
                                        borderTopLeftRadius={!isOwn ? "0" : "lg"}
                                        borderTopRightRadius={isOwn ? "0" : "lg"}
                                        shadow="sm"
                                      >
                                        <Text fontSize="sm">{message.content}</Text>
                                      </Box>
                                      <HStack spacing={2} fontSize="xs" color="gray.500">
                                        <Text>{formatTime(message.createdAt)}</Text>
                                        {isOwn && (
                                          <RiCheckDoubleLine color={message.readBy?.length > 0 ? "blue.500" : "gray.400"} />
                                        )}
                                      </HStack>
                                    </VStack>
                                  </Flex>
                                </motion.div>
                              );
                            })}
                            <div ref={messagesEndRef} />
                          </VStack>
                        )}
                      </Flex>
                      
                      {/* Message Input */}
                      <Divider />
                      <Flex p={4} gap={3}>
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          flex={1}
                          borderRadius="full"
                          bg={useColorModeValue("white", "gray.700")}
                        />
                        <IconButton
                          icon={<RiSendPlaneFill />}
                          colorScheme="blue"
                          onClick={sendMessage}
                          isLoading={sendingMessage}
                          isDisabled={!newMessage.trim()}
                          borderRadius="full"
                          px={4}
                        />
                      </Flex>
                    </CardBody>
                  </Card>
                </motion.div>
              )}
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Messages;
