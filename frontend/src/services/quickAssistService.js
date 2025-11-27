/**
 * Quick Assist API Service
 * 
 * Handles API calls to the Quick Assist endpoint
 * Base URL: https://chtv2-bn.onrender.com/api/ask
 */

import axios from "../config/axiosConfig";

const BASE_URL = "https://chtv2-bn.onrender.com/api/ask";

/**
 * Ask a question to the Quick Assist API
 * @param {string} question - The user's question
 * @returns {Promise<{answer: string, source?: string, similarity?: number}>}
 */
export const askQuestion = async (question) => {
  try {
    console.log("🌐 API Call: POST", BASE_URL);
    console.log("📦 Request body:", { question });
    
    const response = await axios.post(BASE_URL, {
      question: question.trim(),
    });
    
    console.log("✅ Quick Assist Response:", response.data);
    
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
    console.error("❌ Error asking question:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error data:", error.response?.data);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Failed to get response. Please try again.";
    
    throw new Error(errorMessage);
  }
};

