// components/admin/Header.tsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Button,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Divider,
} from "@chakra-ui/react";
import {
  RiSearchLine,
  RiBellLine,
  RiAddCircleLine,
  RiLogoutBoxLine,
  RiUserLine,
  RiSettingsLine,
  RiVideoChatLine,
  RiUserAddLine,
  RiMegaphoneLine,
  RiMenuLine,
  RiUserHeartLine,
  RiStethoscopeLine,
} from "react-icons/ri";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

// Dummy search data
const searchData = {
  users: [
    {
      id: "u1",
      name: "Alice Johnson",
      age: 19,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "u2",
      name: "Bob Smith",
      age: 20,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "u3",
      name: "Charlie Brown",
      age: 18,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "u4",
      name: "Diana Prince",
      age: 21,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: "u5",
      name: "Emma Wilson",
      age: 19,
      type: "user",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ],
  doctors: [
    {
      id: "d1",
      name: "Dr. Sarah Williams",
      specialty: "Mental Health",
      type: "doctor",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: "d2",
      name: "Dr. Michael Chen",
      specialty: "Sexual Health",
      type: "doctor",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    {
      id: "d3",
      name: "Dr. Emma Davis",
      specialty: "Mental Health",
      type: "doctor",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  ],
  consultations: [
    {
      id: "c1",
      userName: "Alice Johnson",
      doctorName: "Dr. Sarah Williams",
      type: "consultation",
      status: "in-progress",
    },
    {
      id: "c2",
      userName: "Bob Smith",
      doctorName: "Dr. Michael Chen",
      type: "consultation",
      status: "scheduled",
    },
    {
      id: "c3",
      userName: "Charlie Brown",
      doctorName: "Dr. Emma Davis",
      type: "consultation",
      status: "completed",
    },
  ],
};

interface HeaderProps {
  onScheduleConsultation?: () => void;
  onAddDoctor?: () => void;
  onSendMessage?: () => void;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onScheduleConsultation,
  onAddDoctor,
  onSendMessage,
  onToggleSidebar,
}) => {
  const [notifications] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const dropdownBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim())
      return { users: [], doctors: [], consultations: [] };

    const query = searchQuery.toLowerCase();

    return {
      users: searchData.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.age.toString().includes(query)
      ),
      doctors: searchData.doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query)
      ),
      consultations: searchData.consultations.filter(
        (consultation) =>
          consultation.userName.toLowerCase().includes(query) ||
          consultation.doctorName.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery]);

  const totalResults =
    searchResults.users.length +
    searchResults.doctors.length +
    searchResults.consultations.length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleResultClick = (result: any) => {
    setSearchQuery("");
    setShowSuggestions(false);

    if (result.type === "user") {
      navigate("/admin/users");
    } else if (result.type === "doctor") {
      navigate("/admin/doctors");
    } else if (result.type === "consultation") {
      navigate("/admin/consultations");
    }
  };

  const handleQuickAction = (action: string, handler?: () => void) => {
    if (handler) {
      handler();
    } else {
      // Handler will be implemented in the parent component
    }
  };

  return (
    <Box
      h="70px"
      w="full"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex={1000}
      px={6}
      py={3}
    >
      <Flex align="center" justify="space-between" h="full">
        {/* Mobile Menu Button */}
        <IconButton
          aria-label="Menu"
          icon={<RiMenuLine />}
          variant="ghost"
          size="md"
          display={{ base: "flex", md: "none" }}
          onClick={onToggleSidebar}
        />

        {/* Search */}
        <Box position="relative" maxW={{ base: "250px", md: "400px" }} flex={1}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <RiSearchLine size={20} />
            </InputLeftElement>
            <Input
              placeholder="Search users, doctors, consultations..."
              size="md"
              borderRadius="full"
              bg={inputBg}
              border="none"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
            />
          </InputGroup>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchQuery && (
            <Box
              position="absolute"
              top="100%"
              left="0"
              right="0"
              mt={2}
              bg={dropdownBg}
              border="1px"
              borderColor={borderColor}
              borderRadius="lg"
              boxShadow="xl"
              zIndex={9999}
              maxH="400px"
              overflowY="auto"
            >
              {totalResults > 0 ? (
                <VStack align="stretch" spacing={2} p={2}>
                  {searchResults.users.length > 0 && (
                    <>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        px={2}
                        color="gray.500"
                      >
                        Users
                      </Text>
                      {searchResults.users.map((user) => (
                        <MotionBox
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ bg: hoverBg }}
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleResultClick(user)}
                        >
                          <HStack spacing={3}>
                            <Avatar
                              size="sm"
                              name={user.name}
                              src={user.avatar}
                            />
                            <Box flex="1">
                              <HStack>
                                <RiUserLine size={16} />
                                <Text fontSize="sm" fontWeight="medium">
                                  {user.name}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.500">
                                Age: {user.age}
                              </Text>
                            </Box>
                          </HStack>
                        </MotionBox>
                      ))}
                    </>
                  )}

                  {searchResults.doctors.length > 0 && (
                    <>
                      {searchResults.users.length > 0 && <Divider />}
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        px={2}
                        color="gray.500"
                      >
                        Doctors
                      </Text>
                      {searchResults.doctors.map((doctor) => (
                        <MotionBox
                          key={doctor.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ bg: hoverBg }}
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleResultClick(doctor)}
                        >
                          <HStack spacing={3}>
                            <Avatar
                              size="sm"
                              name={doctor.name}
                              src={doctor.avatar}
                            />
                            <Box flex="1">
                              <HStack>
                                <RiUserHeartLine size={16} />
                                <Text fontSize="sm" fontWeight="medium">
                                  {doctor.name}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.500">
                                {doctor.specialty}
                              </Text>
                            </Box>
                          </HStack>
                        </MotionBox>
                      ))}
                    </>
                  )}

                  {searchResults.consultations.length > 0 && (
                    <>
                      {(searchResults.users.length > 0 ||
                        searchResults.doctors.length > 0) && <Divider />}
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        px={2}
                        color="gray.500"
                      >
                        Consultations
                      </Text>
                      {searchResults.consultations.map((consultation) => (
                        <MotionBox
                          key={consultation.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ bg: hoverBg }}
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleResultClick(consultation)}
                        >
                          <HStack spacing={3}>
                            <RiStethoscopeLine size={16} />
                            <Box flex="1">
                              <Text fontSize="sm" fontWeight="medium">
                                {consultation.userName} →{" "}
                                {consultation.doctorName}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                Status: {consultation.status}
                              </Text>
                            </Box>
                          </HStack>
                        </MotionBox>
                      ))}
                    </>
                  )}
                </VStack>
              ) : (
                <Box p={4} textAlign="center">
                  <Text fontSize="sm" color="gray.500">
                    No results found for "{searchQuery}"
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Right Side */}
        <HStack spacing={4}>
          {/* Quick Actions */}
          <HStack spacing={2}>
            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<RiAddCircleLine />}
                colorScheme="blue"
                variant="ghost"
                size="sm"
              >
                Quick Actions
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<RiVideoChatLine />}
                  onClick={() =>
                    handleQuickAction(
                      "Schedule Consultation",
                      onScheduleConsultation
                    )
                  }
                >
                  Schedule Consultation
                </MenuItem>
                <MenuItem
                  icon={<RiUserAddLine />}
                  onClick={() => handleQuickAction("Add Doctor", onAddDoctor)}
                >
                  Add New Doctor
                </MenuItem>
                <MenuItem
                  icon={<RiMegaphoneLine />}
                  onClick={() =>
                    handleQuickAction("Send Awareness Message", onSendMessage)
                  }
                >
                  Send Awareness Message
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* Notifications */}
          <IconButton
            aria-label="Notifications"
            icon={
              <Box position="relative">
                <RiBellLine size={22} />
                {notifications > 0 && (
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    borderRadius="full"
                    bg="red.500"
                    color="white"
                    fontSize="10px"
                    minW="18px"
                    h="18px"
                  >
                    {notifications}
                  </Badge>
                )}
              </Box>
            }
            variant="ghost"
            size="md"
          />

          {/* Profile Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rounded="full"
              p={0}
              minW={0}
              h="auto"
            >
              <Avatar size="sm" name="Admin User" bg="blue.500" />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<RiUserLine />}>
                <Text>Admin User</Text>
              </MenuItem>
              <MenuItem icon={<RiSettingsLine />}>Settings</MenuItem>
              <MenuItem icon={<RiLogoutBoxLine />} color="red.500">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={9998}
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </Box>
  );
};

export default Header;
