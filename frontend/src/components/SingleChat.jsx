import React, { useEffect, useState } from "react";
import { ChatState } from "./Context/chatProvider";
import axios from "axios";
import "../components/css/styles.css";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import SCrollableChat from "./SCrollableChat";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/chatLogics";
import ProfileModal from "./miscellaneous/ProfileModal.jsx";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal.jsx";
import io from "socket.io-client";


const ENDPOINT = "http://localhost:8200";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessages] = useState();
  const [socketConnected, setSocketConnected] = useState(false);

  const toast = useToast();

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connection", () => setSocketConnected(true));
    }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          authorization: `${user.token}`,
        },
      };
      console.log("User Token:", user.token);

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:8200/api/v2/message/getmessage/${selectedChat._id}`,
        {
          headers: {
            authorization: `${user.token}`,
          },
        }
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };



  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecevied) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecevied.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageRecevied]);
      }
    });
  },);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            authorization: `${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          " http://localhost:8200/api/v2/message/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log("from single chat", data);

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    // tyiping logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <SCrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E8E8E8"
                placeholder="Enter a message ..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="work sans">
            Click on user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
