// pages/admin/AdminLayout.tsx
import React from "react";
import { Box, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onClose={onClose} />

      {/* Main Content Area */}
      <Box ml={{ base: 0, md: "250px" }}>
        {/* Header */}
        <Header onToggleSidebar={onOpen} />

        {/* Page Content */}
        <Box p={0}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
