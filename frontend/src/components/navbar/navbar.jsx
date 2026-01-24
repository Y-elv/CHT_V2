import "./navbar.css";
import logo from "../../assets/LOGO FULL.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IoClose,
  IoNotificationsOutline,
  IoChatbubbleOutline,
} from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatState } from "../Context/chatProvider";
import { useAuth } from "../../contexts/AuthContext";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useNotificationStore from "../../zustandStore/notificationStore";

const Navbar = ({ active }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Get ChatState (ChatProvider wraps the app, so this should always work)
  const chatContext = ChatState();
  const { user: chatUser = null, chats = [], logoutHandler: chatLogoutHandler } = chatContext || {};
  
  // Get AuthContext for immediate user state updates
  const { user: authUser, logout: authLogout, isAuthenticated, loading: authLoading } = useAuth();
  
  // Get user from localStorage as fallback if authUser is not available yet
  const getUserFromStorage = () => {
    try {
      const chtUser = localStorage.getItem("cht_user");
      const userInfo = localStorage.getItem("userInfo");
      if (chtUser) {
        return JSON.parse(chtUser);
      } else if (userInfo) {
        return JSON.parse(userInfo);
      }
    } catch (error) {
      console.error("❌ Navbar: Error reading user from storage:", error);
    }
    return null;
  };
  
  // Use authUser if available, otherwise try localStorage, then fall back to chatUser
  const storageUser = !authUser && !authLoading ? getUserFromStorage() : null;
  const user = authUser || storageUser || chatUser;
  
  // Debug logging
  useEffect(() => {
    console.log("🔍 Navbar: User state check");
    console.log("   - authUser:", authUser);
    console.log("   - storageUser:", storageUser);
    console.log("   - chatUser:", chatUser);
    console.log("   - Final user:", user);
    console.log("   - authLoading:", authLoading);
    if (user) {
      console.log("   - User.name:", user.name);
      console.log("   - User.email:", user.email);
      console.log("   - User.pic:", user.pic);
      console.log("   - User.role:", user.role);
    }
  }, [authUser, storageUser, chatUser, user, authLoading]);
  
  const logoutHandler = () => {
    if (authLogout) authLogout();
    if (chatLogoutHandler) chatLogoutHandler();
  };
  
  // Check if we're on home page and user is not authenticated
  const isHomePage = location.pathname === "/home" || location.pathname === "/";
  const shouldShowNotifications = user && !isHomePage;

  // Notification Store
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    refresh,
  } = useNotificationStore();

  // Auto-fetch notifications on mount and when user is available
  useEffect(() => {
    if (user && shouldShowNotifications) {
      // Fetch notifications and unread count on component mount
      refresh().catch((error) => {
        console.error("Failed to fetch notifications:", error);
      });
    }
  }, [user, shouldShowNotifications]); // Only fetch when user is available and not on home page

  // Format notification time
  const formatNotificationTime = (dateString) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "Just now";
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    const notificationId = notification._id || notification.id;
    // Support both read and isRead properties
    const isUnread = notification.read === false || 
                     notification.isRead === false || 
                     (!notification.read && notification.isRead === undefined);

    // Mark as read if unread
    if (isUnread && notificationId) {
      try {
        await markAsRead(notificationId);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    // Navigate if link is provided
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    } else if (notification.type === "message" || notification.chatId) {
      navigate("/chats");
      setShowNotifications(false);
    } else {
      setShowNotifications(false);
    }
  };

  // Close notification popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Display count with "9+" logic
  const displayCount = unreadCount > 9 ? "9+" : unreadCount > 0 ? unreadCount : null;

  const menuVariants = {
    closed: {
      y: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMenu]);

  const notificationVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <nav className="sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link className="flex items-center" to="/">
              <img
                src={logo}
                className="h-10 sm:h-12 w-auto"
                alt="Kundwa Health Logo"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden tablet:flex items-center gap-6 lg:gap-8">
            <Link
              to="/our-news"
              className="nav-link relative text-slate-700 dark:text-slate-300 hover:text-[#F7941D] dark:hover:text-[#F7941D] font-medium transition-colors duration-200 px-2 py-1"
            >
              Updates
            </Link>
            <Link
              to="/our-teamm"
              className={`nav-link relative text-slate-700 dark:text-slate-300 hover:text-[#F7941D] dark:hover:text-[#F7941D] font-medium transition-colors duration-200 px-2 py-1 ${
                active === "ourTeam" ? "text-[#F7941D] dark:text-[#F7941D]" : ""
              }`}
            >
              Our Team
            </Link>
            <Link
              to="/menu"
              className="nav-link relative text-slate-700 dark:text-slate-300 hover:text-[#F7941D] dark:hover:text-[#F7941D] font-medium transition-colors duration-200 px-2 py-1"
            >
              Menu
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden tablet:flex items-center gap-4">
            {/* Notification Icon - Only show for authenticated users and not on home page */}
            {shouldShowNotifications && (
              <motion.div
                ref={notificationRef}
                className="relative"
                initial={false}
                animate={showNotifications ? "visible" : "hidden"}
              >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <IoNotificationsOutline className="text-2xl text-slate-700 dark:text-slate-300" />
                {displayCount !== null && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#F7941D] to-[#FFA84D] text-white text-xs font-bold shadow-lg border-2 border-white dark:border-slate-800"
                  >
                    {displayCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notification Popup */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    variants={notificationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                  >
                    <div className="p-4 bg-gradient-to-r from-[#2B2F92]/10 to-[#F7941D]/10 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {unreadCount} unread{" "}
                          {unreadCount === 1 ? "message" : "messages"}
                        </p>
                      )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                      {notificationsLoading && notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7941D] mx-auto mb-3"></div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Loading notifications...
                          </p>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification, index) => {
                          // Support both read and isRead properties
                          const isUnread = notification.read === false || 
                                          notification.isRead === false || 
                                          (!notification.read && notification.isRead === undefined);
                          return (
                            <motion.div
                              key={notification._id || notification.id || index}
                              custom={index}
                              initial="hidden"
                              animate="visible"
                              variants={itemVariants}
                              whileHover={{
                                x: 4,
                                backgroundColor: "rgba(247, 148, 29, 0.08)",
                              }}
                              className={`p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-200 ${
                                isUnread
                                  ? "bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-l-[#F7941D]"
                                  : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {notification.type === "message" ||
                                  notification.type === "chat" ? (
                                    <IoChatbubbleOutline className="text-xl text-[#2B2F92] dark:text-[#F7941D]" />
                                  ) : (
                                    <IoNotificationsOutline className="text-xl text-[#F7941D]" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4
                                      className={`text-sm font-semibold ${
                                        isUnread
                                          ? "text-[#2B2F92] dark:text-[#F7941D]"
                                          : "text-slate-700 dark:text-slate-300"
                                      }`}
                                    >
                                      {notification.title || "Notification"}
                                    </h4>
                                    {isUnread && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-2 h-2 rounded-full bg-gradient-to-r from-[#F7941D] to-[#FFA84D] flex-shrink-0 mt-1.5"
                                      />
                                    )}
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-1">
                                    {notification.message || notification.content || ""}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-500">
                                    {formatNotificationTime(
                                      notification.createdAt || notification.created_at || notification.time
                                    )}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center">
                          <IoNotificationsOutline className="text-4xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                            No notifications
                          </p>
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={async () => {
                            try {
                              await refresh();
                            } catch (error) {
                              console.error("Failed to refresh notifications:", error);
                            }
                          }}
                          className="block w-full text-center text-sm font-medium text-[#2B2F92] dark:text-[#F7941D] hover:text-[#F7941D] dark:hover:text-[#FFA84D] transition-colors duration-200"
                        >
                          Refresh Notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            )}

            {/* User Profile or Login & Signup Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="medium"
                  color="slate-700"
                  className="hidden sm:block text-slate-700 dark:text-slate-300"
                >
                  {user.name}
                </Text>
                <Menu>
                  <MenuButton
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <Avatar
                      src={user.pic}
                      name={user.name}
                      size={{ base: "sm", md: "md" }}
                      border="2px solid"
                      borderColor="#F7941D"
                      boxShadow="0 0 0 2px rgba(247, 148, 29, 0.2)"
                    />
                    <ChevronDownIcon
                      className="hidden sm:block text-slate-700 dark:text-slate-300"
                      fontSize="sm"
                    />
                  </MenuButton>
                  <MenuList
                    bg="white"
                    borderColor="slate-200"
                    shadow="xl"
                    minW="200px"
                    py={2}
                  >
                    <MenuItem
                      as={Link}
                      to="/profile"
                      _hover={{
                        bg: "rgba(247, 148, 29, 0.1)",
                        color: "#F7941D",
                      }}
                      _focus={{
                        bg: "rgba(247, 148, 29, 0.1)",
                        color: "#F7941D",
                      }}
                      icon={<span>👤</span>}
                      py={2}
                    >
                      Change Profile Picture
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        if (logoutHandler) {
                          logoutHandler();
                        }
                      }}
                      _hover={{ bg: "red.50", color: "red.600" }}
                      _focus={{ bg: "red.50", color: "red.600" }}
                      icon={<span>🚪</span>}
                      py={2}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-gradient-to-r from-[#F7941D] to-[#FFA84D] hover:from-[#FFA84D] hover:to-[#F7941D] text-white font-semibold rounded-full text-sm shadow-lg shadow-[#F7941D]/30 hover:shadow-xl hover:shadow-[#F7941D]/40 transition-all duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-[#2B2F92] to-[#1e2266] hover:from-[#1e2266] hover:to-[#2B2F92] text-white font-semibold rounded-full text-sm shadow-lg shadow-[#2B2F92]/30 hover:shadow-xl hover:shadow-[#2B2F92]/40 transition-all duration-300"
                  >
                    Signup
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            className="tablet:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            <GiHamburgerMenu className="text-2xl text-slate-700 dark:text-slate-300" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] tablet:hidden"
            />

            {/* Mobile Menu Panel - Full Screen */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
              className="fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-[#2B2F92] to-[#1e2266] shadow-2xl z-[9999] tablet:hidden overflow-hidden"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
              }}
            >
              {/* Scrollable Content Container */}
              <div className="h-full flex flex-col overflow-y-auto">
                {/* Header - Fixed at top with centered avatar */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-white/20 relative">
                  <img src={logo} className="h-8 sm:h-10 w-auto" alt="Logo" />
                  {/* Centered Avatar - Only show if user is logged in */}
                  {user && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
                      <Avatar
                        src={user.pic}
                        name={user.name}
                        size={{ base: "md", sm: "sm" }}
                        border="2px solid"
                        borderColor="#F7941D"
                        boxShadow="0 0 0 2px rgba(247, 148, 29, 0.2)"
                      />
                      <Text
                        fontSize={{ base: "sm", sm: "xs" }}
                        fontWeight="semibold"
                        color="white"
                        textAlign="center"
                        className="hidden sm:block"
                      >
                        {user.name?.split(" ")[0]}
                      </Text>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 z-10"
                    aria-label="Close menu"
                  >
                    <IoClose className="text-2xl text-white" />
                  </motion.button>
                </div>

                {/* Scrollable Content - Centered */}
                <div className="flex-1 flex flex-col justify-start items-center px-6 py-6 sm:py-8 min-h-0 overflow-y-auto">
                  <div className="w-full max-w-md mx-auto">
                    {/* User Profile Info - Mobile (below header) */}
                    {user && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 w-full flex flex-col items-center gap-2"
                      >
                        <Text
                          fontSize="md"
                          fontWeight="bold"
                          color="white"
                          textAlign="center"
                          className="sm:hidden"
                        >
                          {user.name}
                        </Text>
                      </motion.div>
                    )}
                    {/* Navigation Links */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      className="space-y-4 mb-8 w-full"
                    >
                      {[
                        { to: "/our-news", label: "Updates" },
                        { to: "/our-teamm", label: "Our Team" },
                        { to: "/menu", label: "Menu" },
                        { to: "/consultation", label: "Consultation" },
                        { to: "/chats", label: "Chats" },
                        { to: "/game", label: "Game" },
                        { to: "/news", label: "News" },
                      ].map((link, index) => (
                        <motion.div
                          key={link.to}
                          custom={index}
                          variants={itemVariants}
                        >
                          <Link
                            to={link.to}
                            onClick={() => setShowMenu(false)}
                            className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 text-center ${
                              location.pathname === link.to
                                ? "bg-gradient-to-r from-[#F7941D] to-[#FFA84D] text-white shadow-lg"
                                : "text-white hover:bg-white/20 hover:text-white"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Mobile Notification */}
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 w-full"
                      >
                        <div className="flex items-center gap-3 p-3 bg-white/20 rounded-xl">
                          <div className="relative">
                            <IoNotificationsOutline className="text-2xl text-white" />
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 flex items-center justify-center rounded-full bg-gradient-to-r from-[#F7941D] to-[#FFA84D] text-white text-xs font-bold">
                              {displayCount}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white">
                              {unreadCount} unread{" "}
                              {unreadCount === 1 ? "message" : "messages"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3 w-full"
                    >
                      {user ? (
                        <>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              to="/profile"
                              onClick={() => setShowMenu(false)}
                              className="block w-full px-4 py-3 bg-gradient-to-r from-[#F7941D] to-[#FFA84D] hover:from-[#FFA84D] hover:to-[#F7941D] text-white font-semibold rounded-xl text-center shadow-lg transition-all duration-300"
                            >
                              Profile
                            </Link>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              to="/login"
                              onClick={() => {
                                if (logoutHandler) {
                                  logoutHandler();
                                }
                                setShowMenu(false);
                              }}
                              className="block w-full px-4 py-3 bg-gradient-to-r from-[#2B2F92] to-[#1e2266] hover:from-[#1e2266] hover:to-[#2B2F92] text-white font-semibold rounded-xl text-center shadow-lg transition-all duration-300"
                            >
                              Logout
                            </Link>
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              to="/login"
                              onClick={() => setShowMenu(false)}
                              className="block w-full px-4 py-3 bg-gradient-to-r from-[#F7941D] to-[#FFA84D] hover:from-[#FFA84D] hover:to-[#F7941D] text-white font-semibold rounded-xl text-center shadow-lg transition-all duration-300"
                            >
                              Login
                            </Link>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              to="/register"
                              onClick={() => setShowMenu(false)}
                              className="block w-full px-4 py-3 bg-gradient-to-r from-[#2B2F92] to-[#1e2266] hover:from-[#1e2266] hover:to-[#2B2F92] text-white font-semibold rounded-xl text-center shadow-lg transition-all duration-300"
                            >
                              Signup
                            </Link>
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
