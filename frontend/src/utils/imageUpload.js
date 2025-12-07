/**
 * Image Upload Utility
 * 
 * Uploads images to Cloudinary and returns the image URL
 * Based on the upload function from profile.jsx
 * 
 * @param {File} imageFile - The image file to upload (JPEG or PNG)
 * @returns {Promise<string>} - The Cloudinary image URL
 * @throws {Error} - If upload fails or file is invalid
 */

/**
 * Uploads an image file to Cloudinary and returns the image URL
 * 
 * @param {File} imageFile - The image file to upload
 * @param {Object} options - Optional configuration
 * @param {string} options.uploadPreset - Cloudinary upload preset (default: "chat-app")
 * @param {string} options.cloudName - Cloudinary cloud name (default: "dmzieqsir")
 * @returns {Promise<string>} - The Cloudinary image URL
 * 
 * @example
 * const file = event.target.files[0];
 * try {
 *   const imageUrl = await uploadImageToCloudinary(file);
 *   console.log("Image URL:", imageUrl);
 * } catch (error) {
 *   console.error("Upload failed:", error);
 * }
 */
export const uploadImageToCloudinary = async (imageFile, options = {}) => {
  // Validate file
  if (!imageFile) {
    throw new Error("Please select an image!");
  }

  // Validate file type
  if (imageFile.type !== "image/jpeg" && imageFile.type !== "image/png") {
    throw new Error("Please select a valid image (JPEG or PNG)!");
  }

  // Configuration
  const uploadPreset = options.uploadPreset || "chat-app";
  const cloudName = options.cloudName || "dmzieqsir";

  // Prepare FormData
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  try {
    console.log("🌐 [Cloudinary] Checking network connectivity...");
    console.log("☁️ [Cloudinary] Preparing upload to Cloudinary...");
    console.log("   Cloud Name:", cloudName);
    console.log("   Upload Preset:", uploadPreset);
    console.log("   File Name:", imageFile.name);
    console.log("   File Size:", `${(imageFile.size / 1024).toFixed(2)} KB`);
    console.log("   File Type:", imageFile.type);
    
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log("📡 [Cloudinary] Upload URL:", uploadUrl);
    console.log("📤 [Cloudinary] Sending POST request to Cloudinary...");
    
    const uploadStartTime = Date.now();
    console.log("⏱️ [Cloudinary] Upload start time:", new Date().toISOString());
    
    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const uploadEndTime = Date.now();
    const uploadDuration = uploadEndTime - uploadStartTime;
    console.log("⏱️ [Cloudinary] Upload completed in", uploadDuration, "ms");
    console.log("📥 [Cloudinary] Response received");
    console.log("   Status:", cloudinaryResponse.status);
    console.log("   Status Text:", cloudinaryResponse.statusText);
    console.log("   OK:", cloudinaryResponse.ok);

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error("❌ [Cloudinary] Upload failed with status:", cloudinaryResponse.status);
      console.error("   Error response:", errorText);
      throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`);
    }

    console.log("📦 [Cloudinary] Parsing response JSON...");
    const cloudinaryData = await cloudinaryResponse.json();
    console.log("✅ [Cloudinary] Response parsed successfully");
    console.log("   Response keys:", Object.keys(cloudinaryData));
    
    // Return the image URL
    if (cloudinaryData.url) {
      console.log("✅ [Cloudinary] Image uploaded successfully!");
      console.log("🔗 [Cloudinary] Image URL:", cloudinaryData.url);
      return cloudinaryData.url;
    } else {
      console.error("❌ [Cloudinary] No URL in response");
      console.error("   Response data:", cloudinaryData);
      throw new Error("No URL returned from Cloudinary");
    }
  } catch (error) {
    console.error("❌ [Cloudinary] Error occurred during upload:");
    console.error("   Error type:", error.constructor.name);
    console.error("   Error message:", error.message);
    console.error("   Error name:", error.name);
    
    // Network error detection
    if (error.message === "Network Error" || 
        error.message.includes("Network") || 
        error.message.includes("network") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("fetch") ||
        error.name === "TypeError" && error.message.includes("fetch")) {
      console.error("🌐 [Cloudinary] NETWORK ERROR DETECTED:");
      console.error("   - This usually means:");
      console.error("     1. No internet connection");
      console.error("     2. Cloudinary service is down or unreachable");
      console.error("     3. CORS issue");
      console.error("     4. Firewall blocking the request");
      console.error("   - Check your internet connection");
      console.error("   - Verify Cloudinary is accessible");
    }
    
    // Timeout error
    if (error.name === "AbortError" || error.message.includes("timeout")) {
      console.error("⏱️ [Cloudinary] REQUEST TIMEOUT:");
      console.error("   - The upload request took too long");
    }
    
    throw new Error(
      error.message || "An error occurred while uploading the image. Please check your internet connection."
    );
  }
};

/**
 * Validates if a file is a valid image
 * 
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidImageFile = (file) => {
  if (!file) return false;
  return file.type === "image/jpeg" || file.type === "image/png";
};

/**
 * Gets file size in MB
 * 
 * @param {File} file - The file to check
 * @returns {number} - File size in MB
 */
export const getFileSizeInMB = (file) => {
  if (!file) return 0;
  return (file.size / (1024 * 1024)).toFixed(2);
};

