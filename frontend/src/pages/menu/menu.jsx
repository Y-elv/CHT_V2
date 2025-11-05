import "./menu.css";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoNewspaperOutline,
  IoPeopleOutline,
  IoMenuOutline,
  IoChatbubbleOutline,
  IoGameControllerOutline,
  IoNotificationsOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoMedicalOutline,
  IoMedkitOutline,
} from "react-icons/io5";
import { RiGamepadLine } from "react-icons/ri";
import { FaUserMd } from "react-icons/fa";
import { ChatState } from "../../components/Context/chatProvider";
import { useBadgeStore } from "../../zustandStore/store";
import { Avatar } from "@chakra-ui/react";

const Menu = () => {
  const location = useLocation();
  const chatContext = ChatState();
  const { user = null, logoutHandler } = chatContext || {};
  const profile = useBadgeStore((state) => state.profile) || null;
  const displayUser = profile || user;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Main Navigation Links
  const mainNavLinks = [
    {
      to: "/our-news",
      label: "Updates",
      icon: IoNewspaperOutline,
      description: "Stay updated with the latest health news and information",
      color: "#F7941D",
    },
    {
      to: "/our-teamm",
      label: "Our Team",
      icon: IoPeopleOutline,
      description: "Meet the amazing team behind Kundwa Health",
      color: "#2B2F92",
    },
    {
      to: "/menu",
      label: "Menu",
      icon: IoMenuOutline,
      description: "Explore all available options and features",
      color: "#F7941D",
    },
  ];

  // Service Navigation Links
  const serviceNavLinks = [
    {
      to: "/consultation",
      label: "Consultation",
      icon: FaUserMd,
      description: "Book a consultation with our health professionals",
      color: "#2B2F92",
    },
    {
      to: "/chats",
      label: "Chats",
      icon: IoChatbubbleOutline,
      description: "Connect and chat with our health advisors",
      color: "#F7941D",
    },
    {
      to: "/game",
      label: "Game",
      icon: RiGamepadLine,
      description: "Play interactive health games and learn",
      color: "#2B2F92",
    },
    {
      to: "/news",
      label: "News",
      icon: IoNotificationsOutline,
      description: "Read health articles and educational content",
      color: "#F7941D",
    },
  ];

  // Additional Links
  const additionalLinks = [
    {
      to: "/",
      label: "Home",
      icon: IoHomeOutline,
      color: "#2B2F92",
    },
    {
      to: "/hospital",
      label: "Hospital",
      icon: IoMedicalOutline,
      color: "#F7941D",
    },
    {
      to: "/services",
      label: "Services",
      icon: IoMedicalOutline,
      color: "#2B2F92",
    },
    {
      to: "/pharmacy",
      label: "Pharmacy",
      icon: IoMedkitOutline,
      color: "#F7941D",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen w-full overflow-x-hidden">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{
              background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
            }}
            variants={floatingVariants}
            animate="float"
          />
          <motion.div
            className="absolute bottom-20 right-10 w-60 h-60 rounded-full opacity-10 blur-3xl"
            style={{
              background: "linear-gradient(135deg, #2B2F92 0%, #1e2266 100%)",
            }}
            variants={floatingVariants}
            animate="float"
            transition={{ delay: 2 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-5 blur-3xl"
            style={{
              background: "linear-gradient(135deg, #F7941D 0%, #2B2F92 100%)",
            }}
            variants={floatingVariants}
            animate="float"
            transition={{ delay: 1 }}
          />
        </div>

        <div className="content p-6 sm:p-10 w-full relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            {/* Header Section */}
            <motion.div
              className="text-center mb-12 sm:mb-16"
              variants={itemVariants}
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Menu
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Explore all the features and services available on Kundwa Health
              </motion.p>
            </motion.div>

            {/* User Profile Card (if logged in) */}
            {displayUser && (
              <motion.div
                className="mb-12 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                <motion.div
                  className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 border-2"
                  style={{ borderColor: "#F7941D" }}
                  whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <Avatar
                      src={displayUser.pic}
                      name={displayUser.name}
                      size="lg"
                      border="4px solid"
                      borderColor="#F7941D"
                      boxShadow="0 0 20px rgba(247, 148, 29, 0.3)"
                    />
                    <div className="flex-1">
                      <h3
                        className="text-xl sm:text-2xl font-bold mb-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {displayUser.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Welcome back! Continue your health journey.
                      </p>
                    </div>
                    {logoutHandler && (
                      <motion.button
                        onClick={logoutHandler}
                        className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #2B2F92 0%, #1e2266 100%)",
                          color: "#F7941D",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IoLogOutOutline />
                        Logout
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Main Navigation Section */}
            <motion.div
              className="mb-12 sm:mb-16"
              variants={itemVariants}
            >
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Main Navigation
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {mainNavLinks.map((link, index) => {
                  const Icon = link.icon;
                  const active = isActive(link.to);
                  return (
                    <motion.div
                      key={link.to}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ y: -10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link to={link.to} className="block h-full">
                        <motion.div
                          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 h-full border-2 transition-all duration-300 cursor-pointer"
                          style={{
                            borderColor: active ? link.color : "transparent",
                            boxShadow: active
                              ? `0 10px 30px ${link.color}40`
                              : "0 10px 30px rgba(0, 0, 0, 0.1)",
                          }}
                          whileHover={{
                            boxShadow: `0 15px 40px ${link.color}50`,
                            borderColor: link.color,
                          }}
                        >
                          <motion.div
                            className="mb-4"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Icon
                              className="text-4xl sm:text-5xl"
                              style={{ color: link.color }}
                            />
                          </motion.div>
                          <h3
                            className="text-xl sm:text-2xl font-bold mb-2"
                            style={{ color: link.color }}
                          >
                            {link.label}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            {link.description}
                          </p>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Services Navigation Section */}
            <motion.div
              className="mb-12 sm:mb-16"
              variants={itemVariants}
            >
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #2B2F92 0%, #1e2266 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Services & Features
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {serviceNavLinks.map((link, index) => {
                  const Icon = link.icon;
                  const active = isActive(link.to);
                  return (
                    <motion.div
                      key={link.to}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ y: -10, rotateY: 5 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        perspective: "1000px",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <Link to={link.to} className="block h-full">
                        <motion.div
                          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 h-full border-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
                          style={{
                            borderColor: active ? link.color : "transparent",
                            boxShadow: active
                              ? `0 10px 30px ${link.color}40`
                              : "0 10px 30px rgba(0, 0, 0, 0.1)",
                          }}
                          whileHover={{
                            boxShadow: `0 15px 40px ${link.color}50`,
                            borderColor: link.color,
                            rotateY: 5,
                          }}
                        >
                          <motion.div
                            className="mb-4"
                            whileHover={{ rotate: 15, scale: 1.15 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Icon
                              className="text-5xl sm:text-6xl"
                              style={{ color: link.color }}
                            />
                          </motion.div>
                          <h3
                            className="text-lg sm:text-xl font-bold mb-2"
                            style={{ color: link.color }}
                          >
                            {link.label}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm flex-1">
                            {link.description}
                          </p>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Additional Links Section */}
            <motion.div variants={itemVariants}>
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #F7941D 0%, #2B2F92 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Additional Resources
              </motion.h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {additionalLinks.map((link, index) => {
                  const Icon = link.icon;
                  const active = isActive(link.to);
                  return (
                    <motion.div
                      key={link.to}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to={link.to} className="block">
                        <motion.div
                          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 border-2 text-center transition-all duration-300 cursor-pointer"
                          style={{
                            borderColor: active ? link.color : "transparent",
                          }}
                          whileHover={{
                            borderColor: link.color,
                            boxShadow: `0 10px 25px ${link.color}40`,
                          }}
                        >
                          <Icon
                            className="text-3xl sm:text-4xl mx-auto mb-2"
                            style={{ color: link.color }}
                          />
                          <span
                            className="text-sm sm:text-base font-semibold block"
                            style={{ color: link.color }}
                          >
                            {link.label}
                          </span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Footer Section */}
            <motion.div
              className="mt-16 sm:mt-20 text-center"
              variants={itemVariants}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 border-2"
                style={{ borderColor: "#2B2F92" }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3
                  className="text-xl sm:text-2xl font-bold mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Get in Touch
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Have questions or need support? We're here to help!
                </p>
                <motion.a
                  href="mailto:info@kundwahealth.org"
                  className="text-[#2B2F92] dark:text-[#F7941D] font-semibold hover:underline inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  info@kundwahealth.org
                </motion.a>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
                  © Kundwa Health {new Date().getFullYear()} | Privacy Policy
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Menu;
