import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { useToast } from "@chakra-ui/react";
import logo from "../../assets/LOGO FULL.png";
import { CgMail } from "react-icons/cg";
import { BiSolidLockAlt } from "react-icons/bi";

const AuthVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated, loading } = useAuthStore();
  const setProfile = useAuthStore((state) => state.setUser);
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Authenticating User...");
  
  // Use ref to track if toast has already been shown (prevent duplicates)
  const toastShownRef = useRef(false);
  const processingStartedRef = useRef(false);

  // Role-based redirect: admin → admin dashboard, doctor (approved) → doctor dashboard, patient → profile
  // Accept optional user so we can use the profile response (userData) before store updates
  const getRoleRedirectPath = (userForRedirect = user) => {
    console.log("[AUTH VERIFICATION] Step 1: Now checking the role to redirect our Google auth");
    console.log("[AUTH VERIFICATION] Step 2: User for redirect:", userForRedirect ? { role: userForRedirect.role, doctorStatus: userForRedirect.doctorStatus, name: userForRedirect.name } : null);
    if (!userForRedirect) {
      console.log("[AUTH VERIFICATION] Step 3: No user → redirect to /login");
      return "/login";
    }
    if (userForRedirect.role === "admin") {
      console.log("[AUTH VERIFICATION] Step 3: Role is admin → redirect to /admin/dashboard");
      return "/admin/dashboard";
    }
    if (userForRedirect.role === "doctor" && userForRedirect.doctorStatus === "approved") {
      console.log("[AUTH VERIFICATION] Step 3: Role is doctor (approved) → redirect to /doctor/dashboard");
      return "/doctor/dashboard";
    }
    if (userForRedirect.role === "patient") {
      console.log("[AUTH VERIFICATION] Step 3: Role is patient → redirect to /profile");
      return "/profile";
    }
    console.log("[AUTH VERIFICATION] Step 3: Default → redirect to /profile");
    return "/profile";
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const spinnerColor = useColorModeValue("blue.500", "blue.300");

  // 3D card rotation effects
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    console.log("🍪 [AUTH VERIFICATION] Component mounted - checking cookie-based auth");
    console.log("[AUTH VERIFICATION] Timestamp:", new Date().toISOString());
    console.log("[AUTH VERIFICATION] Current user:", user);
    console.log("[AUTH VERIFICATION] Is authenticated:", isAuthenticated);
    
    // Prevent multiple executions - but if user is already in store, still redirect by role
    if (processingStartedRef.current) {
      console.log("[AUTH VERIFICATION] ⚠️ Processing already started, skipping duplicate execution");
      if (isAuthenticated && user) {
        console.log("[AUTH VERIFICATION] User already in store → now checking the role to redirect our Google auth (skip path)");
        const redirectPath = getRoleRedirectPath(user);
        console.log("[AUTH VERIFICATION] Step 4: Final redirect path (skip path):", redirectPath);
        navigate(redirectPath);
      }
      return;
    }

    processingStartedRef.current = true;
    
    const processAuthCallback = async () => {
      try {
        console.log("🔄 [AUTH VERIFICATION] Starting authentication callback processing...");
        console.log("[AUTH VERIFICATION] Timestamp:", new Date().toISOString());
        console.log("[AUTH VERIFICATION] Full URL:", window.location.href);
        console.log("[AUTH VERIFICATION] Pathname:", window.location.pathname);
        console.log("[AUTH VERIFICATION] Search params:", window.location.search);
        console.log("[AUTH VERIFICATION] Hash:", window.location.hash);
        
        // Extract URL parameters (only for error handling)
        console.log("[AUTH VERIFICATION] Extracting URL parameters...");
        const messageParam = searchParams.get("message");
        const error = searchParams.get("error");

        console.log("[AUTH VERIFICATION] URL Parameters Extracted:");
        console.log("[AUTH VERIFICATION] - Message:", messageParam);
        console.log("[AUTH VERIFICATION] - Error:", error);

        // Handle error case
        if (error) {
          setStatus("error");
          setMessage(error || "Authentication failed. Please try again.");
          toast({
            title: "Authentication Error",
            description: error || "Authentication failed. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        // If we have a user already authenticated via cookies, redirect to appropriate dashboard
        if (isAuthenticated && user) {
          console.log("✅ [AUTH VERIFICATION] User already authenticated via cookies");
          console.log("[AUTH VERIFICATION] Now checking the role to redirect our Google auth (from store)");
          setStatus("success");
          setMessage(`Welcome back, ${user.name}!`);
          
          const redirectPath = getRoleRedirectPath();
          console.log("[AUTH VERIFICATION] Step 4: Final redirect path:", redirectPath);
          
          setTimeout(() => {
            navigate(redirectPath);
          }, 2000);
          return;
        }

        // Handle cookie-based authentication (for OAuth callbacks)
        // For cookie-based OAuth, backend sets cookie and redirects here
        // We just need to verify the cookie works by calling profile endpoint
        console.log("🍪 [AUTH VERIFICATION] Verifying cookie-based authentication");
        setStatus("processing");
        setMessage("Verifying your session...");
        
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://chtv2-bn.onrender.com'}/api/auth/profile`, {
            method: 'GET',
            credentials: 'include', // ✅ Send cookies automatically
            // ❌ NO Authorization header - cookies handle auth
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log("✅ [AUTH VERIFICATION] Cookie authentication successful:", userData);
            console.log("[AUTH VERIFICATION] Now checking the role to redirect our Google auth (from profile response)");

            setStatus("success");
            setMessage(`Welcome back, ${userData.name}!`);

            setProfile(userData);

            // Use userData for redirect so we don't rely on store update (which is async)
            const redirectPath = getRoleRedirectPath(userData);
            console.log("[AUTH VERIFICATION] Step 4: Final redirect path:", redirectPath);

            setTimeout(() => {
              navigate(redirectPath);
            }, 2000);
          } else {
            throw new Error('Cookie validation failed');
          }
        } catch (authError) {
          console.error("❌ [AUTH VERIFICATION] Cookie authentication failed:", authError);
          setStatus("error");
          setMessage("Authentication failed. Please try logging in again.");
          
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        console.error("❌ [AUTH VERIFICATION] Callback processing failed:", error);
        setStatus("error");
        setMessage("An error occurred during authentication. Please try again.");
        
        if (!toastShownRef.current) {
          toast({
            title: "Authentication Error",
            description: "An error occurred during authentication. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          toastShownRef.current = true;
        }
        
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(processAuthCallback, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [searchParams, navigate, toast, isAuthenticated, user, setProfile]);

  // Container variants for page animations
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

  // Item variants for form elements
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

  // Floating blob animation variants
  const blobVariants = (delay = 0) => ({
    animate: {
      x: [0, 100, 0],
      y: [0, -100, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 20 + delay * 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
          variants={blobVariants(0)}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
          variants={blobVariants(1)}
          animate="animate"
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
          variants={blobVariants(2)}
          animate="animate"
        />
      </div>

      {/* Main auth verification container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 dark:border-slate-700/50"
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 blur-xl -z-10" />

          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex justify-center mb-4"
            >
              <Image
                src={logo}
                alt="Logo"
                className="w-32 sm:w-36 h-auto"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
              />
            </motion.div>
            <motion.h1
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
              variants={itemVariants}
            >
              Authentication
            </motion.h1>
            <motion.p
              className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base"
              variants={itemVariants}
            >
              Verifying your identity...
            </motion.p>
          </motion.div>

          <VStack spacing={6} align="center">
            {status === "processing" && (
              <>
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50"
                  >
                    <Spinner size="xl" color={spinnerColor} thickness="4px" />
                  </motion.div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Text fontSize="lg" color={textColor} textAlign="center">
                    {message}
                  </Text>
                </motion.div>
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
