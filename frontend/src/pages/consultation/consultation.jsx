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
import axios from "../../config/axiosConfig";
import { useToast, Spinner, Box } from "@chakra-ui/react";
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

  // Fetch approved doctors from API
  const fetchDoctors = async () => {
    console.log("🔄 [Consultation] Starting to fetch approved doctors...");
    setLoadingDoctors(true);
    try {
      const apiUrl = "https://chtv2-bn.onrender.com/api/admin/all-doctors";
      const params = {
        page: 1,
        limit: 100, // Get more doctors
        status: "approved",
      };

      console.log("📤 [Consultation] API Request Details:");
      console.log("   URL:", apiUrl);
      console.log("   Params:", params);
      console.log("   Method: GET");

      const requestStartTime = Date.now();
      const response = await axios.get(apiUrl, { params });
      const requestEndTime = Date.now();

      console.log(
        `⏱️ [Consultation] Request completed in ${
          requestEndTime - requestStartTime
        }ms`
      );
      console.log("📥 [Consultation] API Response received:");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);
      console.log("   Response Data:", response.data);

      if (response.data && response.data.doctors) {
        const doctorsList = response.data.doctors;
        console.log("✅ [Consultation] Doctors array found in response");
        console.log("   Total doctors:", doctorsList.length);
        console.log("   Doctors list:", doctorsList);

        // Log each doctor's details
        doctorsList.forEach((doctor, index) => {
          console.log(`   Doctor ${index + 1}:`, {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            specialty: doctor.specialty,
            status: doctor.doctorStatus,
            hospital: doctor.hospital,
          });
        });

        setDoctors(doctorsList);
        console.log(
          "✅ [Consultation] Doctors state updated:",
          doctorsList.length,
          "doctors"
        );

        // Extract unique specialties from doctors
        const uniqueSpecialties = [
          ...new Set(
            doctorsList
              .map((doctor) => doctor.specialty)
              .filter((specialty) => specialty && specialty.trim() !== "")
          ),
        ];

        console.log("🔍 [Consultation] Extracting specialties...");
        console.log("   Unique specialties from API:", uniqueSpecialties);

        // Add default specialties if not present
        const defaultSpecialties = [
          "Mental Health",
          "Sexual Advice",
          "Counseling and Therapy",
        ];

        const allSpecialties = [
          ...defaultSpecialties,
          ...uniqueSpecialties.filter((s) => !defaultSpecialties.includes(s)),
        ].sort();

        console.log(
          "✅ [Consultation] Final specialties list:",
          allSpecialties
        );
        console.log("   Total specialties:", allSpecialties.length);

        setSpecialties(allSpecialties);
        console.log("✅ [Consultation] Specialties state updated");

        // Summary log
        console.log("🎉 [Consultation] Fetch completed successfully!");
        console.log("   Summary:");
        console.log("   - Doctors fetched:", doctorsList.length);
        console.log("   - Specialties available:", allSpecialties.length);
        console.log(
          "   - Request duration:",
          requestEndTime - requestStartTime,
          "ms"
        );
      } else {
        console.warn("⚠️ [Consultation] No doctors found in response");
        console.warn("   Response data:", response.data);
        setDoctors([]);
        setSpecialties([
          "Mental Health",
          "Sexual Advice",
          "Counseling and Therapy",
        ]);
      }
    } catch (error) {
      console.error("❌ [Consultation] Error fetching doctors:");
      console.error("   Error type:", error.constructor.name);
      console.error("   Error message:", error.message);
      console.error("   Error code:", error.code);

      if (error.response) {
        console.error("   HTTP Status:", error.response.status);
        console.error("   Response data:", error.response.data);
      } else if (error.request) {
        console.error("   No response received");
        console.error("   Request:", error.request);
      }

      console.error("   Full error:", error);

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
      console.log("🏁 [Consultation] Fetch process finished");
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
    const screenWidth = window.innerWidth / window.devicePixelRatio;

    console.log(`Screen width: ${screenWidth}px`);

    if (screenWidth <= 600) {
      console.log("Small device detected, navigating to /book");
      navigate("/book");
      document.body.style.overflow = "hidden";
    } else {
      console.log("Larger device detected, opening modal");
      setIsModalOpen(true);
    }
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

    console.log("Selected Doctor:", selectedDoctorData);
    console.log("Doctor's Email:", selectedDoctorData?.email);
    console.log("Selected District:", selectedDistrict);
    console.log("Selected Service:", selectedService);

    setIsCalendarOpen(true);
    setIsModalOpen(false);
    setIsModalOpen2(false);
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
            <motion.h2
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              style={{
                textAlign: "center",
                marginTop: 10,
                marginBottom: 20,
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MEET THE TEAM
            </motion.h2>

            <Container fluid className="prof-card">
              <Row className="prof-card-up d-flex flex-wrap justify-content-center g-5 gy-5 gx-5">
                <Col xs={12} sm={6} md={4}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <CardProf imgName={luke} />
                  </motion.div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <CardProf imgName={flores} />
                  </motion.div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <CardProf imgName={juanita} />
                  </motion.div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <CardProf imgName={cooper} />
                  </motion.div>
                </Col>
              </Row>

              <Row className="prof-card-down d-flex flex-wrap g-5 gy-5 gx-5">
                <Col xs={12} sm={6} md={4}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <CardProf imgName={alex} className="img-fluid" />
                  </motion.div>
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-3 mb-md-0">
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <CardProf imgName={marvin} />
                  </motion.div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <CardProf imgName={kenny} />
                  </motion.div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <CardProf imgName={karenera} />
                  </motion.div>
                </Col>
              </Row>
            </Container>
            <div className="kh-rooms">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(247,148,29,0.35)",
                }}
                whileTap={{ scale: 0.98 }}
                className="btn-kh"
                onClick={showModal}
                style={{
                  background:
                    "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
                  color: "white",
                  borderRadius: 9999,
                  border: "none",
                  outline: "none",
                }}
              >
                talk to us
              </motion.button>
            </div>
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
                    "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,247,238,0.98) 40%, rgba(238,240,255,0.98) 100%)",
                  position: "relative",
                  borderRadius: "24px",
                  border: "none",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  padding: 0,
                  margin: "auto",
                  width: "90%",
                  maxWidth: "600px",
                  height: "auto",
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
                  backgroundColor: "#B8C2D7",
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
