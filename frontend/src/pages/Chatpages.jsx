import React, { useEffect } from 'react'
import axios from "axios"
import {
  Box,
  Container,
  Tabs,
  Text,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { ChatState } from '../components/Context/chatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const Chatpages = () => {
 const {user} = ChatState();

console.log(user)


  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default Chatpages
