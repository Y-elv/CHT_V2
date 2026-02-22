/**
 * Quick Assist API Service
 * 
 * Handles API calls to the Quick Assist endpoint
 * Uses axios instance with baseURL configured
 */

import axios from "../api/axios";

// Use relative URL since axios instance has baseURL configured
const BASE_URL = "/ask";

/**
 * Ask a question to the Quick Assist API
 * @param {string} question - The user's question
 * @returns {Promise<{answer: string, source?: string, similarity?: number}>}
 */
export const askQuestion = async (question) => {
  try {
    const response = await axios.post(BASE_URL, {
      question: question.trim(),
    });
    // Handle different response structures
    if (response.data) {
      return {
        answer: response.data.answer || response.data.response || response.data.message || "No response received",
        source: response.data.source || response.data.source_type || null,
        similarity: response.data.similarity || response.data.score || null,
      };
    }
    
    return {
      answer: "No response received",
      source: null,
      similarity: null,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Failed to get response. Please try again.";
    
    throw new Error(errorMessage);
  }
};

