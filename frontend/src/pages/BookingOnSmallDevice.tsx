import React, { useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../config/axiosConfig";

Modal.setAppElement("#root"); // Necessary for accessibility

const BookingOnSmallDevice = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isConfirm, setIsConfirm] = useState(false); // For confirmation popup

  const doctorEmails = {
    "Dr Agarwals": "agarwals@example.com",
    "Dr Marvin": "marvin@example.com",
    "Dr Elvis": "elvis@example.com",
    "Dr Luke": "luke@example.com",
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    const requestBody = {
      ProfessionalName: selectedDoctor,
      date: selectedDate.toLocaleDateString(), // format the date
      time: selectedDate.toLocaleTimeString(), // format the time
      district: selectedDistrict,
      serviceName: selectedService,
      doctorEmail: doctorEmails[selectedDoctor],
    };

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const token = user.token;
      console.log("Token:", token);

      const response = await axios.post(
        "https://chtv2-bn.onrender.com/api/v2/user/booking",
        requestBody,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Booking successful:", response.data);
        setIsConfirm(true); // Show confirmation popup
        setIsModalOpen(false); // Close modal
        resetForm();
      } else {
        console.error("Error submitting booking:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setSelectedDoctor("");
    setSelectedDistrict("");
    setSelectedService("");
    setSelectedDate(new Date());
  };

  return (
    <div
      className="container mx-auto p-4 min-h-screen w-full"
      style={{ backgroundColor: "#B8C2D7" }}
    >
      <h1 className="text-2xl font-bold mb-6">TALK TO US</h1>
      <p className="mb-4">
        One click away to meeting our best doctors and wellness experts
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="doctorSelect"
            className="block text-sm font-medium text-gray-700"
          >
            Select a Doctor:
          </label>
          <select
            id="doctorSelect"
            name="doctorSelect"
            value={selectedDoctor}
            onChange={handleDoctorChange}
            className="mt-1 block w-64 p-2 border border-gray-300 rounded-md bg-gray-50"
          >
            <option value="Dr Agarwals">Dr Agarwals</option>
            <option value="Dr Marvin">Dr Marvin</option>
            <option value="Dr Elvis">Dr Elvis</option>
            <option value="Dr Luke">Dr Luke</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="districtSelect"
            className="block text-sm font-medium text-gray-700"
          >
            Select a District:
          </label>
          <select
            id="districtSelect"
            name="districtSelect"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="mt-1 block w-64 p-2 border border-gray-300 rounded-md bg-gray-50"
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
            className="block text-sm font-medium text-gray-700"
          >
            Select a Service:
          </label>
          <select
            id="serviceSelect"
            name="serviceSelect"
            value={selectedService}
            onChange={handleServiceChange}
            className="mt-1 block w-64 p-2 border border-gray-300 rounded-md bg-gray-50"
          >
            <option value="Counseling and Therapy">
              Counseling and Therapy
            </option>
            <option value="Sexual advices">Sexual advices</option>
            <option value="Mental Health">Mental Health</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Submit
        </button>
      </form>

      {/* Modal for selecting date and time */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            color: "black",
            backgroundColor: "#fff",
            width: "300px",
            height: "300px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <h2 className="text-lg font-bold mb-4">Select Date and Time</h2>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="Pp"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleConfirm} // Call the handleConfirm function
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Confirm
        </button>
      </Modal>

      {/* Confirmation Popup */}
      {isConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl font-bold mb-4">Booking Confirmed!</h2>
            <p>Your appointment has been successfully booked.</p>
            <button
              onClick={() => setIsConfirm(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingOnSmallDevice;
