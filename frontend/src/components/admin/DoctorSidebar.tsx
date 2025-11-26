// components/admin/DoctorSidebar.tsx
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Flex,
  Image,
  useColorMode,
  useColorModeValue,
  IconButton,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
} from "@chakra-ui/react";
import {
  RiDashboardLine,
  RiStethoscopeLine,
  RiUserHeartLine,
  RiMessage3Line,
  RiCalendarLine,
  RiFileTextLine,
  RiBarChartLine,
  RiSettings3Line,
  RiMoonLine,
  RiSunLine,
  RiCloseLine,
  RiUserLine,
  RiTimeLine,
  RiNotificationLine,
} from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/LOGO FULL.png";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  badgeColor?: string;
}

interface DoctorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const MotionBox = motion(Box);

const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  isOpen = true,
  onClose,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const activeBg = useColorModeValue("blue.50", "blue.900");
  const activeColor = useColorModeValue("blue.600", "blue.300");

  const navItems: NavItem[] = [
    { icon: RiDashboardLine, label: "Dashboard", path: "/doctor/dashboard" },
    {
      icon: RiStethoscopeLine,
      label: "Quick Actions",
      path: "/doctor/consultations",
      badge: 24,
      badgeColor: "red",
    },
    {
      icon: RiUserHeartLine,
      label: "My Patients",
      path: "/doctor/patients",
      badge: 42,
      badgeColor: "blue",
    },
    {
      icon: RiMessage3Line,
      label: "Messages",
      path: "/doctor/messages",
      badge: 15,
      badgeColor: "orange",
    },
    {
      icon: RiCalendarLine,
      label: "Schedule",
      path: "/doctor/schedule",
      badge: 8,
      badgeColor: "green",
    },
    {
      icon: RiFileTextLine,
      label: "Patient Records",
      path: "/doctor/records",
    },
    {
      icon: RiTimeLine,
      label: "Availability",
      path: "/doctor/availability",
    },
    {
      icon: RiNotificationLine,
      label: "Notifications",
      path: "/doctor/notifications",
      badge: 3,
      badgeColor: "purple",
    },
    {
      icon: RiBarChartLine,
      label: "Analytics",
      path: "/doctor/analytics",
    },
    {
      icon: RiUserLine,
      label: "Profile",
      path: "/doctor/profile",
    },
    { icon: RiSettings3Line, label: "Settings", path: "/doctor/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    // Close mobile menu after navigation
    if (onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <VStack spacing={4} p={4} align="stretch">
      {/* Logo */}
      <Flex justify="space-between" align="center" p={2}>
        <Flex
          align="center"
          gap={2}
          cursor="pointer"
          onClick={() => navigate("/doctor/dashboard")}
          _hover={{ opacity: 0.8 }}
        >
          <Image src={logo} alt="Logo" boxSize="32px" objectFit="contain" />
          <Box>
            <Text fontSize="xs" color="gray.500">
              Doctor Panel
            </Text>
          </Box>
        </Flex>
        <HStack>
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <RiMoonLine /> : <RiSunLine />}
            onClick={toggleColorMode}
            size="sm"
            variant="ghost"
          />
          {/* Close button for mobile */}
          {onClose && (
            <IconButton
              aria-label="Close menu"
              icon={<RiCloseLine />}
              onClick={onClose}
              size="sm"
              variant="ghost"
              display={{ base: "block", md: "none" }}
            />
          )}
        </HStack>
      </Flex>

      <Divider />

      {/* Doctor Profile */}
      <Box
        p={3}
        borderRadius="lg"
        bg={useColorModeValue("gray.50", "gray.700")}
      >
        <HStack>
          <Avatar size="sm" name="Dr. Smith" />
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="sm">
              Dr. Smith
            </Text>
            <Text fontSize="xs" color="gray.500">
              General Practitioner
            </Text>
          </Box>
        </HStack>
      </Box>

      <Divider />

      {/* Navigation Items */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <MotionBox
            key={item.path}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Flex
              align="center"
              p={3}
              borderRadius="lg"
              cursor="pointer"
              bg={active ? activeBg : "transparent"}
              color={active ? activeColor : "inherit"}
              _hover={{ bg: active ? activeBg : hoverBg }}
              onClick={() => handleNavClick(item.path)}
              position="relative"
            >
              <Icon size={20} />
              <Text
                ml={3}
                flex="1"
                fontSize="sm"
                fontWeight={active ? "semibold" : "normal"}
              >
                {item.label}
              </Text>
              {item.badge && (
                <Badge
                  colorScheme={item.badgeColor || "blue"}
                  borderRadius="full"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Flex>
          </MotionBox>
        );
      })}
    </VStack>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        display={{ base: "none", md: "block" }}
        h="100vh"
        w="250px"
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        position="fixed"
        left="0"
        overflowY="auto"
        transition="all 0.3s"
        zIndex={1000}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      {onClose && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg={bgColor} maxW="280px">
            <DrawerBody p={0}>{sidebarContent}</DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default DoctorSidebar;
