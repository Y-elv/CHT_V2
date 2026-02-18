import React, { useState } from "react";
import axios from "../../api/axios";
import { FormControl, useDisclosure, useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../Context/chatProvider";
import UserListItem from "../UserListItem";
import UserBadgetItem from "../UserBadgetItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://chtv2-bn.onrender.com/api/v2/user/getUsers?search=${search}`,

        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      // Extract error message from the API response
      const errorMessage =
        error.response?.data?.message || "Failed to load the search result";

      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        description: "Please fill all fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `${user.token}`,
        },
      };
      const { data } = await axios.post(
        ` https://chtv2-bn.onrender.com/api/v2/chat/creategroup`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },

        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        description: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      // Extract error message from the API response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to create Group";

      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        description: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.500" />
        <ModalContent
          bg="white"
          border="2px solid"
          borderColor="orange.200"
          borderRadius="xl"
          boxShadow="0 8px 32px rgba(247,148,29,0.2)"
        >
          <ModalHeader
            fontSize="28px"
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
            bg="linear-gradient(90deg, #F7941D 0%, #FFA84D 100%)"
            color="white"
            borderTopRadius="xl"
            py={4}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton color="white" _hover={{ bg: "whiteAlpha.300" }} />
          <ModalBody display="flex" flexDir="column" alignItems="center" py={6}>
            <FormControl mb={3}>
              <Input
                placeholder="Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                borderColor="orange.200"
                _focus={{ borderColor: "#F7941D", boxShadow: "0 0 0 1px #F7941D" }}
              />
            </FormControl>

            <FormControl mb={3}>
              <Input
                placeholder="Add Users e.g. anne, anita, ely"
                onChange={(e) => handleSearch(e.target.value)}
                borderColor="orange.200"
                _focus={{ borderColor: "#F7941D", boxShadow: "0 0 0 1px #F7941D" }}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap" gap={2} mb={3}>
              {selectedUsers.map((u) => (
                <UserBadgetItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <Box py={4}>Loading...</Box>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleGroup(u)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter bg="orange.50" borderBottomRadius="xl">
            <Button
              bg="linear-gradient(90deg, #F7941D 0%, #FFA84D 100%)"
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={handleSubmit}
            >
              Create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
