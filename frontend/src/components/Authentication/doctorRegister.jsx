import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  VStack,
  Image,
  Box,
  Textarea,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "../../config/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./signup.css";
import logo from "../../assets/LOGO FULL.png";
import { CgMail } from "react-icons/cg";
import { BiSolidLockAlt } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { FaUserMd, FaHospital, FaCertificate, FaDollarSign } from "react-icons/fa";
import { MdWork, MdDescription } from "react-icons/md";

const DoctorRegister = () => {
  const [show, SetShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [hospital, setHospital] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useNavigate();

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
    
    // Validation
    if (!name || !email || !password || !specialty || !bio || !certificateUrl || 
        !licenseNumber || !yearsOfExperience || !hospital || !consultationFee) {
      toast({
        description: "Please fill all required fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast({
        description: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (isNaN(yearsOfExperience) || parseInt(yearsOfExperience) < 0) {
      toast({
        description: "Years of experience must be a valid number",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (isNaN(consultationFee) || parseFloat(consultationFee) < 0) {
      toast({
        description: "Consultation fee must be a valid number",
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
        "https://chtv2-bn.onrender.com/api/doctor/register",
        {
          name,
          email,
          password,
          pic: pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
          specialty,
          bio,
          certificateUrl,
          licenseNumber,
          yearsOfExperience: parseInt(yearsOfExperience),
          hospital,
          consultationFee: parseFloat(consultationFee),
        },
        config
      );

      console.log("Doctor registration data:", data);

      toast({
        description: data.message || "Doctor registration successful! Your account is pending admin approval.",
        status: "success",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      history("/login");
    } catch (error) {
      console.log("Registration error:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response?.data);

      const errorMessage = error.response?.data?.message || "An error occurred during registration";

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

      {/* Main registration container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-2xl px-4 sm:px-6 lg:px-8"
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
          className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 dark:border-slate-700/50 max-h-[90vh] overflow-y-auto"
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
              Join as Doctor
            </motion.h1>
            <motion.p
              className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base"
              variants={itemVariants}
            >
              Register your medical practice and start helping patients
            </motion.p>
          </motion.div>

          <VStack spacing={4} align="stretch">
            {/* Name Input */}
            <motion.div variants={itemVariants}>
              <FormControl id="name" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={BsFillPersonFill}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Input
                    placeholder="Full Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                  />
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <FormControl id="email" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={CgMail}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                  />
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <FormControl id="password" isRequired>
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
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="pl-12 pr-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                  />
                  <InputRightElement width="4.5rem" className="pr-3">
                    <Button h="1.75rem" size="sm" onClick={handleClick} className="bg-transparent hover:bg-transparent">
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Specialty Input */}
            <motion.div variants={itemVariants}>
              <FormControl id="specialty" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={FaUserMd}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Input
                    placeholder="Specialty (e.g., Cardiology, Pediatrics)"
                    onChange={(e) => setSpecialty(e.target.value)}
                    value={specialty}
                    className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                  />
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Bio Textarea */}
            <motion.div variants={itemVariants}>
              <FormControl id="bio" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3 pt-2">
                    <Box
                      as={MdDescription}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Textarea
                    placeholder="Professional Bio"
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                    className="pl-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                    rows={3}
                  />
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Certificate URL */}
            <motion.div variants={itemVariants}>
              <FormControl id="certificateUrl" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={FaCertificate}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Input
                    placeholder="Certificate URL"
                    onChange={(e) => setCertificateUrl(e.target.value)}
                    value={certificateUrl}
                    className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                  />
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* License Number */}
            <motion.div variants={itemVariants}>
              <FormControl id="licenseNumber" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={FaCertificate}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Input
                    placeholder="License Number"
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    value={licenseNumber}
                    className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                  />
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Years of Experience */}
            <motion.div variants={itemVariants}>
              <FormControl id="yearsOfExperience" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={MdWork}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <NumberInput value={yearsOfExperience} min={0}>
                    <NumberInputField
                      placeholder="Years of Experience"
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </NumberInput>
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Hospital */}
            <motion.div variants={itemVariants}>
              <FormControl id="hospital" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={FaHospital}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Input
                    placeholder="Hospital/Clinic Name"
                    onChange={(e) => setHospital(e.target.value)}
                    value={hospital}
                    className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                  />
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Consultation Fee */}
            <motion.div variants={itemVariants}>
              <FormControl id="consultationFee" isRequired>
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={FaDollarSign}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <NumberInput value={consultationFee} min={0} precision={2}>
                    <NumberInputField
                      placeholder="Consultation Fee"
                      onChange={(e) => setConsultationFee(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </NumberInput>
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Profile Picture URL (Optional) */}
            <motion.div variants={itemVariants}>
              <FormControl id="pic">
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={BsFillPersonFill}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Input
                    placeholder="Profile Picture URL (Optional)"
                    onChange={(e) => setPic(e.target.value)}
                    value={pic}
                    className="pl-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                  />
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                colorScheme="blue"
                width="100%"
                style={{
                  marginTop: 15,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                onClick={submitHandler}
                isLoading={loading}
                className="h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Register as Doctor
              </Button>
            </motion.div>

            {/* Login Link */}
            <motion.div variants={itemVariants} className="text-center mt-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
                >
                  Login here
                </Link>
              </p>
            </motion.div>
          </VStack>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DoctorRegister;

