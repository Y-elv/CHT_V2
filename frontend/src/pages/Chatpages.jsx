import React, { useEffect, useState } from "react";
import UserNavbar from "../layout/userNavbar/userNavbar";
import axios from "../config/axiosConfig";
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
import { ChatState } from "../components/Context/chatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import ProfileNavbar from "../components/profileNavbar/offcanvasprofile";
import { useBadgeStore } from "../zustandStore/store";

const Chatpages = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const profile = useBadgeStore((state) => state.profile) || null;

  return (
    <div style={{ width: "100%" }}>
      {profile && <UserNavbar />}
      {profile && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
        bg="#B8C2D7"
      >
        {profile && <MyChats fetchAgain={fetchAgain} />}
        {profile && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpages;
