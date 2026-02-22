import React, { useEffect } from "react";
import { ChatState } from "./Context/chatProvider";
import { Box, Button, Stack, useToast, Avatar, HStack, Text } from "@chakra-ui/react";
import axios from "../api/axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";

import { getSender, getSenderFull } from "../config/chatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get(
        "/v2/chat/fetch"
      );
      setChats(data || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain, user]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="orange.100"
      minH={0}
      h="100%"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "22px", md: "28px", lg: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        flexShrink={0}
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "14px", md: "17px", lg: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="orange"
            variant="outline"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        borderRadius="lg"
        display="flex"
        flexDir="column"
        p={3}
        bg="orange.50"
        w="100%"
        flex={1}
        minH={0}
        overflow="hidden"
      >
        {chats ? (
          <Stack flex={1} minH={0} overflowY="auto" spacing={2}>
            {chats.map((chat) => {
              const displayName = !chat.isGroupChat
                ? getSender(user, chat.users)
                : chat.chatName;
              const otherUser = !chat.isGroupChat
                ? getSenderFull(user, chat.users)
                : null;
              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "orange.500" : "white"}
                  color={selectedChat === chat ? "white" : "gray.800"}
                  borderWidth="1px"
                  borderColor={selectedChat === chat ? "orange.500" : "orange.100"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                >
                  <HStack spacing={3} w="100%" minW={0}>
                    {!chat.isGroupChat && otherUser ? (
                      <Avatar
                        size="sm"
                        name={otherUser.name}
                        src={otherUser.pic}
                        flexShrink={0}
                        bg={selectedChat === chat ? "whiteAlpha.400" : "gray.300"}
                      />
                    ) : (
                      <Avatar
                        size="sm"
                        name={displayName}
                        flexShrink={0}
                        bg={selectedChat === chat ? "whiteAlpha.400" : "gray.400"}
                      />
                    )}
                    <Text noOfLines={1} flex={1} minW={0}>
                      {displayName}
                    </Text>
                  </HStack>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
