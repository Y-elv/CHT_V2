import Footer from "../../layout/footer/footer";
import "./consultation.css";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Container, Row, Col } from "react-bootstrap";
Modal.setAppElement("#root");
import CardProf from "./cardProf";
import logo from "../../assets/LOGOJUST.png";
import Calendar from "../../components/calendar/calendar";
import Navbar from "../../components/navbar/navbar";
import layer1 from "../../assets/Layer_1.png";
import layer2 from "../../assets/Layer_2.png";
import layer3 from "../../assets/layer_3.png";
import layer4 from "../../assets/layer_4.png";
import layer5 from "../../assets/layer_5.png";
import layer6 from "../../assets/layer_6.png";
import luke from "../../assets/luke.png";
import alex from "../../assets/alex.png";
import marvin from "../../assets/marvin.png";
import flores from "../../assets/flores.png";
import juanita from "../../assets/juanita.png";
import cooper from "../../assets/cooper.png";
import kenny from "../../assets/kenny.png";
import karenera from "../../assets/karenera.png";
import submit from "../../assets/submit.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../../api/axios";
import { useToast, Spinner, Box, Button, Avatar, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import { useAuthStore } from "../../store/authStore";
import { IoMailOutline, IoCallOutline, IoChatbubbleOutline, IoStarOutline } from "react-icons/io5";
import { RiUserHeartLine, RiStethoscopeLine, RiTimeLine } from "react-icons/ri";
const Consultation = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDoctorData, setSelectedDoctorData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState("");

  // Enhanced team member data with chat functionality
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Luke Belmar",
      title: "Mental Health Specialist",
      image: luke,
      email: "luke.belmar@kundwa.health",
      phone: "+250 788 000 001",
      specialty: "Mental Health",
      rating: 4.9,
      experience: "8+ years",
      description: "I provide a safe and confidential space to discuss your thoughts, emotions, and challenges. Together, we'll work on developing coping strategies and managing stress.",
      available: true,
      chatId: "luke-belmar"
    },
    {
      id: 2,
      name: "Dr. Flores Martinez",
      title: "Sexual Health Expert",
      image: flores,
      email: "flores.martinez@kundwa.health",
      phone: "+250 788 000 002",
      specialty: "Sexual Health",
      rating: 4.8,
      experience: "6+ years",
      description: "Specialized in sexual and reproductive health education, providing confidential and non-judgmental guidance on sensitive topics.",
      available: true,
      chatId: "flores-martinez"
    },
    {
      id: 3,
      name: "Dr. Juanita Kim",
      title: "Counseling & Therapy",
      image: juanita,
      email: "juanita.kim@kundwa.health",
      phone: "+250 788 000 003",
      specialty: "Counseling",
      rating: 4.9,
      experience: "7+ years",
      description: "Expert in adolescent counseling and youth empowerment, helping young people navigate life's challenges with confidence.",
      available: true,
      chatId: "juanita-kim"
    },
    {
      id: 4,
      name: "Dr. Cooper Johnson",
      title: "Mental Health Counselor",
      image: cooper,
      email: "cooper.johnson@kundwa.health",
      phone: "+250 788 000 004",
      specialty: "Mental Health",
      rating: 4.7,
      experience: "5+ years",
      description: "Focused on youth mental health, providing innovative therapeutic approaches for today's challenges.",
      available: true,
      chatId: "cooper-johnson"
    },
    {
      id: 5,
      name: "Dr. Alex Chen",
      title: "Sexual Health Advisor",
      image: alex,
      email: "alex.chen@kundwa.health",
      phone: "+250 788 000 005",
      specialty: "Sexual Health",
      rating: 4.8,
      experience: "6+ years",
      description: "Dedicated to providing accurate sexual health information and breaking down barriers to open communication.",
      available: true,
      chatId: "alex-chen"
    },
    {
      id: 6,
      name: "Dr. Marvin Davis",
      title: "Therapy & Wellness",
      image: marvin,
      email: "marvin.davis@kundwa.health",
      phone: "+250 788 000 006",
      specialty: "Therapy",
      rating: 4.6,
      experience: "4+ years",
      description: "Holistic approach to mental wellness, combining traditional therapy with modern wellness techniques.",
      available: true,
      chatId: "marvin-davis"
    },
    {
      id: 7,
      name: "Dr. Kenny Park",
      title: "Youth Mental Health",
      image: kenny,
      email: "kenny.park@kundwa.health",
      phone: "+250 788 000 007",
      specialty: "Mental Health",
      rating: 4.8,
      experience: "5+ years",
      description: "Specialized in working with young adults, creating relatable and effective therapeutic relationships.",
      available: true,
      chatId: "kenny-park"
    },
    {
      id: 8,
      name: "Dr. Karenera Smith",
      title: "Counseling Specialist",
      image: karenera,
      email: "karenera.smith@kundwa.health",
      phone: "+250 788 000 008",
      specialty: "Counseling",
      rating: 4.9,
      experience: "9+ years",
      description: "Experienced counselor with expertise in trauma-informed care and youth empowerment strategies.",
      available: true,
      chatId: "karenera-smith"
    }
  ];

  // Fetch approved doctors from API
  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const apiUrl = "/admin/all-doctors";
      const params = {
        page: 1,
        limit: 100,
        status: "approved",
      };
      const response = await axios.get(apiUrl, { params });

      if (response.data && response.data.doctors) {
        const doctorsList = response.data.doctors;
        setDoctors(doctorsList);

        const uniqueSpecialties = [
          ...new Set(
            doctorsList
              .map((doctor) => doctor.specialty)
              .filter((specialty) => specialty && specialty.trim() !== "")
          ),
        ];
        const defaultSpecialties = [
          "Mental Health",
          "Sexual Advice",
          "Counseling and Therapy",
        ];
        const allSpecialties = [
          ...defaultSpecialties,
          ...uniqueSpecialties.filter((s) => !defaultSpecialties.includes(s)),
        ].sort();
        setSpecialties(allSpecialties);
      } else {
        setDoctors([]);
        setSpecialties([
          "Mental Health",
          "Sexual Advice",
          "Counseling and Therapy",
        ]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Set default values on error
      setDoctors([]);
      setSpecialties([
        "Mental Health",
        "Sexual Advice",
        "Counseling and Therapy",
      ]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Fetch doctors when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchDoctors();
    }
  }, [isModalOpen]);

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  const showModal = () => {
    // Open same modal on all screen sizes so user can choose doctor, district, and continue to book
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    const doctor = doctors.find((d) => d._id === doctorId);
    setSelectedDoctorData(doctor);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedDistrict || !selectedService) {
      toast({
        title: "Incomplete Form",
        description: "Please select a doctor, district, and service.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setIsCalendarOpen(true);
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };

  // Handle chat navigation
  const handleChatWithDoctor = (member) => {
    // Navigate to chat pages with the doctor's chat ID
    navigate(`/chatpages?doctor=${member.chatId}`);
  };

  // Animations matching OurTeamPage style
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };
  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  return (
    <>
      <div
        className="consultation-page bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
        style={{
          overflowX: "hidden",
        }}
      >
        <div className="cons-container" style={{ overflowX: "hidden" }}>
          <Navbar />
          <div className="cons-middle" style={{ paddingBottom: 72 }}>
            {/* Enhanced Title Section */}
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              style={{ textAlign: "center", marginBottom: 60 }}
            >
              <motion.h2
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 16,
                  letterSpacing: "-0.02em",
                }}
              >
                MEET OUR EXPERT TEAM
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                  color: "#64748b",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                Connect with our dedicated healthcare professionals for confidential support and guidance
              </motion.p>
            </motion.div>

            {/* Enhanced Team Cards Grid */}
            <Container fluid style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "32px",
                  marginBottom: "60px",
                }}
              >
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    whileHover={{
                      y: -12,
                      scale: 1.03,
                      transition: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                      borderRadius: "24px",
                      border: "1px solid rgba(43,47,146,0.1)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5)",
                      backdropFilter: "blur(10px)",
                      padding: "32px 24px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative gradient overlay */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(90deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                        borderRadius: "24px 24px 0 0",
                      }}
                    />

                    {/* Avatar Section */}
                    <motion.div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "24px",
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        style={{
                          position: "relative",
                          marginBottom: "16px",
                        }}
                      >
                        <Avatar
                          src={member.image}
                          name={member.name}
                          size="xl"
                          style={{
                            width: "120px",
                            height: "120px",
                            border: "4px solid #F7941D",
                            boxShadow: "0 8px 24px rgba(247,148,29,0.3)",
                          }}
                        />
                        {/* Online status indicator */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            width: "20px",
                            height: "20px",
                            backgroundColor: member.available ? "#10b981" : "#ef4444",
                            borderRadius: "50%",
                            border: "3px solid white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Doctor Info */}
                    <VStack spacing={3} align="center" style={{ textAlign: "center", marginBottom: "20px" }}>
                      <Heading
                        size="md"
                        style={{
                          background: "linear-gradient(135deg, #2B2F92 0%, #1E2266 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontWeight: 700,
                        }}
                      >
                        {member.name}
                      </Heading>
                      <Text
                        fontSize="sm"
                        fontWeight={600}
                        color="#F7941D"
                        style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                      >
                        {member.title}
                      </Text>
                      <HStack spacing={2} align="center">
                        <IoStarOutline color="#F59E0B" size={16} />
                        <Text fontSize="sm" fontWeight={600} color="#1f2937">
                          {member.rating}
                        </Text>
                        <Text fontSize="sm" color="#6b7280">
                          ({member.experience})
                        </Text>
                      </HStack>
                    </VStack>

                    {/* Description */}
                    <Text
                      fontSize="sm"
                      color="#4b5563"
                      lineHeight={1.6}
                      style={{ textAlign: "center", marginBottom: "24px", minHeight: "60px" }}
                    >
                      {member.description}
                    </Text>

                    {/* Contact Info */}
                    <VStack spacing={3} style={{ marginBottom: "24px" }}>
                      <HStack spacing={2} align="center" style={{ fontSize: "0.875rem" }}>
                        <IoMailOutline color="#2B2F92" size={16} />
                        <Text color="#4b5563">{member.email}</Text>
                      </HStack>
                      <HStack spacing={2} align="center" style={{ fontSize: "0.875rem" }}>
                        <IoCallOutline color="#F7941D" size={16} />
                        <Text color="#4b5563">{member.phone}</Text>
                      </HStack>
                    </VStack>
                  </motion.div>
                ))}
              </motion.div>
            </Container>
            {/* Enhanced CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: "60px" }}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  boxShadow: "0 20px 40px rgba(247,148,29,0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={showModal}
                style={{
                  background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
                  color: "white",
                  borderRadius: "9999px",
                  border: "none",
                  outline: "none",
                  padding: "16px 48px",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(247,148,29,0.3)",
                  letterSpacing: "0.02em",
                }}
              >
                Start Consultation
              </motion.button>
            </motion.div>
            <div className="cons-about">
              <div
                className="cons-about-up"
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <img src={logo} />
                <h3
                  style={{
                    background:
                      "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 800,
                  }}
                >
                  ABOUT
                </h3>
              </div>
              <motion.div
                className="cons-about-down"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(247,148,29,0.08) 0%, rgba(43,47,146,0.08) 100%)",
                  border: "1px solid rgba(43,47,146,0.15)",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 48,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                <p style={{ color: "#334155", lineHeight: 1.7 }}>
                  Kundwa Health is youth-led organization working with young
                  people to decentralize health information and service they
                  need to lead healthier lives through digital health means.it
                  was founded in Gatsibo district by three young health
                  activits,who were driven by the passion of tackling sexual &
                  reproductive health and mental health issues through
                  supporting adolescents and young people to have access to
                  life-saving information and services on sexual and
                  reproductive health,mental health and youth empowerment
                  through mentorship.kUNDWA means “loved” it is name we choose
                  for our organization which reflects how young people should be
                  loved and cared for as the future of the nation. our
                  intervention goal is to provide young people with different
                  health tools including information and services they need in a
                  fun and interactive way while promoting the usage of digital
                  health means.
                </p>
              </motion.div>
            </div>
          </div>
          <Footer className="footer" />
        </div>

        {/* modal */}

        {isModalOpen && (
          <div className="modal">
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              style={{
                overlay: {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                },
                content: {
                  color: "black",
                  background:
                    "linear-gradient(135deg, #fff 0%, #fff9f5 50%, #ffedd5 100%)",
                  position: "relative",
                  borderRadius: window.innerWidth <= 600 ? 0 : "24px",
                  border: "none",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  padding: 0,
                  margin: "auto",
                  width: window.innerWidth <= 600 ? "100%" : "90%",
                  maxWidth: window.innerWidth <= 600 ? "100%" : "600px",
                  height: window.innerWidth <= 600 ? "100vh" : "auto",
                  maxHeight: "90vh",
                  overflow: "hidden",
                  inset: "auto",
                  top: "auto",
                  left: "auto",
                  right: "auto",
                  bottom: "auto",
                  transform: "none",
                },
              }}
            >
              {/* Decorative layers - contained within modal */}
              <div
                className="layer1"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <img
                  src={layer1}
                  alt=""
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "30%",
                    maxHeight: "40%",
                    opacity: 0.3,
                  }}
                />
              </div>
              <div
                className="layer2"
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <img
                  src={layer3}
                  alt=""
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "15%",
                    maxHeight: "20%",
                    opacity: 0.3,
                  }}
                />
              </div>
              <div
                className="layer3"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <img
                  src={layer4}
                  alt=""
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "25%",
                    maxHeight: "35%",
                    opacity: 0.3,
                  }}
                />
              </div>
              <div
                className="layer4"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <img
                  src={layer6}
                  alt=""
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "20%",
                    maxHeight: "30%",
                    opacity: 0.3,
                  }}
                />
              </div>
              <div
                className="layer5"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <img
                  src={layer2}
                  alt=""
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "15%",
                    maxHeight: "20%",
                    opacity: 0.3,
                  }}
                />
              </div>
              <div
                className="layer8"
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "10px",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <img
                  src={layer5}
                  alt=""
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "25%",
                    maxHeight: "30%",
                    opacity: 0.3,
                  }}
                />
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#64748b",
                  zIndex: 100,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
                whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                whileTap={{ scale: 0.95 }}
              >
                ×
              </motion.button>

              <motion.div
                className="modal-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                  position: "relative",
                  padding: window.innerWidth <= 768 ? "24px" : "40px",
                  overflowY: "auto",
                  maxHeight: "90vh",
                }}
              >
                <motion.h3
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    marginBottom: "12px",
                    background:
                      "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textAlign: "center",
                  }}
                >
                  TALK TO US
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontSize: "16px",
                    color: "#64748b",
                    marginBottom: "24px",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  One click away from meeting our best doctors and wellness
                  experts
                </motion.p>

                <form
                  onSubmit={handleSubmit}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {loadingDoctors ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      py={8}
                    >
                      <Spinner
                        size="lg"
                        color="#F7941D"
                        thickness="4px"
                        speed="0.65s"
                      />
                    </Box>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ width: "100%" }}
                      >
                        <label
                          htmlFor="doctorSelect"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#334155",
                            marginBottom: "8px",
                            display: "block",
                          }}
                        >
                          Select a Doctor:
                        </label>
                        <select
                          className="select"
                          id="doctorSelect"
                          name="doctorSelect"
                          value={selectedDoctor}
                          onChange={handleDoctorChange}
                          required
                          style={{
                            borderRadius: "12px",
                            width: "100%",
                            height: "48px",
                            padding: "0 16px",
                            color: "#1e293b",
                            backgroundColor: "#f8fafc",
                            border: "2px solid #e2e8f0",
                            fontSize: "15px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#F7941D";
                            e.target.style.backgroundColor = "#fff";
                            e.target.style.boxShadow =
                              "0 0 0 3px rgba(247,148,29,0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.backgroundColor = "#f8fafc";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <option value="">-- Select a Doctor --</option>
                          {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                              {doctor.name} - {doctor.specialty}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ width: "100%" }}
                      >
                        <label
                          htmlFor="districtSelect"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#334155",
                            marginBottom: "8px",
                            display: "block",
                          }}
                        >
                          Select a District:
                        </label>
                        <select
                          className="select"
                          id="districtSelect"
                          name="districtSelect"
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          required
                          style={{
                            borderRadius: "12px",
                            width: "100%",
                            height: "48px",
                            padding: "0 16px",
                            color: "#1e293b",
                            backgroundColor: "#f8fafc",
                            border: "2px solid #e2e8f0",
                            fontSize: "15px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#F7941D";
                            e.target.style.backgroundColor = "#fff";
                            e.target.style.boxShadow =
                              "0 0 0 3px rgba(247,148,29,0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.backgroundColor = "#f8fafc";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <option value="">-- Select a District --</option>
                          <option value="Kicukiro">Kicukiro</option>
                          <option value="Gasabo">Gasabo</option>
                          <option value="Nyarugenge">Nyarugenge</option>
                          <option value="Karongi">Karongi</option>
                          <option value="Kirehe">Kirehe</option>
                          <option value="Bugesera">Bugesera</option>
                          <option value="Burera">Burera</option>
                          <option value="Nyanza">Nyanza</option>
                          <option value="Rubavu">Rubavu</option>
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ width: "100%" }}
                      >
                        <label
                          htmlFor="serviceSelect"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#334155",
                            marginBottom: "8px",
                            display: "block",
                          }}
                        >
                          Select a Service:
                        </label>
                        <select
                          className="select"
                          id="serviceSelect"
                          name="serviceSelect"
                          value={selectedService}
                          onChange={handleServiceChange}
                          required
                          style={{
                            borderRadius: "12px",
                            width: "100%",
                            height: "48px",
                            padding: "0 16px",
                            color: "#1e293b",
                            backgroundColor: "#f8fafc",
                            border: "2px solid #e2e8f0",
                            fontSize: "15px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#F7941D";
                            e.target.style.backgroundColor = "#fff";
                            e.target.style.boxShadow =
                              "0 0 0 3px rgba(247,148,29,0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.backgroundColor = "#f8fafc";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <option value="">-- Select a Service --</option>
                          {specialties.map((specialty, index) => (
                            <option key={index} value={specialty}>
                              {specialty}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="layer9"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "8px",
                        }}
                      >
                        <motion.button
                          type="submit"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 25px rgba(247,148,29,0.35)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            background:
                              "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            padding: "14px 32px",
                            fontSize: "16px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 12px rgba(247,148,29,0.25)",
                          }}
                        >
                          Continue
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </form>
              </motion.div>
            </Modal>
          </div>
        )}

        {/* {isModalOpen2 && (
          <div className="modal-small">
            <Modal
              isOpen={isModalOpen2}
              onRequestClose={closeModal}
              style={{
                overlay: {
                  backgroundColor: "grey",
                },
                content: {
                  color: "black",
                  background: "linear-gradient(135deg, #fff 0%, #fff5eb 50%, #ffedd5 100%)",
                  height: "85vh",
                  width: "80vw",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",

                  position: "relative", // Ensures the modal is fixed in the viewport
                },
              }}
            >
              <div className="modal-content2">
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    color: "#2c17ae",
                  }}
                >
                  TALK TO US
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    marginBottom: "20px",
                  }}
                >
                  One click away to meeting our best doctors and wellness
                  experts
                </p>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Experts :
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="select-form-small">
                    <div style={{ marginBottom: "10px" }}>
                      <label
                        htmlFor="doctorSelect"
                        style={{ fontSize: "14px", color: "#666" }}
                      >
                        Select a Doctor:
                      </label>
                      <br />
                      <select
                        className="select"
                        id="doctorSelect"
                        name="doctorSelect"
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        style={{
                          borderRadius: "5px",
                          width: "100%", // Adjusted width
                          height: "30px",
                          color: "#666666",
                          backgroundColor: "#E8E4FF",
                        }}
                      >
                        <option value="Dr Agarwals">Dr Agarwals</option>
                        <option value="Dr Marvin">Dr Marvin</option>
                        <option value="Dr Elvis">Dr Elvis</option>
                        <option value="Dr Luke">Dr Luke </option>
                      </select>
                      <input
                        type="hidden"
                        id="doctorEmail"
                        name="doctorEmail"
                        value={doctorEmails[selectedDoctor] || ""}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <label
                        htmlFor="districtSelect"
                        style={{ fontSize: "14px", color: "#666" }}
                      >
                        Select a District:
                      </label>
                      <br />
                      <select
                        className="select"
                        id="districtSelect"
                        name="districtSelect"
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        style={{
                          borderRadius: "5px",
                          width: "100%", // Adjusted width
                          height: "30px",
                          color: "#666666",
                          backgroundColor: "#E8E4FF",
                        }}
                      >
                        <option value="Kicukiro">Kicukiro</option>
                        <option value="Gasabo">Gasabo</option>
                        <option value="Nyarugenge">Nyarugenge</option>
                        <option value="Karongi">Karongi</option>
                        <option value="Kirehe">Kirehe</option>
                        <option value="Bugesera">Bugesera</option>
                        <option value="Burera">Burera</option>
                        <option value="Nyanza">Nyanza</option>
                        <option value="Rubavu">Rubavu</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <label
                        htmlFor="serviceSelect"
                        style={{ fontSize: "14px", color: "#666" }}
                      >
                        Select a Service:
                      </label>
                      <br />
                      <select
                        className="select"
                        id="serviceSelect"
                        name="serviceSelect"
                        value={selectedService}
                        onChange={handleServiceChange}
                        style={{
                          borderRadius: "5px",
                          width: "100%", // Adjusted width
                          height: "30px",
                          color: "#666666",
                          backgroundColor: "#E8E4FF",
                        }}
                      >
                        <option value="Counseling and Therapy">Abortion</option>
                        <option value="Sexual advices">Sexual advices</option>
                        <option value="Mental Health">Mental Health</option>
                      </select>
                    </div>
                  </div>
                  <br />

                  <div className="layer-small-btn">
                    <input type="image" src={submit} alt="Submit" />
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        )} */}

        <div className="pop-calendar">
          <Modal
            isOpen={isCalendarOpen}
            onRequestClose={closeCalendar}
            style={{
              overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              },
              content: {
                color: "black",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,247,238,0.98) 40%, rgba(238,240,255,0.98) 100%)",
                position: "relative",
                borderRadius: "24px",
                border: "none",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                padding: 0,
                margin: "auto",
                width: "90%",
                maxWidth: "700px",
                height: "auto",
                minHeight: "auto",
                maxHeight: "95vh",
                overflow: "visible",
                overflowY: "auto",
                inset: "auto",
                top: "auto",
                left: "auto",
                right: "auto",
                bottom: "auto",
                transform: "none",
              },
            }}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={closeCalendar}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255,255,255,0.9)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "20px",
                color: "#64748b",
                zIndex: 100,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
              whileTap={{ scale: 0.95 }}
            >
              ×
            </motion.button>

            {/* Decorative layers - contained within modal */}
            <div
              className="layer6"
              style={{
                position: "absolute",
                top: "-5px",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: 0.2,
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              <img
                src={layer5}
                alt=""
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "40%",
                  maxHeight: "30%",
                }}
              />
            </div>
            <div
              className="layer7"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                opacity: 0.2,
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              <img
                src={layer2}
                alt=""
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "20%",
                  maxHeight: "25%",
                }}
              />
            </div>

            <motion.div
              className="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                width: "100%",
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "20px",
                padding: window.innerWidth <= 768 ? "24px" : "40px",
                minHeight: "auto",
                overflowY: "visible",
                overflowX: "hidden",
              }}
            >
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  marginBottom: "24px",
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Select Date & Time
              </motion.h3>

              <Calendar
                professionalName={selectedDoctorData?.name || selectedDoctor}
                district={selectedDistrict}
                serviceName={selectedService}
                doctorEmail={selectedDoctorData?.email || ""}
                doctorId={selectedDoctorData?._id || ""}
              />
            </motion.div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Consultation;
