import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import "./animate.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../../config/axiosConfig";
import { useToast } from "@chakra-ui/react";
import Image1 from "../../assets/Background1.svg";
import Image2 from "../../assets/Background2.svg";
import Image3 from "../../assets/Background3.svg";
import Kigali from "../../assets/Kigali city.jpeg";
import { MdLocalPharmacy } from "react-icons/md";
import { RiMentalHealthFill } from "react-icons/ri";
import { MdHealthAndSafety } from "react-icons/md";
import { useBadgeStore } from "../../zustandStore/store";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const profile = useBadgeStore((state) => state.profile) || null;
  const ImageArray = [Image1, Image2, Image3];
  const ImageArray2 = [
    {
      url: Image1,
      title: "Welcome to FunHealth",
      text: "Welcome to FunHealth, where we provide comprehensive care and support to keep your mind and body healthy.",
      buttonText: "Learn More",
    },
    {
      url: Image2,
      title: "Mental Wellness",
      text: "Explore our resources and activities designed to boost your mental health and well-being.",
      buttonText: "Explore",
    },
    {
      url: Image3,
      title: "Your Health, Our Priority",
      text: "Discover how we make healthcare simple and accessible, supporting your journey to a healthier life.",
      buttonText: "Get Started",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    companyName: "",
    street: "",
    phone: "",
    email: "",
    idea: "",
    agree: false,
  });

  // Refs for 3D card effects
  const serviceCardRefs = useRef([]);
  const contactCardRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ImageArray.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ImageArray.length]);

  useEffect(() => {
    if (profile) navigate("/profile");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.street ||
      !formData.phone ||
      !formData.email ||
      !formData.idea
    ) {
      toast({
        description: "Please fill in all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        description: "Invalid email format",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!formData.agree) {
      toast({
        description: "Please agree to the terms",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const response = await axios.post(
        " https://chtv2-bn.onrender.com/api/v2/user/getInTouch",
        formData
      );

      setFormData({
        companyName: "",
        street: "",
        phone: "",
        email: "",
        idea: "",
        agree: false,
      });

      toast({
        description: "Form submitted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error submitting the form";
      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

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

  // 3D card effect hook
  const use3DCard = (ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
      stiffness: 300,
      damping: 30,
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), {
      stiffness: 300,
      damping: 30,
    });

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
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

    return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
  };

  // Contact form card with 3D effect
  const contactCard3D = use3DCard(contactCardRef);

  return (
    <div className="relative w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-[#F7941D]/20 to-orange-400/20 rounded-full blur-3xl"
          variants={blobVariants(0)}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#2B2F92]/20 to-purple-400/20 rounded-full blur-3xl"
          variants={blobVariants(1)}
          animate="animate"
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#F7941D]/10 to-[#2B2F92]/10 rounded-full blur-3xl"
          variants={blobVariants(2)}
          animate="animate"
        />
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${ImageArray2[currentImageIndex].url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2B2F92]/80 via-[#2B2F92]/70 to-[#F7941D]/60" />
          </motion.div>

          <motion.div
            key={`content-${currentImageIndex}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {ImageArray2[currentImageIndex].title}
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {ImageArray2[currentImageIndex].text}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const section = document.querySelector(".services-section");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 bg-gradient-to-r from-[#F7941D] to-[#FFA84D] hover:from-[#FFA84D] hover:to-[#F7941D] text-white font-semibold rounded-full text-lg shadow-lg shadow-[#F7941D]/30 hover:shadow-xl hover:shadow-[#F7941D]/50 transition-all duration-300"
              >
                {ImageArray2[currentImageIndex].buttonText}
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slider indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {ImageArray2.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section relative py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#2B2F92] to-[#F7941D] bg-clip-text text-transparent"
          >
            Our Services
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-center mb-12 text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[#2B2F92] via-[#F7941D] to-[#2B2F92] bg-clip-text text-transparent"
          >
            Comprehensive healthcare solutions for your well-being
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: MdLocalPharmacy,
                title: "Pharmacy",
                description:
                  "Access essential medications and expert advice to support your health, ensuring you receive the care you need.",
                gradient: "from-[#F7941D] to-[#FFA84D]",
              },
              {
                icon: RiMentalHealthFill,
                title: "Mental Support",
                description:
                  "We offer resources and guidance to help you achieve mental wellness, fostering resilience and emotional balance.",
                gradient: "from-[#2B2F92] to-[#1e2266]",
              },
              {
                icon: MdHealthAndSafety,
                title: "Health Care",
                description:
                  "In FunHealth, we provide personalized care to support your overall well-being, helping you achieve balance in mind and body.",
                gradient: "from-[#F7941D] via-[#FFA84D] to-[#2B2F92]",
              },
            ].map((service, index) => {
              const card3D = use3DCard(serviceCardRefs[index]);
              return (
                <motion.div
                  key={index}
                  ref={(el) => (serviceCardRefs.current[index] = el)}
                  variants={itemVariants}
                  onMouseMove={card3D.handleMouseMove}
                  onMouseLeave={card3D.handleMouseLeave}
                  style={{
                    rotateX: card3D.rotateX,
                    rotateY: card3D.rotateY,
                    transformStyle: "preserve-3d",
                  }}
                  whileHover={{ y: -10 }}
                  className={`relative bg-gradient-to-br ${service.gradient} backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30`}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-50 blur-xl -z-10" />
                  <div
                    className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <service.icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {service.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#2B2F92] to-[#F7941D] bg-clip-text text-transparent"
          >
            About Us
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-xl border border-white/20 dark:border-slate-700/50 mt-12"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#F7941D]/10 via-transparent to-[#2B2F92]/10 opacity-50 blur-xl -z-10" />
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              Kundwa Health is youth-led organization working with young people
              to decentralize health information and service they need to lead
              healthier lives through digital health means. it was founded in
              Gatsibo district by three young health activits, who were driven
              by the passion of tackling sexual & reproductive health and mental
              health issues through supporting adolescents and young people to
              have access to life-saving information and services on sexual and
              reproductive health, mental health and youth empowerment through
              mentorship. Kundwa means "loved" it is name we choose for our
              organization which reflects how young people should be loved and
              cared for as the future of the nation. our intervention goal is to
              provide young people with different health tools including
              information and services they need in a fun and interactive way
              while promoting the usage of digital health means.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {[
                { number: "35+", label: "People Helped" },
                { number: "10+", label: "Services Provided" },
                { number: "15+", label: "Facilities Partnered with" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-[#F7941D]/10 to-[#2B2F92]/10 rounded-2xl p-6 border border-[#F7941D]/20 dark:border-[#2B2F92]/20"
                >
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#F7941D] to-[#2B2F92] bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background with parallax effect */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${Kigali})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B2F92]/85 via-[#2B2F92]/80 to-[#F7941D]/75" />
          {/* Subtle depth overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </motion.div>

        {/* Floating particles for depth */}
        <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="relative z-10 max-w-7xl mx-auto w-full"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
            >
              Get in Touch
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed"
            >
              Chat with Professionals in Mental, Sexual, Dating
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact Info */}
            <motion.div
              variants={itemVariants}
              className="space-y-5 sm:space-y-6 order-2 lg:order-1"
            >
              {[
                {
                  icon: IoLocationSharp,
                  title: "Address",
                  text: "Gatsibo District Eastern province Rwanda",
                  delay: 0.1,
                },
                {
                  icon: FaPhoneAlt,
                  title: "Phone",
                  text: "+250789287267",
                  delay: 0.2,
                },
                {
                  icon: MdEmail,
                  title: "Email",
                  text: "info@kundwahealth.org",
                  delay: 0.3,
                },
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center gap-4 bg-white/15 backdrop-blur-lg rounded-2xl p-5 sm:p-6 border border-white/25 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#F7941D] to-[#FFA84D] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                  >
                    <contact.icon className="text-xl sm:text-2xl text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base sm:text-lg mb-1">
                      {contact.title}
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base break-words">
                      {contact.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form - Centered and Contained */}
            <motion.div
              ref={contactCardRef}
              variants={itemVariants}
              onMouseMove={contactCard3D.handleMouseMove}
              onMouseLeave={contactCard3D.handleMouseLeave}
              style={{
                rotateX: contactCard3D.rotateX,
                rotateY: contactCard3D.rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative bg-white dark:bg-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/30 dark:border-slate-700/50 order-1 lg:order-2 w-full min-h-[700px] sm:min-h-[750px] lg:min-h-[800px] flex items-center justify-center"
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#F7941D]/5 via-transparent to-[#2B2F92]/5 opacity-60 blur-2xl -z-10" />

              {/* Inner shadow for depth */}
              <div className="absolute inset-0 rounded-3xl shadow-inner pointer-events-none" />

              {/* Form Container with proper boundaries - Centered */}
              <div className="relative z-10 w-full flex flex-col items-center justify-center">
                <motion.h3
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-slate-800 dark:text-slate-100 bg-gradient-to-r from-[#2B2F92] to-[#F7941D] bg-clip-text text-transparent"
                >
                  Send us a Message
                </motion.h3>

                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-md flex flex-col items-center"
                >
                  <div className="w-full space-y-5">
                    {[
                      {
                        name: "companyName",
                        placeholder: "Company Name",
                        type: "text",
                      },
                      { name: "street", placeholder: "Street", type: "text" },
                      {
                        name: "phone",
                        placeholder: "Contact Phone",
                        type: "tel",
                      },
                      { name: "email", placeholder: "E-mail", type: "email" },
                      {
                        name: "idea",
                        placeholder: "Let's talk about your idea",
                        type: "text",
                      },
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        className="w-full"
                      >
                        <motion.input
                          whileFocus={{ scale: 1.01, x: 2 }}
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700/50 focus:border-[#F7941D] dark:focus:border-[#F7941D] focus:ring-4 focus:ring-[#F7941D]/10 dark:focus:ring-[#F7941D]/10 outline-none transition-all duration-300 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base shadow-sm hover:shadow-md"
                        />
                      </motion.div>
                    ))}

                    {/* Checkbox - Properly Aligned Inside white background */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="w-full"
                    >
                      <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300 cursor-pointer group">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex-shrink-0"
                        >
                          <input
                            type="checkbox"
                            name="agree"
                            checked={formData.agree}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#F7941D]/30 focus:border-[#F7941D] accent-[#F7941D] cursor-pointer transition-all duration-200"
                          />
                        </motion.div>
                        <span className="text-sm sm:text-base font-medium group-hover:text-[#2B2F92] dark:group-hover:text-[#F7941D] transition-colors duration-200">
                          Agree and Continue
                        </span>
                      </label>
                    </motion.div>

                    {/* Submit Button - Immediately Below Checkbox, Inside Container */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="w-full"
                    >
                      <motion.button
                        type="submit"
                        whileHover={{
                          scale: 1.03,
                          y: -4,
                          boxShadow:
                            "0 20px 25px -5px rgba(247, 148, 29, 0.4), 0 10px 10px -5px rgba(247, 148, 29, 0.2)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-[#2B2F92] via-[#2B2F92] to-[#F7941D] hover:from-[#F7941D] hover:via-[#FFA84D] hover:to-[#2B2F92] text-white font-bold rounded-xl text-base sm:text-lg shadow-xl shadow-[#2B2F92]/40 hover:shadow-2xl hover:shadow-[#F7941D]/50 transition-all duration-300 relative overflow-hidden group border-2 border-transparent hover:border-[#F7941D]/30"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Submit
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="text-xl"
                          >
                            →
                          </motion.span>
                        </span>
                        {/* Glowing background on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#F7941D] to-[#FFA84D] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                          initial={false}
                        />
                        {/* 3D glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#F7941D]/20 to-[#2B2F92]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                      </motion.button>
                    </motion.div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
