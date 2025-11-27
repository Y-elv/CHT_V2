/**
 * Appointment API Service
 * 
 * Handles API calls for patient appointments
 * Base URL: https://chtv2-bn.onrender.com/api/appointment
 */

import axios from "../config/axiosConfig";

const BASE_URL = "https://chtv2-bn.onrender.com/api/appointment";

/**
 * Get user appointments (for patients)
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} status - Filter by status: 'pending', 'approved', 'cancelled', or '' for all (default: '')
 * @returns {Promise<{appointments: Array, total: number, page: number, totalPages: number}>}
 */
export const getUserAppointments = async (page = 1, limit = 20, status = '') => {
  try {
    let url = `${BASE_URL}/user?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw error;
  }
};

