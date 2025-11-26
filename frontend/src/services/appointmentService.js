/**
 * Appointment API Service
 * 
 * Handles all appointment-related API calls for doctors
 * Base URL: https://chtv2-bn.onrender.com/api/appointment
 */

import axios from "../config/axiosConfig";

const BASE_URL = "https://chtv2-bn.onrender.com/api/appointment";

/**
 * Get doctor appointments with filters
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} status - Appointment status: 'pending', 'approved', 'cancelled' (optional)
 * @returns {Promise<{appointments: Array, total: number, page: number, totalPages: number}>}
 */
export const getDoctorAppointments = async (page = 1, limit = 20, status = null) => {
  try {
    let url = `${BASE_URL}/doctor?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    console.log("🌐 API Call: GET", url);
    
    const response = await axios.get(url);
    console.log("📦 Appointments Response:", response.data);
    
    // Handle response structure
    if (response.data?.appointments) {
      return {
        appointments: Array.isArray(response.data.appointments) ? response.data.appointments : [],
        total: response.data.total || 0,
        page: response.data.page || page,
        totalPages: response.data.totalPages || 1,
      };
    }
    
    // Fallback if structure is different
    if (Array.isArray(response.data)) {
      return {
        appointments: response.data,
        total: response.data.length,
        page,
        totalPages: 1,
      };
    }
    
    console.warn("⚠️ Unknown response structure, returning empty array");
    return {
      appointments: [],
      total: 0,
      page,
      totalPages: 1,
    };
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error data:", error.response?.data);
    throw error;
  }
};

/**
 * Approve an appointment
 * @param {string} appointmentId - The appointment ID
 * @param {string} callLink - The video call link (required for video appointments)
 * @returns {Promise<{message: string, appointment: Object}>}
 */
export const approveAppointment = async (appointmentId, callLink) => {
  try {
    console.log("🌐 API Call: POST", `${BASE_URL}/approve/${appointmentId}`);
    console.log("📦 Request body:", { callLink });
    
    const response = await axios.post(`${BASE_URL}/approve/${appointmentId}`, {
      callLink: callLink || null,
    });
    
    console.log("✅ Appointment approved:", response.data);
    return {
      message: response.data.message || "Appointment approved successfully",
      appointment: response.data.appointment || response.data,
    };
  } catch (error) {
    console.error("❌ Error approving appointment:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error data:", error.response?.data);
    throw error;
  }
};

/**
 * Cancel an appointment
 * @param {string} appointmentId - The appointment ID
 * @param {string} cancellationReason - Reason for cancellation
 * @returns {Promise<{message: string, appointment: Object}>}
 */
export const cancelAppointment = async (appointmentId, cancellationReason) => {
  try {
    console.log("🌐 API Call: POST", `${BASE_URL}/cancel/${appointmentId}`);
    console.log("📦 Request body:", { cancellationReason });
    
    const response = await axios.post(`${BASE_URL}/cancel/${appointmentId}`, {
      cancellationReason: cancellationReason || "No reason provided",
    });
    
    console.log("✅ Appointment cancelled:", response.data);
    return {
      message: response.data.message || "Appointment cancelled successfully",
      appointment: response.data.appointment || response.data,
    };
  } catch (error) {
    console.error("❌ Error cancelling appointment:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error data:", error.response?.data);
    throw error;
  }
};

