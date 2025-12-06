import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Spinner, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useBadgeStore } from "../../zustandStore/store";
import { useToast } from "@chakra-ui/react";
import axios from "../../config/axiosConfig";
import logo from "../../assets/LOGO FULL.png";
import { Image } from "@chakra-ui/react";

const AuthVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { login: authLogin } = useAuth();
  const setProfile = useBadgeStore((state) => state.setProfile);
  const setIsLoggedIn = useBadgeStore((state) => state.setIsLoggedIn);
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Authenticating User...");

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const spinnerColor = useColorModeValue("blue.500", "blue.300");

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Get all URL parameters
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const messageParam = searchParams.get("message");
        const error = searchParams.get("error");

        // Handle error case
        if (error) {
          setStatus("error");
          setMessage(error || "Authentication failed. Please try again.");
          toast({
            title: "Authentication Failed",
            description: error || "Please try logging in again.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        // Check if token exists
        if (!token) {
          setStatus("error");
          setMessage("No authentication token received. Please try again.");
          toast({
            title: "Authentication Error",
            description: "No token received from the authentication server.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        // Parse user data
        let userData = null;
        
        if (userParam) {
          try {
            // Try to parse as JSON (handle both encoded and raw)
            let parsedUser = userParam;
            
            // Check if it's URL encoded
            if (userParam.includes("%")) {
              parsedUser = decodeURIComponent(userParam);
            }
            
            // Try to parse as JSON
            try {
              userData = JSON.parse(parsedUser);
            } catch (e) {
              // If parsing fails, try treating it as a string that might be double-encoded
              try {
                userData = JSON.parse(decodeURIComponent(parsedUser));
              } catch (e2) {
                // If still fails, try one more decode
                try {
                  userData = JSON.parse(decodeURIComponent(decodeURIComponent(parsedUser)));
                } catch (e3) {
                  // If still fails, create a basic user object
                  console.warn("Could not parse user data as JSON, creating basic object");
                  userData = { email: parsedUser };
                }
              }
            }
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            // Create minimal user object
            userData = {};
          }
        } else {
          // If no user param, try to fetch user profile from backend using token
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
            
            const { data } = await axios.get(
              "https://chtv2-bn.onrender.com/api/v2/user/profile",
              config
            );
            userData = data;
          } catch (fetchError) {
            console.error("Error fetching user profile:", fetchError);
            // Continue with minimal user data
            userData = {};
          }
        }

        // Normalize user data structure
        // Handle different response structures:
        // 1. Direct user object from login: { token, email, role, ... }
        // 2. Nested structure from OAuth: { message, token, user: { email, role, user: {...} } }
        
        // If userData already has token and role, it's likely from regular login
        let normalizedUser;
        
        if (userData.token && userData.role) {
          // Direct login response structure
          normalizedUser = {
            ...userData,
            token: token, // Use token from URL params
          };
        } else {
          // OAuth response structure - extract nested user
          const userInfo = userData?.user?.user || userData?.user || userData;
          
          normalizedUser = {
            token: token,
            email: userData?.email || userInfo?.email,
            role: userData?.role || userInfo?.role,
            doctorStatus: userInfo?.doctorStatus,
            name: userInfo?.name,
            pic: userInfo?.pic,
            _id: userInfo?._id,
            ...userInfo,
          };
        }

        // Store in localStorage using the requested format
        try {
          // Store user object
          localStorage.setItem("cht_user", JSON.stringify(normalizedUser));
          
          // Store token separately
          localStorage.setItem("cht_token", token);
          
          // Also store in userInfo for backward compatibility
          localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
        } catch (storageError) {
          console.error("Error storing authentication data:", storageError);
          throw new Error("Failed to save authentication data");
        }

        // Update auth context and global state
        authLogin(normalizedUser);
        setProfile(normalizedUser);
        setIsLoggedIn(true);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("userLoggedIn"));

        setStatus("success");
        setMessage(messageParam || "Authentication successful! Redirecting...");

        toast({
          title: "Login Successful",
          description: "Welcome back!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });

        // Determine redirect path based on role
        const role = normalizedUser.role;
        const doctorStatus = normalizedUser.doctorStatus;

        let redirectPath = "/profile"; // Default

        if (role === "admin") {
          redirectPath = "/admin/dashboard";
        } else if (role === "doctor" && doctorStatus === "approved") {
          redirectPath = "/doctor/dashboard";
        } else if (role === "doctor" && doctorStatus !== "approved") {
          toast({
            title: "Account Pending",
            description: "Your doctor account is pending approval. Please contact admin.",
            status: "warning",
            duration: 7000,
            isClosable: true,
            position: "bottom",
          });
          redirectPath = "/profile";
        } else if (role === "patient") {
          redirectPath = "/profile";
        }

        // Redirect after a short delay
        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);

      } catch (error) {
        console.error("Error processing authentication:", error);
        setStatus("error");
        setMessage(error.message || "An error occurred during authentication. Please try again.");
        
        toast({
          title: "Authentication Error",
          description: error.message || "Please try logging in again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    processAuthCallback();
  }, [searchParams, navigate, toast, authLogin, setProfile, setIsLoggedIn]);

  // Container variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={itemVariants}
          className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 dark:border-slate-700/50"
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 blur-xl -z-10" />

          <VStack spacing={6} align="center">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image
                src={logo}
                alt="Logo"
                className="w-24 sm:w-28 h-auto"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
              />
            </motion.div>

            {/* Status indicator */}
            {status === "processing" && (
              <>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color={spinnerColor}
                  size="xl"
                />
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  color={textColor}
                  textAlign="center"
                >
                  {message}
                </Text>
              </>
            )}

            {status === "success" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  color="green.600"
                  textAlign="center"
                >
                  {message}
                </Text>
              </>
            )}

            {status === "error" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.div>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  color="red.600"
                  textAlign="center"
                >
                  {message}
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  textAlign="center"
                >
                  Redirecting to login page...
                </Text>
              </>
            )}
          </VStack>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthVerification;

