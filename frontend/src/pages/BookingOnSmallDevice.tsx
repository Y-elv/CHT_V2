import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../config/axiosConfig";
import { motion } from "framer-motion";
import { useToast, Spinner, Box } from "@chakra-ui/react";
import Navbar from "../components/navbar/navbar";
import Footer from "../layout/footer/footer";
import Calendar from "../components/calendar/calendar";
import {
  RiArrowRightLine,
  RiUserLine,
  RiMapPinLine,
  RiServiceLine,
} from "react-icons/ri";

Modal.setAppElement("#root"); // Necessary for accessibility

interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  pic?: string;
  doctorStatus?: string;
}

const BookingOnSmallDevice = () => {
  const toast = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDoctorData, setSelectedDoctorData] = useState<Doctor | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch approved doctors from API
  const fetchDoctors = async () => {
    console.log("🔄 [Booking Mobile] Starting to fetch approved doctors...");
    setLoadingDoctors(true);
    try {
      const apiUrl = "https://chtv2-bn.onrender.com/api/admin/all-doctors";
      const params = {
        page: 1,
        limit: 100,
        status: "approved",
      };

      console.log("📤 [Booking Mobile] API Request Details:");
      console.log("   URL:", apiUrl);
      console.log("   Params:", params);

      const requestStartTime = Date.now();
      const response = await axios.get(apiUrl, { params });
      const requestEndTime = Date.now();

      console.log(
        `⏱️ [Booking Mobile] Request completed in ${
          requestEndTime - requestStartTime
        }ms`
      );
      console.log("📥 [Booking Mobile] API Response received:");
      console.log("   Status:", response.status);
      console.log("   Response Data:", response.data);

      interface ApiResponse {
        doctors?: Doctor[];
      }

      const apiResponse = response.data as ApiResponse;

      if (apiResponse && apiResponse.doctors) {
        const doctorsList: Doctor[] = apiResponse.doctors;
        console.log("✅ [Booking Mobile] Doctors array found in response");
        console.log("   Total doctors:", doctorsList.length);

        setDoctors(doctorsList);

        // Extract unique specialties from doctors
        const uniqueSpecialties: string[] = [
          ...new Set(
            doctorsList
              .map((doctor) => doctor.specialty)
              .filter(
                (specialty): specialty is string =>
                  Boolean(specialty) &&
                  typeof specialty === "string" &&
                  specialty.trim() !== ""
              )
          ),
        ];

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

        setSpecialties(allSpecialties);
        console.log("✅ [Booking Mobile] Fetch completed successfully!");
      } else {
        setDoctors([]);
        setSpecialties([
          "Mental Health",
          "Sexual Advice",
          "Counseling and Therapy",
        ]);
      }
    } catch (error) {
      console.error("❌ [Booking Mobile] Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDoctorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = event.target.value;
    setSelectedDoctor(doctorId);
    const doctor = doctors.find((d) => d._id === doctorId);
    setSelectedDoctorData(doctor || null);
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDistrict(event.target.value);
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <Navbar active="" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8 max-w-2xl"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingBottom: "80px",
          paddingTop: "32px",
          gap: "24px",
        }}
      >
        <motion.div
          variants={itemVariants}
          className="text-center"
          style={{ width: "100%", marginBottom: "32px" }}
        >
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: "28px",
              fontWeight: 700,
              marginBottom: "12px",
              background:
                "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TALK TO US
          </motion.h1>
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "16px",
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            One click away from meeting our best doctors and wellness experts
          </motion.p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            padding: "32px",
            paddingBottom: "48px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            minHeight: "auto",
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
              <motion.div variants={itemVariants} style={{ marginBottom: "0" }}>
                <label
                  htmlFor="doctorSelect"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "12px",
                  }}
                >
                  <RiUserLine size={18} color="#F7941D" />
                  <span>Select a Doctor:</span>
                  <RiArrowRightLine
                    size={16}
                    color="#64748b"
                    style={{ marginLeft: "auto" }}
                  />
                </label>
                <select
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
                    paddingRight: "40px",
                    color: "#1e293b",
                    backgroundColor: "#f8fafc",
                    border: "2px solid #e2e8f0",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    outline: "none",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#F7941D";
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(247,148,29,0.1)";
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

              <motion.div variants={itemVariants} style={{ marginBottom: "0" }}>
                <label
                  htmlFor="districtSelect"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "12px",
                  }}
                >
                  <RiMapPinLine size={18} color="#F7941D" />
                  <span>Select a District:</span>
                  <RiArrowRightLine
                    size={16}
                    color="#64748b"
                    style={{ marginLeft: "auto" }}
                  />
                </label>
                <select
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
                    paddingRight: "40px",
                    color: "#1e293b",
                    backgroundColor: "#f8fafc",
                    border: "2px solid #e2e8f0",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    outline: "none",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#F7941D";
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(247,148,29,0.1)";
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

              <motion.div variants={itemVariants} style={{ marginBottom: "0" }}>
                <label
                  htmlFor="serviceSelect"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "12px",
                  }}
                >
                  <RiServiceLine size={18} color="#F7941D" />
                  <span>Select a Service:</span>
                  <RiArrowRightLine
                    size={16}
                    color="#64748b"
                    style={{ marginLeft: "auto" }}
                  />
                </label>
                <select
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
                    paddingRight: "40px",
                    color: "#1e293b",
                    backgroundColor: "#f8fafc",
                    border: "2px solid #e2e8f0",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    outline: "none",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#F7941D";
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(247,148,29,0.1)";
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
                variants={itemVariants}
                style={{
                  marginTop: "8px",
                  width: "100%",
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
                    width: "100%",
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
                    marginTop: "8px",
                    marginBottom: "0",
                  }}
                >
                  Continue
                </motion.button>
              </motion.div>
            </>
          )}
        </motion.form>
      </motion.div>

      {/* Calendar Modal */}
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
            maxHeight: "98vh",
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
            top: "16px",
            left: "16px",
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
            padding: window.innerWidth <= 768 ? "32px 24px" : "48px 40px",
            paddingTop: window.innerWidth <= 768 ? "56px" : "64px",
            minHeight: "auto",
            overflowY: "visible",
            overflowX: "hidden",
          }}
        >
          <Calendar
            professionalName={selectedDoctorData?.name || selectedDoctor}
            district={selectedDistrict}
            serviceName={selectedService}
            doctorEmail={selectedDoctorData?.email || ""}
            onBookingSuccess={() => {
              // Close calendar modal after successful booking
              setTimeout(() => {
                closeCalendar();
              }, 2000); // Give user time to see success message
            }}
          />
        </motion.div>
      </Modal>

      <div style={{ marginTop: "auto", width: "100%", paddingTop: "60px" }}>
        <Footer />
      </div>
    </div>
  );
};

export default BookingOnSmallDevice;
