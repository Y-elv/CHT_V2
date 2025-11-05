import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/navbar";
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
import { motion } from "framer-motion";

const Chatpages = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const profile = useBadgeStore((state) => state.profile) || null;

  // Subtle, non-intrusive animations matching the global style
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div style={{ width: "100%", overflowX: "hidden", position: "relative" }}>
      {profile && <Navbar />}
      {profile && <SideDrawer />}
      {/* Animated background depth layers - visual only, no layout impact */}
      <div
        className="pointer-events-none"
        style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "absolute",
            top: "15%",
            left: "8%",
            width: 260,
            height: 260,
            borderRadius: 9999,
            filter: "blur(50px)",
            background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{
            position: "absolute",
            bottom: "12%",
            right: "8%",
            width: 320,
            height: 320,
            borderRadius: 9999,
            filter: "blur(60px)",
            background: "linear-gradient(135deg, #2B2F92 0%, #1e2266 100%)",
          }}
        />
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ position: "relative", zIndex: 1 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="calc(100vh - 80px)"
        p="10px"
        bg="transparent"
        overflow="hidden"
        as={motion.div}
        variants={contentVariants}
        whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
        style={{
          borderRadius: 16,
          boxShadow:
            "0 6px 20px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
          backdropFilter: "blur(2px)",
          transition: "box-shadow 200ms ease",
        }}
      >
        {profile && <MyChats fetchAgain={fetchAgain} />}
        {profile && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
      </motion.div>
    </div>
  );
};

export default Chatpages;
