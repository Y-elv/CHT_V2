import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useBadgeStore } from "../../zustandStore/store";
import { useToast } from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import { extractUserFromToken } from "../../utils/tokenUtils";
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
  
  // Use ref to track if toast has already been shown (prevent duplicates)
  const toastShownRef = useRef(false);
  const processingStartedRef = useRef(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const spinnerColor = useColorModeValue("blue.500", "blue.300");

  useEffect(() => {
    // ============================================
    // [AUTH][CALLBACK] Component Mount Detection
    // ============================================
    console.log("============================================");
    console.log("[AUTH][CALLBACK] AuthVerification component mounted");
    console.log("[AUTH][CALLBACK] Timestamp:", new Date().toISOString());
    console.log("[AUTH][CALLBACK] Component render count check");
    
    // Prevent multiple executions
    if (processingStartedRef.current) {
      console.log("[AUTH][CALLBACK] ⚠️ Processing already started, skipping duplicate execution");
      return;
    }
    
    processingStartedRef.current = true;
    
    const processAuthCallback = async () => {
      try {
        // ============================================
        // [AUTH][CALLBACK] Starting Callback Processing
        // ============================================
        console.log("============================================");
        console.log("[AUTH][CALLBACK] Starting authentication callback processing...");
        console.log("[AUTH][CALLBACK] Timestamp:", new Date().toISOString());
        console.log("[AUTH][CALLBACK] Full URL:", window.location.href);
        console.log("[AUTH][CALLBACK] Pathname:", window.location.pathname);
        console.log("[AUTH][CALLBACK] Search params:", window.location.search);
        console.log("[AUTH][CALLBACK] Hash:", window.location.hash);
        
        // ============================================
        // [AUTH][CALLBACK] Extract URL Parameters
        // ============================================
        console.log("[AUTH][CALLBACK] Extracting URL parameters...");
        let token = searchParams.get("token");
        // Trim token immediately to remove any whitespace or URL encoding artifacts
        if (token) {
          token = token.trim();
        }
        const userParam = searchParams.get("user");
        const messageParam = searchParams.get("message");
        const error = searchParams.get("error");

        console.log("[AUTH][CALLBACK] URL Parameters Extracted:");
        console.log("[AUTH][CALLBACK] - Token exists:", !!token);
        console.log("[AUTH][CALLBACK] - Token length:", token?.length || 0);
        console.log("[AUTH][CALLBACK] - Token preview:", token ? `${token.substring(0, 20)}...` : "N/A");
        console.log("[AUTH][CALLBACK] - Full token:", token);
        console.log("[AUTH][CALLBACK] - User param exists:", !!userParam);
        console.log("[AUTH][CALLBACK] - User param length:", userParam?.length || 0);
        console.log("[AUTH][CALLBACK] - User param preview:", userParam ? `${userParam.substring(0, 50)}...` : "N/A");
        console.log("[AUTH][CALLBACK] - Message:", messageParam);
        console.log("[AUTH][CALLBACK] - Error:", error);

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

        // ============================================
        // [AUTH][CALLBACK] BEFORE Token Storage
        // ============================================
        console.log("[AUTH][CALLBACK] ===== BEFORE SAVING TOKEN =====");
        console.log("[AUTH][CALLBACK] Token from URL:", token);
        console.log("[AUTH][CALLBACK] Token length:", token?.length);
        console.log("[AUTH][CALLBACK] Checking localStorage BEFORE save:");
        const tokenBefore = localStorage.getItem("token");
        const chtTokenBefore = localStorage.getItem("cht_token");
        const userInfoBefore = localStorage.getItem("userInfo");
        console.log("[AUTH][CALLBACK] - Existing 'token':", !!tokenBefore);
        console.log("[AUTH][CALLBACK] - Existing 'cht_token':", !!chtTokenBefore);
        console.log("[AUTH][CALLBACK] - Existing 'userInfo':", !!userInfoBefore);
        
        // Save token to localStorage as "token"
        // Ensure token is trimmed before saving
        const cleanToken = token.trim();
        console.log("[AUTH][CALLBACK] Saving token to localStorage as 'token'...");
        console.log("[AUTH][CALLBACK] Token length before trim:", token.length);
        console.log("[AUTH][CALLBACK] Token length after trim:", cleanToken.length);
        console.log("[AUTH][CALLBACK] Token starts with 'eyJ':", cleanToken.startsWith('eyJ'));
        localStorage.setItem("token", cleanToken);
        
        // ============================================
        // [AUTH][CALLBACK] AFTER Token Storage
        // ============================================
        console.log("[AUTH][CALLBACK] ===== AFTER SAVING TOKEN =====");
        const savedToken = localStorage.getItem("token");
        console.log("[AUTH][CALLBACK] Token retrieved after save:", savedToken);
        console.log("[AUTH][CALLBACK] Token length after save:", savedToken?.length);
        console.log("[AUTH][CALLBACK] Tokens match:", token === savedToken);
        console.log("[AUTH][CALLBACK] Token saved successfully:", !!savedToken);

        // Decode token to extract user information
        let decoded;
        try {
          console.log("🔓 [Token Decode] Starting JWT decode...");
          console.log("🔓 [Token Decode] Token BEFORE decode:", token);
          const fullDecoded = jwtDecode(token);
          console.log("🔓 [Token Decode] Full decoded token:", JSON.stringify(fullDecoded, null, 2));
          decoded = fullDecoded.id || fullDecoded;
          console.log("🔓 [Token Decode] Extracted decoded.id:", decoded);
          console.log("🔓 [Token Decode] All keys in decoded token:", Object.keys(fullDecoded));

          // Log all possible paths to user data
          console.log("   - decoded.email:", decoded.email);
          console.log("   - decoded.role:", decoded.role);
          console.log("   - decoded.user:", decoded.user);
          console.log("   - decoded.user?.name:", decoded.user?.name);
          console.log("   - decoded.user?.pic:", decoded.user?.pic);
          console.log("   - decoded.user?._id:", decoded.user?._id);
          console.log("   - decoded.id?.user:", decoded.id?.user);
          console.log("   - decoded.id?.user?.name:", decoded.id?.user?.name);
          console.log("   - decoded.doctorStatus:", decoded.doctorStatus);
          console.log(
            "   - decoded.user?.doctorStatus:",
            decoded.user?.doctorStatus
          );
        } catch (decodeError) {
          console.error("❌ Error decoding token:", decodeError);
          setStatus("error");
          setMessage("Invalid token. Please try logging in again.");
          toast({
            title: "Authentication Error",
            description: "Invalid token format.",
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

        // Extract user information - prioritize URL param, then token
        let userInfo = {
          token: token,
        };

        // First, try to get user data from URL parameter (most reliable)
        if (userParam) {
          console.log("📦 Parsing user data from URL parameter...");
          try {
            let parsedUser = userParam;
            // Handle URL encoding
            if (userParam.includes("%")) {
              parsedUser = decodeURIComponent(userParam);
            }

            // Try to parse as JSON
            let urlUserData;
            try {
              urlUserData = JSON.parse(parsedUser);
            } catch (e1) {
              // Try double decode
              try {
                urlUserData = JSON.parse(decodeURIComponent(parsedUser));
              } catch (e2) {
                // Try one more time
                urlUserData = JSON.parse(
                  decodeURIComponent(decodeURIComponent(parsedUser))
                );
              }
            }

            console.log("✅ User data from URL param:", urlUserData);

            // Extract user data - handle both flat and nested structures
            if (urlUserData.user && typeof urlUserData.user === "object") {
              // Nested structure: { user: { name, email, ... } }
              userInfo = {
                ...userInfo,
                email: urlUserData.user.email || urlUserData.email,
                role: urlUserData.user.role || urlUserData.role,
                name: urlUserData.user.name,
                pic: urlUserData.user.pic,
                _id: urlUserData.user._id,
                doctorStatus: urlUserData.user.doctorStatus,
              };
            } else {
              // Flat structure: { email, role, name, ... }
              userInfo = {
                ...userInfo,
                email: urlUserData.email,
                role: urlUserData.role,
                name: urlUserData.name,
                pic: urlUserData.pic,
                _id: urlUserData._id,
                doctorStatus: urlUserData.doctorStatus,
              };
            }
          } catch (parseError) {
            console.error("❌ Error parsing user param:", parseError);
          }
        }

        // If we still don't have user data, try to extract from decoded token
        if ((!userInfo.email || !userInfo.role) && decoded) {
          console.log(
            "⚠️ Missing user data from URL, trying to extract from token..."
          );
          // Handle different possible token structures:
          // 1. decoded.email, decoded.role, decoded.user.name, decoded.user.pic, decoded.user._id
          // 2. decoded.id.user (nested structure)
          // 3. decoded.email, decoded.role, decoded.name, decoded.pic, decoded._id (flat structure)

          userInfo = {
            ...userInfo,
            email:
              userInfo.email ||
              decoded.email ||
              decoded.id?.user?.email ||
              decoded.user?.email,
            role:
              userInfo.role ||
              decoded.role ||
              decoded.id?.user?.role ||
              decoded.user?.role,
            name:
              userInfo.name ||
              decoded.user?.name ||
              decoded.id?.user?.name ||
              decoded.name,
            pic:
              userInfo.pic ||
              decoded.user?.pic ||
              decoded.id?.user?.pic ||
              decoded.pic,
            _id:
              userInfo._id ||
              decoded.user?._id ||
              decoded.id?.user?._id ||
              decoded._id ||
              decoded.id?.user?.id,
            doctorStatus:
              userInfo.doctorStatus ||
              decoded.user?.doctorStatus ||
              decoded.id?.user?.doctorStatus ||
              decoded.doctorStatus,
          };
        }

        console.log("👤 Final Extracted User Info:");
        console.log("   - Email:", userInfo.email);
        console.log("   - Role:", userInfo.role);
        console.log("   - Name:", userInfo.name);
        console.log("   - Pic:", userInfo.pic);
        console.log("   - ID:", userInfo._id);
        console.log("   - DoctorStatus:", userInfo.doctorStatus);

        // Create normalized user object for storage
        const normalizedUser = {
          ...userInfo,
          // Ensure all required fields are present
          email: userInfo.email,
          role: userInfo.role,
          name: userInfo.name,
          pic: userInfo.pic,
          _id: userInfo._id,
        };

        console.log("📦 Normalized User Object:", normalizedUser);

        // Validate that we have at least email and role
        if (!normalizedUser.email || !normalizedUser.role) {
          console.error("❌ Missing required fields (email or role)");
          setStatus("error");
          setMessage(
            "Unable to extract user information from token. Please try logging in again."
          );
          toast({
            title: "Authentication Error",
            description: "Missing user information in token.",
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

        // Store in localStorage (multiple formats for compatibility)
        try {
          console.log("💾 [LocalStorage Write] Starting localStorage writes...");
          
          // Store login time for fresh login detection
          sessionStorage.setItem("lastLoginTime", Date.now().toString());
          console.log("💾 [LocalStorage Write] Stored login time:", new Date().toISOString());
          
          // Store token as "token" (primary) - ensure it's trimmed
          const cleanTokenForStorage = token.trim();
          console.log("💾 [LocalStorage Write] Writing 'token':", cleanTokenForStorage?.substring(0, 20) + "...");
          console.log("💾 [LocalStorage Write] Full token BEFORE storage:", cleanTokenForStorage);
          console.log("💾 [LocalStorage Write] Token starts with 'eyJ':", cleanTokenForStorage.startsWith('eyJ'));
          localStorage.setItem("token", cleanTokenForStorage);
          const verifyToken = localStorage.getItem("token");
          console.log("💾 [LocalStorage Write] Verified 'token' stored:", !!verifyToken, "Length:", verifyToken?.length);
          console.log("💾 [LocalStorage Write] Full token AFTER storage:", verifyToken);
          console.log("💾 [LocalStorage Write] Tokens match:", cleanTokenForStorage === verifyToken);
          console.log("💾 [LocalStorage Write] Stored token starts with 'eyJ':", verifyToken?.startsWith('eyJ'));

          // Store user object
          console.log("💾 [LocalStorage Write] Writing 'cht_user':", normalizedUser);
          localStorage.setItem("cht_user", JSON.stringify(normalizedUser));
          const verifyChtUser = localStorage.getItem("cht_user");
          console.log("💾 [LocalStorage Write] Verified 'cht_user' stored:", !!verifyChtUser);

          // Store token separately (for backward compatibility)
          console.log("💾 [LocalStorage Write] Writing 'cht_token':", token?.substring(0, 20) + "...");
          localStorage.setItem("cht_token", token);
          const verifyChtToken = localStorage.getItem("cht_token");
          console.log("💾 [LocalStorage Write] Verified 'cht_token' stored:", !!verifyChtToken);

          // Also store in userInfo for backward compatibility
          console.log("💾 [LocalStorage Write] Writing 'userInfo':", normalizedUser);
          localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
          const verifyUserInfo = localStorage.getItem("userInfo");
          console.log("💾 [LocalStorage Write] Verified 'userInfo' stored:", !!verifyUserInfo);
          
          console.log("✅ [LocalStorage Write] All localStorage writes completed");
        } catch (storageError) {
          console.error("❌ [LocalStorage Write] Error storing authentication data:", storageError);
          throw new Error("Failed to save authentication data");
        }

        // ============================================
        // [AUTH][CALLBACK] BEFORE Auth State Update
        // ============================================
        console.log("[AUTH][CALLBACK] ===== BEFORE AUTH STATE UPDATE =====");
        console.log("[AUTH][CALLBACK] Normalized user object:", normalizedUser);
        console.log("[AUTH][CALLBACK] User email:", normalizedUser.email);
        console.log("[AUTH][CALLBACK] User role:", normalizedUser.role);
        console.log("[AUTH][CALLBACK] User token exists:", !!normalizedUser.token);
        
        // Update auth context and global state (Zustand)
        console.log("[AUTH][CALLBACK] Updating auth context and global state...");
        console.log("[AUTH][CALLBACK] Step 1: Calling authLogin()...");
        const loginResult = authLogin(normalizedUser);
        console.log("[AUTH][CALLBACK] authLogin() result:", loginResult);
        
        console.log("[AUTH][CALLBACK] Step 2: Calling setProfile()...");
        setProfile(normalizedUser);
        
        console.log("[AUTH][CALLBACK] Step 3: Calling setIsLoggedIn(true)...");
        setIsLoggedIn(true);
        
        // ============================================
        // [AUTH][CALLBACK] AFTER Auth State Update
        // ============================================
        console.log("[AUTH][CALLBACK] ===== AFTER AUTH STATE UPDATE =====");
        console.log("[AUTH][CALLBACK] Verifying localStorage after state update:");
        const tokenAfter = localStorage.getItem("token");
        const chtTokenAfter = localStorage.getItem("cht_token");
        const userInfoAfter = localStorage.getItem("userInfo");
        const chtUserAfter = localStorage.getItem("cht_user");
        console.log("[AUTH][CALLBACK] - 'token' exists:", !!tokenAfter);
        console.log("[AUTH][CALLBACK] - 'cht_token' exists:", !!chtTokenAfter);
        console.log("[AUTH][CALLBACK] - 'userInfo' exists:", !!userInfoAfter);
        console.log("[AUTH][CALLBACK] - 'cht_user' exists:", !!chtUserAfter);
        console.log("[AUTH][CALLBACK] Auth state update completed successfully");

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("userLoggedIn"));
        console.log("📢 Dispatched 'userLoggedIn' event");

        setStatus("success");
        setMessage("Authentication successful! Redirecting...");

        // Show only one toast for login success (prevent duplicates)
        if (!toastShownRef.current) {
          console.log("🎉 [Auth Callback] Showing login success toast");
          toastShownRef.current = true;
          toast({
            title: "Login Successful",
            description: "Welcome back!",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom",
            id: "login-success-toast", // Unique ID to prevent duplicates
          });
        } else {
          console.log("⚠️ [Auth Callback] Toast already shown, skipping duplicate");
        }

        // Determine redirect path based on role
        const role = normalizedUser.role;
        const doctorStatus = normalizedUser.doctorStatus;

        console.log("🧭 Determining redirect path:");
        console.log("   - User Role:", role);
        console.log("   - Doctor Status:", doctorStatus);

        let redirectPath = "/profile"; // Default

        if (role === "admin") {
          redirectPath = "/admin/dashboard";
          console.log("   ✅ Redirecting to: /admin/dashboard (Admin)");
        } else if (role === "doctor") {
          if (doctorStatus === "approved") {
            redirectPath = "/doctor/dashboard";
            console.log(
              "   ✅ Redirecting to: /doctor/dashboard (Approved Doctor)"
            );
          } else {
            redirectPath = "/profile";
            console.log(
              "   ⚠️ Redirecting to: /profile (Doctor pending approval)"
            );
          }
        } else if (role === "patient") {
          redirectPath = "/profile";
          console.log("   ✅ Redirecting to: /profile (Patient)");
        } else {
          console.log("   ⚠️ Unknown role, defaulting to: /profile");
        }

        console.log("[AUTH][CALLBACK] Final redirect path:", redirectPath);

        // ============================================
        // [AUTH][CALLBACK] BEFORE Navigation
        // ============================================
        console.log("[AUTH][CALLBACK] ===== BEFORE NAVIGATION =====");
        console.log("[AUTH][CALLBACK] Current URL:", window.location.href);
        console.log("[AUTH][CALLBACK] Target path:", redirectPath);
        console.log("[AUTH][CALLBACK] Verifying token exists before navigation:");
        const tokenBeforeNav = localStorage.getItem("token");
        console.log("[AUTH][CALLBACK] - Token exists:", !!tokenBeforeNav);
        console.log("[AUTH][CALLBACK] - Token length:", tokenBeforeNav?.length || 0);
        console.log("[AUTH][CALLBACK] Waiting 1500ms before navigation...");

        // Redirect after a short delay
        setTimeout(() => {
          console.log("[AUTH][CALLBACK] ===== NAVIGATING NOW =====");
          console.log("[AUTH][CALLBACK] Timestamp:", new Date().toISOString());
          console.log("[AUTH][CALLBACK] Navigating to:", redirectPath);
          console.log("[AUTH][CALLBACK] Final token check before navigate():");
          const finalToken = localStorage.getItem("token");
          console.log("[AUTH][CALLBACK] - Token exists:", !!finalToken);
          console.log("[AUTH][CALLBACK] - Token:", finalToken ? `${finalToken.substring(0, 30)}...` : "null");
          navigate(redirectPath);
          console.log("[AUTH][CALLBACK] navigate() called");
        }, 1500);
      } catch (error) {
        console.error("Error processing authentication:", error);
        setStatus("error");
        setMessage(
          error.message ||
            "An error occurred during authentication. Please try again."
        );

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
    
    // Cleanup function
    return () => {
      console.log("[AUTH][CALLBACK] AuthVerification component cleanup/unmount");
      console.log("[AUTH][CALLBACK] Checking token after unmount:");
      const tokenAfterUnmount = localStorage.getItem("token");
      console.log("[AUTH][CALLBACK] - Token exists:", !!tokenAfterUnmount);
      // Reset refs if component unmounts (shouldn't happen, but safety measure)
      // Don't reset here as we want to prevent duplicates even on re-renders
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]); // Only depend on searchParams - other functions are stable
  
  // ============================================
  // [AUTH][RENDER] Component Lifecycle
  // ============================================
  useEffect(() => {
    console.log("[AUTH][RENDER] AuthVerification component mounted");
    return () => {
      console.log("[AUTH][RENDER] AuthVerification component unmounted");
    };
  }, []);

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
                <Text fontSize="sm" color="gray.500" textAlign="center">
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
