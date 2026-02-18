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
  Avatar,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";
import { RiEyeLine, RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import { useAdminStore, ApiUser } from "../../store/adminStore";
import { getStatusColor } from "../../utils/formatters";

const ORANGE = "#F7941D";
const ORANGE_LIGHT = "orange.100";
const ORANGE_GRADIENT = "linear(to-br, orange.400, orange.600)";

const AdminUsers: React.FC = () => {
  const {
    users,
    usersTotal,
    usersPage,
    usersTotalPages,
    isLoading,
    fetchUsers,
    blockUser,
    unblockUser,
  } = useAdminStore();
  const toast = useToast();
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionId, setActionId] = useState<string | null>(null);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    fetchUsers(1, 20);
  }, [fetchUsers]);

  const handleView = (user: ApiUser) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleBlock = async (user: ApiUser) => {
    if (user.status === "blocked") return;
    setActionId(user._id);
    try {
      await blockUser(user._id);
      toast({
        title: "User blocked",
        description: `${user.name} has been blocked successfully.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (e: any) {
      toast({
        title: "Failed to block",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setActionId(null);
    }
  };

  const handleUnblock = async (user: ApiUser) => {
    if (user.status !== "blocked") return;
    setActionId(user._id);
    try {
      await unblockUser(user._id);
      toast({
        title: "User unblocked",
        description: `${user.name} has been unblocked successfully.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (e: any) {
      toast({
        title: "Failed to unblock",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setActionId(null);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="full" p={6}>
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between">
            <Box>
              <Heading size="2xl" mb={2} bgGradient={ORANGE_GRADIENT} bgClip="text">
                Users
              </Heading>
              <Text color={subtleText}>
                Manage platform users. View profile, block or unblock.
              </Text>
            </Box>
          </HStack>

          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            {isLoading && !users.length ? (
              <Flex justify="center" py={12}>
                <Spinner size="xl" color={ORANGE} />
              </Flex>
            ) : (
              <Box overflowX="auto">
                <Table size="sm">
                  <Thead bg={useColorModeValue("orange.50", "gray.700")}>
                    <Tr>
                      <Th>User</Th>
                      <Th>Email</Th>
                      <Th>Role</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => {
                      const isBlocked = (user.status || "").toLowerCase() === "blocked";
                      const role = (user.role || "patient").toLowerCase();
                      return (
                        <Tr key={user._id}>
                          <Td>
                            <HStack spacing={3}>
                              <Avatar
                                size="sm"
                                name={user.name}
                                src={user.pic}
                                bg={ORANGE}
                                color="white"
                              />
                              <Text fontWeight="medium" fontSize="sm">
                                {user.name}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color={subtleText}>
                              {user.email}
                            </Text>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={role === "doctor" ? "blue" : "gray"}
                              textTransform="capitalize"
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              {role}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getStatusColor(
                                isBlocked ? "blocked" : "active"
                              )}
                              px={2}
                              py={1}
                              borderRadius="full"
                              textTransform="capitalize"
                            >
                              {isBlocked ? "Blocked" : "Active"}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                aria-label="View profile"
                                icon={<RiEyeLine />}
                                size="sm"
                                variant="ghost"
                                colorScheme="orange"
                                onClick={() => handleView(user)}
                              />
                              {isBlocked ? (
                                <Button
                                  size="xs"
                                  leftIcon={<RiLockUnlockLine />}
                                  colorScheme="green"
                                  variant="outline"
                                  isLoading={actionId === user._id}
                                  onClick={() => handleUnblock(user)}
                                >
                                  Unblock
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  leftIcon={<RiLockLine />}
                                  colorScheme="red"
                                  variant="outline"
                                  isLoading={actionId === user._id}
                                  onClick={() => handleBlock(user)}
                                  isDisabled={user.isAdmin}
                                >
                                  Block
                                </Button>
                              )}
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            )}
            {usersTotal > 0 && (
              <HStack mt={4} justify="space-between">
                <Text fontSize="sm" color={subtleText}>
                  Total: {usersTotal} users
                </Text>
                {usersTotalPages > 1 && (
                  <HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="orange"
                      isDisabled={usersPage <= 1}
                      onClick={() => fetchUsers(usersPage - 1, 20)}
                    >
                      Previous
                    </Button>
                    <Text fontSize="sm">
                      Page {usersPage} of {usersTotalPages}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="orange"
                      isDisabled={usersPage >= usersTotalPages}
                      onClick={() => fetchUsers(usersPage + 1, 20)}
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

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            User profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            {selectedUser && (
              <VStack align="stretch" spacing={4}>
                <Flex justify="center">
                  {selectedUser.pic ? (
                    <Avatar
                      size="2xl"
                      name={selectedUser.name}
                      src={selectedUser.pic}
                      bg={ORANGE}
                      color="white"
                    />
                  ) : (
                    <Flex
                      w="80px"
                      h="80px"
                      borderRadius="full"
                      bgGradient={ORANGE_GRADIENT}
                      align="center"
                      justify="center"
                      color="white"
                      fontSize="2xl"
                      fontWeight="bold"
                    >
                      {getInitials(selectedUser.name)}
                    </Flex>
                  )}
                </Flex>
                <SimpleGrid columns={1} spacing={2}>
                  <Box>
                    <Text fontSize="xs" color={subtleText}>
                      Name
                    </Text>
                    <Text fontWeight="semibold">{selectedUser.name}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color={subtleText}>
                      Email
                    </Text>
                    <Text>{selectedUser.email}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color={subtleText}>
                      Role
                    </Text>
                    <Badge
                      colorScheme={
                        selectedUser.role === "doctor" ? "blue" : "gray"
                      }
                      textTransform="capitalize"
                    >
                      {selectedUser.role}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color={subtleText}>
                      Status
                    </Text>
                    <Badge
                      colorScheme={getStatusColor(
                        selectedUser.status === "blocked" ? "blocked" : "active"
                      )}
                      textTransform="capitalize"
                    >
                      {selectedUser.status === "blocked" ? "Blocked" : "Active"}
                    </Badge>
                  </Box>
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminUsers;
