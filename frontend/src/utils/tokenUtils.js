import { jwtDecode } from "jwt-decode";

/**
 * Extract user information from JWT token stored in localStorage
 * @returns {Object|null} User object with email, role, name, pic, id or null if token is invalid/missing
 */
export const extractUserFromToken = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.log("⚠️ extractUserFromToken: No token found in localStorage");
    return null;
  }
  
  try {
    console.log("🔓 extractUserFromToken: Decoding token...");
    const decoded = jwtDecode(token);
    console.log("✅ extractUserFromToken: Token decoded successfully");
    console.log("   Full decoded:", decoded);
    console.log("   - decoded.email:", decoded.email);
    console.log("   - decoded.role:", decoded.role);
    console.log("   - decoded.user:", decoded.user);
    console.log("   - decoded.user?.name:", decoded.user?.name);
    console.log("   - decoded.user?.pic:", decoded.user?.pic);
    console.log("   - decoded.user?._id:", decoded.user?._id);
    
    const extractedUser = {
      email: decoded.email,
      role: decoded.role,
      name: decoded.user?.name,
      pic: decoded.user?.pic,
      id: decoded.user?._id,
      doctorStatus: decoded.user?.doctorStatus || decoded.doctorStatus,
    };
    
    console.log("👤 extractUserFromToken: Extracted user:", extractedUser);
    return extractedUser;
  } catch (err) {
    console.error("❌ extractUserFromToken: Invalid or expired token", err);
    return null;
  }
};

