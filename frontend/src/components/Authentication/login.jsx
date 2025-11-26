import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  VStack,
  Box,
  Image,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "../../config/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./login.css";
import logo from "../../assets/LOGO FULL.png";
import { CgMail } from "react-icons/cg";
import { BiSolidLockAlt } from "react-icons/bi";
import { useBadgeStore } from "../../zustandStore/store";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [show, SetShow] = useState(false);
  const [loading, setLoading] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const toast = useToast();
  const setProfile = useBadgeStore((state) => state.setProfile);
  const profile = useBadgeStore((state) => state.profile);
  const setIsLoggedIn = useBadgeStore((state) => state.setIsLoggedIn);
  const { login: authLogin } = useAuth();
  const handleClick = () => SetShow(!show);

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

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        description: "Please fill all fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        " https://chtv2-bn.onrender.com/api/v2/user/login",
        {
          email,
          password,
        },
        config
      );
      console.log("Data received from login endpoint:", data);

      toast({
        description: "Login successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      // Update global auth state (also stores in localStorage)
      authLogin(data);
      setLoading(false);
      setIsLoggedIn(true);
      setProfile(data);

      // Role-based redirect
      const role = data.role;
      const doctorStatus = data.doctorStatus;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "doctor" && doctorStatus === "approved") {
        navigate("/doctor/dashboard");
      } else if (role === "doctor" && doctorStatus !== "approved") {
        toast({
          description: "Your doctor account is pending approval. Please contact admin.",
          status: "warning",
          duration: 7000,
          isClosable: true,
          position: "bottom",
        });
        // Don't navigate, stay on login page
      } else if (role === "patient") {
        navigate("/profile");
      } else {
        // Fallback to profile for unknown roles
        navigate("/profile");
      }
    } catch (error) {
      console.log("Login error:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response?.data);

      // Extract error message from the API response
      const errorMessage = error.response?.data?.message || "An error occurred";

      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  console.log("Zus Profile", profile);

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

      {/* Main login container */}
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
              Welcome Back
            </motion.h1>
            <motion.p
              className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base"
              variants={itemVariants}
            >
              Sign in to continue your journey
            </motion.p>
          </motion.div>

          <VStack spacing={6} align="stretch">
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <FormControl id="email" isRequired>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <InputGroup className="group">
                    <InputLeftElement pointerEvents="none" className="pl-3">
                      <Box
                        as={CgMail}
                        className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                      />
                    </InputLeftElement>
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      _focus={{
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                      }}
                      _hover={{
                        borderColor: "blue.400",
                      }}
                    />
                  </InputGroup>
                </motion.div>
              </FormControl>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <FormControl id="password" isRequired>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <InputGroup className="group">
                    <InputLeftElement pointerEvents="none" className="pl-3">
                      <Box
                        as={BiSolidLockAlt}
                        className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                      />
                    </InputLeftElement>
                    <Input
                      type={show ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-20 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      _focus={{
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                      }}
                      _hover={{
                        borderColor: "blue.400",
                      }}
                    />
                    <InputRightElement width="4.5rem" className="pr-2">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleClick}
                        className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors duration-200"
                        _hover={{
                          bg: "slate.100",
                        }}
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </motion.div>
              </FormControl>
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div variants={itemVariants} className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
              >
                Forgot Password?
              </Link>
            </motion.div>

            {/* Login Button */}
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={submitHandler}
                  width="100%"
                  isLoading={loading}
                  className="h-12 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-base shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-400/30"
                  style={{
                    background:
                      "linear-gradient(to right, #2563eb, #9333ea, #db2777)",
                  }}
                  _hover={{
                    background:
                      "linear-gradient(to right, #1d4ed8, #7e22ce, #be185d)",
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
                  }}
                  _loading={{
                    opacity: 0.7,
                  }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
            </motion.div>

            {/* Register Link */}
            <motion.div variants={itemVariants} className="text-center mt-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                New here?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  Register
                </Link>
              </p>
            </motion.div>
          </VStack>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
