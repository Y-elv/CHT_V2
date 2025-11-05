import { useState, useRef, useEffect } from "react";
import { Button } from "@chakra-ui/button";
import { useToast, Box, Image, VStack } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import logo from "../../assets/LOGO FULL.png";
import axios from "../../config/axiosConfig";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();
  const inputRefs = useRef([]);

  // Get email from location state or use a default
  const email = location.state?.email || "";

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

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      toast({
        description: "Please register first to receive an OTP code.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      navigate("/register");
    }
  }, [email, navigate, toast]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        digits.split("").forEach((digit, i) => {
          if (i < 6) {
            newOtp[i] = digit;
          }
        });
        setOtp(newOtp);
        const lastFilledIndex = Math.min(digits.length - 1, 5);
        inputRefs.current[lastFilledIndex]?.focus();
      });
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast({
        description: "Please enter the complete 6-digit OTP code",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://chtv2-bn.onrender.com/api/v2/user/verify-otp",
        {
          email,
          otp: otpCode,
        },
        config
      );

      toast({
        description: "OTP verified successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      // Navigate to verification success page
      navigate("/verification-success", { state: { email } });
    } catch (error) {
      console.log("OTP verification error:", error);
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      await axios.post(
        "https://chtv2-bn.onrender.com/api/v2/user/resend-otp",
        { email },
        config
      );

      toast({
        description: "OTP resent successfully! Check your email.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      setResendCooldown(60); // 60 second cooldown
      setIsResending(false);
    } catch (error) {
      console.log("Resend OTP error:", error);
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsResending(false);
    }
  };

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

  // Input box animation variants
  const inputVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -90 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    }),
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

      {/* Main OTP container */}
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
              Verify Your Email
            </motion.h1>
            <motion.p
              className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base"
              variants={itemVariants}
            >
              We've sent a 6-digit code to <span className="font-semibold">{email || "your email"}</span>
            </motion.p>
          </motion.div>

          <VStack spacing={6} align="stretch">
            {/* OTP Input Boxes */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-2 sm:gap-3 mb-4"
            >
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileFocus={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 focus:scale-110 text-slate-800 dark:text-slate-100"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Verify Button */}
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={handleSubmit}
                  width="100%"
                  isLoading={loading}
                  className="h-12 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-base shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-400/30"
                  style={{
                    background: "linear-gradient(to right, #2563eb, #9333ea, #db2777)",
                  }}
                  _hover={{
                    background: "linear-gradient(to right, #1d4ed8, #7e22ce, #be185d)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
                  }}
                  _loading={{
                    opacity: 0.7,
                  }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </motion.div>
            </motion.div>

            {/* Resend OTP Button */}
            <motion.div variants={itemVariants} className="text-center">
              <motion.button
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isResending}
                whileHover={resendCooldown === 0 && !isResending ? { scale: 1.05 } : {}}
                whileTap={resendCooldown === 0 && !isResending ? { scale: 0.95 } : {}}
                animate={
                  resendCooldown === 0 && !isResending
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 0 8px rgba(59, 130, 246, 0)",
                        ],
                      }
                    : {}
                }
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className={`text-sm font-medium transition-colors duration-200 ${
                  resendCooldown > 0 || isResending
                    ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                }`}
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </motion.button>
            </motion.div>
          </VStack>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OTP;

