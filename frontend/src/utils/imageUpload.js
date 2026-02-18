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
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const cloudinaryResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });
    if (!cloudinaryResponse.ok) {
      throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`);
    }
    const cloudinaryData = await cloudinaryResponse.json();
    if (cloudinaryData.url) {
      return cloudinaryData.url;
    }
    throw new Error("No URL returned from Cloudinary");
  } catch (error) {
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

