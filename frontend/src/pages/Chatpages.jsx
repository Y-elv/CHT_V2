import React, { useState } from "react";
import Navbar from "../components/navbar/navbar";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../components/Context/chatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useBadgeStore } from "../zustandStore/store";
import { motion } from "framer-motion";

const Chatpages = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const profile = useBadgeStore((state) => state.profile) || null;

  // Use either stored profile badge or authenticated chat user
  const hasProfile = profile || user;

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
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {hasProfile && <Navbar />}
      {hasProfile && (
        <Box
          flexShrink={0}
          zIndex={40}
          bg="linear-gradient(90deg, #F7941D 0%, #FFA84D 100%)"
          borderBottom="2px solid rgba(255,255,255,0.3)"
          shadow="md"
          w="100%"
        >
          <SideDrawer />
        </Box>
      )}

      <div
        className="pointer-events-none"
        style={{ position: "absolute", inset: 0, zIndex: 0, background: "#fff9f5" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            filter: "blur(60px)",
            background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          display: "flex",
          width: "100%",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="100%"
          minH={0}
          p={3}
          flex={1}
          bg="#fffbf7"
          as={motion.div}
          variants={contentVariants}
          style={{
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(247,148,29,0.15)",
            border: "1px solid",
            borderColor: "rgba(247,148,29,0.25)",
          }}
        >
          {hasProfile && <MyChats fetchAgain={fetchAgain} />}
          {hasProfile && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </motion.div>
    </div>
  );
};

export default Chatpages;
