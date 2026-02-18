import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  useToast,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Spinner,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { RiAddLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import { useAdminStore, ApiFaq } from "../../store/adminStore";

const ORANGE_GRADIENT = "linear(to-br, orange.400, orange.600)";
const CATEGORIES = [
  "general",
  "mental wellness",
  "sexual_health",
  "consultation",
  "platform",
];

const AdminFAQ: React.FC = () => {
  const {
    faqs,
    faqsTotal,
    faqsPage,
    faqsTotalPages,
    isLoading,
    fetchFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
  } = useAdminStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingFaq, setEditingFaq] = useState<ApiFaq | null>(null);
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    fetchFaqs(1, 20);
  }, [fetchFaqs]);

  const openCreate = () => {
    setEditingFaq(null);
    setFormQuestion("");
    setFormAnswer("");
    setFormCategory("general");
    onOpen();
  };

  const openEdit = (faq: ApiFaq) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category || "general");
    onOpen();
  };

  const handleSubmit = async () => {
    if (!formQuestion.trim() || !formAnswer.trim()) {
      toast({
        title: "Missing fields",
        description: "Question and answer are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setSubmitting(true);
    try {
      if (editingFaq) {
        await updateFaq(editingFaq._id, {
          question: formQuestion,
          answer: formAnswer,
          category: formCategory,
        });
        toast({
          title: "FAQ updated",
          description: "The FAQ has been updated successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        await createFaq({
          question: formQuestion,
          answer: formAnswer,
          category: formCategory,
        });
        toast({
          title: "FAQ created",
          description: "The FAQ has been created successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      }
      onClose();
    } catch (e: any) {
      toast({
        title: editingFaq ? "Update failed" : "Create failed",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFaq(id);
      toast({
        title: "FAQ deleted",
        description: "The FAQ has been deleted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const decodeHtml = (s: string) => {
    if (!s) return s;
    const doc = new DOMParser().parseFromString(s, "text/html");
    return doc.documentElement.textContent || s;
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="full" p={6}>
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between">
            <Box>
              <Heading size="2xl" mb={2} bgGradient={ORANGE_GRADIENT} bgClip="text">
                FAQs
              </Heading>
              <Text color={subtleText}>
                Create, edit, and delete frequently asked questions.
              </Text>
            </Box>
            <Button
              leftIcon={<RiAddLine />}
              colorScheme="orange"
              bgGradient={ORANGE_GRADIENT}
              _hover={{ opacity: 0.9 }}
              onClick={openCreate}
            >
              Add FAQ
            </Button>
          </HStack>

          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            {isLoading && !faqs.length ? (
              <Flex justify="center" py={12}>
                <Spinner size="xl" color="orange.500" />
              </Flex>
            ) : (
              <Box overflowX="auto">
                <Table size="sm">
                  <Thead bg={useColorModeValue("orange.50", "gray.700")}>
                    <Tr>
                      <Th>Question</Th>
                      <Th>Answer</Th>
                      <Th>Category</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {faqs.map((faq) => (
                      <Tr key={faq._id}>
                        <Td maxW="280px">
                          <Text fontSize="sm" noOfLines={2}>
                            {decodeHtml(faq.question)}
                          </Text>
                        </Td>
                        <Td maxW="320px">
                          <Text fontSize="xs" noOfLines={2} color={subtleText}>
                            {decodeHtml(faq.answer)}
                          </Text>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme="orange"
                            textTransform="capitalize"
                            fontSize="10px"
                          >
                            {faq.category?.replace("_", " ") || "—"}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Edit"
                              icon={<RiEditLine />}
                              size="sm"
                              variant="ghost"
                              colorScheme="orange"
                              onClick={() => openEdit(faq)}
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<RiDeleteBinLine />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              isLoading={deletingId === faq._id}
                              onClick={() => handleDelete(faq._id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
            {faqsTotal > 0 && (
              <HStack mt={4} justify="space-between">
                <Text fontSize="sm" color={subtleText}>
                  Total: {faqsTotal} FAQs
                </Text>
                {faqsTotalPages > 1 && (
                  <HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="orange"
                      isDisabled={faqsPage <= 1}
                      onClick={() => fetchFaqs(faqsPage - 1, 20)}
                    >
                      Previous
                    </Button>
                    <Text fontSize="sm">
                      Page {faqsPage} of {faqsTotalPages}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="orange"
                      isDisabled={faqsPage >= faqsTotalPages}
                      onClick={() => fetchFaqs(faqsPage + 1, 20)}
                    >
                      Next
                    </Button>
                  </HStack>
                )}
              </HStack>
            )}
          </Box>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            {editingFaq ? "Edit FAQ" : "Create FAQ"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Question</FormLabel>
                <Input
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Enter question"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Answer</FormLabel>
                <Textarea
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Enter answer"
                  rows={4}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace("_", " ")}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              bgGradient={ORANGE_GRADIENT}
              _hover={{ opacity: 0.9 }}
              isLoading={submitting}
              onClick={handleSubmit}
            >
              {editingFaq ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminFAQ;
