import { useEffect, useRef } from "react";
import { Button } from "@chakra-ui/button";
import { Box, Image, VStack } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import logo from "../../assets/LOGO FULL.png";

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const autoNavigateRef = useRef(true);

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

  const handleContinue = () => {
    autoNavigateRef.current = false;
    navigate("/login");
  };

  // Auto-navigate after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoNavigateRef.current) {
        navigate("/login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Container variants for page animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Check icon animation variants
  const checkIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        repeat: 1,
        ease: "easeInOut",
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

  // Celebration particles animation
  const particleVariants = (delay = 0) => ({
    initial: { scale: 0, opacity: 1, x: 0, y: 0 },
    animate: {
      scale: [0, 1, 0],
      opacity: [1, 1, 0],
      x: [0, Math.random() * 200 - 100],
      y: [0, Math.random() * 200 - 100],
      transition: {
        duration: 1.5,
        delay,
        ease: "easeOut",
      },
    },
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-emerald-900 dark:to-green-900">
      {/* Enhanced animated background blobs with celebration colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full blur-3xl"
          variants={blobVariants(0)}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl"
          variants={blobVariants(1)}
          animate="animate"
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl"
          variants={blobVariants(2)}
          animate="animate"
        />
      </div>

      {/* Celebration particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full"
          variants={particleVariants(i * 0.1)}
          initial="initial"
          animate="animate"
          style={{
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Main success container */}
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
          {/* Enhanced glow effect with celebration colors */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 opacity-60 blur-xl -z-10" />

          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex justify-center mb-6"
            >
              <Image
                src={logo}
                alt="Logo"
                className="w-32 sm:w-36 h-auto"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
              />
            </motion.div>

            {/* Animated Check Icon */}
            <motion.div
              className="flex justify-center mb-6"
              variants={itemVariants}
            >
              <motion.div
                variants={checkIconVariants}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                >
                  <FaCheckCircle className="text-7xl sm:text-8xl text-green-500 dark:text-green-400" />
                </motion.div>
                {/* Glowing ring around check */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-green-400/50"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 mb-3"
              variants={itemVariants}
            >
              Email Verified!
            </motion.h1>
            <motion.p
              className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base"
              variants={itemVariants}
            >
              Your email <span className="font-semibold">{email || "has been verified"}</span> successfully.
              <br />
              You can now sign in to your account.
            </motion.p>
          </motion.div>

          <VStack spacing={6} align="stretch">
            {/* Continue Button */}
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={handleContinue}
                  width="100%"
                  className="h-12 rounded-xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-semibold text-base shadow-lg shadow-green-500/30 dark:shadow-green-400/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40 dark:hover:shadow-green-400/30"
                  style={{
                    background: "linear-gradient(to right, #16a34a, #10b981, #14b8a6)",
                  }}
                  _hover={{
                    background: "linear-gradient(to right, #15803d, #059669, #0d9488)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.4), 0 10px 10px -5px rgba(34, 197, 94, 0.2)",
                  }}
                >
                  Continue to Login
                </Button>
              </motion.div>
            </motion.div>

            {/* Auto-redirect countdown */}
            <motion.div
              variants={itemVariants}
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Redirecting automatically in a few seconds...
              </p>
            </motion.div>
          </VStack>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerificationSuccess;

