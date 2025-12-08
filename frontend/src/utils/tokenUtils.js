import { jwtDecode } from "jwt-decode";

/**
 * Extract user information from JWT token stored in localStorage
 * @returns {Object|null} User object with email, role, name, pic, id or null if token is invalid/missing
 */
export const extractUserFromToken = () => {
  console.log("🟠 [Token Utils] extractUserFromToken() called");
  const token = localStorage.getItem("token");
  console.log("🟠 [Token Utils] Token retrieved from localStorage:", !!token);
  console.log("🟠 [Token Utils] Token length:", token?.length || 0);
  console.log("🟠 [Token Utils] Token preview:", token ? `${token.substring(0, 30)}...` : "null");
  
  if (!token) {
    console.log("🟠 [Token Utils] No token found, returning null");
    return null;
  }
  
  try {
    console.log("🟠 [Token Utils] Decoding token...");
    const decoded = jwtDecode(token);
    console.log("🟠 [Token Utils] Token decoded successfully");
    console.log("🟠 [Token Utils] Full decoded token:", JSON.stringify(decoded, null, 2));
    console.log("🟠 [Token Utils] Decoded keys:", Object.keys(decoded));
    console.log("🟠 [Token Utils] - decoded.email:", decoded.email);
    console.log("🟠 [Token Utils] - decoded.role:", decoded.role);
    console.log("🟠 [Token Utils] - decoded.user:", decoded.user);
    console.log("🟠 [Token Utils] - decoded.user?.name:", decoded.user?.name);
    console.log("🟠 [Token Utils] - decoded.user?.pic:", decoded.user?.pic);
    console.log("🟠 [Token Utils] - decoded.user?._id:", decoded.user?._id);
    console.log("🟠 [Token Utils] - decoded.id?.user:", decoded.id?.user);
    
    const extractedUser = {
      email: decoded.email || decoded.user?.email || decoded.id?.user?.email,
      role: decoded.role || decoded.user?.role || decoded.id?.user?.role,
      name: decoded.user?.name || decoded.id?.user?.name || decoded.name,
      pic: decoded.user?.pic || decoded.id?.user?.pic || decoded.pic,
      id: decoded.user?._id || decoded.id?.user?._id || decoded._id || decoded.id?.user?.id,
      doctorStatus: decoded.user?.doctorStatus || decoded.id?.user?.doctorStatus || decoded.doctorStatus,
    };
    
    console.log("🟠 [Token Utils] Extracted user data:", extractedUser);
    console.log("🟠 [Token Utils] Email:", extractedUser.email);
    console.log("🟠 [Token Utils] Role:", extractedUser.role);
    console.log("🟠 [Token Utils] Name:", extractedUser.name);
    console.log("🟠 [Token Utils] ID:", extractedUser.id);
    console.log("🟠 [Token Utils] DoctorStatus:", extractedUser.doctorStatus);
    
    return extractedUser;
  } catch (err) {
    console.error("❌ [Token Utils] Error extracting user from token:", err);
    console.error("❌ [Token Utils] Error message:", err.message);
    console.error("❌ [Token Utils] Error stack:", err.stack);
    return null;
  }
};

