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
  useToast,
  Spinner,
} from "@chakra-ui/react";

import { Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import ProfileModal from "./ProfileModal";
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
import axios from "axios";
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
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    console.log("Search button clicked");
    console.log("Token:", user.token);

    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: `${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8200/api/v2/user/getUsers?search=${search}`,

        config
      );

      setLoading(false);
      setSearchResult(data);
      console.log("data:", data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "failed to load the search result ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `${user.token}`,
        },
      };

      const { data } = await axios.post(
        " http://localhost:8200/api/v2/chat/acsess",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching chats!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontFamily="work sans" fontSize="2xl">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton as={Button}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* Add your Menu options here if needed */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
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
