import {
  Box,
  Button,
  Tooltip,
  Avatar,
  Icon,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useToast,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import "./SideDrawer.css";

import { Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import axios from "../../api/axios";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Drawer,
  Input,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/chatProvider";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        description: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
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

      const { data } = await axios.get(
        `/v2/user/getUsers?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      // Extract error message from the API response
      const errorMessage =
        error.response?.data?.message || "Failed to load the search result";

      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      // 1. Reuse existing 1-to-1 chat if it already exists in state
      const existingChat =
        chats &&
        chats.find(
          (chat) =>
            !chat.isGroupChat &&
            Array.isArray(chat.users) &&
            chat.users.some((u) => u._id === userId)
        );

      if (existingChat) {
        setSelectedChat(existingChat);
        setLoadingChat(false);
        onClose();
        return;
      }

      // 2. Otherwise, ask backend to find-or-create the direct chat
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/v2/chat/acsess",
        { userId },
        config
      );

      // Merge into chat list only if this chat is not already present
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      // Extract error message from the API response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error fetching chats";

      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  if (!user) return null;

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="transparent"
        w="100%"
        p="8px 16px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button
            variant="solid"
            bg="white"
            color="#F7941D"
            onClick={onOpen}
            display="flex"
            flexDirection="row"
            alignItems="center"
            _hover={{ bg: "whiteAlpha.900", color: "#c0761a" }}
            size="md"
            borderRadius="lg"
            leftIcon={<i className="fas fa-search" style={{ fontSize: "18px" }} />}
          >
            <Text display={{ base: "none", md: "flex" }} px="2" fontWeight="semibold">
              Search User
            </Text>
          </Button>
        </Tooltip>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
