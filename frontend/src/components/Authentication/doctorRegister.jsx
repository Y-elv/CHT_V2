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
  Text,
  Spinner,
  Center,
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
import { uploadImageToCloudinary } from "../../utils/imageUpload";

const DoctorRegister = () => {
  const [show, SetShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  // Handle image file selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary
  const handleImageUpload = async () => {
    console.log("🖼️ [Image Upload] Starting image upload process...");
    
    if (!selectedImage) {
      console.warn("⚠️ [Image Upload] No image selected!");
      toast({
        description: "Please select an image first!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    console.log("📁 [Image Upload] Image file details:", {
      name: selectedImage.name,
      type: selectedImage.type,
      size: `${(selectedImage.size / 1024).toFixed(2)} KB`,
    });

    console.log("🌐 [Image Upload] Checking network connectivity...");
    setUploadingImage(true);
    
    try {
      console.log("☁️ [Image Upload] Calling uploadImageToCloudinary function...");
      const imageUrl = await uploadImageToCloudinary(selectedImage);
      
      console.log("✅ [Image Upload] Image uploaded successfully!");
      console.log("🔗 [Image Upload] Cloudinary URL received:", imageUrl);
      
      setPic(imageUrl);
      console.log("💾 [Image Upload] Image URL saved to state (pic):", imageUrl);
      
      toast({
        description: "Image uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("❌ [Image Upload] Error occurred during upload:");
      console.error("   Error object:", error);
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
      
      // Check for network errors
      if (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to fetch")) {
        console.error("🌐 [Image Upload] Network error detected - check internet connection");
      }
      
      toast({
        description: error.message || "Failed to upload image. Please check your internet connection and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      console.log("🏁 [Image Upload] Upload process completed");
      setUploadingImage(false);
    }
  };

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
    console.log("🚀 [Registration] Starting registration process...");
    console.log("📋 [Registration] Form data:", {
      name,
      email,
      password: "***",
      specialty,
      bio: bio.substring(0, 50) + "...",
      certificateUrl,
      licenseNumber,
      yearsOfExperience,
      hospital,
      consultationFee,
      pic: pic ? "✅ Image URL set" : "❌ No image",
      selectedImage: selectedImage ? "✅ Image selected" : "❌ No image",
    });
    
    setLoading(true);
    
    // If image is selected but not uploaded, upload it first
    if (selectedImage && !pic) {
      console.log("📤 [Registration] Image selected but not uploaded. Uploading now...");
      try {
        setUploadingImage(true);
        console.log("☁️ [Registration] Uploading image to Cloudinary...");
        const imageUrl = await uploadImageToCloudinary(selectedImage);
        console.log("✅ [Registration] Image uploaded successfully:", imageUrl);
        setPic(imageUrl);
        console.log("💾 [Registration] Image URL saved to state");
        setUploadingImage(false);
      } catch (error) {
        console.error("❌ [Registration] Image upload failed:");
        console.error("   Error:", error);
        console.error("   Error message:", error.message);
        
        // Check for network errors
        if (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to fetch")) {
          console.error("🌐 [Registration] Network error detected during image upload");
        }
        
        toast({
          description: error.message || "Failed to upload image. Please check your internet connection and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        setUploadingImage(false);
        return;
      }
    } else if (pic) {
      console.log("✅ [Registration] Image already uploaded:", pic);
    } else {
      console.log("ℹ️ [Registration] No image selected, using default avatar");
    }
    
    // Validation
    console.log("✔️ [Registration] Validating form fields...");
    if (!name || !email || !password || !specialty || !bio || !certificateUrl || 
        !licenseNumber || !yearsOfExperience || !hospital || !consultationFee) {
      console.warn("⚠️ [Registration] Validation failed - missing required fields");
      console.warn("   Missing fields:", {
        name: !name,
        email: !email,
        password: !password,
        specialty: !specialty,
        bio: !bio,
        certificateUrl: !certificateUrl,
        licenseNumber: !licenseNumber,
        yearsOfExperience: !yearsOfExperience,
        hospital: !hospital,
        consultationFee: !consultationFee,
      });
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
    console.log("✅ [Registration] All required fields validated");

    console.log("🔐 [Registration] Validating password format...");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.warn("⚠️ [Registration] Password validation failed");
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
    console.log("✅ [Registration] Password format validated");

    console.log("🔢 [Registration] Validating numeric fields...");
    if (isNaN(yearsOfExperience) || parseInt(yearsOfExperience) < 0) {
      console.warn("⚠️ [Registration] Invalid years of experience:", yearsOfExperience);
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
      console.warn("⚠️ [Registration] Invalid consultation fee:", consultationFee);
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
    console.log("✅ [Registration] Numeric fields validated");

    try {
      console.log("🌐 [Registration] Checking network connectivity...");
      console.log("📡 [Registration] Preparing API request...");
      
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        timeout: 60000, // 60 seconds timeout for registration (longer for image processing)
      };
      console.log("📋 [Registration] Request headers:", config.headers);
      console.log("⏱️ [Registration] Request timeout set to:", config.timeout, "ms");

      // Prepare registration data with Cloudinary URL
      const registrationData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        pic: pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        specialty: specialty.trim(),
        bio: bio.trim(),
        certificateUrl: certificateUrl.trim(),
        licenseNumber: licenseNumber.trim(),
        yearsOfExperience: parseInt(yearsOfExperience),
        hospital: hospital.trim(),
        consultationFee: parseFloat(consultationFee),
      };

      // Validate data types before sending
      console.log("📤 [Registration] Sending registration request to API...");
      console.log("   URL: https://chtv2-bn.onrender.com/api/doctor/register");
      console.log("   Method: POST");
      console.log("   Data:", {
        ...registrationData,
        password: "***", // Don't log password
      });
      console.log("   Pic URL:", registrationData.pic);
      console.log("   Data types check:");
      console.log("     - yearsOfExperience:", typeof registrationData.yearsOfExperience, registrationData.yearsOfExperience);
      console.log("     - consultationFee:", typeof registrationData.consultationFee, registrationData.consultationFee);
      console.log("     - All strings trimmed:", Object.keys(registrationData).filter(k => k !== 'password' && k !== 'pic').every(k => typeof registrationData[k] === 'string' ? registrationData[k] === registrationData[k].trim() : true));

      const requestStartTime = Date.now();
      console.log("⏱️ [Registration] Request start time:", new Date().toISOString());

      const { data } = await axios.post(
        "https://chtv2-bn.onrender.com/api/doctor/register",
        registrationData,
        config
      );

      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;
      console.log("⏱️ [Registration] Request completed in", requestDuration, "ms");
      console.log("✅ [Registration] API response received successfully");
      console.log("📦 [Registration] Response data:", data);

      // Show success toast with API message
      console.log("🎉 [Registration] Registration successful!");
      console.log("📝 [Registration] Success message:", data.message);
      
      toast({
        title: "Registration Successful!",
        description: data.message || "Doctor registration successful! Your account is pending admin approval. You will be notified once approved.",
        status: "success",
        duration: 8000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      console.log("🔄 [Registration] Redirecting to login page in 2 seconds...");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        console.log("➡️ [Registration] Navigating to /login");
        history("/login");
      }, 2000);
    } catch (error) {
      const requestEndTime = Date.now();
      console.error("❌ [Registration] Error occurred during registration");
      console.error("   Error type:", error.constructor.name);
      console.error("   Error message:", error.message);
      console.error("   Error code:", error.code);
      console.error("   Error stack:", error.stack);
      
      // Network error detection
      if (error.message === "Network Error" || 
          error.message.includes("Network") || 
          error.message.includes("network") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("fetch") ||
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNABORTED") {
        console.error("🌐 [Registration] NETWORK ERROR DETECTED:");
        console.error("   - This usually means:");
        console.error("     1. No internet connection");
        console.error("     2. Server is down or unreachable");
        console.error("     3. CORS issue");
        console.error("     4. Firewall blocking the request");
        console.error("   - Check your internet connection");
        console.error("   - Verify the API endpoint is accessible");
      }
      
      // Timeout error
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.error("⏱️ [Registration] REQUEST TIMEOUT:");
        console.error("   - The request took too long to complete");
        console.error("   - Server might be slow or overloaded");
      }
      
      // HTTP error responses
      if (error.response) {
        console.error("📡 [Registration] HTTP Error Response:");
        console.error("   Status:", error.response.status);
        console.error("   Status Text:", error.response.statusText);
        console.error("   Headers:", error.response.headers);
        console.error("   Data:", error.response.data);
        
        // Log validation errors if present
        if (error.response.data?.errors) {
          console.error("   Validation Errors:", error.response.data.errors);
        }
        if (error.response.data?.details) {
          console.error("   Error Details:", error.response.data.details);
        }
      } else if (error.request) {
        console.error("📡 [Registration] Request was made but no response received:");
        console.error("   Request:", error.request);
        console.error("   - This usually indicates a network issue");
      }
      
      // Extract error message from API response with more details
      let errorMessage = "An error occurred during registration. Please check your internet connection and try again.";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        // Try multiple fields for error message
        errorMessage = errorData.message || 
                      errorData.error || 
                      errorData.details ||
                      error.message;
        
        // Add validation errors if present
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors.map(e => e.message || e).join(", ");
          errorMessage = `${errorMessage} ${validationErrors ? `(${validationErrors})` : ""}`;
        } else if (errorData.errors && typeof errorData.errors === 'object') {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(", ");
          errorMessage = `${errorMessage} ${validationErrors ? `(${validationErrors})` : ""}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("💬 [Registration] Error message to display:", errorMessage);

      toast({
        title: "Registration Failed",
        description: errorMessage,
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
      
      setLoading(false);
      console.log("🏁 [Registration] Registration process ended with error");
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
                      className="pl-14 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
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
                    className="pl-14 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
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
                      className="pl-14 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </NumberInput>
                </InputGroup>
              </FormControl>
            </motion.div>

            {/* Profile Picture Upload (Optional) */}
            <motion.div variants={itemVariants}>
              <FormControl id="pic">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Profile Picture (Optional)
                </label>
                
                {/* Image Preview */}
                {(imagePreview || pic) && (
                  <div className="mb-3 flex items-center gap-4">
                    <Image
                      src={imagePreview || pic}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                    />
                    {pic && (
                      <div className="flex-1">
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ✓ Image uploaded successfully
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* File Input */}
                <InputGroup className="group">
                  <InputLeftElement pointerEvents="none" className="pl-3">
                    <Box
                      as={BsFillPersonFill}
                      className="text-slate-700 dark:text-slate-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </InputLeftElement>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageSelect}
                    className="pl-14 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300"
                  />
                </InputGroup>
                
                {/* Upload Button */}
                {selectedImage && !pic && (
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={handleImageUpload}
                    isLoading={uploadingImage}
                    loadingText="Uploading..."
                    className="mt-2 w-full flex items-center justify-center gap-2"
                  >
                    {uploadingImage ? (
                      <>
                        <Spinner size="sm" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      "Upload Image"
                    )}
                  </Button>
                )}
              </FormControl>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                colorScheme="blue"
                width="100%"
                style={{
                  marginTop: 15,
                  background: loading 
                    ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                onClick={submitHandler}
                isLoading={loading}
                loadingText="Registering..."
                disabled={loading || uploadingImage}
                className="h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span>Registering...</span>
                  </>
                ) : (
                  "Register as Doctor"
                )}
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

