import React, { useState } from "react";
import "./calendar.css";
import Modal from "react-modal";
import axios from "../../config/axiosConfig";
import submit from "../../assets/submit.png";
import { motion } from "framer-motion";
import { useToast } from "@chakra-ui/react";

Modal.setAppElement("#root");

const CalendarInput = ({
  professionalName,
  district,
  serviceName,
  doctorEmail,
  doctorId,
  onBookingSuccess,
}) => {
  const toast = useToast();
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("video");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isConfirm, setIsConfirm] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
    // Show Next button when both date and time are selected
    if (selectedDays.length > 0 && event.target.value) {
      setShowNextButton(true);
    } else {
      setShowNextButton(false);
    }
  };

  const handleNextClick = () => {
    if (selectedDays.length === 0) {
      toast({
        title: "Date Required",
        description: "Please select a date first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (!selectedTime) {
      toast({
        title: "Time Required",
        description: "Please select a time.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // Proceed to confirmation
    handleConfirm(new Event("submit"));
  };

  const closeConfirm = () => {
    setIsConfirm(false);
    // Call the callback if provided to close parent modal
    if (onBookingSuccess) {
      onBookingSuccess();
    }
  };

  const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      // Only allow one date selection at a time
      setSelectedDays([day]);
    }
    // Show Next button when both date and time are selected
    if (selectedTime && day) {
      setShowNextButton(true);
    } else if (!selectedTime) {
      setShowNextButton(false);
    }
  };

  const formatSelectedDays = () => {
    return selectedDays.map((day) => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Note: month is zero-based, so add 1
      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    });
  };

  // Convert 24-hour time format (HH:mm) to 12-hour format (h:mm AM/PM)
  const formatTimeTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleConfirm = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (selectedDays.length === 0 || !selectedTime) {
      toast({
        title: "Incomplete Selection",
        description: "Please select both a date and time.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!reason || reason.trim() === "") {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for your visit.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!doctorId) {
      toast({
        title: "Doctor ID Required",
        description: "Doctor information is missing. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setIsSubmitting(true);
    const formattedSelectedDays = formatSelectedDays();
    const formattedTime = formatTimeTo12Hour(selectedTime);

    console.log("📅 [Calendar] Booking submission started:");
    console.log("   Selected dates:", formattedSelectedDays);
    console.log("   Selected time (24h):", selectedTime);
    console.log("   Selected time (12h):", formattedTime);
    console.log("   Doctor ID:", doctorId);
    console.log("   Doctor:", professionalName);
    console.log("   Appointment Type:", appointmentType);
    console.log("   Reason:", reason);
    console.log("   Notes:", notes);

    const requestBody = {
      doctorId: doctorId,
      date: formattedSelectedDays[0],
      time: formattedTime,
      appointmentType: appointmentType,
      reason: reason.trim(),
      notes: notes.trim() || "",
    };

    try {
      console.log("📤 [Calendar] Sending booking request...");
      console.log("   Request body:", requestBody);

      // Try multiple token sources
      let token = localStorage.getItem("token");
      if (!token) {
        token = localStorage.getItem("cht_token");
      }
      if (!token) {
        const user = JSON.parse(localStorage.getItem("userInfo") || "null");
        if (user && user.token) {
          token = user.token;
        }
      }

      console.log("🔑 [Calendar] Token found:", !!token);

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await axios.post(
        "https://chtv2-bn.onrender.com/api/appointment/book",
        requestBody,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ [Calendar] Booking successful!");
      console.log("   Response status:", response.status);
      console.log("   Response data:", response.data);

      if (response.status >= 200 && response.status < 300) {
        setSelectedDays([]);
        setSelectedTime("");
        setAppointmentType("video");
        setReason("");
        setNotes("");
        setShowNextButton(false);
        setIsConfirm(true);

        toast({
          title: "Booking Successful!",
          description:
            response.data?.message ||
            "Your appointment has been booked successfully. Check your email for confirmation.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        console.error(
          "❌ [Calendar] Unexpected response status:",
          response.status
        );
        throw new Error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ [Calendar] Booking error:");
      console.error("   Error type:", error.constructor.name);
      console.error("   Error message:", error.message);
      console.error("   Error code:", error.code);

      if (error.response) {
        console.error("   HTTP Status:", error.response.status);
        console.error("   Response data:", error.response.data);
      }

      toast({
        title: "Booking Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to book appointment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setIsSubmitting(false);
      console.log("🏁 [Calendar] Booking process finished");
    }
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 1 - firstDayOfWeek; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isCurrentMonth = dayDate.getMonth() === month;
      const dayNumber = isCurrentMonth ? dayDate.getDate() : "";
      days.push(
        <div
          key={dayDate}
          className={`day ${
            selectedDays.includes(dayNumber) ? "selected" : ""
          } ${isCurrentMonth ? "" : "inactive"}`}
          onClick={() => (isCurrentMonth ? handleDayClick(dayNumber) : null)}
        >
          {dayNumber}
        </div>
      );
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <>
      <form
        onSubmit={handleConfirm}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          className="calendar-input"
          style={{
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            className="calendar-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "0",
              padding: "0 4px",
              gap: "8px",
            }}
          >
            <button onClick={handlePrevMonth} className="nav-btn">
              <i
                className="fas fa-chevron-left"
                style={{ fontSize: "12px" }}
              ></i>
            </button>
            <div
              className="current-date"
              style={{ flex: 1, textAlign: "center" }}
            >
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}{" "}
              {currentDate.toLocaleString("default", { weekday: "long" })}
            </div>
            <button onClick={handleNextMonth} className="nav-btn">
              <i
                className="fas fa-chevron-right"
                style={{ fontSize: "12px" }}
              ></i>
            </button>
          </div>
          {/* Weekday labels */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "6px",
              marginBottom: "8px",
              padding: "0 4px",
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#64748b",
                    padding: "8px 4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {day}
                </div>
              )
            )}
          </div>
          <div
            className="days"
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "6px",
              marginBottom: "0",
            }}
          >
            {renderDays()}
          </div>
          {selectedDays.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="selected-days"
              style={{
                textAlign: "center",
                marginBottom: "0",
                fontSize: "14px",
                color: "#334155",
                padding: "8px 16px",
                background: "rgba(247,148,29,0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(247,148,29,0.2)",
              }}
            >
              <strong>Selected Date:</strong> {selectedDays[0]}{" "}
              {currentDate.toLocaleString("default", { month: "long" })},{" "}
              {currentDate.getFullYear()}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginTop: "0", width: "100%" }}
          >
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "12px",
              }}
            >
              Select Time:
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              onClick={(e) => {
                e.target.showPicker?.();
              }}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                backgroundColor: "#f8fafc",
                color: "#1e293b",
                cursor: "pointer",
                transition: "all 0.3s ease",
                outline: "none",
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#F7941D";
                e.target.style.backgroundColor = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(247,148,29,0.1)";
                // Open time picker on focus for better UX
                if (e.target.showPicker) {
                  e.target.showPicker();
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "#f8fafc";
                e.target.style.boxShadow = "none";
              }}
            />
          </motion.div>

          {/* Appointment Type */}
          {selectedDays.length > 0 && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{ marginTop: "0", width: "100%" }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "12px",
                }}
              >
                Appointment Type:
              </label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "16px",
                  backgroundColor: "#f8fafc",
                  color: "#1e293b",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  outline: "none",
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
                <option value="video">Video Consultation</option>
                <option value="chat">Chat Consultation</option>
                <option value="in-person">In-Person Visit</option>
              </select>
            </motion.div>
          )}

          {/* Reason */}
          {selectedDays.length > 0 && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginTop: "0", width: "100%" }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "12px",
                }}
              >
                Reason for Visit:
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Routine checkup, Follow-up, Consultation"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "16px",
                  backgroundColor: "#f8fafc",
                  color: "#1e293b",
                  transition: "all 0.3s ease",
                  outline: "none",
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
              />
            </motion.div>
          )}

          {/* Notes */}
          {selectedDays.length > 0 && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{ marginTop: "0", width: "100%" }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "12px",
                }}
              >
                Additional Notes (Optional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information you'd like to share..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "16px",
                  backgroundColor: "#f8fafc",
                  color: "#1e293b",
                  fontFamily: "inherit",
                  resize: "vertical",
                  transition: "all 0.3s ease",
                  outline: "none",
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
              />
            </motion.div>
          )}

          {showNextButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <motion.button
                type="button"
                onClick={handleNextClick}
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
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
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(247,148,29,0.25)",
                  opacity: isSubmitting ? 0.7 : 1,
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                {isSubmitting ? "Processing..." : "Next →"}
              </motion.button>
            </motion.div>
          )}
        </div>
      </form>

      <Modal
        isOpen={isConfirm}
        onRequestClose={closeConfirm}
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
            zIndex: 2000,
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
            maxWidth: "500px",
            height: "auto",
            minHeight: "300px",
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
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeConfirm}
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
          whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
          whileTap={{ scale: 0.95 }}
        >
          ×
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            padding: window.innerWidth <= 650 ? "24px" : "40px",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              color: "white",
              boxShadow: "0 10px 30px rgba(247,148,29,0.3)",
            }}
          >
            ✓
          </div>
          <h3
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
              background:
                "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Booking Successful!
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Your meet up request has been received and your doctor has been
            notified. Check your email for confirmation.
          </p>
          <motion.button
            onClick={closeConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "12px",
              boxShadow: "0 4px 12px rgba(247,148,29,0.25)",
            }}
          >
            Close
          </motion.button>
        </motion.div>
      </Modal>
    </>
  );
};

export default CalendarInput;
