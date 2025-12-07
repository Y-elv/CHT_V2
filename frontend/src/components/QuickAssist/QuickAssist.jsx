import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  RiQuestionAnswerLine,
  RiSendPlaneFill,
  RiCloseLine,
  RiRobotLine,
} from "react-icons/ri";
import { askQuestion } from "../../services/quickAssistService";

const QuickAssist = () => {
  const location = useLocation();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  // Hide on login, register, and forgot-password pages
  const hiddenPaths = ["/login", "/register", "/forgot-password"];
  const shouldHide = hiddenPaths.includes(location.pathname);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const modalContentRef = useRef(null);
  const modalCardRef = useRef(null);

  const bgColor = "white";
  const borderColor = useColorModeValue("orange.200", "orange.300");
  const headerBg = "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)";
  const inputBg = useColorModeValue("orange.50", "orange.50");

  // 3D card rotation for modal
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    if (!modalCardRef.current || !isOpen) return;
    const rect = modalCardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const handleSend = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();
    setQuestion("");
    setError(null);

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: userQuestion,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Show loading state
    setLoading(true);
    const loadingMessage = {
      id: Date.now() + 1,
      type: "loading",
      text: "Thinking...",
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await askQuestion(userQuestion);

      // Remove loading message and add response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessage.id);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            type: "assistant",
            text: response.answer,
            source: response.source,
            similarity: response.similarity,
            timestamp: new Date(),
          },
        ];
      });
    } catch (err) {
      // Remove loading message and add error
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessage.id);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            type: "error",
            text: err.message || "Failed to get response. Please try again.",
            timestamp: new Date(),
          },
        ];
      });
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // Don't render on login, register, or forgot-password pages
  if (shouldHide) {
    return null;
  }

  return (
    <>
      {/* Floating Funhealth Assist Button with 3D Effects */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.2,
        }}
        whileHover={{
          scale: 1.15,
          rotate: [0, -5, 5, -5, 0],
          transition: { duration: 0.5 },
        }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          perspective: "1000px",
        }}
      >
        <motion.div
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: [0, 5, -5, 0],
            rotateX: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Button
            onClick={onOpen}
            size={isMobile ? "lg" : "lg"}
            bgGradient="linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)"
            color="white"
            borderRadius="full"
            boxShadow="0 8px 24px rgba(247, 148, 29, 0.4), 0 0 20px rgba(247, 148, 29, 0.2)"
            _hover={{
              bgGradient: "linear-gradient(135deg, #FFA84D 0%, #F7941D 100%)",
              boxShadow:
                "0 12px 32px rgba(247, 148, 29, 0.6), 0 0 30px rgba(247, 148, 29, 0.4)",
              transform: "translateY(-4px) translateZ(20px)",
            }}
            _active={{
              transform: "translateY(0px) translateZ(0px)",
            }}
            leftIcon={
              isMobile ? (
                <RiRobotLine size={24} />
              ) : (
                <RiQuestionAnswerLine size={24} />
              )
            }
            px={isMobile ? 4 : 6}
            py={isMobile ? 4 : 6}
            fontSize={isMobile ? "0" : "md"}
            fontWeight="semibold"
            minW={isMobile ? "64px" : "auto"}
            w={isMobile ? "64px" : "auto"}
            h={isMobile ? "64px" : "auto"}
            position="relative"
            overflow="visible"
            aria-label={isMobile ? "Funhealth Assist" : undefined}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: "-4px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #F7941D, #FFA84D)",
                opacity: 0.5,
                filter: "blur(8px)",
                zIndex: -1,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {!isMobile && "Funhealth Assist"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Chat Modal - Positioned at bottom right */}
      {isOpen && (
        <>
          <Box
            position="fixed"
            inset={0}
            bg="blackAlpha.600"
            backdropFilter="blur(4px)"
            zIndex={1000}
            onClick={onClose}
          />
          <Box
            position="fixed"
            bottom="100px"
            right="24px"
            zIndex={1001}
            maxW="500px"
            w={{ base: "calc(100% - 48px)", md: "500px" }}
            maxH="calc(100vh - 140px)"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 50,
                rotateX: 20,
                rotateY: -10,
              }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 50,
                rotateX: 20,
                rotateY: -10,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.5,
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <Box
                ref={(node) => {
                  modalContentRef.current = node;
                  modalCardRef.current = node;
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                borderRadius="2xl"
                boxShadow="2xl"
                bg={bgColor}
                maxH="calc(100vh - 140px)"
                display="flex"
                flexDirection="column"
                border="2px solid"
                borderColor="orange.200"
                style={{
                  transformStyle: "preserve-3d",
                  rotateX,
                  rotateY,
                  transformPerspective: 1000,
                }}
              >
                {/* Orange Header */}
                <Box
                  bgGradient={headerBg}
                  borderTopRadius="2xl"
                  p={4}
                  color="white"
                  position="relative"
                >
                  <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Box
                        p={2}
                        bg="whiteAlpha.200"
                        borderRadius="full"
                        backdropFilter="blur(10px)"
                      >
                        <RiQuestionAnswerLine size={24} />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="bold">
                          Funhealth Assist
                        </Text>
                        <Text fontSize="xs" color="whiteAlpha.800">
                          Ask me anything
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack spacing={2}>
                      {messages.length > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          color="white"
                          _hover={{ bg: "whiteAlpha.200" }}
                          onClick={clearChat}
                          fontSize="xs"
                        >
                          Clear
                        </Button>
                      )}
                      <IconButton
                        aria-label="Close"
                        icon={<RiCloseLine />}
                        size="sm"
                        variant="ghost"
                        color="white"
                        _hover={{ bg: "whiteAlpha.200" }}
                        onClick={onClose}
                      />
                    </HStack>
                  </HStack>
                </Box>

                {/* Messages Area */}
                <Box
                  p={0}
                  flex={1}
                  overflowY="auto"
                  css={{
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: useColorModeValue("#F7941D", "#FFA84D"),
                      borderRadius: "3px",
                    },
                  }}
                >
                  <VStack
                    spacing={4}
                    p={4}
                    align="stretch"
                    minH="300px"
                    maxH="400px"
                  >
                    {messages.length === 0 ? (
                      <VStack spacing={3} py={8} color="orange.400">
                        <RiQuestionAnswerLine size={48} />
                        <Text
                          fontSize="sm"
                          textAlign="center"
                          color="orange.500"
                          fontWeight="medium"
                        >
                          Start a conversation by asking a question below
                        </Text>
                      </VStack>
                    ) : (
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {message.type === "loading" ? (
                              <HStack spacing={2} justify="center" py={4}>
                                <Spinner size="sm" color="#F7941D" />
                                <Text
                                  fontSize="sm"
                                  color="orange.500"
                                  fontWeight="medium"
                                >
                                  {message.text}
                                </Text>
                              </HStack>
                            ) : message.type === "error" ? (
                              <Alert
                                status="error"
                                borderRadius="md"
                                fontSize="sm"
                                bg="red.50"
                                border="1px solid"
                                borderColor="red.200"
                              >
                                <AlertIcon color="red.500" />
                                <Text color="red.700">{message.text}</Text>
                              </Alert>
                            ) : message.type === "user" ? (
                              <Box
                                alignSelf="flex-end"
                                maxW="80%"
                                bgGradient="linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)"
                                color="white"
                                p={3}
                                borderRadius="lg"
                                borderTopRightRadius="sm"
                                boxShadow="sm"
                              >
                                <Text fontSize="sm" fontWeight="medium">
                                  {message.text}
                                </Text>
                              </Box>
                            ) : (
                              <Box
                                alignSelf="flex-start"
                                maxW="80%"
                                bg="orange.50"
                                p={3}
                                borderRadius="lg"
                                borderTopLeftRadius="sm"
                                boxShadow="sm"
                                border="1px solid"
                                borderColor="orange.200"
                              >
                                <Text fontSize="sm" mb={2} color="gray.800">
                                  {message.text}
                                </Text>
                              </Box>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                    <div ref={messagesEndRef} />
                  </VStack>
                </Box>

                <Divider />

                {/* Input Area */}
                <Box p={4} borderTop="1px solid" borderColor="orange.200">
                  <HStack w="full" spacing={3}>
                    <Input
                      ref={inputRef}
                      placeholder="Type your question here..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={handleKeyPress}
                      bg={inputBg}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="orange.200"
                      focusBorderColor="#F7941D"
                      color="gray.800"
                      _placeholder={{
                        color: "gray.400",
                      }}
                      _hover={{
                        borderColor: "#F7941D",
                      }}
                      _focus={{
                        borderColor: "#F7941D",
                        bg: "white",
                      }}
                      isDisabled={loading}
                      size="lg"
                    />
                    <IconButton
                      aria-label="Send message"
                      icon={<RiSendPlaneFill />}
                      bgGradient="linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)"
                      color="white"
                      _hover={{
                        bgGradient:
                          "linear-gradient(135deg, #FFA84D 0%, #F7941D 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      _active={{
                        transform: "translateY(0px)",
                      }}
                      onClick={handleSend}
                      isLoading={loading}
                      isDisabled={!question.trim() || loading}
                      size="lg"
                      borderRadius="lg"
                      boxShadow="sm"
                    />
                  </HStack>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </>
      )}
    </>
  );
};

export default QuickAssist;
