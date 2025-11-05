import Footer from "../../layout/footer/footer";
import "./consultation.css";
import React, { useState } from "react";
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
const Consultation = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  const showModal = () => {
    const screenWidth = window.innerWidth / window.devicePixelRatio;

    // Log the screen width to the console
    console.log(`Screen width: ${screenWidth}px`);

    if (screenWidth <= 600) {
      console.log("Small device detected, navigating to /try-page");
      navigate("/book");
      document.body.style.overflow = "hidden";
      // setIsModalOpen2(true); // You can uncomment this if needed
    } else {
      console.log("Larger device detected, opening modal");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const doctorEmails = {
    "Dr Agarwals": "agarwals@example.com",
    "Dr Marvin": "marvin@example.com",
    "Dr Elvis": "mugishaelvis456@gmail.com",
    "Dr Luke": "luke@example.com",
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDoctorEmail = doctorEmails[selectedDoctor];

    console.log("Selected Doctor:", selectedDoctor);
    console.log("Doctor's Email:", selectedDoctorEmail);
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
                  backgroundColor: "rgba(0,0,0,0.4)",
                },
                content: {
                  color: "black",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,247,238,0.98) 40%, rgba(238,240,255,0.98) 100%)",
                  height: "85vh",
                  width: "60vw",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                  position: "relative",
                },
              }}
            >
              <div
                className="layer1"
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <img src={layer1} />
              </div>
              <div
                className="layer2"
                style={{ position: "absolute", top: 20, left: 15 }}
              >
                <img src={layer3} alt="Nested Image" />{" "}
              </div>
              <div
                className="layer3"
                style={{ position: "absolute", bottom: 0, right: 0, zIndex: 2 }}
              >
                <img src={layer4} alt="Nested Image" />{" "}
              </div>
              <div
                className="layer4"
                style={{
                  position: "absolute",
                  top: "59%",
                  right: 0,
                  transform: "translateY(-50%)",
                  zIndex: 1,
                }}
              >
                <img src={layer6} alt="Nested Image" />{" "}
              </div>
              <div
                className="layer5"
                style={{ position: "absolute", top: 20, right: 0 }}
              >
                <img src={layer2} alt="Nested Image" />{" "}
              </div>
              <div
                className="layer8"
                style={{ position: "absolute", top: -20, right: 0 }}
              >
                <img src={layer5} alt="Nested Image" />{" "}
              </div>

              <div className="modal-content">
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "10px",
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
                  <div className="select-form">
                    <div>
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
                          width: "150px",
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
                    <div>
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
                          width: "150px",
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
                    <div>
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
                          width: "150px",
                          height: "30px",
                          color: "#666666",
                          backgroundColor: "#E8E4FF",
                        }}
                      >
                        <option value="Counseling and Therapy">
                          Counseling and Therapy
                        </option>
                        <option value="Sexual advices">Sexual advices</option>
                        <option value="Mental Health">Mental Health</option>
                      </select>
                    </div>
                  </div>
                  <br />

                  <div className="layer9">
                    <input type="image" src={submit} alt="Submit" />
                  </div>
                </form>
              </div>
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
                backgroundColor: "rgba(0,0,0,0.4)",
              },
              content: {
                color: "black",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,247,238,0.98) 40%, rgba(238,240,255,0.98) 100%)",
                height: "87vh",
                width: window.innerWidth <= 600 ? "80vw" : "65vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: window.innerWidth <= 600 ? "" : "0 auto",
                fontSize: "14px",
                position: "relative",
              },
            }}
          >
            <div
              className="layer6"
              style={{ position: "absolute", top: -9, left: 350 }}
            >
              <img src={layer5} alt="Nested Image" />{" "}
            </div>
            <div
              className="layer7"
              style={{ position: "absolute", top: 20, right: 0 }}
            >
              <img src={layer2} alt="Nested Image" />{" "}
            </div>
            <div className="calendar">
              <Calendar
                professionalName={selectedDoctor}
                district={selectedDistrict}
                serviceName={selectedService}
                doctorEmail={doctorEmails[selectedDoctor]}
              />
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Consultation;
